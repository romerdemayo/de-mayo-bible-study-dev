/* De Mayo Bible Studies - Social Studio confirmed posting workflow */
(function(){
'use strict';
const POSTED_HISTORY='dm_social_v22_posted_history';
const PENDING_KEY='dm_social_share_pending';
const $=s=>document.querySelector(s);
function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function clean(v=''){return String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function notify(message){if(typeof window.toast==='function')window.toast(message)}
function currentItem(){
 const type=$('#socialType')?.value==='prayer'?'prayer':'verse';
 const body=type==='prayer'?$('#socialPrayer')?.value:$('#socialVerse')?.value;
 if(!String(body||'').trim())return null;
 const reference=type==='prayer'?'Prayer':($('#socialReference')?.value||'');
 const caption=$('#socialCaption')?.value||'';
 const hashtags=$('#socialHashtags')?.value||'';
 return {type,reference,body:String(body).trim(),caption,hashtags,platform:'Facebook',postedAt:Date.now(),signature:clean(`${type}|${reference}|${body}|${caption}`)};
}
function rememberPosted(item){
 const arr=read(POSTED_HISTORY).filter(x=>x.signature!==item.signature);
 arr.unshift(item);write(POSTED_HISTORY,arr.slice(0,500));
 notify('Saved to posted history. Social Studio will avoid repeating it.');
 refreshPostedSummary();
}
function hideManualButton(){
 let style=$('#dmShareWorkflowStyle');
 if(!style){style=document.createElement('style');style.id='dmShareWorkflowStyle';style.textContent='#dmSocialMarkPosted{display:none!important}';document.head.appendChild(style)}
}
function refreshPostedSummary(){
 hideManualButton();
 const panel=$('#dmSocialV2Panel');if(!panel)return;
 const count=read(POSTED_HISTORY).length;
 let summary=$('#dmConfirmedPostedSummary');
 if(!count){summary?.remove();return}
 if(!summary){summary=document.createElement('p');summary.id='dmConfirmedPostedSummary';summary.className='small-note';panel.appendChild(summary)}
 summary.innerHTML=`✅ <b>${count}</b> confirmed Facebook ${count===1?'post':'posts'} protected from repeats.`;
}
function armConfirmation(){
 const item=currentItem();if(!item)return;
 sessionStorage.setItem(PENDING_KEY,JSON.stringify({item,armedAt:Date.now(),asked:false}));
 setTimeout(()=>askIfReady(false),2600);
}
function askIfReady(fromReturn){
 let pending;try{pending=JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null')}catch{return}
 if(!pending||pending.asked||Date.now()-pending.armedAt<900)return;
 pending.asked=true;sessionStorage.setItem(PENDING_KEY,JSON.stringify(pending));
 const yes=window.confirm('Did you successfully post this to Facebook?\n\nPress OK only after the post has been published.');
 sessionStorage.removeItem(PENDING_KEY);
 if(yes)rememberPosted({...pending.item,postedAt:Date.now()});
 else if(fromReturn)notify('Not marked as posted. You can share it again later.');
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.id==='socialShare'||button.id==='socialFacebook')armConfirmation();
 if(button.id==='socialGenerateVerse'||button.id==='socialGeneratePrayer'||button.id==='socialGenerateComplete'||button.id==='dmSocialFreshSelected')setTimeout(refreshPostedSummary,90);
 if(button.closest('[data-page="socialstudio"]'))setTimeout(refreshPostedSummary,90);
},false);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(()=>askIfReady(true),500)});
window.addEventListener('focus',()=>setTimeout(()=>askIfReady(true),500));
window.addEventListener('hashchange',()=>setTimeout(refreshPostedSummary,80));
window.addEventListener('load',()=>setTimeout(refreshPostedSummary,80));
setTimeout(refreshPostedSummary,80);
})();