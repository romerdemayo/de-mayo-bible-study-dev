/* De Mayo Bible Studies — Premium Social Studio behaviour bridge */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
let timer=0;
function contentType(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function triggerStrict(kind){
 const id=kind==='prayer'?'socialGeneratePrayer':kind==='surprise'?'socialGenerateComplete':'socialGenerateVerse';
 const btn=document.getElementById(id);
 if(!btn){window.toast?.('Fresh-content engine is still loading. Please try again.');return false}
 btn.click();setTimeout(syncPremium,120);setTimeout(syncPremium,320);return true;
}
function ensureControls(){
 const designer=$('#dmSocialDesigner');if(!designer||$('#dmPremiumGenerateControls'))return;
 const sidebar=$('.dm-premium-sidebar',designer);if(!sidebar)return;
 const box=document.createElement('section');box.id='dmPremiumGenerateControls';
 box.innerHTML=`<h3>GENERATE CONTENT</h3><div class="dm-premium-generate-grid"><button class="primary" id="dmPremiumVerse">📖 Generate Bible verse</button><button class="primary" id="dmPremiumPrayer">🙏 Generate prayer</button><button class="ghost" id="dmPremiumSurprise">✨ Surprise me</button></div>`;
 sidebar.insertBefore(box,sidebar.firstElementChild);
 $('#dmPremiumVerse').onclick=e=>{e.preventDefault();triggerStrict('verse')};
 $('#dmPremiumPrayer').onclick=e=>{e.preventDefault();triggerStrict('prayer')};
 $('#dmPremiumSurprise').onclick=e=>{e.preventDefault();triggerStrict('surprise')};
 if(!$('#dmPremiumBehaviourStyles')){const s=document.createElement('style');s.id='dmPremiumBehaviourStyles';s.textContent=`.dm-premium-generate-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:1/-1}.dm-premium-generate-grid button{min-height:46px;white-space:normal}#dmSocialDesigner.dm-prayer-mode label:has(#dmDesignerPrayer){display:none!important}#dmSocialDesigner.dm-prayer-mode .dm-designer-editor{grid-template-columns:1fr minmax(180px,.7fr)}@media(max-width:520px){.dm-premium-generate-grid{grid-template-columns:1fr}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:auto}}`;document.head.appendChild(s)}
}
function syncPremium(){const designer=$('#dmSocialDesigner');if(!designer)return;const prayer=contentType()==='prayer';designer.classList.toggle('dm-prayer-mode',prayer);const prayerEditor=$('#dmDesignerPrayer');if(prayerEditor){prayerEditor.disabled=prayer;const label=prayerEditor.closest('label');if(label)label.style.display=prayer?'none':''}}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(location.hash!=='#socialstudio')return;ensureControls();syncPremium()},80)}
window.addEventListener('load',()=>{schedule();setTimeout(schedule,250)});window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,250)});document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],#dmPremiumGenerateControls,#dmSocialDesigner'))schedule()});document.addEventListener('change',e=>{if(e.target.id==='socialType')schedule()});
})();