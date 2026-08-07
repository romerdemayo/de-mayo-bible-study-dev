/* De Mayo Bible Studies — Premium Social Studio behaviour bridge */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let timer=0;

function textOf(el){return String(el?.textContent||el?.value||'').replace(/\s+/g,' ').trim().toLowerCase()}
function legacyButton(pattern){
 return $$('button,input[type="button"],input[type="submit"]').find(el=>!el.closest('#dmSocialDesigner')&&pattern.test(textOf(el)));
}
function contentType(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function dispatchField(id){const el=$('#'+id);if(el)el.dispatchEvent(new Event('input',{bubbles:true}))}
function triggerLegacy(kind){
 const btn=kind==='prayer'
  ?legacyButton(/generate prayer|fresh prayer/)
  :kind==='surprise'
   ?legacyButton(/surprise me|fresh idea/)
   :legacyButton(/generate bible verse|fresh bible verse/);
 if(btn){btn.click();setTimeout(syncPremium,80);setTimeout(syncPremium,260);return true}
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
  const s=document.createElement('style');s.id='dmPremiumBehaviourStyles';s.textContent=`
  .dm-premium-generate-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:1/-1}.dm-premium-generate-grid button{min-height:46px;white-space:normal}
  #dmSocialDesigner.dm-prayer-mode label:has(#dmDesignerPrayer){display:none!important}
  #dmSocialDesigner.dm-prayer-mode .dm-designer-editor{grid-template-columns:1fr minmax(180px,.7fr)}
  @media(max-width:520px){.dm-premium-generate-grid{grid-template-columns:1fr}.dm-premium-generate-grid #dmPremiumSurprise{grid-column:auto}}
  `;document.head.appendChild(s);
 }
}
function prayerCanvasFinish(){
 const c=$('#dmDesignerCanvas');if(!c||contentType()!=='prayer')return;
 const ctx=c.getContext('2d'),w=c.width,h=c.height;if(!ctx||!w||!h)return;
 const y=Math.round(h*.59),boxH=Math.round(h*.18),x=Math.round(w*.075),boxW=Math.round(w*.85);
 const sample=ctx.getImageData(Math.max(0,Math.round(w*.03)),Math.max(0,Math.round(h*.5)),1,1).data;
 ctx.fillStyle=`rgba(${sample[0]},${sample[1]},${sample[2]},.90)`;ctx.fillRect(0,y-18,w,boxH+50);
 ctx.fillStyle='rgba(255,255,255,.60)';ctx.beginPath();ctx.roundRect(x,y,boxW,boxH,24);ctx.fill();
 ctx.textAlign='left';ctx.fillStyle='rgba(60,48,38,.78)';ctx.font=`700 ${Math.max(20,Math.round(w*.02))}px Arial`;ctx.fillText('♡  PRAYER FOCUS',x+30,y+48);
 const focus=$('#dmDesignerReflection')?.value||'Bring this need honestly before God and trust Him with the outcome.';
 ctx.font=`400 ${Math.max(20,Math.round(w*.019))}px Georgia,serif`;ctx.fillStyle='rgba(45,38,32,.92)';
 const words=focus.split(/\s+/);let line='',lines=[],max=boxW-60;for(const word of words){const t=line?line+' '+word:word;if(ctx.measureText(t).width>max&&line){lines.push(line);line=word;if(lines.length>=4)break}else line=t}if(line&&lines.length<4)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x+30,y+90+i*Math.max(28,Math.round(w*.028))));
}
function syncPremium(){
 const designer=$('#dmSocialDesigner');if(!designer)return;
 const prayer=contentType()==='prayer';designer.classList.toggle('dm-prayer-mode',prayer);
 const prayerEditor=$('#dmDesignerPrayer');if(prayerEditor){prayerEditor.disabled=prayer;prayerEditor.closest('label')?.toggleAttribute('hidden',prayer)}
 dispatchField(prayer?'socialPrayer':'socialVerse');dispatchField('socialReference');
 setTimeout(prayerCanvasFinish,40);
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(location.hash!=='#socialstudio')return;ensureControls();syncPremium()},80)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"],#dmPremiumGenerateControls,#dmSocialDesigner'))schedule()});
document.addEventListener('input',e=>{if(['socialType','socialVerse','socialPrayer','socialReference','dmDesignerReflection'].includes(e.target.id))schedule()});
document.addEventListener('change',e=>{if(e.target.id==='socialType')schedule()});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule()}).observe(document.documentElement,{childList:true,subtree:true});
})();
