/* De Mayo Bible Studies — voice-over Refresh Script reliability fix v1
   Makes Refresh Script a true button action and rebuilds the prepared script from the latest Reel content. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let installed=false;
function refresh(){
  const button=$('#dmRefreshVoiceoverScript');
  if(button)button.type='button';
  let updated=false;
  try{updated=!!window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.()||updated;}catch(error){console.warn('Voice duration refresh:',error);}
  try{window.DM_REEL_DURATION_SYNC?.syncVoiceoverScript?.();updated=!!$('#dmVoiceoverScript')?.textContent.trim()||updated;}catch(error){console.warn('Voice duration sync refresh:',error);}
  /* Run once more after the other Reel listeners have settled so an older handler cannot overwrite the fresh script. */
  setTimeout(()=>{
    try{window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.();}catch{}
    try{window.DM_REEL_DURATION_SYNC?.syncVoiceoverScript?.();}catch{}
    const b=$('#dmRefreshVoiceoverScript');
    if(b){const old='↻ Refresh Script';b.textContent='✓ Script Refreshed';setTimeout(()=>{if(b.isConnected)b.textContent=old;},900);}
  },90);
  window.toast?.(updated?'Voice-over script refreshed from the current Reel.':'The Reel script is still loading. Please try again in a moment.');
}
function wire(){
  const button=$('#dmRefreshVoiceoverScript');
  if(!button)return false;
  button.type='button';
  if(button.dataset.dmRefreshFixed==='1')return true;
  button.dataset.dmRefreshFixed='1';
  button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();refresh();},true);
  return true;
}
function boot(){
  if(installed)return;installed=true;
  wire();
  document.addEventListener('dm-reel-studio-ready',()=>setTimeout(wire,80));
  document.addEventListener('dm-reel-content-change',()=>setTimeout(wire,40));
  window.addEventListener('hashchange',()=>setTimeout(wire,100));
  let tries=0;const timer=setInterval(()=>{tries++;if(wire()||tries>80)clearInterval(timer);},125);
}
window.DM_REEL_VOICEOVER_REFRESH_FIX={refresh,wire};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
