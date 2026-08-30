/* De Mayo Bible Studies — selected Reel duration sync v1
   Keeps the native MP4 target aligned with the duration selected in Reel Creator.
   Native recorder derives voiced MP4 length from DM_REEL_VOICEOVER_DURATION, so immediately
   before export we temporarily set that timing value to the selected duration target. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let actualVoiceDuration=0;
function selectedDuration(){
  const n=Number($('#dmDuration')?.value||30);
  return Math.max(9,Math.min(120,Number.isFinite(n)?n:30));
}
function rememberActual(){
  const n=Number(window.DM_REEL_VOICEOVER_DURATION||0);
  if(n>0 && !window.__DM_DURATION_SYNC_APPLIED)actualVoiceDuration=n;
}
function syncBeforeExport(){
  rememberActual();
  if(!window.DM_REEL_VOICEOVER_BLOB?.size)return;
  const target=selectedDuration();
  window.__DM_DURATION_SYNC_APPLIED=true;
  /* native-mp4-recorder adds one second after this value */
  window.DM_REEL_VOICEOVER_DURATION=Math.max(1,target-1);
  const status=$('#dmExportStatus');
  if(status){status.hidden=false;status.dataset.type='info';status.textContent=`Selected Reel length: ${target} seconds. The MP4 will use this duration.`;}
}
function restoreAfterExport(){
  if(!window.__DM_DURATION_SYNC_APPLIED)return;
  setTimeout(()=>{
    if(actualVoiceDuration>0)window.DM_REEL_VOICEOVER_DURATION=actualVoiceDuration;
    window.__DM_DURATION_SYNC_APPLIED=false;
  },1500);
}
function showSelection(){
  const el=$('#dmDuration');if(!el)return;
  let note=$('#dmDurationSyncNote');
  if(!note){note=document.createElement('small');note.id='dmDurationSyncNote';note.className='small-note';el.insertAdjacentElement('afterend',note);}
  note.textContent=`Target MP4 length: ${selectedDuration()} seconds. Voice recording may finish earlier, but export will follow this selected length.`;
}
function boot(){
  document.addEventListener('dm-reel-voiceover-ready',()=>{actualVoiceDuration=Number(window.DM_REEL_VOICEOVER_DURATION||0);showSelection();});
  document.addEventListener('change',e=>{if(e.target?.id==='dmDuration')showSelection();});
  document.addEventListener('click',e=>{
    const b=e.target?.closest?.('#dmNativeMp4');if(!b)return;
    syncBeforeExport();restoreAfterExport();
  },true);
  showSelection();
  let tries=0;const retry=setInterval(()=>{tries++;showSelection();if($('#dmDuration')||tries>40)clearInterval(retry);},100);
}
window.DM_REEL_DURATION_SYNC={selectedDuration,syncBeforeExport};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
