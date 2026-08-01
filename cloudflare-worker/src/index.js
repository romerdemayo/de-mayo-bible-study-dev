const VERSES = [
  { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.', theme: 'hope' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.', theme: 'guidance' },
  { reference: 'Isaiah 41:10', text: 'Do not fear, for I am with you. Do not be dismayed, for I am your God. I will strengthen you. Yes, I will help you.', theme: 'strength' },
  { reference: 'Philippians 4:6-7', text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. The peace of God will guard your hearts and your thoughts in Christ Jesus.', theme: 'peace' },
  { reference: 'Psalm 34:18', text: 'The Lord is near to those who have a broken heart, and saves those who have a crushed spirit.', theme: 'comfort' },
  { reference: 'Lamentations 3:22-23', text: 'It is because of the Lord’s loving kindnesses that we are not consumed, because his compassion does not fail. They are new every morning. Great is your faithfulness.', theme: 'gratitude' },
  { reference: 'Romans 8:28', text: 'We know that all things work together for good for those who love God, to those who are called according to his purpose.', theme: 'hope' }
];

const PRAYERS = [
  { reference: 'Prayer for Hope', text: 'Heavenly Father, when the road ahead feels uncertain, anchor my heart in Your promises. Help me trust Your wisdom, wait with faith, and remember that Your presence is greater than every fear. In Jesus’ name, Amen.' },
  { reference: 'Prayer for Peace', text: 'Lord Jesus, quiet every anxious thought and teach me to rest in Your care. Guard my heart with Your peace, guide my decisions, and help me bring every concern to You in prayer. Amen.' },
  { reference: 'Prayer for Guidance', text: 'Father, direct my steps today. Give me wisdom to recognise what honours You, courage to obey Your Word, and humility to follow where You lead. In Jesus’ name, Amen.' },
  { reference: 'Prayer for Strength', text: 'Almighty God, strengthen me when I feel weak. Remind me that Your grace is sufficient, Your power is made perfect in weakness, and I never walk alone. Amen.' }
];

function json(data, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type, X-De-Mayo-Secret', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' } });
}

function escapeXml(value = '') { return String(value).replace(/[<>&'\"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])); }
function wrap(text, max = 28) {
  const words = text.split(/\s+/); const lines = []; let line = '';
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines.slice(0, 11);
}
function dailyIndex(length, offset = 0) { const now = new Date(); const start = Date.UTC(now.getUTCFullYear(), 0, 0); const day = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000); return (day + offset) % length; }
function createSvg(item, kind = 'SCRIPTURE') {
  const lines = wrap(item.text, kind === 'PRAYER' ? 32 : 27); const font = lines.length > 8 ? 42 : lines.length > 6 ? 48 : 56; const lineHeight = Math.round(font * 1.25); const total = lines.length * lineHeight; const startY = Math.max(310, 540 - total / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#123f34"/><stop offset=".55" stop-color="#2f6b59"/><stop offset="1" stop-color="#c79638"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity=".28"/></filter></defs><rect width="1080" height="1080" rx="38" fill="url(#g)"/><circle cx="165" cy="170" r="95" fill="#fff" opacity=".06"/><circle cx="920" cy="230" r="150" fill="#fff" opacity=".07"/><circle cx="840" cy="900" r="190" fill="#fff" opacity=".05"/><text x="540" y="145" text-anchor="middle" fill="#f5dd9b" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="4">${kind}</text>${lines.map((line, i) => `<text x="540" y="${startY + i * lineHeight}" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="${font}" font-weight="700" filter="url(#s)">${escapeXml(line)}</text>`).join('')}<text x="540" y="875" text-anchor="middle" fill="#f5dd9b" font-family="Arial,sans-serif" font-size="31" font-weight="700">${escapeXml(item.reference)}</text><text x="540" y="990" text-anchor="middle" fill="#fff" opacity=".84" font-family="Arial,sans-serif" font-size="20" font-weight="600">De Mayo Bible Studies</text></svg>`;
}

async function publishPhoto(env, bytes, caption, filename = 'daily-scripture.svg', contentType = 'image/svg+xml') {
  const version = env.GRAPH_API_VERSION || 'v23.0';
  const endpoint = `https://graph.facebook.com/${version}/${env.FB_PAGE_ID}/photos`;
  const form = new FormData(); form.append('access_token', env.FB_PAGE_ACCESS_TOKEN); form.append('caption', caption); form.append('published', 'true'); form.append('source', new Blob([bytes], { type: contentType }), filename);
  const response = await fetch(endpoint, { method: 'POST', body: form }); const data = await response.json(); if (!response.ok || data.error) throw new Error(data.error?.message || `Facebook returned ${response.status}`); return data;
}

function authorised(request, env) { return !env.APP_SHARED_SECRET || request.headers.get('X-De-Mayo-Secret') === env.APP_SHARED_SECRET; }
async function autoPost(env) {
  const mode = (env.AUTO_CONTENT || 'mixed').toLowerCase(); const usePrayer = mode === 'prayer' || (mode === 'mixed' && dailyIndex(2) === 1); const item = usePrayer ? PRAYERS[dailyIndex(PRAYERS.length)] : VERSES[dailyIndex(VERSES.length)]; const kind = usePrayer ? 'PRAYER' : 'SCRIPTURE';
  const svg = createSvg(item, kind); const caption = usePrayer ? `${item.text}\n\n#Prayer #Faith #DeMayoBibleStudies` : `${item.text}\n\n${item.reference}\n\n#BibleVerse #Faith #DailyEncouragement #DeMayoBibleStudies`;
  return publishPhoto(env, new TextEncoder().encode(svg), caption);
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || '*'; if (request.method === 'OPTIONS') return json({ ok: true }, 200, origin); const url = new URL(request.url);
    if (url.pathname === '/health') return json({ ok: true, message: 'De Mayo Facebook Publisher is connected.', configured: Boolean(env.FB_PAGE_ID && env.FB_PAGE_ACCESS_TOKEN) }, 200, origin);
    if (!authorised(request, env)) return json({ error: 'Unauthorised request.' }, 401, origin);
    if (url.pathname === '/publish' && request.method === 'POST') {
      try { const body = await request.json(); if (!body.imageData || !body.caption) return json({ error: 'Image and caption are required.' }, 400, origin); const match = body.imageData.match(/^data:(.+?);base64,(.+)$/); if (!match) return json({ error: 'Invalid image data.' }, 400, origin); const bytes = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0)); const data = await publishPhoto(env, bytes, body.caption, 'de-mayo-social-post.png', match[1]); return json({ ok: true, ...data }, 200, origin); } catch (error) { return json({ error: error.message }, 500, origin); }
    }
    if (url.pathname === '/run-daily' && request.method === 'POST') { try { return json({ ok: true, ...(await autoPost(env)) }, 200, origin); } catch (error) { return json({ error: error.message }, 500, origin); } }
    return json({ error: 'Not found.' }, 404, origin);
  },
  async scheduled(_event, env, ctx) { ctx.waitUntil(autoPost(env)); }
};
