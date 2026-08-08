/* De Mayo Bible Studies — Social Studio → Reel Studio handoff */
(function(){
'use strict';
const KEY='dm_social_to_reel_v1';
const $=(s,r=document)=>r.querySelector(s);
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
function copy(text){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>window.toast?.('Imported reel script copied.'));else window.toast?.('Copy is not available on this browser.')}
function applyClosestSettings(item){
 const type=item.type==='prayer'?'prayer':'verse';const typeBtn=$(`[data-dm-type="${type}"]`);if(typeBtn)typeBtn.click();
 const map={hope:'hope',faith:'faith',peace:'peace',guidance:'faith',strength:'strength',healing:'hope',gratitude:'gratitude'};const theme=map[item.spiritualTheme]||'hope';
 const select=$('#dmTheme');if(select&&[...select.options].some(o=>o.value===theme)){select.value=theme;select.dispatchEvent(new Event('change',{bubbles:true}))}
}
function script(item){return `${item.type==='prayer'?'Prayer':'Scripture'}\n\n${item.type==='verse'?(item.reference+'\n'+item.body):item.body}${item.reflection?'\n\nReflection\n'+item.reflection:''}${item.caption?'\n\nCaption\n'+item.caption:''}${item.hashtags?'\n\n'+item.hashtags:''}`}
function build(){
 if(location.hash!=='#reelcreator')return;const item=read(),view=$('#view');if(!item||!view||$('#dmSocialReelHandoff'))return;
 const panel=document.createElement('section');panel.id='dmSocialReelHandoff';panel.className='card';panel.innerHTML=`<div class="section-heading"><div><span class="eyebrow">FROM SOCIAL STUDIO</span><h3>🎬 Imported post ready for Reel Studio</h3></div></div><p><b>${item.type==='prayer'?'Prayer':esc(item.reference||'Bible verse')}</b></p><p class="dm-handoff-body">${esc(item.body||'')}</p>${item.reflection?`<p><b>Reflection:</b> ${esc(item.reflection)}</p>`:''}<div class="dm-handoff-actions"><button class="primary" id="dmHandoffApply">Use matching Reel settings</button><button class="ghost" id="dmHandoffCopy">Copy full reel script</button><button class="ghost" id="dmHandoffDismiss">Dismiss</button></div><p class="small-note">The exact Social Studio content is preserved here. Reel Studio currently applies the closest built-in reel theme while keeping this imported script available for narration and editing.</p>`;
 const style=document.createElement('style');style.textContent=`#dmSocialReelHandoff{margin-bottom:18px}.dm-handoff-body{white-space:pre-wrap;line-height:1.55}.dm-handoff-actions{display:flex;gap:8px;flex-wrap:wrap}.dm-handoff-actions button{min-height:44px}@media(max-width:600px){.dm-handoff-actions button{width:100%}}`;document.head.appendChild(style);
 view.insertBefore(panel,view.firstElementChild);$('#dmHandoffApply').onclick=()=>{applyClosestSettings(item);window.toast?.('Matching Reel settings applied. Imported script is ready above.')};$('#dmHandoffCopy').onclick=()=>copy(script(item));$('#dmHandoffDismiss').onclick=()=>{localStorage.removeItem(KEY);panel.remove()};
}
function boot(){setTimeout(build,120);setTimeout(build,400)}
window.addEventListener('load',boot);window.addEventListener('hashchange',boot);
})();
