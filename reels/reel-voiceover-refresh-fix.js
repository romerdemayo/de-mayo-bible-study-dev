/* De Mayo Bible Studies — voice-over Refresh Script reliability fix v2
   Manual pasted content always wins, so Refresh Script cannot replace or shorten its reflection. */
(function(){
'use strict';
const $=s=>document.querySelector(s);let installed=false;
function isManual(){try{return String(window.DM_REEL_CREATOR?.getContent?.().source||'').toLowerCase()==='manual';}catch{return false;}}
function runBestSync(){
 if(isManual()&&window.DM_REEL_MANUAL_CONTENT?.syncReading){window.DM_REEL_MANUAL_CONTENT.syncReading();return !!$('#dmVoiceoverScript')?.textContent.trim();}
 let updated=false;try{updated=!!window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.()||updated;}catch(error){console.warn('Voice duration refresh:',error);}try{window.DM_REEL_DURATION_SYNC?.syncVoiceoverScript?.();updated=!!$('#dmVoiceoverScript')?.textContent.trim()||updated;}catch(error){console.warn('Voice duration sync refresh:',error);}return updated;
}
function refresh(){const button=$('#dmRefreshVoiceoverScript');if(button)button.type='button';const updated=runBestSync();setTimeout(()=>{runBestSync();const b=$('#dmRefreshVoiceoverScript');if(b){const old='↻ Refresh Script';b.textContent='✓ Script Refreshed';setTimeout(()=>{if(b.isConnected)b.textContent=old;},900);}},90);window.toast?.(updated?'Voice-over script refreshed from the current Reel.':'The Reel script is still loading. Please try again in a moment.');}
function wire(){const button=$('#dmRefreshVoiceoverScript');if(!button)return false;button.type='button';if(button.dataset.dmRefreshFixed==='1')return true;button.dataset.dmRefreshFixed='1';button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();refresh();},true);return true;}
function boot(){if(installed)return;installed=true;wire();document.addEventListener('dm-reel-studio-ready',()=>setTimeout(wire,80));document.addEventListener('dm-reel-content-change',()=>setTimeout(wire,40));window.addEventListener('hashchange',()=>setTimeout(wire,100));let tries=0;const timer=setInterval(()=>{tries++;if(wire()||tries>80)clearInterval(timer);},125);}
window.DM_REEL_VOICEOVER_REFRESH_FIX={refresh,wire};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();