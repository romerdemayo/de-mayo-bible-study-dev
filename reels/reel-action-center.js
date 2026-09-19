/* De Mayo Bible Studies — Reel Action Center v6.1 — complete collapsible workflow */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const GROUPS=[
 {key:'Create',title:'✨ 1. CREATE YOUR REEL',sub:'Choose content, theme and generate your script'},
 {key:'Recording',title:'🎙 2. RECORD YOUR REEL',sub:'Open teleprompter and record your voice'},
 {key:'Video',title:'🎥 3. CREATE YOUR VIDEO',sub:'Add music, create MP4 and save to device'},
 {key:'Facebook',title:'ⓕ 4. POST TO FACEBOOK',sub:'Share your reel, copy caption/hashtags and mark as posted'},
 {key:'Save',title:'📁 5. SAVE YOUR REEL',sub:'Save to your library and manage your reels'},
 {key:'Weekly',title:'📅 6. WEEKLY REEL SCHEDULE',sub:'Plan and prepare your weekly reels in advance'}
];
const ITEMS={
 Recording:[['dmStartVoiceover','🎙','Start Recording','Open Teleprompter'],['dmStopVoiceover','■','Stop Recording','End Session'],['dmRefreshVoiceoverScript','↻','Refresh Script','Update Teleprompter']],
 Video:[['dmNativeMp4','▣','Create MP4','With Sound'],['dmSilentMp4','🔇','MP4 Without Sound','No Audio Track'],['dmSaveVideo','⇩','Save Video','Save to Device']],
 Facebook:[['dmShareFacebookMp4','📤','Share to Facebook','Attach Created MP4'],['dmTopFacebook','ⓕ','Post Text to Facebook','Caption / Text Only'],['dmCopyCaption','▤','Copy Caption','To Clipboard'],['dmCopyHashtags','#','Copy Hashtags','To Clipboard'],['dmMarkPosted','✓','Mark as Posted','Save to History']],
 Save:[['dmSaveLibrary','📁','Save Reel','To My Reels'],['dmViewMyReels','☷','View My Reels','Open Library']]
};
function source(id){if(id==='dmShareFacebookMp4')return window.DM_MP4_HAS_LATEST?.()?{disabled:false,hidden:false}:$('#dmShareLastMp4');if(id==='dmTopFacebook')return $('#dmPublishFacebookNow');if(id==='dmViewMyReels')return $('#dmReelLibrary');return $('#'+id)}
function trigger(id){
 if(id==='dmShareFacebookMp4'){if(window.DM_MP4_SHARE_LATEST)return window.DM_MP4_SHARE_LATEST();const b=$('#dmShareLastMp4');if(b&&!b.disabled)return b.click();window.toast?.('Create your MP4 first, then tap Share to Facebook.');return;}
 if(id==='dmTopFacebook'){const n=$('#dmPublishFacebookNow');if(n)return n.click();const c=window.DM_REEL_CREATOR?.getContent?.()||{};if(navigator.share)return navigator.share({title:c.title||'De Mayo Bible Studies',text:[c.caption,c.hashtags].filter(Boolean).join('\n\n')}).catch(()=>{});return;}
 if(id==='dmViewMyReels'){return $('#dmReelLibrary')?.scrollIntoView({behavior:'smooth',block:'start'});}
 const el=$('#'+id);if(el&&!el.disabled)el.click();
}
function actionButton(id,icon,label,sub){const o=source(id);if(!o&&!['dmShareFacebookMp4','dmTopFacebook','dmViewMyReels'].includes(id))return '';return '<button type="button" class="dm-dash-action" data-action-for="'+id+'"><span class="dm-action-icon">'+icon+'</span><span class="dm-action-copy"><strong>'+label+'</strong><small>'+sub+'</small></span></button>'}
function selectProxy(label,id){const el=$('#'+id);if(!el)return '';return '<label class="dm-dash-field"><span>'+label+'</span><select data-proxy-select="'+id+'">'+el.innerHTML+'</select></label>'}
function createBody(){
 const nativeType=$('#dmReelContentType')?.value||'devotional',type=nativeType==='motivation'?'motivation':($('[data-dm-type].active')?.dataset.dmType||'verse');
 return '<div class="dm-content-choice"><button data-type-proxy="verse" class="'+(type==='verse'?'active':'')+'">📖<b>Bible Verse</b><small>Verse + Message + Prayer</small></button><button data-type-proxy="motivation" class="'+(type==='motivation'?'active':'')+'">🔥<b>Christian Motivation</b><small>Encouragement</small></button><button data-type-proxy="devotional" class="'+(type==='devotional'?'active':'')+'">❤️<b>Devotional</b><small>Reflection & Prayer</small></button><button data-open-weekly>📅<b>Weekly Reel</b><small>Series Content</small></button><button data-open-sound>🎵<b>Reel Sounds</b><small>Music & Audio</small></button></div><div class="dm-dash-fields">'+selectProxy('Theme','dmTheme')+selectProxy('Template','dmTemplate')+selectProxy('Length','dmDuration')+selectProxy('Language','dmReelLanguage')+'</div><div class="dm-dash-status"><span>● <b>Gemini</b> <i id="dmDashGemini">Ready</i></span><span id="dmDashPosted"></span></div><div class="dm-action-grid dm-create-actions">'+actionButton('dmRegenerate','✨','Generate','Create Your Reel')+actionButton('dmReelSurprise','🎲','Surprise Me','Random Theme')+actionButton('dmManualOnePaste','✎','Use My Content','Paste Your Own')+'</div>';
}
function videoExtras(){return '<div class="dm-dash-fields">'+selectProxy('Reel Sound','dmMusic')+'</div><div class="dm-volume-note">Choose your sound and volume in Reel Sound settings, then create your MP4.</div><div class="dm-action-grid">'+(ITEMS.Video.map(x=>actionButton(...x)).join(''))+'</div>'}
function weeklyBody(){const mgr=$('#dmReelScheduleManager');if(!mgr)return '<p class="dm-volume-note">Weekly Reel Schedule Manager is loading…</p>';return '<div class="dm-weekly-shortcuts"><button data-weekly-target="dmReelScheduleEnabled">☑ Enable / Pause Weekly Plan</button><button data-weekly-target="dmSaveReelSchedule">💾 Save Schedule</button><button data-weekly-target="dmSaveReelForReview">📥 Save Reel for Review</button><button data-weekly-target="dmOpenScheduledReel">✏️ Open Draft</button><button data-weekly-target="dmApproveScheduledReel">✓ Approve Reel</button><button data-weekly-target="dmClearScheduledReel">🗑 Remove Draft</button></div><button class="dm-jump-original" data-jump="#dmReelScheduleManager">Open full schedule settings ↓</button>'}
function recordExtras(){const script=$('#dmVoiceoverScript')?.textContent?.trim()||'Your complete prepared reading script will appear here after you create a Reel.';return '<div class="dm-top-script"><div class="dm-top-script-head"><b>📜 Prepared Reading Script</b><span>Up to 2:00</span></div><div class="dm-top-script-text">'+script.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div><button class="dm-jump-original" data-jump="#dmVoiceoverScript">Open full teleprompter settings ↓</button></div><div class="dm-action-grid">'+ITEMS.Recording.map(x=>actionButton(...x)).join('')+'</div>'}
function manualExtras(){return '<div class="dm-top-manual"><b>✍️ Paste My Verse, Reflection & Prayer</b><p>Paste everything in one box. The app will pick out the reference, verse, reflection and prayer.</p><textarea id="dmTopManualPaste" rows="7" placeholder="Reference: Psalm 46:10\n\nVerse: Be still, and know that I am God...\n\nReflection: ...\n\nPrayer: ..."></textarea><button type="button" id="dmTopUseManual">✨ Use This Content</button></div>'}
function bodyFor(key){if(key==='Create')return createBody()+manualExtras();if(key==='Recording')return recordExtras();if(key==='Video')return videoExtras();if(key==='Weekly')return weeklyBody();return '<div class="dm-action-grid">'+(ITEMS[key]||[]).map(x=>actionButton(...x)).join('')+'</div>'}
function build(){
 if(location.hash!=='#reelcreator')return;
 let panel=$('#dmReelActionCenter');
 if(!panel){const host=$('.dm-reel-v2');if(!host)return;panel=document.createElement('section');panel.id='dmReelActionCenter';panel.className='card dm-action-center';const hero=host.querySelector('.dm-reel-hero');(hero||host.firstElementChild)?.insertAdjacentElement('afterend',panel);}
 const open=panel.querySelector('.dm-action-group.is-open')?.dataset.actionGroup||'Create';
 panel.innerHTML='<div class="dm-action-center-head"><div><span class="pill">QUICK CONTROLS</span><h3>🎬 Reel Creator</h3><p>Create Faith-Filled Reels in Minutes</p></div><em>One Place. Everything You Need.</em></div><div id="dmActionCenterGroups"></div>';
 const wrap=$('#dmActionCenterGroups');
 GROUPS.forEach(g=>{const box=document.createElement('div');box.className='dm-action-group'+(g.key===open?' is-open':'');box.dataset.actionGroup=g.key;box.innerHTML='<button class="dm-action-group-toggle" type="button" aria-expanded="'+(g.key===open)+'"><span><strong>'+g.title+'</strong><small>'+g.sub+'</small></span><b class="dm-action-chevron">⌄</b></button><div class="dm-action-body">'+bodyFor(g.key)+'</div>';wrap.appendChild(box);});
 wire();sync();
}
function wire(){
 const panel=$('#dmReelActionCenter');if(!panel)return;
 panel.querySelectorAll('.dm-action-group-toggle').forEach(t=>t.onclick=()=>{const box=t.closest('.dm-action-group'),opening=!box.classList.contains('is-open');panel.querySelectorAll('.dm-action-group').forEach(x=>x.classList.remove('is-open'));if(opening)box.classList.add('is-open');});
 panel.querySelectorAll('[data-action-for]').forEach(b=>b.onclick=()=>trigger(b.dataset.actionFor));
 panel.querySelectorAll('[data-proxy-select]').forEach(p=>{const o=$('#'+p.dataset.proxySelect);if(o)p.value=o.value;p.onchange=()=>{const target=$('#'+p.dataset.proxySelect);if(target){target.value=p.value;target.dispatchEvent(new Event('change',{bubbles:true}));}}});
 panel.querySelectorAll('[data-type-proxy]').forEach(b=>b.onclick=()=>{const type=b.dataset.typeProxy,c=$('#dmReelContentType');if(type==='motivation'){if(c){c.value='motivation';c.dispatchEvent(new Event('change',{bubbles:true}));}}else{if(c){c.value='devotional';c.dispatchEvent(new Event('change',{bubbles:true}));}const target=$('[data-dm-type="'+type+'"]');if(target)target.click();}panel.querySelectorAll('[data-type-proxy]').forEach(x=>x.classList.toggle('active',x===b));sync();});
 panel.querySelector('[data-open-weekly]')?.addEventListener('click',()=>openGroup('Weekly'));
 panel.querySelector('[data-open-sound]')?.addEventListener('click',()=>openGroup('Video'));
 panel.querySelectorAll('[data-weekly-target]').forEach(b=>b.onclick=()=>$('#'+b.dataset.weeklyTarget)?.click());
 panel.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>$(b.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'}));
 const topPaste=$('#dmTopManualPaste'),nativePaste=$('#dmManualAllInOne');if(topPaste&&nativePaste){topPaste.value=nativePaste.value||'';topPaste.oninput=()=>{nativePaste.value=topPaste.value;nativePaste.dispatchEvent(new Event('input',{bubbles:true}));};}
 $('#dmTopUseManual')?.addEventListener('click',()=>{if(nativePaste&&topPaste){nativePaste.value=topPaste.value;nativePaste.dispatchEvent(new Event('input',{bubbles:true}));}$('#dmManualOnePaste')?.click();});
}
function openGroup(key){const p=$('#dmReelActionCenter');p?.querySelectorAll('.dm-action-group').forEach(x=>x.classList.toggle('is-open',x.dataset.actionGroup===key));}
function sync(){const p=$('#dmReelActionCenter');if(!p)return;p.querySelectorAll('[data-action-for]').forEach(b=>{const o=source(b.dataset.actionFor);if(o){b.disabled=!!o.disabled;b.hidden=!!o.hidden;}else if(b.dataset.actionFor==='dmShareFacebookMp4'){b.disabled=!window.DM_MP4_HAS_LATEST?.();}});const posted=$('#dmPostedReelCount')?.textContent||'';const d=$('#dmDashPosted');if(d)d.textContent=posted;const gs=$('#dmReelGeminiStatus')?.dataset.type;const g=$('#dmDashGemini');if(g)g.textContent=gs==='error'?'Offline / Built-in':gs==='loading'?'Checking…':'Ready';}
function hideLegacy(){const panel=$('#dmReelActionCenter');if(!panel)return;const selectors=['#dmManualReelCard','#dmReelScheduleManager'];selectors.forEach(sel=>{const el=$(sel);if(el&&!el.closest('#dmReelActionCenter'))el.classList.add('dm-legacy-reel-control');});const controls=document.querySelector('.dm-reel-controls');if(controls)controls.classList.add('dm-legacy-controls-contained');}
function boot(){let n=0;const timer=setInterval(()=>{n++;if(!$('#dmReelActionCenter'))build();else sync();hideLegacy();if(n>40)clearInterval(timer)},200);document.addEventListener('dm-reel-content-change',()=>setTimeout(sync,80));document.addEventListener('dm-reel-studio-ready',()=>setTimeout(build,80));window.addEventListener('hashchange',()=>setTimeout(build,100));}
window.DM_REEL_ACTION_CENTER={build,sync,openGroup};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();