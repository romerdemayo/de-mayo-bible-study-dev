/* De Mayo Bible Studies — Reel Action Center v3 — top workflow dashboard */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const GROUPS=[
 {key:'Create',title:'✨ 1. CREATE YOUR REEL',items:[['dmRegenerate','✨','Generate','Selected Theme'],['dmReelSurprise','🎲','Surprise Me','Random Theme'],['dmManualOnePaste','✎','Use My Content','Paste Your Own']]},
 {key:'Recording',title:'🎙 2. RECORD YOUR REEL',items:[['dmStartVoiceover','🎙','Start Recording','Open Teleprompter'],['dmStopVoiceover','■','Stop Recording','End Session'],['dmRefreshVoiceoverScript','↻','Refresh Script','Update Teleprompter']]},
 {key:'Video',title:'🎥 3. CREATE YOUR VIDEO',items:[['dmNativeMp4','▣','Create MP4','With Sound'],['dmSilentMp4','🔇','MP4 Without Sound','No Background Music'],['dmSaveVideo','⇩','Save Video','Download to Device']]},
 {key:'Facebook',title:'ⓕ 4. POST TO FACEBOOK',items:[['dmTopFacebook','ⓕ','Post to Facebook','Publish / Share'],['dmCopyCaption','▤','Copy Caption','To Clipboard'],['dmCopyHashtags','#','Copy Hashtags','To Clipboard'],['dmMarkPosted','✓','Mark as Posted','Save to History']]},
 {key:'Save',title:'📁 5. SAVE YOUR REEL',items:[['dmSaveLibrary','📁','Save Reel','To My Reels'],['dmViewMyReels','☷','View My Reels','Open Library']]}
];
function clickOriginal(id){
 if(id==='dmTopFacebook'){if(window.DM_SOCIAL_FACEBOOK?.publish)return window.DM_SOCIAL_FACEBOOK.publish();const native=$('#dmPublishFacebookNow');if(native)return native.click();if(navigator.share){const c=window.DM_REEL_CREATOR?.getContent?.()||{};return navigator.share({title:c.title||'De Mayo Bible Studies',text:[c.caption,c.hashtags].filter(Boolean).join('\n\n')}).catch(()=>{});}return;}
 if(id==='dmViewMyReels'){const lib=$('#dmReelLibrary');if(lib)return lib.scrollIntoView({behavior:'smooth',block:'start'});return;}
 const target=$('#'+id);if(target&&!target.disabled)target.click();
}
function originalFor(id){return id==='dmTopFacebook'?$('#dmPublishFacebookNow'):id==='dmViewMyReels'?$('#dmReelLibrary'):$('#'+id)}
function build(){
 if(location.hash!=='#reelcreator')return false;
 let panel=$('#dmReelActionCenter');
 if(!panel){const host=$('.dm-reel-v2');if(!host)return false;panel=document.createElement('section');panel.id='dmReelActionCenter';panel.className='card dm-action-center';panel.innerHTML='<div class="dm-action-center-head"><div><span class="pill">QUICK CONTROLS</span><h3>🎬 Reel Creator</h3><p>Create Faith-Filled Reels in Minutes</p></div><em>One Place. Everything You Need.</em></div><div id="dmActionCenterGroups"></div>';const hero=host.querySelector('.dm-reel-hero');(hero||host.firstElementChild)?.insertAdjacentElement('afterend',panel);}
 const wrap=$('#dmActionCenterGroups');if(!wrap)return false;wrap.innerHTML='';
 GROUPS.forEach(group=>{const box=document.createElement('div');box.className='dm-action-group';box.dataset.actionGroup=group.key;box.innerHTML='<h4>'+group.title+'</h4><div class="dm-action-grid"></div>';const grid=box.querySelector('.dm-action-grid');group.items.forEach(([id,icon,label,sub])=>{const original=originalFor(id);if(!original&&id!=='dmTopFacebook'&&id!=='dmViewMyReels')return;const b=document.createElement('button');b.type='button';b.dataset.actionFor=id;b.innerHTML='<span class="dm-action-icon">'+icon+'</span><span class="dm-action-copy"><strong>'+label+'</strong><small>'+sub+'</small></span>';b.disabled=!!original?.disabled;b.hidden=!!original?.hidden;b.onclick=()=>clickOriginal(id);grid.appendChild(b);});wrap.appendChild(box);});
 return true;
}
function sync(){const p=$('#dmReelActionCenter');if(!p)return;p.querySelectorAll('[data-action-for]').forEach(b=>{const o=originalFor(b.dataset.actionFor);if(o&&b.dataset.actionFor!=='dmViewMyReels'){b.disabled=!!o.disabled;b.hidden=!!o.hidden;}});}
function boot(){let n=0;const timer=setInterval(()=>{n++;build();sync();if(n>20)clearInterval(timer)},250);document.addEventListener('dm-reel-content-change',()=>setTimeout(sync,80));document.addEventListener('click',()=>setTimeout(sync,100),true);window.addEventListener('hashchange',()=>setTimeout(build,100));}
window.DM_REEL_ACTION_CENTER={build,sync};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();