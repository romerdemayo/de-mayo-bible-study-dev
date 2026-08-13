/* De Mayo Bible Studies — Build 1.26 Social Publishing Workflow */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const HISTORY_KEY='dm_social_publish_history_v1';
const STATUS_KEY='dm_social_publish_status_v1';
const REEL_HANDOFF='dm_social_to_reel_v1';
const PLATFORM_KEY='dm_social_platform_v1';
let bootTimer=0;

function toastMsg(m){if(typeof window.toast==='function')window.toast(m)}
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
function writeJSON(key,v){localStorage.setItem(key,JSON.stringify(v))}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
function type(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function getValue(id){return String($(id)?.value||'').trim()}
function fire(el,event='input'){if(el)el.dispatchEvent(new Event(event,{bubbles:true}))}
function setValue(id,value,event='input'){const el=$(id);if(!el)return;el.value=value;fire(el,event)}
function currentSnapshot(){
 const t=type();
 return {
  id:'post-'+Date.now(),
  type:t,
  reference:t==='verse'?getValue('#socialReference'):'Prayer',
  body:t==='prayer'?getValue('#socialPrayer'):getValue('#socialVerse'),
  reflection:getValue('#dmDesignerReflection'),
  caption:getValue('#socialCaption'),
  hashtags:getValue('#socialHashtags'),
  spiritualTheme:$('#dmPremiumSpiritualThemes button.active')?.dataset.spiritualTheme||getValue('#socialTopic')||'hope',
  designTheme:$('[data-designer-theme].active')?.dataset.designerTheme||'classic',
  platform:localStorage.getItem(PLATFORM_KEY)||'facebook',
  status:localStorage.getItem(STATUS_KEY)||'draft',
  updatedAt:new Date().toISOString()
 };
}
function saveHistory(status){
 const item={...currentSnapshot(),status,updatedAt:new Date().toISOString()};
 if(!item.body){toastMsg('Generate or enter content first.');return null}
 const items=readJSON(HISTORY_KEY,[]);
 const signature=(item.type+'|'+item.reference+'|'+item.body).toLowerCase();
 const next=[item,...items.filter(x=>(x.type+'|'+x.reference+'|'+x.body).toLowerCase()!==signature)].slice(0,100);
 writeJSON(HISTORY_KEY,next);localStorage.setItem(STATUS_KEY,status);renderStatus();renderHistory();return item;
}
function restore(item){
 setValue('#socialType',item.type,'change');
 if(item.type==='prayer')setValue('#socialPrayer',item.body);else{setValue('#socialVerse',item.body);setValue('#socialReference',item.reference)}
 if(item.caption)setValue('#socialCaption',item.caption);if(item.hashtags)setValue('#socialHashtags',item.hashtags);
 if(item.reflection)setValue('#dmDesignerReflection',item.reflection);
 const sp=$(`[data-spiritual-theme="${item.spiritualTheme}"]`);if(sp)sp.click();
 const dt=$(`[data-designer-theme="${item.designTheme}"]`);if(dt)dt.click();
 setPlatform(item.platform||'facebook');localStorage.setItem(STATUS_KEY,item.status||'draft');renderStatus();toastMsg('Saved social post restored.');
}
function setPlatform(platform){
 localStorage.setItem(PLATFORM_KEY,platform);
 const size=platform==='facebook-landscape'?'landscape':platform==='story'||platform==='reel'?'story':'square';
 const b=$(`[data-designer-size="${size}"]`);if(b)b.click();
 $$('#dmPublishingPlatforms button').forEach(x=>x.classList.toggle('active',x.dataset.platform===platform));
}
function renderStatus(){
 const box=$('#dmPublishingStatus');if(!box)return;const status=localStorage.getItem(STATUS_KEY)||'draft';
 box.querySelectorAll('[data-status]').forEach(b=>b.classList.toggle('active',b.dataset.status===status));
 const label=$('#dmPublishingStatusLabel');if(label)label.textContent=status==='posted'?'Posted':status==='ready'?'Ready to post':'Draft';
}
function renderHistory(){
 const box=$('#dmPublishingHistoryList');if(!box)return;const items=readJSON(HISTORY_KEY,[]).slice(0,8);
 box.innerHTML=items.length?items.map((x,i)=>`<button type="button" class="dm-publish-history-item" data-history-index="${i}"><b>${x.type==='prayer'?'🙏 Prayer':'📖 '+esc(x.reference||'Bible verse')}</b><small>${esc((x.body||'').replace(/\s+/g,' ').slice(0,72))}${(x.body||'').length>72?'…':''}</small><span>${esc(x.status||'draft')} · ${new Date(x.updatedAt).toLocaleDateString()}</span></button>`).join(''):'<p class="small-note">No publishing history yet.</p>';
 box.querySelectorAll('[data-history-index]').forEach(b=>b.onclick=()=>restore(items[Number(b.dataset.historyIndex)]));
}
function syncEditorFromSource(){
 const t=type();const body=$('#dmPublishingBody');const ref=$('#dmPublishingReference');const cap=$('#dmPublishingCaption');const tags=$('#dmPublishingHashtags');
 if(body&&document.activeElement!==body)body.value=t==='prayer'?getValue('#socialPrayer'):getValue('#socialVerse');
 if(ref){ref.closest('label').hidden=t==='prayer';if(document.activeElement!==ref)ref.value=getValue('#socialReference')}
 if(cap&&document.activeElement!==cap)cap.value=getValue('#socialCaption');if(tags&&document.activeElement!==tags)tags.value=getValue('#socialHashtags');
 const kind=$('#dmPublishingKind');if(kind)kind.textContent=t==='prayer'?'Prayer':'Bible verse';
}
function smartSurprise(){
 const themes=$$('#dmPremiumSpiritualThemes [data-spiritual-theme]');if(themes.length)themes[Math.floor(Math.random()*themes.length)].click();
 const design=$$('[data-designer-theme]');if(design.length)design[Math.floor(Math.random()*design.length)].click();
 const btn=$('#dmPremiumSurprise')||$('#socialGenerateComplete');if(btn)btn.click();
 setTimeout(()=>{syncEditorFromSource();localStorage.setItem(STATUS_KEY,'draft');renderStatus()},180);
}
function createReelHandoff(){
 const item=currentSnapshot();if(!item.body)return toastMsg('Create content first.');
 const payload={...item,source:'social-studio',createdAt:new Date().toISOString()};writeJSON(REEL_HANDOFF,payload);
 toastMsg('Social post prepared for Reel Studio.');
 location.hash='#reelcreator';
}
function build(){
 if(location.hash!=='#socialstudio')return;const designer=$('#dmSocialDesigner');if(!designer||$('#dmPublishingWorkflow'))return;
 const target=$('#dmPremiumSpiritualThemes')||$('.dm-premium-head',designer);if(!target)return;
 const panel=document.createElement('section');panel.id='dmPublishingWorkflow';panel.className='card dm-publishing-workflow';
 panel.innerHTML=`<div class="dm-publish-head"><div><span class="eyebrow">BUILD 1.26</span><h3>📣 Social Publishing Workflow</h3><p>Edit once, prepare for the right platform, then track what was posted.</p></div><span id="dmPublishingStatusLabel" class="dm-status-pill">Draft</span></div>
 <div class="dm-publish-grid">
  <section><h4>Content editor · <span id="dmPublishingKind">Bible verse</span></h4><label id="dmPublishingReferenceLabel">Reference<input id="dmPublishingReference"></label><label>Post content<textarea id="dmPublishingBody" rows="6"></textarea></label><label>Caption<textarea id="dmPublishingCaption" rows="4"></textarea></label><label>Hashtags<textarea id="dmPublishingHashtags" rows="3"></textarea></label></section>
  <section><h4>Platform preset</h4><div id="dmPublishingPlatforms" class="dm-platform-grid"><button data-platform="facebook">Facebook Square</button><button data-platform="instagram">Instagram Square</button><button data-platform="story">Story 9:16</button><button data-platform="reel">Reel 9:16</button><button data-platform="facebook-landscape">Facebook Landscape</button></div>
  <h4>Post status</h4><div id="dmPublishingStatus" class="dm-status-grid"><button data-status="draft">Draft</button><button data-status="ready">Ready</button><button data-status="posted">Posted</button></div>
  <button id="dmSmartSurprise" class="primary">✨ Smart Surprise Me</button><button id="dmCreateReelFromPost" class="ghost">🎬 Create Reel from this</button></section>
 </div>
 <details class="dm-publish-history"><summary>🕘 Recent publishing history</summary><div id="dmPublishingHistoryList"></div></details>`;
 target.insertAdjacentElement('afterend',panel);
 const style=document.createElement('style');style.id='dmPublishingStyles';style.textContent=`
 #dmPublishingWorkflow{max-width:1220px;margin:0 auto 18px;padding:18px}.dm-publish-head{display:flex;gap:16px;align-items:flex-start;justify-content:space-between}.dm-publish-head h3{margin:.2rem 0}.dm-status-pill{padding:8px 12px;border-radius:999px;background:#eef4f1;font-weight:800;white-space:nowrap}.dm-publish-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:18px;margin-top:14px}.dm-publish-grid>section{border:1px solid var(--border,#d8dedb);border-radius:14px;padding:14px}.dm-publish-grid label{display:grid;gap:5px;margin:10px 0;font-weight:700}.dm-publish-grid textarea,.dm-publish-grid input{width:100%;box-sizing:border-box}.dm-platform-grid,.dm-status-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:14px}.dm-platform-grid button,.dm-status-grid button{min-height:44px}.dm-platform-grid button.active,.dm-status-grid button.active{background:#2f7765;color:white;border-color:#2f7765}.dm-publish-grid #dmSmartSurprise,.dm-publish-grid #dmCreateReelFromPost{width:100%;margin-top:8px;min-height:46px}.dm-publish-history{margin-top:14px}.dm-publish-history summary{cursor:pointer;font-weight:800}.dm-publish-history-item{width:100%;display:grid;grid-template-columns:minmax(110px,.35fr) 1fr auto;gap:10px;text-align:left;align-items:center;padding:10px;margin-top:8px}.dm-publish-history-item small{overflow:hidden}.dm-publish-history-item span{font-size:.78rem;opacity:.7}@media(max-width:760px){.dm-publish-grid{grid-template-columns:1fr}.dm-publish-head{align-items:center}.dm-platform-grid{grid-template-columns:1fr 1fr}.dm-publish-history-item{grid-template-columns:1fr}.dm-publish-history-item span{justify-self:start}}`;
 document.head.appendChild(style);
 $('#dmPublishingBody').addEventListener('input',()=>setValue(type()==='prayer'?'#socialPrayer':'#socialVerse',$('#dmPublishingBody').value));
 $('#dmPublishingReference').addEventListener('input',()=>setValue('#socialReference',$('#dmPublishingReference').value));
 $('#dmPublishingCaption').addEventListener('input',()=>setValue('#socialCaption',$('#dmPublishingCaption').value));
 $('#dmPublishingHashtags').addEventListener('input',()=>setValue('#socialHashtags',$('#dmPublishingHashtags').value));
 $$('#dmPublishingPlatforms button').forEach(b=>b.onclick=()=>setPlatform(b.dataset.platform));
 $$('#dmPublishingStatus button').forEach(b=>b.onclick=()=>{const s=b.dataset.status;if(s==='posted'){const mark=$('#dmSocialMarkPosted');if(mark)mark.click()}saveHistory(s)});
 $('#dmSmartSurprise').onclick=smartSurprise;$('#dmCreateReelFromPost').onclick=createReelHandoff;
 setPlatform(localStorage.getItem(PLATFORM_KEY)||'facebook');syncEditorFromSource();renderStatus();renderHistory();
}
function boot(){if(location.hash!=='#socialstudio')return;clearTimeout(bootTimer);bootTimer=setTimeout(()=>{build();syncEditorFromSource()},100)}
window.addEventListener('load',boot);window.addEventListener('hashchange',boot);
document.addEventListener('input',e=>{if(['socialType','socialVerse','socialPrayer','socialReference','socialCaption','socialHashtags'].includes(e.target?.id))syncEditorFromSource()});
document.addEventListener('change',e=>{if(e.target?.id==='socialType')syncEditorFromSource()});
document.addEventListener('click',e=>{if(e.target.closest('#dmPremiumGenerateControls,#dmSocialV2Panel,[data-page="socialstudio"]'))setTimeout(syncEditorFromSource,140)});
document.addEventListener('dm-social-studio-ready',boot);
})();
