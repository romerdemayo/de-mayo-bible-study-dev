/* De Mayo Bible Studies - native MP4 recorder with free generated music */
(function(){
'use strict';
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const MOBILE=IOS||/Android/i.test(navigator.userAgent);
const MP4_TYPES=['video/mp4;codecs=avc1.42E01E','video/mp4;codecs=avc1.424028','video/mp4'];
const EXPORT_WIDTH=1080;
const EXPORT_HEIGHT=1920;
const EXPORT_FPS=IOS?20:24;
const EXPORT_VIDEO_BITRATE=IOS?5000000:8000000;
const SUPPORTED=!!(window.MediaRecorder&&HTMLCanvasElement.prototype.captureStream&&MP4_TYPES.some(t=>MediaRecorder.isTypeSupported(t)));
window.DM_NATIVE_MP4_SUPPORTED=SUPPORTED;
if(!SUPPORTED)return;
let busy=false;
function status(message,type='info'){
  if(typeof window.toast==='function')window.toast(message);
  const box=document.querySelector('#dmExportStatus');
  if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}
}
function clearOldFailure(){
  document.querySelectorAll('#dmExportStatus,[data-type="error"],.dm-export-error').forEach(el=>{
    if(/MP4 creation failed|could not create|native MP4 creation failed/i.test(el.textContent||'')){el.hidden=true;el.textContent='';}
  });
}
function wrap(ctx,text,maxWidth){const words=String(text||'').trim().split(/\s+/),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(line&&ctx.measureText(test).width>maxWidth){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines;}
function fit(ctx,text,maxWidth,maxHeight,max=64,min=24){for(let size=max;size>=min;size-=2){ctx.font=`800 ${size}px system-ui,-apple-system,sans-serif`;const lines=wrap(ctx,text,maxWidth),lh=size*1.2;if(lines.length*lh<=maxHeight)return {size,lines,lh};}ctx.font=`800 ${min}px system-ui,-apple-system,sans-serif`;return {size:min,lines:wrap(ctx,text,maxWidth),lh:min*1.2};}
function snapshot(){const reel=document.querySelector('.dm-reel-canvas');if(!reel)return null;const style=getComputedStyle(reel);return {kicker:reel.querySelector('.dm-reel-kicker')?.textContent||'BIBLE ENCOURAGEMENT',message:reel.querySelector('.dm-reel-message')?.textContent||'',ref:reel.querySelector('.dm-reel-reference')?.textContent||'',r1:style.getPropertyValue('--r1').trim()||'#092846',r2:style.getPropertyValue('--r2').trim()||'#2f6b88',accent:style.getPropertyValue('--accent').trim()||'#f2c96d'};}
async function collect(){const out=[];const next=document.querySelector('#dmNext');const count=document.querySelector('#dmSceneCount')?.textContent||'';const total=Math.max(1,Math.min(6,Number(count.match(/of\s+(\d+)/i)?.[1]||3)));for(let i=0;i<total;i++){const s=snapshot();if(s)out.push(s);if(i<total-1&&next){next.click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}}return out;}
function draw(ctx,s,w,h,p){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,s.r1);g.addColorStop(1,s.r2);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.globalAlpha=.12;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(w*.2,h*.23,w*.18,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w*.79,h*.62,w*.25,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.82)';ctx.font=`700 ${Math.round(w*.023)}px system-ui,-apple-system,sans-serif`;ctx.fillText('BIBLE REEL  •  DE MAYO BIBLE STUDIES',w/2,h*.125);ctx.fillStyle=s.accent;ctx.font=`800 ${Math.round(w*.032)}px system-ui,-apple-system,sans-serif`;ctx.fillText(s.kicker.toUpperCase(),w/2,h*.19);const f=fit(ctx,s.message,w*.74,h*.34,Math.round(w*.09),Math.round(w*.045));ctx.fillStyle='#fff';ctx.font=`800 ${f.size}px system-ui,-apple-system,sans-serif`;let y=h*.40-(f.lines.length*f.lh)/2+f.lh/2;for(const line of f.lines){ctx.fillText(line,w/2,y);y+=f.lh;}if(s.ref){ctx.fillStyle=s.accent;ctx.font=`800 ${Math.round(w*.047)}px system-ui,-apple-system,sans-serif`;ctx.fillText(s.ref,w/2,h*.60);}ctx.fillStyle='#fff';ctx.font=`800 ${Math.round(w*.041)}px system-ui,-apple-system,sans-serif`;ctx.fillText('✝  De Mayo Bible Studies',w/2,h*.685);ctx.font=`500 ${Math.round(w*.025)}px system-ui,-apple-system,sans-serif`;ctx.fillText('Grow in faith · Walk in truth',w/2,h*.715);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(w*.10,h*.755,w*.80,8);ctx.fillStyle=s.accent;ctx.fillRect(w*.10,h*.755,w*.80*Math.max(0,Math.min(1,p)),8);}
function musicSettings(){return {track:document.querySelector('#dmExportMusic')?.value||'gentle',volume:Math.max(0,Math.min(1,Number(document.querySelector('#dmExportMusicVolume')?.value||28)/100))};}
async function makeMusic(duration){
  const settings=musicSettings();
  if(settings.track==='none'||settings.volume<=0)return null;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return null;
  const ac=new AudioCtx();
  await ac.resume();
  const destination=ac.createMediaStreamDestination();
  const master=ac.createGain();
  const filter=ac.createBiquadFilter();
  filter.type='lowpass';filter.frequency.value=1200;filter.Q.value=.4;
  master.connect(filter);filter.connect(destination);
  const now=ac.currentTime,vol=settings.volume*.22,end=now+duration;
  master.gain.setValueAtTime(0,now);
  master.gain.linearRampToValueAtTime(vol,now+1.2);
  master.gain.setValueAtTime(vol,Math.max(now+1.2,end-1.5));
  master.gain.linearRampToValueAtTime(0,end);
  const progressions={
    gentle:[[261.63,329.63,392],[220,277.18,329.63],[174.61,220,261.63],[196,246.94,293.66]],
    hope:[[261.63,329.63,392],[293.66,369.99,440],[220,277.18,329.63],[174.61,220,261.63]],
    prayer:[[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[164.81,207.65,246.94]]
  };
  const chords=progressions[settings.track]||progressions.gentle;
  const oscillators=[];
  for(let voice=0;voice<3;voice++){
    const osc=ac.createOscillator();
    const gain=ac.createGain();
    osc.type=voice===0?'sine':'triangle';
    gain.gain.value=voice===0?.48:.18;
    osc.connect(gain);gain.connect(master);
    for(let t=0;t<duration;t+=4){const chord=chords[Math.floor(t/4)%chords.length];osc.frequency.setValueAtTime(chord[voice],now+t);}
    osc.start(now);osc.stop(end+.1);oscillators.push(osc);
  }
  return {ac,destination,stop:async()=>{try{oscillators.forEach(o=>o.stop());}catch{}try{await ac.close();}catch{}}};
}
function silentSelected(){return document.querySelector('#dmExportMusic')?.value==='none';}
function syncCreateButton(){const btn=document.querySelector('#dmNativeMp4');if(!btn||busy)return;btn.textContent=silentSelected()?'🎬 Create Silent MP4':'🎬 Create MP4 with Sound';}
async function create(){if(busy)return;busy=true;clearOldFailure();const btn=document.querySelector('#dmNativeMp4');const silent=silentSelected();if(btn){btn.disabled=true;btn.textContent='⏳ Starting HD MP4…';}status('Starting 1080 × 1920 MP4 creation… Keep Safari open.','info');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));let music=null;try{const scenes=await collect();if(!scenes.length)throw new Error('Reel preview is not ready');const selected=Number(document.querySelector('#dmDuration')?.value||15);const duration=IOS?15:Math.max(9,Math.min(30,selected));const w=EXPORT_WIDTH,h=EXPORT_HEIGHT,fps=EXPORT_FPS;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});const videoStream=canvas.captureStream(fps);music=await makeMusic(duration);const tracks=[...videoStream.getVideoTracks(),...(music?music.destination.stream.getAudioTracks():[])];const stream=new MediaStream(tracks);const mime=MP4_TYPES.find(t=>MediaRecorder.isTypeSupported(t));const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:EXPORT_VIDEO_BITRATE,audioBitsPerSecond:128000});const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);const done=new Promise((resolve,reject)=>{rec.onstop=resolve;rec.onerror=e=>reject(e.error||new Error('Recording failed'));});rec.start(500);const total=duration*1000,start=performance.now();await new Promise(resolve=>{function frame(now){const p=Math.min(1,(now-start)/total),idx=Math.min(scenes.length-1,Math.floor(p*scenes.length)),sp=(p*scenes.length)-idx;draw(ctx,scenes[idx]||scenes[0],w,h,sp);const pct=Math.round(p*100);if(btn)btn.textContent=`⏳ Creating HD MP4 ${pct}%`;status(`Creating 1080p ${silent?'silent ':''}MP4 ${pct}%… Keep Safari open.`);if(p<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});rec.stop();await done;const blob=new Blob(chunks,{type:'video/mp4'});if(!blob.size)throw new Error('Empty MP4 file');if(window.DM_MP4_RESULT_READY)window.DM_MP4_RESULT_READY(blob);else URL.createObjectURL(blob);clearOldFailure();status(`1080 × 1920 ${silent?'silent MP4':'MP4 with sound'} ready (${(blob.size/1024/1024).toFixed(1)} MB). Tap Share MP4, then Save Video.`,'success');}
catch(err){console.error(err);status(`iPhone could not create this MP4 (${err?.message||'recording error'}). Reload Safari, use a 15-second Reel, and try once more.`,'error');}
finally{if(music)await music.stop();busy=false;if(btn)btn.disabled=false;syncCreateButton();}}
function installSoundControls(actions){
  if(document.querySelector('#dmSoundControls'))return;
  const card=document.createElement('section');card.id='dmSoundControls';card.className='card';
  card.innerHTML='<h3>🎵 Reel sound</h3><div class="dm-form-grid"><label>Sound option<select id="dmExportMusic"><option value="gentle">Gentle ambient</option><option value="hope">Hopeful instrumental</option><option value="prayer">Prayer atmosphere</option><option value="none">No sound — silent MP4</option></select></label><label>Music volume<input id="dmExportMusicVolume" type="range" min="0" max="60" value="28"><span id="dmExportMusicVolumeValue">28%</span></label></div><p class="small-note">Choose <b>No sound — silent MP4</b> to export without an audio track. Device voice reading remains preview-only.</p>';
  actions.insertAdjacentElement('beforebegin',card);
  const select=card.querySelector('#dmExportMusic'),slider=card.querySelector('#dmExportMusicVolume'),value=card.querySelector('#dmExportMusicVolumeValue');
  const syncSoundChoice=()=>{const silent=select.value==='none';slider.disabled=silent;value.textContent=silent?'Silent':slider.value+'%';syncCreateButton();};
  slider.addEventListener('input',syncSoundChoice);
  select.addEventListener('change',syncSoundChoice);
  syncSoundChoice();
}
function install(){const actions=document.querySelector('.dm-reel-actions');if(!actions)return;installSoundControls(actions);document.querySelectorAll("#dmSaveVideo,#dmCreateMp4").forEach(el=>el.style.display="none");const old=document.querySelector('#dmBrowserMp4');if(old)old.style.display='none';if(document.querySelector('#dmNativeMp4')){syncCreateButton();return;}const b=document.createElement('button');b.id='dmNativeMp4';b.type='button';b.className='primary';b.textContent='🎬 Create HD MP4';b.onclick=create;actions.appendChild(b);syncCreateButton();document.querySelectorAll('.dm-browser-mp4-guide').forEach(el=>{el.innerHTML=IOS?'<h3>Save a Facebook-ready Reel</h3><p>Creates a <b>1080 × 1920 vertical MP4</b> with permanent on-screen captions and Facebook-safe text placement. Use a <b>15-second Reel</b>, keep Safari open, then tap <b>Share MP4</b> and choose <b>Save Video</b>.</p>':'<h3>Facebook-ready HD MP4</h3><p>Creates a <b>1080 × 1920 vertical MP4</b> with permanent on-screen captions and Facebook-safe text placement.</p>';});}
window.addEventListener('load',install);window.addEventListener('hashchange',()=>setTimeout(install,0));document.addEventListener('dm-reel-studio-ready',install);
})();
