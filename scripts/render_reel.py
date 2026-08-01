#!/usr/bin/env python3
"""Render a De Mayo Bible Studies vertical MP4 from a JSON request."""
from __future__ import annotations

import asyncio
import json
import math
import os
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FPS = 30
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = str(text or "").strip().split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and draw.textbbox((0, 0), candidate, font=fnt)[2] > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines or [""]


def fit_text(draw: ImageDraw.ImageDraw, text: str, max_width: int, max_height: int,
             max_size: int = 96, min_size: int = 38, max_lines: int = 11) -> tuple[ImageFont.FreeTypeFont, list[str], int]:
    for size in range(max_size, min_size - 1, -2):
        fnt = font(size, True)
        lines = wrap(draw, text, fnt, max_width)
        line_h = int(size * 1.24)
        if len(lines) <= max_lines and len(lines) * line_h <= max_height:
            return fnt, lines, line_h
    fnt = font(min_size, True)
    lines = wrap(draw, text, fnt, max_width)[:max_lines]
    if len(lines) == max_lines:
        lines[-1] = lines[-1].rstrip(".,;: ") + "…"
    return fnt, lines, int(min_size * 1.24)


def gradient_background(index: int) -> Image.Image:
    palettes = [
        ((7, 37, 72), (47, 112, 151)),
        ((28, 43, 75), (69, 91, 140)),
        ((44, 35, 74), (115, 74, 123)),
        ((22, 67, 74), (63, 127, 120)),
        ((38, 45, 58), (83, 101, 119)),
    ]
    top, bottom = palettes[index % len(palettes)]
    img = Image.new("RGB", (W, H), top)
    px = img.load()
    for y in range(H):
        t = y / max(1, H - 1)
        c = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(W):
            px[x, y] = c
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    circles = [(180, 450, 240), (830, 1220, 310), (750, 1450, 230)]
    for cx, cy, r in circles:
        od.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(255, 255, 255, 22))
        od.ellipse((cx-r*0.72, cy-r*0.72, cx+r*0.72, cy+r*0.72), fill=(255, 255, 255, 18))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def draw_centered_lines(draw: ImageDraw.ImageDraw, lines: list[str], fnt: ImageFont.FreeTypeFont,
                        y: int, line_h: int, fill=(255, 255, 255)) -> None:
    for line in lines:
        box = draw.textbbox((0, 0), line, font=fnt)
        width = box[2] - box[0]
        draw.text(((W - width) / 2, y), line, font=fnt, fill=fill)
        y += line_h


def create_scene(path: Path, scene_index: int, label: str, text: str, sub: str = "") -> None:
    img = gradient_background(scene_index)
    draw = ImageDraw.Draw(img)
    safe_left, safe_right = 95, W - 95
    max_width = safe_right - safe_left

    label_font = font(38, True)
    label_box = draw.textbbox((0, 0), label, font=label_font)
    draw.text(((W - (label_box[2] - label_box[0])) / 2, 175), label, font=label_font, fill=(225, 235, 245))

    content_top, content_bottom = 340, 1390
    reserved_sub = 125 if sub else 0
    fnt, lines, line_h = fit_text(draw, text, max_width, content_bottom-content_top-reserved_sub,
                                    max_size=100 if len(text) < 90 else 82, min_size=40)
    total_h = len(lines) * line_h
    y = content_top + max(0, (content_bottom-content_top-reserved_sub-total_h)//2)
    draw_centered_lines(draw, lines, fnt, y, line_h)

    if sub:
        sf = font(46, True)
        box = draw.textbbox((0, 0), sub, font=sf)
        draw.text(((W-(box[2]-box[0]))/2, content_bottom+35), sub, font=sf, fill=(236, 240, 247))

    brand_font = font(42, True)
    brand = "De Mayo Bible Studies"
    box = draw.textbbox((0, 0), brand, font=brand_font)
    draw.text(((W-(box[2]-box[0]))/2, 1690), brand, font=brand_font, fill=(255, 255, 255))
    tag_font = font(24)
    tagline = "GROW IN FAITH • WALK IN TRUTH • SHARE HIS LOVE"
    box = draw.textbbox((0, 0), tagline, font=tag_font)
    draw.text(((W-(box[2]-box[0]))/2, 1760), tagline, font=tag_font, fill=(218, 229, 240))
    img.save(path, quality=95)


async def generate_edge_voice(text: str, voice: str, out_path: Path) -> bool:
    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, voice=voice, rate="-8%", pitch="+0Hz")
        await communicate.save(str(out_path))
        return out_path.exists() and out_path.stat().st_size > 1000
    except Exception as exc:
        print(f"Natural voice unavailable, using offline fallback: {exc}")
        return False


def generate_fallback_voice(text: str, out_path: Path) -> None:
    wav = out_path.with_suffix(".wav")
    engine = shutil.which("espeak-ng") or shutil.which("espeak")
    if engine:
        run([engine, "-s", "145", "-v", "en-us", "-w", str(wav), text])
        run(["ffmpeg", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "3", str(out_path)])
    else:
        # Last-resort silence keeps rendering functional if no speech engine is available.
        run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "3", "-q:a", "9", str(out_path)])


def duration_of(path: Path) -> float:
    result = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)
    ], text=True).strip()
    return max(1.0, float(result))


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: render_reel.py request.json output.mp4")
        return 2
    request_path, output_path = Path(sys.argv[1]), Path(sys.argv[2])
    data = json.loads(request_path.read_text(encoding="utf-8"))
    work = Path("render-work")
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    scenes = [
        ("TODAY'S ENCOURAGEMENT", data.get("hook", "God is with you today."), ""),
        ("SCRIPTURE", data.get("verse", ""), data.get("ref", "")),
        ("REFLECTION", data.get("reflection", ""), ""),
        ("PRAYER", data.get("prayer", ""), "Amen."),
        ("FOLLOW FOR DAILY FAITH", "Follow De Mayo Bible Studies", "Scripture • Prayer • Encouragement"),
    ]
    for i, (label, text, sub) in enumerate(scenes):
        create_scene(work / f"scene-{i}.png", i, label, text, sub)

    narration = ". ".join(filter(None, [
        data.get("hook", ""), data.get("ref", ""), data.get("verse", ""),
        data.get("reflection", ""), "Let us pray.", data.get("prayer", ""), "Amen."
    ]))
    voice_choice = data.get("voice", "female")
    edge_voice = "en-NZ-MollyNeural" if voice_choice == "female" else "en-NZ-MitchellNeural"
    voice_path = work / "voice.mp3"
    ok = asyncio.run(generate_edge_voice(narration, edge_voice, voice_path))
    if not ok:
        generate_fallback_voice(narration, voice_path)

    requested = max(15, min(60, int(data.get("duration", 30))))
    voice_duration = duration_of(voice_path)
    total_duration = max(float(requested), voice_duration + 2.0)
    scene_duration = total_duration / len(scenes)

    concat = work / "images.txt"
    with concat.open("w", encoding="utf-8") as f:
        for i in range(len(scenes)):
            f.write(f"file '{(work / f'scene-{i}.png').resolve()}'\n")
            f.write(f"duration {scene_duration:.3f}\n")
        f.write(f"file '{(work / f'scene-{len(scenes)-1}.png').resolve()}'\n")

    silent_video = work / "silent.mp4"
    run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat),
        "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-preset", "medium",
        "-crf", "20", "-movflags", "+faststart", str(silent_video)
    ])

    # Create a gentle original ambient bed, then mix it quietly underneath narration.
    ambient = work / "ambient.m4a"
    run([
        "ffmpeg", "-y", "-f", "lavfi", "-i",
        f"sine=frequency=196:sample_rate=44100:duration={total_duration:.3f}",
        "-af", "volume=0.025,afade=t=in:st=0:d=2,afade=t=out:st=" + str(max(0, total_duration-3)) + ":d=3",
        "-c:a", "aac", "-b:a", "128k", str(ambient)
    ])

    run([
        "ffmpeg", "-y", "-i", str(silent_video), "-i", str(voice_path), "-i", str(ambient),
        "-filter_complex", "[1:a]volume=1.0[voice];[2:a]volume=1.0[bed];[voice][bed]amix=inputs=2:duration=longest:dropout_transition=2[a]",
        "-map", "0:v:0", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total_duration:.3f}", "-movflags", "+faststart", str(output_path)
    ])
    print(f"Created {output_path} ({output_path.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
