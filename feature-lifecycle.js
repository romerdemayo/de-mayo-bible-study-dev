/* De Mayo Bible Studies | stable feature lifecycle */
(function(){
'use strict';
let lastSocialView=null;
function signalSocial(){
 if(location.hash!=='#socialstudio')return;
 const view=document.querySelector('#view');
 if(!view||!view.querySelector('.social-studio-layout')||view===lastSocialView)return;
 lastSocialView=view;
 requestAnimationFrame(()=>document.dispatchEvent(new CustomEvent('dm-social-studio-ready')));
}
document.addEventListener('click',event=>{
 if(event.target.closest?.('[data-page="socialstudio"],a[href="#socialstudio"]'))setTimeout(signalSocial,0);
});
window.addEventListener('hashchange',()=>setTimeout(signalSocial,0));
window.addEventListener('load',()=>setTimeout(signalSocial,0));
})();

