/* De Mayo Bible Studies — dedicated silent MP4 export button v1 */
(function(){
'use strict';
let installed=false;
function install(){
 if(installed||location.hash!=='#reelcreator')return;
 const soundBtn=document.querySelector('#dmNativeMp4');
 if(!soundBtn){setTimeout(install,120);return;}
 const actions=soundBtn.parentElement;if(!actions)return;
 if(document.querySelector('#dmSilentMp4')){installed=true;return;}
 const b=document.createElement('button');
 b.id='dmSilentMp4';b.type='button';b.textContent='🔇 Create MP4 without Sound';
 if(soundBtn.className)b.className=soundBtn.className;
 b.classList.remove('primary');
 b.onclick=()=>{
   const sound=document.querySelector('#dmExportMusic');
   if(!sound){window.toast?.('MP4 sound controls are not ready yet.');return;}
   const previous=sound.value;
   sound.value='none';sound.dispatchEvent(new Event('change',{bubbles:true}));
   soundBtn.click();
   const restore=()=>{if(!soundBtn.disabled){sound.value=previous;sound.dispatchEvent(new Event('change',{bubbles:true}));clearInterval(timer);}};
   const timer=setInterval(restore,500);setTimeout(()=>{clearInterval(timer);if(sound.value==='none'){sound.value=previous;sound.dispatchEvent(new Event('change',{bubbles:true}));}},130000);
 };
 soundBtn.insertAdjacentElement('afterend',b);installed=true;
}
function boot(){install();window.addEventListener('hashchange',()=>{installed=false;setTimeout(install,100);});document.addEventListener('dm-reel-studio-ready',()=>setTimeout(install,80));let n=0;const t=setInterval(()=>{n++;install();if(installed||n>50)clearInterval(t);},150);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
