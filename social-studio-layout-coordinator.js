/* De Mayo Bible Studies — Social Studio adaptive layout coordinator */
(function(){
'use strict';
let timer=0;

function arrange(){
  if(location.hash!=='#socialstudio')return false;
  const view=document.querySelector('#view');
  const layout=view?.querySelector('.social-studio-layout');
  if(!view||!layout)return false;

  const engine=document.querySelector('#dmSocialV2Panel');
  const branding=document.querySelector('#dmSocialBrandingSettings');
  const designer=document.querySelector('#dmSocialDesigner');
  const drafts=view.querySelector('.social-drafts');

  /* Keep only the creator, preview and fresh engine inside the two-column workspace. */
  if(engine&&engine.parentElement!==layout)layout.appendChild(engine);

  /* Extra tools must be full-width sections below the main workspace. */
  let anchor=layout;
  [branding,designer].forEach(panel=>{
    if(!panel)return;
    if(panel.parentElement!==view||panel.previousElementSibling!==anchor){
      anchor.insertAdjacentElement('afterend',panel);
    }
    panel.classList.add('dm-social-full-width-panel');
    anchor=panel;
  });

  /* Keep saved drafts after all creator panels. */
  if(drafts&&drafts.previousElementSibling!==anchor){
    anchor.insertAdjacentElement('afterend',drafts);
  }
  return true;
}

function schedule(){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    arrange();
    setTimeout(arrange,120);
    setTimeout(arrange,500);
  },40);
}

window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
document.addEventListener('click',e=>{
  if(e.target.closest('[data-page="socialstudio"],#dmSocialV2Panel,#dmSocialBrandingSettings,#dmSocialDesigner'))schedule();
});

const observer=new MutationObserver(()=>{
  if(location.hash==='#socialstudio')schedule();
});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
