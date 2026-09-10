/* De Mayo Bible Studies — lock teleprompter text while recording v1 */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let locked=false,lockedText='',observer=null,restoring=false;
function currentText(){return String($('#dmVoiceoverFullscreenScript')?.textContent||$('#dmVoiceoverScript')?.textContent||'').trim();}
function restore(){if(!locked||restoring||!lockedText)return;restoring=true;try{const normal=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');if(normal&&normal.textContent!==lockedText){const y=normal.scrollTop;normal.textContent=lockedText;normal.scrollTop=y;}if(full&&full.textContent!==lockedText){const y=full.scrollTop;full.textContent=lockedText;full.scrollTop=y;}}finally{restoring=false;}}
function lock(){const text=currentText();if(!text)return false;lockedText=text;locked=true;document.documentElement.dataset.dmTeleprompterLocked='1';restore();return true;}
function unlock(){locked=false;lockedText='';delete document.documentElement.dataset.dmTeleprompterLocked;}
function watch(){if(observer)observer.disconnect();observer=new MutationObserver(()=>restore());observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
function boot(){watch();document.addEventListener('click',e=>{if(e.target?.id==='dmStartVoiceover'){window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.();setTimeout(lock,0);}if(['dmStopVoiceover','dmFullscreenStop'].includes(e.target?.id))setTimeout(unlock,250);},true);document.addEventListener('dm-reel-voiceover-ready',unlock);document.addEventListener('dm-reel-manual-content-deleted',unlock);window.addEventListener('hashchange',()=>{if(location.hash!=='#reelcreator')unlock();});}
window.DM_REEL_TELEPROMPTER_LOCK={lock,unlock,restore,isLocked:()=>locked,text:()=>lockedText};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
