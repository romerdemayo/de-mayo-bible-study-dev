/* De Mayo Bible Studies - Build 1.23.1 Resource Hub */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const OPEN_KEY='dm_libraryOpenResource';
const $=s=>document.querySelector(s);
const OUTPUTS=[['social','📱','Social Posts'],['reel','🎬','Reels'],['presentation','📊','Presentations'],['handout','📄','Handouts'],['prayer','🙏','Prayers'],['kids','🧒','Kids Lessons'],['smallgroup','👥','Small Groups']];
function ensureOutputStudio(){if(window.DM_RESOURCE_OUTPUTS||document.querySelector('script[data-dm-output-studio]'))return;const s=document.createElement('script');s.src='resource-output-studio.js?v=1231';s.defer=true;s.dataset.dmOutputStudio='1';document.head.appendChild(s)}
function read(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function clean(v=''){return String(v).trim().toLowerCase()}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function outputCounts(resource){const list=Array.isArray(resource.outputs)?resource.outputs:[];return Object.fromEntries(OUTPUTS.map(([key])=>[key,list.filter(x=>x.type===key).length]))}
function matchResource(card){
 const title=clean(card.querySelector('h3')?.textContent);if(!title)return null;
 const rows=read();let index=rows.findIndex(x=>clean(x.title)===title);
 if(index<0)index=rows.findIndex(x=>title.includes(clean(x.title))||clean(x.title).includes(title));
 return index>=0?{resource:rows[index],index}:null;
}
function openResource(resource,index){localStorage.setItem(OPEN_KEY,JSON.stringify({id:resource.id||null,index,title:resource.title||'',updatedAt:resource.updatedAt||0}));location.hash='aicreator'}
function openOutputChooser(resource,index){
 ensureOutputStudio();let wrap=$('#dmResourceOutputModal');if(wrap)wrap.remove();
 wrap=document.createElement('div');wrap.id='dmResourceOutputModal';wrap.className='dm-capture-modal';
 const counts=outputCounts(resource);
 wrap.innerHTML=`<div class="dm-capture-dialog"><h2>✨ Create Output</h2><p><b>${esc(resource.title||'Saved resource')}</b></p><div class="dm-resource-output-list">${OUTPUTS.map(([key,icon,label])=>`<button class="ghost" data-output-type="${key}"><span>${icon}</span><b>${label}</b><small>${counts[key]||0} created</small></button>`).join('')}</div><p class="dm-ai-note">Social posts, reel scripts, and prayers are available now. Presentation, handout, kids lesson, and small-group outputs follow in the next builds.</p><button class="ghost wide" id="dmResourceOutputClose">Close</button></div>`;
 document.body.appendChild(wrap);
 wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};$('#dmResourceOutputClose').onclick=()=>wrap.remove();
 wrap.querySelectorAll('[data-output-type]').forEach(b=>b.onclick=()=>{
  const type=b.dataset.outputType;
  if(window.DM_RESOURCE_OUTPUTS?.open){window.DM_RESOURCE_OUTPUTS.open(resource,index,type);return}
  window.toast?.('Output Studio is loading. Please tap again in a moment.');
 });
}
function cardHub(card,resource,index){
 card.classList.add('dm-resource-hub-card');
 const category=card.querySelector('small');if(category)category.textContent=`My Resources · ${resource.type||'resource'}`;
 let hub=card.querySelector('.dm-resource-hub');if(hub)hub.remove();hub=document.createElement('section');hub.className='dm-resource-hub';
 const counts=outputCounts(resource);
 hub.innerHTML=`<div class="dm-resource-meta"><span>${esc(resource.reference||'No Scripture selected')}</span><span>${esc(resource.audience||'Personal')}</span><span>${esc(resource.language||'English')}</span></div><h4>Outputs</h4><div class="dm-resource-output-counts">${OUTPUTS.map(([key,icon,label])=>`<span title="${label}">${icon} <b>${counts[key]||0}</b></span>`).join('')}</div><div class="dm-resource-hub-actions"><button class="ghost" data-resource-open>📖 Open Resource</button><button class="primary" data-resource-output>✨ Create Output</button></div>`;
 card.appendChild(hub);
 const old=card.querySelector('[data-open-cat]');if(old)old.parentElement?.remove();
 hub.querySelector('[data-resource-open]').onclick=e=>{e.preventDefault();openResource(resource,index)};
 hub.querySelector('[data-resource-output]').onclick=e=>{e.preventDefault();openOutputChooser(resource,index)};
}
function addStyles(){if($('#dmResourceHubStyles'))return;const style=document.createElement('style');style.id='dmResourceHubStyles';style.textContent=`
#dmMinistryPacksSection,.dm-pack-library-section{display:none!important}.dm-resource-hub{border-top:1px solid var(--border,#d7dedb);margin-top:14px;padding-top:12px}.dm-resource-meta{display:flex;gap:8px;flex-wrap:wrap}.dm-resource-meta span{font-size:.78rem;padding:4px 8px;border-radius:999px;background:var(--surface-2,#eef3f1)}.dm-resource-hub h4{margin:12px 0 8px}.dm-resource-output-counts{display:flex;gap:8px;flex-wrap:wrap}.dm-resource-output-counts span{min-width:48px;padding:6px 8px;border:1px solid var(--border,#d7dedb);border-radius:10px;text-align:center}.dm-resource-hub-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.dm-resource-output-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:16px 0}.dm-resource-output-list button{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;text-align:left;align-items:center}.dm-resource-output-list button span{grid-row:1/3;font-size:1.4rem}.dm-resource-output-list small{opacity:.7}@media(max-width:600px){.dm-resource-output-list{grid-template-columns:1fr}.dm-resource-hub-actions>*{flex:1 1 100%}}`;
 document.head.appendChild(style)}
function enhance(){
 if(location.hash!=='#mylibrary')return false;ensureOutputStudio();addStyles();$('#dmMinistryPacksSection')?.remove();
 document.querySelectorAll('.dm-library-recent-title h3').forEach(h=>{if(/recently added/i.test(h.textContent))h.textContent='My Resources'});
 const cards=[...document.querySelectorAll('.dm-library-card')];if(!cards.length)return false;
 cards.forEach(card=>{const category=clean(card.querySelector('small')?.textContent);if(!category.includes('resource'))return;const found=matchResource(card);if(found)cardHub(card,found.resource,found.index)});return true
}
function openPending(){
 if(location.hash!=='#aicreator')return false;let pending=null;try{pending=JSON.parse(localStorage.getItem(OPEN_KEY)||'null')}catch{}
 if(!pending)return false;const rows=read();let index=Number.isInteger(pending.index)?pending.index:-1;
 if(index<0||!rows[index]||(pending.id&&rows[index].id!==pending.id))index=rows.findIndex(x=>(pending.id&&x.id===pending.id)||clean(x.title)===clean(pending.title));
 if(index<0)return false;const saved=document.querySelector(`#dmAiSaved [data-load="${index}"]`);if(!saved)return false;localStorage.removeItem(OPEN_KEY);saved.click();return true
}
function retry(fn,attempt=0){if(fn())return;if(attempt<25)setTimeout(()=>retry(fn,attempt+1),100)}
ensureOutputStudio();window.addEventListener('load',()=>{retry(enhance);retry(openPending)});window.addEventListener('hashchange',()=>{retry(enhance);retry(openPending)});window.addEventListener('dm-resource-output-saved',()=>setTimeout(()=>retry(enhance),60));document.addEventListener('click',e=>{if(e.target.closest('#dmMyLibraryNav,#dmAiLibrary'))setTimeout(()=>retry(enhance),80)});
})();