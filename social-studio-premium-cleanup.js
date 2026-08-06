/* De Mayo Bible Studies - Build 1.25.1a Premium Social Studio cleanup */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function hideBlock(el){
 if(!el||el.id==='dmSocialDesigner'||el.closest?.('#dmSocialDesigner'))return;
 const block=el.closest?.('article.card,section.card,.card,.social-preview,.social-preview-card,.social-post-preview,.post-preview-card')||el.parentElement;
 if(block&&block.id!=='dmSocialDesigner'&&!block.closest?.('#dmSocialDesigner')){
  block.hidden=true;
  block.style.setProperty('display','none','important');
  block.dataset.dmLegacySocialHidden='1';
 }
}
function clean(){
 if(location.hash!=='#socialstudio')return false;
 const view=$('#view'),designer=$('#dmSocialDesigner');
 if(!view||!designer)return false;
 view.classList.add('dm-premium-social-active');
 view.querySelectorAll('canvas').forEach(c=>{if(c.id!=='dmDesignerCanvas')hideBlock(c)});
 [...view.querySelectorAll('h1,h2,h3,h4,h5,strong,b,span,p')].forEach(el=>{
  if(el.closest('#dmSocialDesigner'))return;
  const text=(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
  if(text==='POST TEXT PREVIEW'||text==='SCRIPTURE'||text.startsWith('POST TEXT PREVIEW '))hideBlock(el);
 });
 view.querySelectorAll('.social-preview,.social-preview-card,.social-post-preview,.post-preview-card,[data-social-preview],[id*="socialPreview" i],[class*="social-preview" i]').forEach(hideBlock);
 return true;
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(clean,180)}
window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],a[href="#socialstudio"]'))schedule()});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule()}).observe(document.documentElement,{childList:true,subtree:true});
})();
