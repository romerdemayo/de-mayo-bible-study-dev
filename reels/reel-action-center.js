/* De Mayo Bible Studies — Reel Action Center v5 — complete compact workflow */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const META={
 Recording:{title:'🎙 2. RECORD YOUR REEL',sub:'Open teleprompter and record your voice'},
 Video:{title:'🎥 3. CREATE YOUR VIDEO',sub:'Add Reel sound, create MP4 and save to device'},
 Facebook:{title:'ⓕ 4. POST TO FACEBOOK',sub:'Share your Reel, copy caption/hashtags and mark as posted'},
 Save:{title:'📁 5. SAVE YOUR REEL',sub:'Save to your library and manage your Reels'},
 Weekly:{title:'📅 6. WEEKLY REEL SCHEDULE',sub:'Plan and prepare your weekly Reels in advance'}
};
const ACTIONS={
 Recording:[['dmStartVoiceover','🎙','Start Recording','Open Teleprompter'],['dmStopVoiceover','■','Stop Recording','End Session'],['dmRefreshVoiceoverScript','↻','Refresh Script','Update Teleprompter']],
 Video:[['dmNativeMp4','▣','Create MP4','With Sound'],['dmSilentMp4','🔇','Silent MP4','No Sound'],['dmSaveVideo','⇩','Save Video','To Device']],
 Facebook:[['dmTopFacebook','ⓕ','Post to Facebook','Publish / Share'],['dmCopyCaption','▤','Copy Caption','Clipboard'],['dmCopyHashtags','#','Copy Hashtags','Clipboard'],['dmMarkPosted','✓','Mark as Posted','History']],
 Save:[['dmSaveLibrary','📁','Save Reel','My Reels'],['dmViewMyReels','☷','View My Reels','Open Library']]
};
function fire(el){if(!el||el.disabled)return;el.click()}
function native(id){if(id==='dmTopFacebook')return $('#dmPublishFacebookNow');if(id==='dmMarkPosted')return $('#dmMarkReelPosted')||$('#dmMarkPosted');return $('#'+id)}
function doAction(id){
 if(id==='dmTopFacebook'){const n=native(id);if(n)return fire(n);if(navigator.share){const c=window.DM_REEL_CREATOR?.getContent?.()||{};return navigator.share({title:c.title||'De Mayo Bible Studies',text:[c.caption,c.hashtags].filter(Boolean).join('\n\n')}).catch(()=>{})}}
 if(id==='dmViewMyReels'){return $('#dmReelLibrary')?.scrollIntoView({behavior:'smooth',block:'start'})}
 fire(native(id));
}
function openGroup(key){const wrap=$('#dmActionCenterGroups');if(!wrap)return;wrap.querySelectorAll('.dm-action-group').forEach(x=>{const yes=x.dataset.actionGroup===key;x.classList.toggle('is-open',yes);x.querySelector('.dm-action-group-toggle')?.setAttribute('aria-expanded',yes?'true':'false')});}
function group(key,body,open=false){
 const box=document.createElement('div');box.className='dm-action-group'+(open?' is-open':'');box.dataset.actionGroup=key;
 box.innerHTML='<button type="button" class="dm-action-group-toggle" aria-expanded="'+(open?'true':'false')+'"><span><strong>'+META[key].title+'</strong><small>'+META[key].sub+'</small></span><b class="dm-action-chevron">⌄</b></button><div class="dm-action-body">'+body+'</div>';
 box.querySelector('.dm-action-group-toggle').onclick=()=>{const next=!box.classList.contains('is-open');if(next)openGroup(key);else{box.classList.remove('is-open');box.querySelector('.dm-action-group-toggle').setAttribute('aria-expanded','false')}};
 return box;
}
function actionGrid(items){return '<div class="dm-action-grid">'+items.map(([id,icon,label,sub])=>'<button type="button" data-action-for="'+id+'"><span class="dm-action-icon">'+icon+'</span><span class="dm-action-copy"><strong>'+label+'</strong><small>'+sub+'</small></span></button>').join('')+'</div>'}
function selectProxy(id,label,proxyId){
 const o=$('#'+id);if(!o)return '';
 return '<label>'+label+'<select id="'+proxyId+'" data-mirror="'+id+'">'+[...o.options].map(x=>'<option value="'+x.value+'"'+(x.value===o.value?' selected':'')+'>'+x.textContent+'</option>').join('')+'</select></label>';
}
function createBody(){
 return '<div class="dm-create-label">Content Type</div><div class="dm-content-types">'+
 '<button data-content="verse"><b>📖 Bible Verse</b><small>Verse + Message + Prayer</small></button>'+
 '<button data-content="motivation"><b>🔥 Christian Motivation</b><small>Encouragement</small></button>'+
 '<button data-content="devotional"><b>❤️ Devotional</b><small>Reflection & Prayer</small></button>'+
 '<button data-content="weekly"><b>📅 Weekly Reel</b><small>Series Content</small></button>'+
 '<button data-content="sounds"><b>🎵 Reel Sounds</b><small>Music & Audio</small></button></div>'+
 '<div class="dm-top-settings">'+selectProxy('dmTheme','Theme','dmTopTheme')+selectProxy('dmTemplate','Template','dmTopTemplate')+selectProxy('dmDuration','Length','dmTopDuration')+selectProxy('dmReelLanguage','Language','dmTopLanguage')+'</div>'+
 '<div class="dm-top-status"><span id="dmTopGemini">● Gemini</span><span id="dmTopRepeat"></span></div>'+
 actionGrid([['dmRegenerate','✨','Generate','Create Your Reel'],['dmReelSurprise','🎲','Surprise Me','Random Theme'],['dmManualOnePaste','✎','Use My Content','Paste Your Own']]);
}
function weeklyBody(){
 const ready=$('#dmReelScheduleManager');
 if(!ready)return '<p class="dm-action-loading">Weekly Reel manager is loading…</p>';
 return '<div class="dm-weekly-top"><label class="dm-top-check"><input type="checkbox" id="dmTopWeeklyEnabled"> Enable weekly plan</label><div class="dm-top-settings">'+selectProxy('dmReelScheduleDay','Posting day','dmTopScheduleDay')+selectProxy('dmReelScheduleTime','Posting time','dmTopScheduleTime')+'</div></div>'+
 actionGrid([['dmSaveReelSchedule','💾','Save Schedule','Weekly Plan'],['dmSaveReelForReview','📥','Save for Review','Current Reel'],['dmOpenScheduledReel','✏️','Open Draft','Review'],['dmApproveScheduledReel','✓','Approve Reel','Approve Draft'],['dmClearScheduledReel','🗑','Remove Draft','Clear Draft']])+
 '<div id="dmTopWeeklySummary" class="dm-top-status"></div>';
}
function bind(panel){
 panel.querySelectorAll('[data-action-for]').forEach(b=>{b.onclick=()=>doAction(b.dataset.actionFor)});
 panel.querySelectorAll('select[data-mirror]').forEach(p=>{p.onchange=()=>{const o=$('#'+p.dataset.mirror);if(o){o.value=p.value;o.dispatchEvent(new Event('change',{bubbles:true}))}}});
 panel.querySelectorAll('[data-content]').forEach(b=>{b.onclick=()=>{const type=b.dataset.content;if(type==='weekly'){openGroup('Weekly');return}if(type==='sounds'){openGroup('Video');setTimeout(()=>$('#dmTopMusic')?.focus(),50);return}if(type==='motivation'){const o=$('#dmReelContentType');if(o){o.value='motivation';o.dispatchEvent(new Event('change',{bubbles:true}))}}else{const o=$('[data-dm-type="'+type+'"]');if(o)fire(o);const ai=$('#dmReelContentType');if(ai){ai.value='devotional';ai.dispatchEvent(new Event('change',{bubbles:true}))}}sync()}});
 const en=$('#dmTopWeeklyEnabled'),orig=$('#dmReelScheduleEnabled');if(en&&orig){en.checked=orig.checked;en.onchange=()=>{orig.checked=en.checked;orig.dispatchEvent(new Event('change',{bubbles:true}))}}
}
function build(){
 if(location.hash!=='#reelcreator')return false;const host=$('.dm-reel-v2');if(!host)return false;
 let panel=$('#dmReelActionCenter');if(!panel){panel=document.createElement('section');panel.id='dmReelActionCenter';panel.className='card dm-action-center';const hero=host.querySelector('.dm-reel-hero');(hero||host.firstElementChild)?.insertAdjacentElement('afterend',panel)}
 const open=panel.querySelector('.dm-action-group.is-open')?.dataset.actionGroup||'Create';
 panel.innerHTML='<div class="dm-action-center-head"><div><span class="pill">REEL WORKFLOW</span><h3>🎬 Reel Creator</h3><p>Create Faith-Filled Reels in Minutes</p></div><em>One Place. Everything You Need.</em></div><div id="dmActionCenterGroups"></div>';
 const wrap=$('#dmActionCenterGroups');
 const create=document.createElement('div');create.className='dm-action-group'+(open==='Create'?' is-open':'');create.dataset.actionGroup='Create';create.innerHTML='<button type="button" class="dm-action-group-toggle" aria-expanded="'+(open==='Create'?'true':'false')+'"><span><strong>✨ 1. CREATE YOUR REEL</strong><small>Choose content, theme and generate your script</small></span><b class="dm-action-chevron">⌄</b></button><div class="dm-action-body">'+createBody()+'</div>';create.querySelector('.dm-action-group-toggle').onclick=()=>create.classList.contains('is-open')?create.classList.remove('is-open'):openGroup('Create');wrap.appendChild(create);
 wrap.appendChild(group('Recording',actionGrid(ACTIONS.Recording),open==='Recording'));wrap.appendChild(group('Video','<div class="dm-video-top">'+selectProxy('dmMusic','Reel Sound','dmTopMusic')+'</div>'+actionGrid(ACTIONS.Video),open==='Video'));['Facebook','Save'].forEach(key=>wrap.appendChild(group(key,actionGrid(ACTIONS[key]),open===key)));
 wrap.appendChild(group('Weekly',weeklyBody(),open==='Weekly'));
 bind(panel);sync();return true;
}
function sync(){
 const p=$('#dmReelActionCenter');if(!p)return;
 p.querySelectorAll('select[data-mirror]').forEach(x=>{const o=$('#'+x.dataset.mirror);if(o&&x.value!==o.value)x.value=o.value});
 p.querySelectorAll('[data-action-for]').forEach(b=>{const o=native(b.dataset.actionFor);if(o)b.disabled=!!o.disabled});
 const gem=$('#dmReelGeminiStatus'),top=$('#dmTopGemini');if(top){const t=(gem?.textContent||'').trim();top.textContent=t?(t.includes('success')||t.includes('Ready')?'🟢 Gemini Ready':'● '+t.slice(0,55)):'● Gemini Ready'}
 const rep=$('#dmPostedReelCount'),tr=$('#dmTopRepeat');if(tr)tr.textContent=rep?.textContent||'';
 const ws=$('#dmReelScheduleSummary'),tw=$('#dmTopWeeklySummary');if(tw)tw.textContent=ws?.textContent||'';
 const ai=$('#dmReelContentType')?.value;const activeType=document.querySelector('[data-dm-type].active')?.dataset.dmType;p.querySelectorAll('[data-content]').forEach(b=>b.classList.toggle('active',(b.dataset.content==='motivation'&&ai==='motivation')||(b.dataset.content===activeType&&ai!=='motivation')));
}
function boot(){let n=0;const timer=setInterval(()=>{n++;build();if(n>32)clearInterval(timer)},250);document.addEventListener('dm-reel-content-change',()=>setTimeout(sync,80));document.addEventListener('click',()=>setTimeout(sync,120),true);window.addEventListener('hashchange',()=>setTimeout(build,100));}
window.DM_REEL_ACTION_CENTER={build,sync,openGroup};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();