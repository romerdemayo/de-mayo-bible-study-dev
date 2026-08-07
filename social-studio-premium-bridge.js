/* De Mayo Bible Studies — keep premium Social Studio active after generation */
(function(){
'use strict';
let timer=0;
const $=(s,r=document)=>r.querySelector(s);

function activate(){
  if(location.hash!=='#socialstudio')return;
  const view=$('#view');
  const designer=$('#dmSocialDesigner');
  const layout=$('.social-studio-layout',view);
  const engine=$('#dmSocialV2Panel');
  const branding=$('#dmSocialBrandingSettings');
  const drafts=$('.social-drafts',view);
  if(!view||!designer)return;

  designer.hidden=false;
  designer.removeAttribute('aria-hidden');
  designer.style.removeProperty('display');
  designer.style.width='100%';
  designer.style.maxWidth='1220px';
  designer.style.margin='0 auto 20px';
  if(designer.parentElement!==view||designer!==view.firstElementChild){
    view.insertBefore(designer,view.firstElementChild);
  }

  let anchor=designer;
  [engine,branding,drafts].forEach(panel=>{
    if(!panel)return;
    panel.hidden=false;
    panel.removeAttribute('aria-hidden');
    panel.style.removeProperty('display');
    panel.style.width='100%';
    panel.style.maxWidth='1220px';
    panel.style.marginLeft='auto';
    panel.style.marginRight='auto';
    if(panel.parentElement!==view||panel.previousElementSibling!==anchor){
      anchor.insertAdjacentElement('afterend',panel);
    }
    anchor=panel;
  });

  if(layout){
    layout.hidden=true;
    layout.setAttribute('aria-hidden','true');
    layout.style.setProperty('display','none','important');
  }

  /* Trigger the premium canvas to redraw from the newly generated content. */
  const verse=$('#socialVerse');
  if(verse)verse.dispatchEvent(new Event('input',{bubbles:true}));
}

function schedule(){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    activate();
    setTimeout(activate,100);
    setTimeout(activate,350);
  },30);
}

window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
document.addEventListener('click',e=>{
  if(e.target.closest('#socialGenerateVerse,#socialGeneratePrayer,#socialGenerateComplete,#dmSocialFreshSelected,[data-page="socialstudio"],a[href="#socialstudio"]'))schedule();
});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule()}).observe(document.documentElement,{childList:true,subtree:true});
})();
