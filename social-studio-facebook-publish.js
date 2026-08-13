/* De Mayo Bible Studies — Social Studio secure Facebook Page publishing */
(function(){
'use strict';

const API='https://e-mayo-bible-ai.romer-demayo.workers.dev/';
const SESSION_KEY='dm_social_owner_publish_key_v1';
const POSTED_HISTORY='dm_social_v22_posted_history';
const PUBLISH_HISTORY='dm_social_publish_history_v1';
const STATUS_KEY='dm_social_publish_status_v1';
const $=(s,r=document)=>r.querySelector(s);

function clean(v=''){return String(v??'').trim()}
function toast(m){window.toast?.(m)}
function read(k,f=[]){try{const x=JSON.parse(localStorage.getItem(k)||JSON.stringify(f));return Array.isArray(x)?x:f}catch{return f}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function signature(v=''){return String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function type(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}

function normalizeHashtags(raw){
 const parts=clean(raw).split(/\s+/).filter(Boolean);
 return parts.map(x=>x.startsWith('#')?x:'#'+x.replace(/^#+/,'')).join(' ');
}

function current(){
 const t=type();
 const reference=t==='verse'?clean($('#dmPublishingReference')?.value||$('#socialReference')?.value):'Prayer';
 const body=clean($('#dmPublishingBody')?.value||(t==='prayer'?$('#socialPrayer')?.value:$('#socialVerse')?.value));
 const caption=clean($('#dmPublishingCaption')?.value||$('#socialCaption')?.value);
 const hashtags=normalizeHashtags($('#dmPublishingHashtags')?.value||$('#socialHashtags')?.value);
 return {t,reference,body,caption,hashtags};
}

function compose(item){
 const chunks=[];
 if(item.t==='verse'&&item.reference)chunks.push(item.reference);
 if(item.body)chunks.push(item.body);
 if(item.caption)chunks.push(item.caption);
 if(item.hashtags)chunks.push(item.hashtags);
 return chunks.join('\n\n').trim();
}

function getOwnerKey(){
 let key=sessionStorage.getItem(SESSION_KEY)||'';
 if(key)return key;
 key=window.prompt('Owner publishing key\n\nEnter your Social Studio publishing key. It is kept only for this browser session and is not saved in the app.')||'';
 key=key.trim();
 if(key)sessionStorage.setItem(SESSION_KEY,key);
 return key;
}

function rememberPosted(item,postId){
 const now=Date.now();
 const sig=signature(`${item.t}|${item.reference}|${item.body}|${item.caption}`);
 const posted=read(POSTED_HISTORY,[]);
 const same=x=>x.signature===sig||(x.type===item.t&&signature(x.body||'')===signature(item.body));
 const old=posted.find(same);
 const saved={
  ...old,
  type:item.t,
  reference:item.reference,
  body:item.body,
  caption:item.caption,
  hashtags:item.hashtags,
  platform:'Facebook',
  facebookPostId:postId,
  signature:sig,
  firstPostedAt:old?.firstPostedAt||old?.postedAt||now,
  postedAt:now,
  protected:true,
  repostCount:(old?.repostCount||0)+(old?1:0)
 };
 write(POSTED_HISTORY,[saved,...posted.filter(x=>!same(x))].slice(0,500));

 const history=read(PUBLISH_HISTORY,[]);
 const historyItem={
  id:'fb-'+now,
  type:item.t,
  reference:item.reference,
  body:item.body,
  caption:item.caption,
  hashtags:item.hashtags,
  platform:'facebook',
  status:'posted',
  facebookPostId:postId,
  updatedAt:new Date(now).toISOString()
 };
 write(PUBLISH_HISTORY,[historyItem,...history].slice(0,100));
 localStorage.setItem(STATUS_KEY,'posted');
 document.querySelector('[data-status="posted"]')?.classList.add('active');
 const label=$('#dmPublishingStatusLabel');if(label)label.textContent='Posted';
}

function setBusy(busy,text){
 const b=$('#dmPublishFacebookNow');
 if(!b)return;
 b.disabled=busy;
 b.textContent=busy?(text||'Publishing…'):'📘 Publish to Facebook';
}

async function publish(){
 const item=current();
 if(!item.body){toast('Generate or enter content first.');return}
 const message=compose(item);
 if(!message){toast('There is nothing to publish yet.');return}
 if(!confirm('Publish this post now to the De Mayo Bible Studies Facebook Page?'))return;
 const key=getOwnerKey();
 if(!key){toast('Publishing cancelled — owner key is required.');return}

 setBusy(true,'Publishing to Facebook…');
 try{
  const res=await fetch(API,{
   method:'POST',
   headers:{'Content-Type':'application/json','X-Social-Studio-Key':key},
   body:JSON.stringify({action:'facebook-post',message})
  });
  let data={};
  try{data=await res.json()}catch{}
  if(!res.ok||data?.ok===false){
   if(res.status===401){sessionStorage.removeItem(SESSION_KEY);throw new Error('Owner publishing key was not accepted. Please try again.')}
   throw new Error(data?.error||`Facebook publishing failed (${res.status}).`);
  }
  rememberPosted(item,data.postId||'');
  toast('✅ Published to De Mayo Bible Studies on Facebook.');
  const status=$('#dmFacebookPublishStatus');
  if(status)status.textContent='✅ Published successfully'+(data.postId?' · Post ID saved':'');
  window.dispatchEvent(new CustomEvent('dm-social-facebook-published',{detail:{...item,postId:data.postId||''}}));
 }catch(err){
  console.error('Social Studio Facebook publishing:',err);
  toast('⚠️ '+(err.message||'Facebook publishing failed.'));
  const status=$('#dmFacebookPublishStatus');if(status)status.textContent='⚠️ '+(err.message||'Publishing failed.');
 }finally{setBusy(false)}
}

function forgetKey(){
 sessionStorage.removeItem(SESSION_KEY);
 toast('Owner publishing key cleared for this browser session.');
 const status=$('#dmFacebookPublishStatus');if(status)status.textContent='🔐 Owner key cleared.';
}

function build(){
 if(location.hash!=='#socialstudio')return;
 const workflow=$('#dmPublishingWorkflow');
 if(!workflow||$('#dmFacebookPublisher'))return;
 const right=workflow.querySelector('.dm-publish-grid>section:nth-child(2)');
 if(!right)return;
 const box=document.createElement('div');
 box.id='dmFacebookPublisher';
 box.innerHTML=`<hr class="dm-fb-divider"><h4>Facebook Page publishing</h4><p class="small-note">Owner only. Your Facebook token stays encrypted in Cloudflare. The owner key is kept only for this browser session.</p><button type="button" id="dmPublishFacebookNow" class="primary">📘 Publish to Facebook</button><button type="button" id="dmForgetFacebookKey" class="ghost">🔐 Clear owner key</button><p id="dmFacebookPublishStatus" class="small-note" role="status">Ready for secure publishing.</p>`;
 right.appendChild(box);
 $('#dmPublishFacebookNow').onclick=publish;
 $('#dmForgetFacebookKey').onclick=forgetKey;
 if(!$('#dmFacebookPublisherStyle')){
  const s=document.createElement('style');s.id='dmFacebookPublisherStyle';s.textContent=`#dmFacebookPublisher{margin-top:14px}.dm-fb-divider{border:0;border-top:1px solid var(--border,#d8dedb);margin:15px 0}#dmFacebookPublisher button{width:100%;min-height:46px;margin-top:8px}#dmPublishFacebookNow:disabled{opacity:.65;cursor:wait}#dmFacebookPublishStatus{margin:.7rem 0 0}`;document.head.appendChild(s);
 }
}

function boot(){setTimeout(build,140)}
window.addEventListener('load',boot);
window.addEventListener('hashchange',boot);
document.addEventListener('dm-social-studio-ready',boot);
boot();
window.DM_SOCIAL_FACEBOOK={publish,forgetKey,endpoint:API};
})();
