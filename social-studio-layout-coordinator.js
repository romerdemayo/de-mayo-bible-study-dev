/* De Mayo Bible Studies — premium Social Studio generator visibility hotfix */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let timer=0;
function text(el){return String(el?.textContent||el?.value||'').replace(/\s+/g,' ').trim().toLowerCase()}
function findLegacy(kind){
 const re=kind==='prayer'?/generate prayer|fresh prayer/:kind==='surprise'?/surprise me|fresh idea/:/generate bible verse|fresh bible verse/;
 return $$('button,input[type="button"],input[type="submit"]').find(el=>!el.closest('#dmPremiumGeneratorHotfix')&&re.test(text(el)));
}
function run(kind){
 const btn=findLegacy(kind);
 if(btn){
  btn.click();
  setTimeout(()=>document.querySelector('#dmSocialDesigner')?.scrollIntoView({behavior:'smooth',block:'start'}),120);
 }else{
  window.toast?.('Generator is still loading. Please try again.');
 }
}
function mount(){
 if(location.hash!=='#socialstudio')return;
 const designer=$('#dmSocialDesigner');
 if(!designer)return;
 let panel=$('#dmPremiumGeneratorHotfix');
 if(!panel){
  panel=document.createElement('section');
  panel.id='dmPremiumGeneratorHotfix';
  panel.innerHTML='<h3>CREATE FRESH CONTENT</h3><div><button class="primary" id="dmHotfixVerse">📖 Generate Bible verse</button><button class="primary" id="dmHotfixPrayer">🙏 Generate prayer</button><button class="ghost" id="dmHotfixSurprise">✨ Surprise me</button></div>';
  const head=$('.dm-premium-head',designer);
  if(head)head.insertAdjacentElement('afterend',panel);else designer.prepend(panel);
  $('#dmHotfixVerse').onclick=e=>{e.preventDefault();run('verse')};
  $('#dmHotfixPrayer').onclick=e=>{e.preventDefault();run('prayer')};
  $('#dmHotfixSurprise').onclick=e=>{e.preventDefault();run('surprise')};
 }
 if(!$('#dmPremiumGeneratorHotfixStyles')){
  const s=document.createElement('style');
  s.id='dmPremiumGeneratorHotfixStyles';
  s.textContent=`
  #dmPremiumGeneratorHotfix{display:block!important;visibility:visible!important;margin:0 auto 18px;padding:14px;border:1px solid var(--border,#d8dedb);border-radius:16px;background:var(--surface,#fff);max-width:900px}
  #dmPremiumGeneratorHotfix h3{text-align:center;margin:0 0 10px;color:#274c3c}
  #dmPremiumGeneratorHotfix>div{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  #dmPremiumGeneratorHotfix #dmHotfixSurprise{grid-column:1/-1}
  #dmPremiumGeneratorHotfix button{display:block!important;visibility:visible!important;min-height:48px;white-space:normal}
  @media(max-width:600px){#dmPremiumGeneratorHotfix>div{grid-template-columns:1fr}#dmPremiumGeneratorHotfix #dmHotfixSurprise{grid-column:auto}}
  `;
  document.head.appendChild(s);
 }
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{mount();setTimeout(mount,150);setTimeout(mount,500)},40)}
window.addEventListener('load',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],a[href="#socialstudio"]'))schedule()});
document.addEventListener('dm-social-studio-ready',schedule);
})();
