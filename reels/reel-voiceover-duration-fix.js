/* De Mayo Bible Studies — daily voice-over duration bridge v3
   Matches narration to selected Reel duration and ensures every prayer closes in Jesus' name. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const words=v=>clean(v).split(' ').filter(Boolean);
function current(){try{return window.DM_REEL_CREATOR?.getContent?.()||{}}catch{return{}}}
function weekly(){return !!$('.dm-reel-canvas.dm-weekly-scene');}
function selectedSeconds(){const n=Number($('#dmDuration')?.value||60);return Math.max(15,Math.min(120,Number.isFinite(n)?n:60));}
function targetWords(){return Math.max(28,Math.min(205,Math.round(selectedSeconds()*1.68)));}
function trimTo(value,limit){const all=words(value);return all.length<=limit?clean(value):all.slice(0,limit).join(' ').replace(/[,:;\-–—]+$/,'')+'…';}
function prayerClose(value){
 let p=clean(value).replace(/(?:,?\s*)?(?:in\s+jesus(?:'|’)?\s+name(?:\s*,?\s*(?:we\s+pray)?)?[,\s.!]*)?amen[.!]*$/i,'').trim();
 p=p.replace(/[,.!?;:]+$/,'').trim();
 return `${p}${p?'. ':''}In Jesus’ name, Amen.`;
}
const FILLERS=[
 'Take a quiet moment and let this truth settle in your heart. God is not asking you to carry tomorrow before it arrives. He is inviting you to trust Him in this moment and take the next faithful step with Him.',
 'Whatever you are facing today, remember that God sees the whole picture even when you only see one part. His Word is still dependable, His presence is still near, and His grace is enough for what is in front of you.',
 'You can bring your questions, worries, hopes, and plans to God. You do not need perfect words. Come honestly, listen for what His Word is reminding you of, and choose to respond with faith rather than fear.',
 'As you continue through your day, carry this scripture with you. Return to it when your thoughts become heavy. Let it shape your response, steady your heart, and remind you that God remains faithful in every season.'
];
function closeText(q){return `Before you go, reflect on this question: ${q} If this encouraged you, share your answer in the comments and send this message to someone who may need God’s encouragement today.`;}
function build(){
 if(weekly())return '';
 const c=current(),verse=clean(c.verse),reference=clean(c.reference);
 const reflection=clean(c.voiceoverReflection||c.reflection);
 const prayer=prayerClose(c.voiceoverPrayer||c.prayer);
 const q=window.DM_REEL_ENGAGEMENT?.question?.(c)||'What part of God’s Word spoke to you today?';
 const target=targetWords(),softMax=Math.min(210,target+5);
 let parts=[verse,reference,reflection],count=words(parts.join(' ')).length;
 for(const filler of FILLERS){const remaining=target-count-words(`Let us pray. ${prayer} ${closeText(q)}`).length;if(remaining<=10)break;const piece=trimTo(filler,Math.min(words(filler).length,remaining));if(piece){parts.push(piece);count=words(parts.join(' ')).length;}}
 parts.push('Let us pray.',prayer,closeText(q));
 let text=parts.filter(Boolean).join('\n\n');const all=words(text);if(all.length>softMax)text=all.slice(0,softMax).join(' ').replace(/[,:;\-–—]+$/,'')+'.';return text;
}
function apply(){const text=build();if(!text)return false;const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');if(area&&area.textContent!==text){area.textContent=text;area.scrollTop=0;}if(full&&full.textContent!==text){full.textContent=text;full.scrollTop=0;}const count=words(text).length,estimate=Math.ceil(count/100*60),seconds=selectedSeconds(),info=$('#dmVoiceoverWordCount');if(info)info.textContent=`${count} words • about ${estimate} seconds at a calm reading pace • selected Reel ${seconds}s`;return true;}
function fixTimer(){document.querySelectorAll('#dmVoiceoverTimer,#dmFullscreenTimer').forEach(el=>{if(el.textContent.includes('/ 1:30'))el.textContent=el.textContent.replace('/ 1:30','/ 2:00');});}
let queued=false;function schedule(delay=80){if(queued)return;queued=true;setTimeout(()=>{queued=false;apply();fixTimer();},delay);}
function boot(){schedule(120);['dm-reel-content-change','dm-reel-generated','dm-reel-studio-ready'].forEach(name=>document.addEventListener(name,()=>schedule(80)));document.addEventListener('change',e=>{if(e.target?.id==='dmDuration')schedule(30);});document.addEventListener('click',e=>{if(e.target?.id==='dmRefreshVoiceoverScript')schedule(40);if(e.target?.id==='dmStartVoiceover')setTimeout(()=>{apply();fixTimer();},100);});const timer=setInterval(fixTimer,500);setTimeout(()=>clearInterval(timer),125000);}
window.DM_REEL_VOICEOVER_DURATION_FIX={apply,build,selectedSeconds,targetWords,prayerClose};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
