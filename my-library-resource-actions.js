/* De Mayo Bible Studies - Build 1.22.3a My Library exact resource actions */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const OPEN_KEY='dm_libraryOpenResource';
const $=s=>document.querySelector(s);
function readResources(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function clean(v=''){return String(v).trim().toLowerCase()}
function matchResource(card){
 const title=clean(card.querySelector('h3')?.textContent);
 if(!title)return null;
 const rows=readResources();
 let index=rows.findIndex(x=>clean(x.title)===title);
 if(index<0)index=rows.findIndex(x=>title.includes(clean(x.title))||clean(x.title).includes(title));
 return index>=0?{resource:rows[index],index}:null;
}
function openResource(resource,index){
 localStorage.setItem(OPEN_KEY,JSON.stringify({id:resource.id||null,index,title:resource.title||'',updatedAt:resource.updatedAt||0}));
 location.hash='aicreator';
}
function createPack(resource,index){
 if(window.DM_MINISTRY_PACKS?.createFromResource){window.DM_MINISTRY_PACKS.createFromResource(resource,index);return}
 window.toast?.('Ministry Pack engine is still loading. Please try again.');
}
function enhance(){
 if(location.hash!=='#mylibrary')return false;
 const cards=[...document.querySelectorAll('.dm-library-card')];
 if(!cards.length)return false;
 cards.forEach(card=>{
  const category=clean(card.querySelector('small')?.textContent);
  if(category!=='resources')return;
  const found=matchResource(card);if(!found)return;
  const actions=card.querySelector('div:last-child')||card;
  let open=actions.querySelector('[data-dm-open-exact-resource]');
  if(!open){
   const old=actions.querySelector('[data-open-cat]');
   open=old||document.createElement('button');
   open.className='ghost';open.textContent='Open resource';open.dataset.dmOpenExactResource='1';
   if(!old)actions.appendChild(open);
  }
  open.onclick=e=>{e.preventDefault();e.stopPropagation();openResource(found.resource,found.index)};
  if(!actions.querySelector('[data-dm-library-pack]')){
   const pack=document.createElement('button');pack.className='ghost';pack.textContent='🎁 Create Ministry Pack';pack.dataset.dmLibraryPack='1';
   pack.onclick=e=>{e.preventDefault();e.stopPropagation();createPack(found.resource,found.index)};
   actions.appendChild(pack);
  }
 });
 return true;
}
function openPending(){
 if(location.hash!=='#aicreator')return;
 let pending=null;try{pending=JSON.parse(localStorage.getItem(OPEN_KEY)||'null')}catch{}
 if(!pending)return;
 const rows=readResources();let index=Number.isInteger(pending.index)?pending.index:-1;
 if(index<0||!rows[index]||(pending.id&&rows[index].id!==pending.id))index=rows.findIndex(x=>(pending.id&&x.id===pending.id)||clean(x.title)===clean(pending.title));
 if(index<0)return;
 const saved=document.querySelector(`#dmAiSaved [data-load="${index}"]`);
 if(saved){localStorage.removeItem(OPEN_KEY);saved.click();return true}
 return false;
}
function retry(fn,attempt=0){if(fn())return;if(attempt<20)setTimeout(()=>retry(fn,attempt+1),100)}
window.addEventListener('load',()=>{retry(enhance);retry(openPending)});
window.addEventListener('hashchange',()=>{retry(enhance);retry(openPending)});
document.addEventListener('click',e=>{if(e.target.closest('#dmMyLibraryNav,#dmAiLibrary'))setTimeout(()=>retry(enhance),80)});
})();
