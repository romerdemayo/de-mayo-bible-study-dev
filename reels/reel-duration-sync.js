/* De Mayo Bible Studies — selected Reel duration + content sync v2
   Selected duration drives Gemini content length, teleprompter word target and MP4 length.
   Voice recording remains capped at two minutes. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const SPEAKING_WPM=105,MAX_SECONDS=120;
let actualVoiceDuration=0,fetchPatched=false;
function words(v=''){return String(v||'').trim().split(/\s+/).filter(Boolean)}
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim()}
function selectedDuration(){const n=Number($('#dmDuration')?.value||30);return Math.max(15,Math.min(MAX_SECONDS,Number.isFinite(n)?n:30));}
function targetWords(){return Math.max(35,Math.min(210,Math.round(selectedDuration()*SPEAKING_WPM/60)));}
function shorten(value,limit){const text=clean(value),all=words(text);if(all.length<=limit)return text;const hard=all.slice(0,limit).join(' ');const stops=[...hard.matchAll(/[.!?](?=\s|$)/g)].map(m=>m.index+1).filter(i=>i>=hard.length*.58);return stops.length?hard.slice(0,stops[stops.length-1]).trim():hard.replace(/[,:;\-–—]+$/,'').trim()+'…';}
function durationInstruction(){const seconds=selectedDuration(),target=targetWords(),low=Math.max(25,Math.round(target*.9)),high=Math.round(target*1.04);return `IMPORTANT REEL LENGTH: The user selected ${seconds} seconds. Write enough spoken content so the complete narration (verse + reference + reflection/message + prayer + short engagement question) is about ${low}-${high} words total at a calm 105 words-per-minute pace. Do not make the prayer tiny just to stay brief. Keep the visual reflection and prayer readable, but provide fuller natural wording for voice-over when needed. Never exceed a two-minute spoken script.`;}
function patchPromptBody(body){
 try{
  const data=typeof body==='string'?JSON.parse(body):body;if(!data||typeof data!=='object')return body;
  const note='\n\n'+durationInstruction();let changed=false;
  const walk=(obj)=>{if(!obj||typeof obj!=='object')return;for(const key of Object.keys(obj)){const v=obj[key];if(typeof v==='string'&&/prompt|instruction|message|content/i.test(key)&&v.length>40&&/verse|reel|prayer|reflection|bible/i.test(v)){if(!v.includes('IMPORTANT REEL LENGTH:'))obj[key]=v+note;changed=true;}else if(v&&typeof v==='object')walk(v);}};
  walk(data);if(!changed&&typeof data.prompt==='string')data.prompt+=note;
  return typeof body==='string'?JSON.stringify(data):data;
 }catch{return body;}
}
function patchFetch(){if(fetchPatched||typeof window.fetch!=='function')return;fetchPatched=true;const original=window.fetch.bind(window);window.fetch=function(input,init){try{const url=typeof input==='string'?input:input?.url||'';if(location.hash==='#reelcreator'&&/e-mayo-bible-ai/i.test(url)&&init?.body){init={...init,body:patchPromptBody(init.body)};}}catch{}return original(input,init);};}
function buildDurationScript(){
 const c=window.DM_REEL_CREATOR?.getContent?.()||{},verse=clean(c.verse),reference=clean(c.reference),reflection=clean(c.voiceoverReflection||c.reflection),prayer=clean(c.voiceoverPrayer||c.prayer),question=clean(window.DM_REEL_ENGAGEMENT?.question?.(c));
 const limit=targetWords(),fixed=words(`${verse} ${reference} Let us reflect. Let us pray. ${question}`).length;
 const available=Math.max(20,limit-fixed),prayerBudget=Math.max(24,Math.round(available*.38)),reflectionBudget=Math.max(24,available-prayerBudget);
 const parts=[verse,reference,'Let us reflect.',shorten(reflection,reflectionBudget),'Let us pray.',shorten(prayer,prayerBudget)];
 const q=question?`Before you go, ${question}`:'';if(q&&words(parts.join(' ')+' '+q).length<=limit+8)parts.push(q);
 return parts.filter(Boolean).join('\n\n');
}
function syncVoiceoverScript(){
 if(!$('#dmVoiceoverScript')||!window.DM_REEL_CREATOR)return;
 const text=buildDurationScript();if(!text)return;const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');if(area&&area.textContent!==text){area.textContent=text;area.scrollTop=0;}if(full&&full.textContent!==text){full.textContent=text;full.scrollTop=0;}
 const count=words(text).length,estimate=Math.ceil(count/SPEAKING_WPM*60),target=selectedDuration(),info=$('#dmVoiceoverWordCount');if(info)info.textContent=`${count} words • about ${estimate} seconds • selected Reel ${target}s`;
 const timerText=`0:00 / 2:00`;if($('#dmVoiceoverTimer')&&!window.DM_REEL_VOICEOVER_BLOB)$('#dmVoiceoverTimer').textContent=timerText;if($('#dmFullscreenTimer')&&!window.DM_REEL_VOICEOVER_BLOB)$('#dmFullscreenTimer').textContent=timerText;
}
function rememberActual(){const n=Number(window.DM_REEL_VOICEOVER_DURATION||0);if(n>0&&!window.__DM_DURATION_SYNC_APPLIED)actualVoiceDuration=n;}
function syncBeforeExport(){rememberActual();if(!window.DM_REEL_VOICEOVER_BLOB?.size)return;const target=selectedDuration();window.__DM_DURATION_SYNC_APPLIED=true;window.DM_REEL_VOICEOVER_DURATION=Math.max(1,target-1);const status=$('#dmExportStatus');if(status){status.hidden=false;status.dataset.type='info';status.textContent=`Selected Reel length: ${target} seconds. The MP4 will use this duration.`;}}
function restoreAfterExport(){if(!window.__DM_DURATION_SYNC_APPLIED)return;setTimeout(()=>{if(actualVoiceDuration>0)window.DM_REEL_VOICEOVER_DURATION=actualVoiceDuration;window.__DM_DURATION_SYNC_APPLIED=false;},1500);}
function showSelection(){const el=$('#dmDuration');if(!el)return;let note=$('#dmDurationSyncNote');if(!note){note=document.createElement('small');note.id='dmDurationSyncNote';note.className='small-note';el.insertAdjacentElement('afterend',note);}note.textContent=`Target: ${selectedDuration()} seconds • about ${targetWords()} spoken words. New generated content and voice-over will aim for this length; recording can run up to 2:00.`;}
function refreshAll(){showSelection();setTimeout(syncVoiceoverScript,50);setTimeout(syncVoiceoverScript,250);}
function boot(){patchFetch();document.addEventListener('dm-reel-voiceover-ready',()=>{actualVoiceDuration=Number(window.DM_REEL_VOICEOVER_DURATION||0);showSelection();});document.addEventListener('dm-reel-content-change',refreshAll);document.addEventListener('dm-reel-generated',refreshAll);document.addEventListener('change',e=>{if(e.target?.id==='dmDuration'){refreshAll();}});document.addEventListener('click',e=>{if(e.target?.id==='dmRefreshVoiceoverScript')setTimeout(syncVoiceoverScript,80);const b=e.target?.closest?.('#dmNativeMp4');if(b){syncBeforeExport();restoreAfterExport();}},true);refreshAll();let tries=0;const retry=setInterval(()=>{tries++;patchFetch();refreshAll();if(($('#dmDuration')&&$('#dmVoiceoverScript'))||tries>40)clearInterval(retry);},150);}
window.DM_REEL_DURATION_SYNC={selectedDuration,targetWords,syncBeforeExport,syncVoiceoverScript,durationInstruction};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
