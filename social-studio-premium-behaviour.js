/* De Mayo Bible Studies — Premium Social Studio behaviour bridge */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let timer=0;

function textOf(el){return String(el?.textContent||el?.value||'').replace(/\s+/g,' ').trim().toLowerCase()}
function legacyButton(pattern){return $$('button,input[type="button"],input[type="submit"]').find(el=>!el.closest('#dmSocialDesigner')&&pattern.test(textOf(el)))}
function contentType(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function triggerLegacy(kind){
 const btn=kind==='prayer'?legacyButton(/generate prayer|fresh prayer/):kind==='surprise'?legacyButton(/surprise me|fresh idea/):legacyButton(/generate bible verse|fresh bible verse/);
 if(btn){btn.click();setTimeout(syncPremium,120);setTimeout(syncPremium,320);return true}
 return false;
}
function ensureControls(){
 const designer=$('#dmSocialDesigner');if(!designer||$('#dmPremiumGenerateControls'))return;
 const sidebar=$('.dm-premium-sidebar',designer);if(!sidebar)return;
 const box=document.createElement('section');
 box.id='dmPremiumGenerateControls';
 box.innerHTML=`<h3>GENERATE CONTENT</h3><div class="dm-premium-generate-grid"><button class="primary" id="dmPremiumVerse">📖 Generate Bible verse</button><button class="primary" id="dmPremiumPrayer">🙏 Generate prayer</button><button class="ghost" id="dmPremiumSurprise">✨ Surprise me</button></div>`;
 sidebar.insertBefore(box,sidebar.firstElementChild);
 $('#dmPremiumVerse').onclick=e=>{e.preventDefault();triggerLegacy('verse')};
 $('#dmPremiumPrayer').onclick=e=>{e.preventDefault();triggerLegacy('prayer')};
 $('#dmPremiumSurprise').onclick=e=>{e.preventDefault();triggerLegacy('surprise')};
 if(!$('#dmPremiumBehaviourStyles')){
  const s=document.createElement('style');s.id='dmPremiumBehaviourStyles';s.textContent=`.dm-premium-generate-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:1/-1}.dm-premium-generate-grid button{min-height:46px;white-space:normal}#dmSocialDesigner.dm-prayer-mode label:has(#dmDesignerPrayer){display:none!important}#dmSocialDesigner.dm-prayer-mode .dm-designer-editor{grid-template-columns:1fr minmax(180px,.7fr)}@media(max-width:520px){.dm-premium-generate-grid{grid-template-columns:1fr}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:auto}}`;document.head.appendChild(s);
 }
}
function syncPremium(){
 const designer=$('#dmSocialDesigner');if(!designer)return;
 const prayer=contentType()==='prayer';designer.classList.toggle('dm-prayer-mode',prayer);
 const prayerEditor=$('#dmDesignerPrayer');if(prayerEditor){prayerEditor.disabled=prayer;const label=prayerEditor.closest('label');if(label)label.style.display=prayer?'none':''}
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(location.hash!=='#socialstudio')return;ensureControls();syncPremium()},80)}
window.addEventListener('load',()=>{schedule();setTimeout(schedule,250)});
window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,250)});
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],#dmPremiumGenerateControls,#dmSocialDesigner'))schedule()});
document.addEventListener('change',e=>{if(e.target.id==='socialType')schedule()});
})();
