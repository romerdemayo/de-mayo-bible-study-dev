/* De Mayo Bible Studies — daily voice-over duration bridge v11
   Always uses the preserved full narration for manual, offline and generated Reels.
   Reflection and prayer are never shortened in the teleprompter. Engagement remains visual only. */
(function(){
'use strict';
const $=s=>document.querySelector(s),clean=v=>String(v||'').replace(/\s+/g,' ').trim(),words=v=>clean(v).split(' ').filter(Boolean);
function current(){try{return window.DM_REEL_CREATOR?.getContent?.()||{}}catch{return{}}}
function saved(){return window.DM_REEL_FULL_NARRATION||{}}
function weekly(){return !!$('.dm-reel-canvas.dm-weekly-scene');}
function selectedSeconds(){const n=Number($('#dmDuration')?.value||60);return Math.max(15,Math.min(120,Number.isFinite(n)?n:60));}
function targetWords(){return Math.max(24,Math.min(192,Math.round(selectedSeconds()*1.60)));}
function prayerClose(value){let p=clean(value).replace(/(?:,?\s*)?(?:in\s+jesus(?:'|’)?\s+name(?:\s*,?\s*(?:we\s+pray)?)?[,\s.!]*)?amen[.!]*$/i,'').trim();p=p.replace(/[,.!?;:]+$/,'').trim();return `${p}${p?'. ':''}In Jesus’ name, Amen.`;}
function source(){const c=current(),s=saved();return clean(s.source||c.source).toLowerCase();}
function build(){
 if(weekly())return '';
 const c=current(),s=saved();
 const verse=clean(s.verse||c.verse),reference=clean(s.reference||c.reference);
 const fullReflection=clean(s.reflection||c.voiceoverReflection||c.reflection);
 const prayer=prayerClose(s.prayer||c.voiceoverPrayer||c.prayer);
 if(!verse&&!reference&&!fullReflection&&!prayer)return '';
 return [verse,reference,'Let us reflect.',fullReflection,'Let us pray.',prayer].filter(Boolean).join('\n\n');
}
function apply(){
 const text=build();if(!text)return false;
 const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');
 if(area&&area.textContent!==text){area.textContent=text;area.scrollTop=0;area.dataset.dmFullNarration='1';}
 if(full&&full.textContent!==text){full.textContent=text;full.scrollTop=0;full.dataset.dmFullNarration='1';}
 const count=words(text).length,estimate=Math.ceil(count/96*60),info=$('#dmVoiceoverWordCount'),src=source();
 if(info){const label=src==='manual'?'full pasted script':src.includes('built-in')||src.includes('offline')?'full offline script':'full generated script';info.textContent=`${count} words • about ${estimate} seconds • ${label}`;}
 return true;
}
function fixTimer(){document.querySelectorAll('#dmVoiceoverTimer,#dmFullscreenTimer').forEach(el=>{if(el.textContent.includes('/ 1:30'))el.textContent=el.textContent.replace('/ 1:30','/ 2:00');});}
let queued=false;function schedule(delay=60){if(queued)return;queued=true;setTimeout(()=>{queued=false;apply();fixTimer();},delay);}
function boot(){
 schedule(120);
 ['dm-reel-content-change','dm-reel-generated','dm-reel-studio-ready','dm-reel-engagement-ready','dm-reel-manual-content-ready','dm-reel-full-narration-ready'].forEach(name=>document.addEventListener(name,()=>schedule(40)));
 document.addEventListener('change',e=>{if(e.target?.id==='dmDuration')schedule(30);});
 /* Capture phase refreshes the exact full narration before reel-voiceover.js opens fullscreen. */
 document.addEventListener('click',e=>{if(e.target?.id==='dmStartVoiceover'){apply();fixTimer();}},true);
 document.addEventListener('click',e=>{if(e.target?.id==='dmRefreshVoiceoverScript')schedule(20);});
 const timer=setInterval(fixTimer,500);setTimeout(()=>clearInterval(timer),125000);
}
window.DM_REEL_VOICEOVER_DURATION_FIX={apply,build,selectedSeconds,targetWords,prayerClose,source};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();