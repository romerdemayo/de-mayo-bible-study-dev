/* De Mayo Bible Studies - Sprint 1 My Library foundation */
(function(){
'use strict';
const $=s=>document.querySelector(s),VIEW=()=>$('#view');
const CAPTURE_KEY='dm_quickCaptures';
const ROUTES={notes:'verseNotes',prayers:'prayerlibrary',resources:'myresources',reels:'reelcreator',social:'socialstudio',favourites:'favourites',drafts:'creator'};
const CATEGORY_RULES=[
 ['notes','📝','Bible Notes','Notes & reflections',/note|journal|reflection/i],
 ['prayers','🙏','Prayers','Journal & requests',/prayer/i],
 ['resources','📚','Resources','Studies & devotionals',/resource|study|sermon|devotional|exhort|kids/i],
 ['reels','🎬','Reels','Videos & shorts',/reel/i],
 ['social','📱','Social Posts','Posts & captions',/social|facebook|posted/i],
 ['favourites','🔖','Favourites','Verses & highlights',/favourite|favorite|highlight/i],
 ['drafts','📂','Drafts & Ideas','Quick captures',/draft|capture|idea/i]
];
function readRaw(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
function textOf(x){if(x==null)return'';if(typeof x==='string')return x;if(typeof x==='number')return String(x);if(Array.isArray(x))return x.map(textOf).join(' ');if(typeof x==='object')return [x.title,x.name,x.reference,x.verse,x.body,x.text,x.content,x.prayer,x.topic,x.caption].filter(Boolean).join(' ');return''}
function timeOf(x){if(!x||typeof x!=='object')return 0;return Number(x.updatedAt||x.saved||x.createdAt||x.postedAt||x.date||0)||0}
function classify(key){const found=CATEGORY_RULES.find(x=>x[4].test(key));return found?found[0]:null}
function collect(){const out=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key||!key.startsWith('dm_')||key.startsWith('dm_system_'))continue;const cat=classify(key);if(!cat)continue;const value=readRaw(key);const rows=Array.isArray(value)?value:(value&&typeof value==='object'?Object.values(value):[]);rows.slice(0,150).forEach((item,index)=>{const text=textOf(item).trim();if(!text)return;const meta=CATEGORY_RULES.find(x=>x[0]===cat);out.push({cat,key,index,text,title:(item&&typeof item==='object'&&(item.title||item.name||item.reference||item.topic))||meta?.[2]||'Saved item',time:timeOf(item)});});}
 const captures=readRaw(CAPTURE_KEY)||[];captures.forEach((x,index)=>out.push({cat:'drafts',key:CAPTURE_KEY,index,text:x.text||'',title:x.type||'Quick Capture',time:x.createdAt||0}));
 return out.sort((a,b)=>b.time-a.time);
}
function nav(page){if(typeof window.route==='function')window.route(page);else location.hash=page}
function ensureNav(){const navBox=$('#nav');if(!navBox||$('#dmMyLibraryNav'))return;const b=document.createElement('button');b.id='dmMyLibraryNav';b.className='dm-library-nav-button';b.textContent='📚 My Library';b.onclick=()=>openLibrary();navBox.prepend(b)}
function openLibrary(){history.replaceState(null,'','#mylibrary');renderLibrary();}
function renderLibrary(){
 const view=VIEW();if(!view)return;const items=collect();const counts=Object.fromEntries(CATEGORY_RULES.map(c=>[c[0],items.filter(x=>x.cat===c[0]).length]));
 $('#pageTitle').textContent='My Library';$('#pageSub').textContent='Your personal Bible & ministry space';
 view.innerHTML=`<section class="dm-library-shell">
 <article class="card dm-library-hero"><div class="dm-library-hero-copy"><div class="dm-library-hero-icon">📖</div><div><span class="dm-library-badge">🔒 Private on this device</span><h2>My Library</h2><p>Your personal Bible and ministry workspace.</p></div></div><button class="primary" id="dmLibraryCreate">＋ Create Something</button></article>
 <section class="dm-library-stats">${CATEGORY_RULES.slice(0,6).map(c=>`<button class="dm-library-stat" data-lib-filter="${c[0]}"><span class="dm-stat-icon">${c[1]}</span><b>${counts[c[0]]||0}</b><span>${c[2]}</span><small>${c[3]}</small></button>`).join('')}</section>
 <section class="card dm-library-main"><div class="dm-library-toolbar"><input id="dmLibrarySearch" placeholder="Search My Library…"><button class="ghost dm-library-show-all" id="dmLibraryAll" aria-label="Show all categories">Show all</button></div><div class="dm-library-filters">${CATEGORY_RULES.map(c=>`<button class="ghost dm-library-filter" data-lib-filter="${c[0]}">${c[1]} ${c[2]}</button>`).join('')}</div><div class="dm-library-recent-title"><h3>Recently Added</h3><button class="ghost" id="dmLibraryRecentAll">View all</button></div><section id="dmLibraryResults" class="dm-library-grid"></section><section class="dm-library-quick-section"><div class="dm-library-quick-heading"><span>⚡</span><div><h3>Quick Capture</h3><p>Capture your thoughts in seconds</p></div></div><div class="dm-library-quick-grid">${[['📝','Quick Note'],['🙏','Prayer'],['💡','Ministry Idea'],['⛪','Sermon Idea'],['🎬','Reel Idea']].map(x=>`<button class="ghost" data-capture-type="${x[1]}"><span>${x[0]}</span>${x[1]}</button>`).join('')}</div></section></section>
 </section>`;
 const paint=(filter='',query='')=>{const q=query.toLowerCase().trim();const rows=items.filter(x=>(!filter||x.cat===filter)&&(!q||(x.title+' '+x.text).toLowerCase().includes(q))).slice(0,80);$('#dmLibraryResults').innerHTML=rows.length?rows.map(x=>`<article class="dm-library-card"><small>${CATEGORY_RULES.find(c=>c[0]===x.cat)?.[2]||x.cat}</small><h3>${escapeHtml(String(x.title).slice(0,90))}</h3><p>${escapeHtml(x.text.slice(0,220))}</p><div><button class="ghost" data-open-cat="${x.cat}">Open section</button></div></article>`).join(''):`<article class="dm-library-empty"><div class="dm-library-empty-icon">📖</div><h3>Your library is empty</h3><p>Start creating and saving your notes, prayers, studies, and more.</p><button class="primary" id="dmEmptyCreate">＋ Create Something</button></article>`;document.querySelectorAll('[data-open-cat]').forEach(b=>b.onclick=()=>nav(ROUTES[b.dataset.openCat]||'myresources'));const empty=$('#dmEmptyCreate');if(empty)empty.onclick=()=>nav('creator');};
 let filter='';paint();$('#dmLibrarySearch').oninput=e=>paint(filter,e.target.value);$('#dmLibraryAll').onclick=$('#dmLibraryRecentAll').onclick=()=>{filter='';$('#dmLibrarySearch').value='';paint()};document.querySelectorAll('[data-lib-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.libFilter;paint(filter,$('#dmLibrarySearch').value)});$('#dmLibraryCreate').onclick=()=>nav('creator');document.querySelectorAll('[data-capture-type]').forEach(b=>b.onclick=()=>openCapture(b.dataset.captureType));
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
function openCapture(defaultType='Quick Note'){if($('#dmCaptureModal'))return;const wrap=document.createElement('div');wrap.id='dmCaptureModal';wrap.className='dm-capture-modal';wrap.innerHTML=`<div class="dm-capture-dialog"><h2>➕ Quick Capture</h2><label>Type<select id="dmCaptureType"><option>Quick Note</option><option>Prayer</option><option>Ministry Idea</option><option>Sermon Idea</option><option>Reel Idea</option></select></label><label>Your thought<textarea id="dmCaptureText" placeholder="Write it here before you forget…"></textarea></label><div class="dm-capture-actions"><button class="ghost" id="dmCaptureCancel">Cancel</button><button class="primary" id="dmCaptureSave">Save to My Library</button></div></div>`;document.body.appendChild(wrap);$('#dmCaptureType').value=defaultType;$('#dmCaptureCancel').onclick=()=>wrap.remove();$('#dmCaptureSave').onclick=()=>{const text=$('#dmCaptureText').value.trim();if(!text)return;const arr=readRaw(CAPTURE_KEY)||[];arr.unshift({type:$('#dmCaptureType').value,text,createdAt:Date.now()});localStorage.setItem(CAPTURE_KEY,JSON.stringify(arr.slice(0,300)));wrap.remove();if(typeof window.toast==='function')window.toast('Saved to My Library');if(location.hash==='#mylibrary')renderLibrary();};}
function ensureCapture(){if($('#dmQuickCapture'))return;const b=document.createElement('button');b.id='dmQuickCapture';b.className='primary dm-quick-capture';b.setAttribute('aria-label','Quick Capture');b.textContent='＋';b.onclick=()=>openCapture();document.body.appendChild(b)}
function handleHash(){if(location.hash==='#mylibrary')setTimeout(renderLibrary,0)}
function install(){ensureNav();ensureCapture();handleHash()}
window.addEventListener('hashchange',handleHash);window.addEventListener('load',install);new MutationObserver(()=>{ensureNav();ensureCapture()}).observe(document.documentElement,{childList:true,subtree:true});
})();
