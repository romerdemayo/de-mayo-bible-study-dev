/* De Mayo Bible Studies — daily voice-over duration bridge v1
   Uses preserved full generated text and adds a natural engagement close so daily narration
   better fills the available two-minute recording window without overcrowding Reel slides. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const words=v=>clean(v).split(' ').filter(Boolean);
function current(){try{return window.DM_REEL_CREATOR?.getContent?.()||{}}catch{return{}}}
function weekly(){return !!$('.dm-reel-canvas.dm-weekly-scene');}
function shorten(value,limit){
 const all=words(value);if(all.length<=limit)return clean(value);
 return all.slice(0,limit).join(' ').replace(/[,:;\-–—]+$/,'')+'…';
}
function build(){
 if(weekly())return '';
 const c=current(),verse=clean(c.verse),reference=clean(c.reference);
 const reflection=shorten(c.voiceoverReflection||c.reflection,72);
 const prayer=shorten(c.voiceoverPrayer||c.prayer,58);
 const q=window.DM_REEL_ENGAGEMENT?.question?.(c)||'What part of God’s Word spoke to you today?';
 const bridge='Take a quiet moment and let this truth settle in your heart. You do not need to have every answer today. Bring what you are carrying to God, trust His Word, and take your next faithful step with Him.';
 const close=`Before you go, reflect on this question: ${q} If this encouraged you, share your answer in the comments and send this message to someone who may need God’s encouragement today.`;
 let text=[verse,reference,reflection,bridge,'Let us pray.',prayer,close].filter(Boolean).join('\n\n');
 const all=words(text);if(all.length>195)text=all.slice(0,195).join(' ').replace(/[,:;\-–—]+$/,'')+'.';
 return text;
}
function apply(){
 const text=build();if(!text)return false;
 const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');
 if(area&&area.textContent!==text){area.textContent=text;area.scrollTop=0;}
 if(full&&full.textContent!==text){full.textContent=text;full.scrollTop=0;}
 const count=words(text).length,estimate=Math.ceil(count/100*60),info=$('#dmVoiceoverWordCount');
 if(info)info.textContent=`${count} words • about ${estimate} seconds at a calm reading pace`;
 return true;
}
function fixTimer(){document.querySelectorAll('#dmVoiceoverTimer,#dmFullscreenTimer').forEach(el=>{if(el.textContent.includes('/ 1:30'))el.textContent=el.textContent.replace('/ 1:30','/ 2:00');});}
let queued=false;function schedule(delay=80){if(queued)return;queued=true;setTimeout(()=>{queued=false;apply();fixTimer();},delay);}
function boot(){
 schedule(120);
 ['dm-reel-content-change','dm-reel-generated','dm-reel-studio-ready'].forEach(name=>document.addEventListener(name,()=>schedule(80)));
 document.addEventListener('click',e=>{if(e.target?.id==='dmRefreshVoiceoverScript')schedule(40);if(e.target?.id==='dmStartVoiceover')setTimeout(()=>{apply();fixTimer();},100);});
 const timer=setInterval(fixTimer,500);setTimeout(()=>clearInterval(timer),125000);
}
window.DM_REEL_VOICEOVER_DURATION_FIX={apply,build};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
