/* De Mayo Bible Studies - Build 1.25.1c Premium Social Studio cleanup */
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
function norm(text=''){
 return String(text)
  .replace(/[\s\u00a0]+/g,' ')
  .replace(/[✨⬇📤📋✅✏️🎨🎲🔄♻️🖼️📱]/g,'')
  .trim().toLowerCase();
}
function hideButton(btn){
 if(!btn||btn.dataset.dmKeepSocialAction==='1')return;
 btn.hidden=true;
 btn.style.setProperty('display','none','important');
 btn.dataset.dmDuplicateSocialButton='1';
}
function actionOf(btn){
 const id=(btn.id||'').toLowerCase();
 const text=norm(btn.textContent);
 const insideDesigner=!!btn.closest('#dmSocialDesigner');
 if(id==='dmdesignersave'||/^(save|download|export).*(png|image|graphic)$/.test(text)||/^(save png|download image|save image)$/.test(text))return 'save-image';
 if(id==='dmdesignershare'||/^(share|send).*(image|graphic)$/.test(text)||/^(share image|share graphic)$/.test(text))return 'share-image';
 if(id==='dmdesignersurprise'&&insideDesigner)return 'designer-random-theme';
 if(/copy.*caption/.test(text))return 'copy-caption';
 if(/copy.*hashtag/.test(text))return 'copy-hashtags';
 if(/copy.*(post|text|content)/.test(text))return 'copy-post';
 if(/facebook/.test(text)&&/(share|prepare|post)/.test(text))return 'facebook-share';
 if(/mark.*posted|already posted|shared already/.test(text))return 'mark-posted';
 if(/generate.*prayer|fresh prayer|new prayer/.test(text))return 'generate-prayer';
 if(/generate.*(bible verse|scripture)|fresh bible verse|new bible verse/.test(text))return 'generate-verse';
 if(/generate.*fresh idea|fresh idea|surprise me/.test(text)&&!insideDesigner)return 'generate-surprise-content';
 if(/generate image|create image|make graphic|create graphic/.test(text))return 'render-graphic';
 return '';
}
function priority(btn,action){
 const insideDesigner=!!btn.closest('#dmSocialDesigner');
 const id=(btn.id||'').toLowerCase();
 if(['save-image','share-image','designer-random-theme','render-graphic'].includes(action)&&insideDesigner)return 100;
 if(id==='dmsocialfreshselected')return 95;
 if(id==='dmsocialmarkposted')return 95;
 if(id.includes('copycaption')||id.includes('copyhashtags'))return 90;
 if(btn.closest('#dmSocialV2Panel'))return 80;
 if(btn.closest('.social-controls'))return 70;
 return 10;
}
function dedupeButtons(view){
 const groups=new Map();
 const buttons=[...view.querySelectorAll('button,a[role="button"]')].filter(btn=>{
  if(btn.closest('[hidden],[data-dm-legacy-social-hidden="1"]'))return false;
  if(btn.dataset.dmDuplicateSocialButton==='1')return false;
  return !btn.hidden;
 });
 buttons.forEach(btn=>{
  const action=actionOf(btn);if(!action)return;
  if(!groups.has(action))groups.set(action,[]);
  groups.get(action).push(btn);
 });
 groups.forEach((items,action)=>{
  if(items.length<2)return;
  items.sort((a,b)=>priority(b,action)-priority(a,action));
  const keep=items[0];keep.dataset.dmKeepSocialAction='1';
  items.slice(1).forEach(hideButton);
 });
 // Remove empty duplicate action rows left behind by hidden buttons.
 view.querySelectorAll('.social-auto-actions,.social-actions,.resource-buttons,.creator-buttons,.dm-designer-actions').forEach(row=>{
  if(row.closest('#dmSocialDesigner'))return;
  const visible=[...row.querySelectorAll('button,a[role="button"]')].filter(b=>!b.hidden&&b.style.display!=='none');
  if(!visible.length&&row.children.length)row.style.setProperty('display','none','important');
 });
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
 dedupeButtons(view);
 return true;
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(clean,220)}
window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],a[href="#socialstudio"]'))schedule()});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule()}).observe(document.documentElement,{childList:true,subtree:true});
})();
