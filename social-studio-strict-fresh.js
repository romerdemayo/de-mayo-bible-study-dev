/* De Mayo Bible Studies — strict fresh generation guard */
(function(){
'use strict';
const VERSE_HISTORY='dm_social_v22_verse_history';
const PRAYER_HISTORY='dm_social_v22_prayer_history';
const POSTED_HISTORY='dm_social_v22_posted_history';
const $=s=>document.querySelector(s);
let bypass=false;
function read(k){try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function clean(v=''){return String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function toast(m){window.toast?.(m)}
function type(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function snapshot(t=type()){
 return t==='prayer'
  ? {type:t,body:String($('#socialPrayer')?.value||'').trim(),reference:'Prayer'}
  : {type:t,body:String($('#socialVerse')?.value||'').trim(),reference:String($('#socialReference')?.value||'').trim()};
}
function key(x){return x.type==='prayer'?clean(x.body):clean(x.reference+'|'+x.body)}
function historySet(t){
 const generated=read(t==='prayer'?PRAYER_HISTORY:VERSE_HISTORY);
 const posted=read(POSTED_HISTORY).filter(x=>x.protected!==false&&x.type===t);
 return new Set([...generated,...posted].map(x=>key({type:t,body:x.body||'',reference:x.reference||''})).filter(Boolean));
}
function directId(id){return ['socialGenerateVerse','socialGeneratePrayer','socialGenerateComplete','dmSocialFreshSelected'].includes(id)}
function restore(before){
 if(before.type==='prayer'){
  const el=$('#socialPrayer');if(el){el.value=before.body;el.dispatchEvent(new Event('input',{bubbles:true}))}
 }else{
  const v=$('#socialVerse'),r=$('#socialReference');
  if(v){v.value=before.body;v.dispatchEvent(new Event('input',{bubbles:true}))}
  if(r){r.value=before.reference;r.dispatchEvent(new Event('input',{bubbles:true}))}
 }
}
function generateFresh(button){
 const requested=button.id==='socialGenerateVerse'?'verse':button.id==='socialGeneratePrayer'?'prayer':button.id==='dmSocialFreshSelected'?type():null;
 const target=requested||type();
 const before=snapshot(target);
 const seen=historySet(target);
 if(key(before))seen.add(key(before));
 bypass=true;
 try{button.click()}finally{bypass=false}
 const now=snapshot(target),k=key(now);
 if(k&&!seen.has(k))return;
 restore(before);
 toast(target==='prayer'
  ? 'Offline prayer pool has no genuinely new prayer available right now. No previous prayer was recycled.'
  : 'Offline Bible verse pool is exhausted. No previous verse was recycled.');
}
window.addEventListener('click',e=>{
 if(bypass)return;
 const b=e.target.closest('button');if(!b||!directId(b.id))return;
 e.preventDefault();e.stopImmediatePropagation();
 generateFresh(b);
},true);
})();
