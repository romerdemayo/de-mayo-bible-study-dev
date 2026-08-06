/* De Mayo Bible Studies - Build 1.23.1d Premium Social Studio primary interface */
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
 const engine=$('#dmSocialV2Panel',view);
 const branding=$('#dmSocialBrandingSettings',view);
 const drafts=$('.social-drafts',view);

 view.classList.add('dm-premium-social-active');

 /* The premium designer is now the main Social Studio interface. */
 showPanel(designer);
 if(designer.parentElement!==view||designer!==view.firstElementChild){
  view.insertBefore(designer,view.firstElementChild);
 }

 /* Keep the useful fresh-content and branding tools underneath it. */
 let anchor=designer;
 if(engine){showPanel(engine);anchor=placeAfter(anchor,engine)}
 if(branding){showPanel(branding);anchor=placeAfter(anchor,branding)}
 if(drafts){showPanel(drafts);anchor=placeAfter(anchor,drafts)}

 /* Remove the duplicated legacy creator, dropdowns, caption form and preview. */
 hideLegacy(controls);
 hideLegacy(preview);
 hideLegacy(layout);

 return true;
}

function schedule(){
 clearTimeout(timer);
 timer=setTimeout(()=>{
  arrange();
  setTimeout(arrange,120);
  setTimeout(arrange,500);
 },50);
}

window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
document.addEventListener('click',e=>{
 if(e.target.closest('[data-page="socialstudio"],a[href="#socialstudio"],#dmSocialDesigner,#dmSocialV2Panel,#dmSocialBrandingSettings'))schedule();
});
new MutationObserver(()=>{
 if(location.hash==='#socialstudio')schedule();
}).observe(document.documentElement,{childList:true,subtree:true});
})();
