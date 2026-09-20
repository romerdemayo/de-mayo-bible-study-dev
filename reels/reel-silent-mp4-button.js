/* De Mayo Bible Studies — direct Voice Only MP4 export v2 */
(function(){
'use strict';
let installed=false;
function install(){
 if(installed||location.hash!=='#reelcreator')return;
 const soundBtn=document.querySelector('#dmNativeMp4');
 if(!soundBtn){setTimeout(install,120);return;}
 const actions=soundBtn.parentElement;if(!actions)return;
 let b=document.querySelector('#dmSilentMp4');
 if(!b){b=document.createElement('button');b.id='dmSilentMp4';b.type='button';soundBtn.insertAdjacentElement('afterend',b);}
 b.textContent='🎙 Create MP4 — Voice Only';
 b.title='Your recorded voice with no background music';
 if(soundBtn.className)b.className=soundBtn.className;
 b.classList.remove('primary');
 b.onclick=()=>{if(typeof window.DM_CREATE_VOICE_ONLY_MP4==='function')window.DM_CREATE_VOICE_ONLY_MP4();else window.toast?.('Voice-only MP4 creator is still loading. Please try again.');};
 installed=true;
}
function boot(){install();window.addEventListener('hashchange',()=>{installed=false;setTimeout(install,100);});document.addEventListener('dm-reel-studio-ready',()=>setTimeout(install,80));let n=0;const t=setInterval(()=>{n++;install();if(installed||n>50)clearInterval(t);},150);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();