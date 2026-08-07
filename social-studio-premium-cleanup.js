/* De Mayo Bible Studies - Premium Social Studio primary interface */
(function(){
'use strict';
let timer=0;
const $=(s,r=document)=>r.querySelector(s);

function hideLegacy(el){
 if(!el)return;
 el.hidden=true;
 el.setAttribute('aria-hidden','true');
 el.style.setProperty('display','none','important');
 el.dataset.dmLegacySocialHidden='1';
}

function showPanel(el){
 if(!el)return;
 el.hidden=false;
 el.removeAttribute('aria-hidden');
 el.style.removeProperty('display');
 el.classList.add('dm-social-full-width-panel');
 el.style.width='100%';
 el.style.maxWidth='1220px';
 el.style.marginLeft='auto';
 el.style.marginRight='auto';
}

function placeAfter(anchor,panel){
 if(!anchor||!panel)return anchor;
 if(panel.parentElement!==anchor.parentElement||panel.previousElementSibling!==anchor){
  anchor.insertAdjacentElement('afterend',panel);
 }
 return panel;
}

function arrange(){
 if(location.hash!=='#socialstudio')return false;
 const view=$('#view');
 const designer=$('#dmSocialDesigner');
 if(!view||!designer)return false;

 const layout=$('.social-studio-layout',view);
 const controls=$('.social-controls',view);
 const preview=$('.social-preview-card',view);
 const engine=$('#dmSocialV2Panel');
 const branding=$('#dmSocialBrandingSettings');
 const drafts=$('.social-drafts',view);

 view.classList.add('dm-premium-social-active');
 showPanel(designer);
 if(designer.parentElement!==view||designer!==view.firstElementChild)view.insertBefore(designer,view.firstElementChild);

 let anchor=designer;
 if(engine){showPanel(engine);anchor=placeAfter(anchor,engine)}
 if(branding){showPanel(branding);anchor=placeAfter(anchor,branding)}
 if(drafts){showPanel(drafts);anchor=placeAfter(anchor,drafts)}

 hideLegacy(controls);
 hideLegacy(preview);
 hideLegacy(layout);

 /* Redraw premium canvas from the latest generated verse or prayer. */
 const source=$('#socialType')?.value==='prayer'?$('#socialPrayer'):$('#socialVerse');
 if(source&&!source.dataset.dmPremiumRedrawing){
  source.dataset.dmPremiumRedrawing='1';
  source.dispatchEvent(new Event('input',{bubbles:true}));
  delete source.dataset.dmPremiumRedrawing;
 }
 return true;
}

function schedule(delay=40){
 clearTimeout(timer);
 timer=setTimeout(()=>{
  arrange();
  setTimeout(arrange,100);
  setTimeout(arrange,350);
  setTimeout(arrange,800);
 },delay);
}

window.addEventListener('load',()=>schedule());
window.addEventListener('hashchange',()=>schedule());
window.addEventListener('resize',()=>schedule(80));
document.addEventListener('click',e=>{
 if(e.target.closest('[data-page="socialstudio"],a[href="#socialstudio"],#socialGenerateVerse,#socialGeneratePrayer,#socialGenerateComplete,#dmSocialFreshSelected,#dmSocialDesigner,#dmSocialV2Panel,#dmSocialBrandingSettings'))schedule();
});
document.addEventListener('input',e=>{
 if(['socialVerse','socialReference','socialPrayer','socialType'].includes(e.target?.id))schedule(20);
});
document.addEventListener('change',e=>{
 if(['socialType','socialTopic'].includes(e.target?.id))schedule(20);
});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule(60)}).observe(document.documentElement,{childList:true,subtree:true});
})();
