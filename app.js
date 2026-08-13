Warning: truncated output (original token count: 86355)
Total output lines: 2561

/*
 De Mayo Bible Ministry
 Copyright © 2026 Romer Sadio De Mayo
 All Rights Reserved. Unauthorised copying, modification, distribution, or sale is prohibited.
*/
const D=window.BIBLE_DATA,V=D.verses,B=D.books,$=s=>document.querySelector(s),view=$('#view');
const DM_DATA_GUARD=(()=>{
 const DB_NAME='DeMayoBibleDataProtection',STORE_NAME='snapshots',LATEST='latest',INTERNAL='dm_system_',VERSION='1.12.1-dev';
 let timer=null,dbPromise=null;
 const userKeys=()=>Object.keys(localStorage).filter(k=>k.startsWith('dm_')&&!k.startsWith(INTERNAL));
 const collect=()=>{const data={};userKeys().forEach(k=>data[k]=localStorage.getItem(k));return data};
 const open=()=>dbPromise||(dbPromise=new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('IndexedDB unavailable'));const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE_NAME))req.result.createObjectStore(STORE_NAME,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)}));
 const put=async(reason='automatic-save')=>{try{const data=collect();if(!Object.keys(data).length)return false;const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).put({id:LATEST,app:'De Mayo Bible Studies',version:VERSION,created:new Date().toISOString(),reason,data});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});localStorage.setItem(INTERNAL+'lastAutoBackup',new Date().toISOString());return true}catch(e){console.warn('Automatic device snapshot failed',e);return false}};
 const schedule=(reason='automatic-save')=>{clearTimeout(timer);timer=setTimeout(()=>{const run=()=>put(reason);if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:1800});else setTimeout(run,0)},650)};
 const get=async()=>{try{const db=await open();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,'readonly'),req=tx.objectStore(STORE_NAME).get(LATEST);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}catch{return null}};
 const restore=async(snapshot)=>{if(!snapshot||!snapshot.data)return false;Object.entries(snapshot.data).forEach(([k,v])=>{if(k.startsWith('dm_')&&!k.startsWith(INTERNAL)&&typeof v==='string')localStorage.setItem(k,v)});localStorage.setItem(INTERNAL+'lastRecovery',new Date().toISOString());return true};
 const recoverIfEmpty=async()=>{if(userKeys().length)return false;const snap=await get();if(!snap||!snap.data||!Object.keys(snap.data).length)return false;await restore(snap);return true};
 const requestPersistence=async()=>{try{return !!(navigator.storage&&navigator.storage.persist&&await navigator.storage.persist())}catch{return false}};
 window.addEventListener('pagehide',()=>{try{const last=Date.parse(localStorage.getItem(INTERNAL+'lastAutoBackup')||0);if(userKeys().length&&Date.now()-last>60000)put('page-close')}catch{}});
 return {schedule,put,get,restore,recoverIfEmpty,requestPersistence,userKeys,collect};
})();
const store={get:(k,d=[])=>{try{return JSON.parse(localStorage.getItem('dm_'+k)||JSON.stringify(d))}catch{return d}},set:(k,v)=>{localStorage.setItem('dm_'+k,JSON.stringify(v));DM_DATA_GUARD.schedule('saved-'+k)}};
const I18N={
 en:{code:'EN',html:'en',
  navGroups:['Home','Read','Study','Create','Ministry','More'],
  pages:{home:'⌂ Home',read:'📖 Read Bible',search:'🔎 Search',devotionals:'🌅 Devotionals',exhortations:'🎤 Exhortations',studies:'📚 Bible Studies',kidslibrary:'👧 Kids Lessons',prayerlibrary:'🙏 Prayer Library',favourites:'★ Favourites',highlights:'🖍 Highlights',verseNotes:'🗒 Verse Notes',notes:'📝 Bible Study Creator',prayer:'🙏 Prayer Creator',myresources:'📁 Created Resources',sermon:'🎤 Sermon Studio',kids:'🧒 Kids Ministry Studio',reading:'📅 Chapter Tracker',plans:'🗓 Guided Reading Plans',salvation:'❤️ Salvation Guide',characters:'👥 Bible Characters',dictionary:'📘 Bible Dictionary',creator:'✨ Create Resource',support:'❤️ Support the Ministry',feedback:'💬 Feedback & Contact',help:'❓ Help & User Guide',about:'ℹ️ About & Copyright',socialstudio:'🎨 Social Studio',creatorstudio:'✨ Christian Creator Studio',reelcreator:'🎬 Bible Reel Creator',fbpublisher:'📅 Facebook Auto Publisher',devdashboard:'🚀 Development & QA Centre',analytics:'📊 Ministry Insights',backup:'🔒 Backup & Restore'},
  mobile:{home:'Home',read:'Bible',plans:'Plans',creator:'Create',more:'More'},
  footer:'Easy-English WEB Bible',privacy:'Your personal content stays on this device.',
  homeTitle:'Home',homeSub:'Read, study, pray, and prepare.',
  langTitle:'Language',langSub:'Choose English or Tagalog for the app menus and guides.',
  switched:'Language changed to English'},
 tl:{code:'TL',html:'tl',
  navGroups:['Tahanan','Basahin','Pag-aaral','Gumawa','Ministeryo','Iba pa'],
  pages:{home:'⌂ Tahanan',read:'📖 Basahin ang Bibliya',search:'🔎 Maghanap',devotionals:'🌅 Mga Debosyonal',exhortations:'🎤 Mga Exhortation',studies:'📚 Pag-aaral ng Bibliya',kidslibrary:'👧 Aralin para sa Bata',prayerlibrary:'🙏 Aklatan ng Panalangin',favourites:'★ Mga Paborito',highlights:'🖍 Mga Highlight',verseNotes:'🗒 Tala sa Talata',notes:'📝 Gumawa ng Bible Study',prayer:'🙏 Prayer Creator',myresources:'📁 Ginawang Materyales',sermon:'🎤 Sermon Studio',kids:'🧒 Kids Ministry Studio',reading:'📅 Talaan ng Kabanata',plans:'🗓 Mga Gabay sa Pagbasa',salvation:'❤️ Gabay sa Kaligtasan',characters:'👥 Mga Tauhan sa Bibliya',dictionary:'📘 Diksyunaryo ng Bibliya',creator:'✨ Gumawa ng Materyales',support:'❤️ Suportahan ang Ministeryo',feedback:'💬 Feedback at Contact',help:'❓ Tulong at Gabay',about:'ℹ️ Tungkol at Copyright',socialstudio:'🎨 Social Studio',creatorstudio:'✨ Christian Creator Studio',reelcreator:'🎬 Bible Reel Creator',fbpublisher:'📅 Facebook Auto Publisher',devdashboard:'🚀 Development & QA Centre',analytics:'📊 Ministry Insights',backup:'🔒 Backup at Restore'},
  mobile:{home:'Tahanan',read:'Bibliya',plans:'Plano',creator:'Gumawa',more:'Iba pa'},
  footer:'Ang Dating Biblia (1905)',privacy:'Ang personal mong nilalaman ay nananatili sa device na ito.',
  homeTitle:'Tahanan',homeSub:'Magbasa, mag-aral, manalangin, at maghanda.',
  langTitle:'Wika',langSub:'Piliin ang English o Tagalog para sa mga menu at gabay ng app.',
  switched:'Tagalog na ang wika ng app'}
};
let appLanguage=store.get('language','en');
function lang(){return I18N[appLanguage]||I18N.en}
function buildNavigation(){
 const L=lang();
 $('#nav').innerHTML=navGroups.map((g,gi)=>{const visible=g[1].filter(p=>p[0]!=='fbpublisher');return `<div class="nav-section">${L.navGroups[gi]}</div>${visible.map(p=>`<button data-page="${p[0]}">${L.pages[p[0]]||p[1]}</button>`).join('')}`}).join('');
 const icons={home:'⌂',read:'📖',plans:'🗓',creator:'＋'};
 $('#mobileNav').innerHTML=['home','read','plans','creator'].map(k=>`<button data-page="${k}"><span>${icons[k]}</span>${L.mobile[k]}</button>`).join('')+`<button data-action="menu"><span>☰</span>${L.mobile.more}</button>`;
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>route(b.dataset.page));
 document.querySelectorAll('[data-action="menu"]').forEach(b=>b.onclick=toggleMenu);
 $('#translationLabel').textContent=L.footer;$('#privacyLabel').textContent=L.privacy;
 $('#language').textContent=L.code;document.documentElement.lang=L.html;document.documentElement.dataset.language=appLanguage;
}
async function setLanguage(code){appLanguage=code==='tl'?'tl':'en';store.set('language',appLanguage);buildNavigation();if(appLanguage==='tl'&&!window.TAGALOG_VERSES){showBibleLoading();try{await window.DM_TAGALOG_BIBLE.load()}catch(e){toast('Hindi ma-load ang Tagalog Bible. Kailangan ng internet sa unang paggamit.')}}render();toast(lang().switched)}

const navGroups=[
 ['Home',[['home','⌂ Home']]],
 ['Read',[['read','📖 Read Bible'],['plans','🗓 Guided Reading Plans'],['search','🔎 Search'],['reading','📅 Chapter Tracker']]],
 ['Study',[['highlights','🖍 Highlights'],['verseNotes','🗒 Verse Notes'],['favourites','★ Favourites'],['myresources','📁 Created Resources'],['devotionals','🌅 Devotionals'],['studies','📚 Bible Studies']]],
 ['Create',[['creator','✨ Quick Create'],['notes','📝 Bible Study Creator'],['prayer','🙏 Prayer Creator'],['sermon','🎤 Sermon Studio'],['kids','🧒 Kids Ministry Studio'],['creatorstudio','✨ Christian Creator Studio'],['socialstudio','🎨 Social Studio'],['reelcreator','🎬 Bible Reel Creator']]],
 ['Ministry',[['kidslibrary','👧 Kids Lessons'],['prayerlibrary','🙏 Prayer Library'],['exhortations','🎤 Exhortations'],['salvation','❤️ Salvation Guide'],['characters','👥 Bible Characters'],['dictionary','📘 Bible Dictionary']]],
 ['More',[['fbpublisher','📅 Facebook Auto Publisher'],['devdashboard','🚀 Development & QA Centre'],['analytics','📊 Ministry Insights'],['backup','🔒 Backup & Restore'],['support','❤️ Support the Ministry'],['feedback','💬 Feedback & Contact'],['help','❓ Help & User Guide'],['about','ℹ️ About & Copyright']]]
]
const pages=navGroups.flatMap(g=>g[1]);
const internalPages=['resource'];
const validPages=new Set([...pages.map(x=>x[0]),...internalPages]);
const mobilePages=[['home','⌂','Home'],['read','📖','Bible'],['plans','🗓','Plans'],['creator','＋','Create']];
let state={page:'home',previousPage:'home',book:store.get('lastBook','John'),chapter:store.get('lastChapter',3),font:store.get('fontSize',19)};
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function splitBibleVerseText(text=''){
 const raw=String(text);const headings=[];const body=raw.replace(/<<\s*([\s\S]*?)\s*>>/g,(_,h)=>{const clean=h.replace(/\s+/g,' ').trim();if(clean)headings.push(clean);return ' '}).replace(/\s+/g,' ').trim();
 return {headings,body};
}
function formatBibleVerseText(text=''){
 const parts=splitBibleVerseText(text);
 const headingHtml=parts.headings.map(h=>`<span class="bible-section-heading">${esc(h)}</span>`).join('');
 const bodyHtml=parts.body?`<span class="bible-verse-body">${esc(parts.body)}</span>`:`<span class="bible-verse-omitted">${ui('Verse text is not included in this translation.','Hindi kasama ang teksto ng talatang ito sa saling ito.')}</span>`;
 return `${headingHtml}${bodyHtml}`;
}
function plainBibleVerseText(text=''){const parts=splitBibleVerseText(text);return [...parts.headings,parts.body].filter(Boolean).join(' ')||ui('Verse text is not included in this translation.','Hindi kasama ang teksto ng talatang ito sa saling ito.')}
const BIBLE_BOOK_ALIASES={
 'Psalm':'Psalms','Ps':'Psalms','Psa':'Psalms',
 'Song of Songs':'Song of Solomon','Songs':'Song of Solomon','Canticles':'Song of Solomon',
 'Revelations':'Revelation','Rev':'Revelation',
 'Jn':'John','Mt':'Matthew','Matt':'Matthew','Mk':'Mark','Lk':'Luke',
 'Gen':'Genesis','Ex':'Exodus','Exod':'Exodus','Lev':'Leviticus','Num':'Numbers','Deut':'Deuteronomy',
 'Josh':'Joshua','Judg':'Judges','1 Sam':'1 Samuel','2 Sam':'2 Samuel','1 Kgs':'1 Kings','2 Kgs':'2 Kings',
 '1 Chr':'1 Chronicles','2 Chr':'2 Chronicles','Neh':'Nehemiah','Esth':'Esther','Prov':'Proverbs',
 'Eccl':'Ecclesiastes','Isa':'Isaiah','Jer':'Jeremiah','Lam':'Lamentations','Ezek':'Ezekiel','Dan':'Daniel',
 'Hos':'Hosea','Obad':'Obadiah','Mic':'Micah','Nah':'Nahum','Hab':'Habakkuk','Zeph':'Zephaniah',
 'Hag':'Haggai','Zech':'Zechariah','Mal':'Malachi','Rom':'Romans','1 Cor':'1 Corinthians',
 '2 Cor':'2 Corinthians','Gal':'Galatians','Eph':'Ephesians','Phil':'Philippians','Col':'Colossians',
 '1 Thess':'1 Thessalonians','2 Thess':'2 Thessalonians','1 Tim':'1 Timothy','2 Tim':'2 Timothy',
 'Phlm':'Philemon','Heb':'Hebrews','Jas':'James','1 Pet':'1 Peter','2 Pet':'2 Peter',
 '1 Jn':'1 John','2 Jn':'2 John','3 Jn':'3 John'
};
function normaliseBibleBookName(name=''){
 const cleaned=String(name).replace(/\./g,'').replace(/\s+/g,' ').trim();
 const direct=B.find(x=>x.name.toLowerCase()===cleaned.toLowerCase());
 if(direct)return direct.name;
 const alias=Object.entries(BIBLE_BOOK_ALIASES).find(([a])=>a.toLowerCase()===cleaned.toLowerCase());
 return alias?alias[1]:'';
}
function bibleReferencePattern(){
 const names=[...B.map(x=>x.name),...Object.keys(BIBLE_BOOK_ALIASES)].sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\ /g,'\\s+'));
 return `(?:${names.join('|')})\\.?\\s+\\d{1,3}(?::\\d{1,3}(?:\\s*[-–—]\\s*(?:\\d{1,3}:)?\\d{1,3})?)?`;
}
function parseBibleReference(input=''){
 const text=String(input).replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
 const re=new RegExp(`(?:^|[^A-Za-z0-9])(${bibleReferencePattern()})`,'i');
 const match=text.match(re);if(!match)return null;
 const ref=match[1].trim();
 const tail=ref.match(/^(.*?)[.]?\s+(\d{1,3})(?::(\d{1,3})(?:\s*-\s*(\d{1,3})(?::(\d{1,3}))?)?)?$/i);if(!tail)return null;
 const bookName=normaliseBibleBookName(tail[1]);if(!bookName)return null;
 const book=B.find(x=>x.name===bookName),chapter=+tail[2],verse=+(tail[3]||1),crossChapter=tail[5]?+tail[4]:chapter,endVerse=+(tail[5]||tail[4]||tail[3]||1);
 if(!book||chapter<1||chapter>book.chapters||verse<1||crossChapter<chapter||crossChapter>book.chapters||(crossChapter===chapter&&endVerse<verse)||endVerse<1)return null;
 const chapterVerses=V.filter(v=>v.b===bookName&&Number(v.c)===chapter);
 if(chapterVerses.length){const max=Math.max(...chapterVerses.map(v=>Number(v.v)||0));if(verse>max)return null} const endChapterVerses=V.filter(v=>v.b===bookName&&Number(v.c)===crossChapter);if(endChapterVerses.length&&endVerse>Math.max(...endChapterVerses.map(v=>Number(v.v)||0)))return null
 return {book:bookName,chapter,verse,endChapter:crossChapter,endVerse,label:ref};
}
function scriptureLink(reference,label=reference){
 const parsed=parseBibleReference(reference);
 return parsed?`<button type="button" class="scripture-link" data-bible-ref="${esc(reference)}" aria-label="Open ${esc(reference)} in Bible reader">${esc(label)}</button>`:esc(label);
}
function scriptureList(items=[]){return items.map(x=>scriptureLink(x)).join(', ')}
function extractBibleReferences(text=''){
 const re=new RegExp(`\\b${bibleReferencePattern()}`,'gi');
 return [...new Set((String(text).match(re)||[]).map(x=>x.replace(/\s+/g,' ').trim()).filter(x=>parseBibleReference(x)))];
}
function customScripturePanel(text,primary=''){
 const refs=[...new Set([primary,...extractBibleReferences(text)].filter(Boolean))];
 if(!refs.length)return '';
 return `<section class="card scripture-index"><h3>📖 ${ui('Scriptures in this resource','Mga Talata sa Materyales')}</h3><p>${ui('Tap any reference to open it in the Bible reader.','Pindutin ang anumang talata upang buksan ito sa Bible reader.')}</p><div class="scripture-chip-list">${refs.map(r=>scriptureLink(r)).join('')}</div></section>`;
}
function renderTextWithScriptureLinks(text=''){
 let out=esc(String(text||''));
 const refs=extractBibleReferences(text).sort((a,b)=>b.length-a.length);
 refs.forEach(ref=>{
  const escapedRef=esc(ref);
  out=out.split(escapedRef).join(`<button type="button" class="scripture-link inline-scripture" data-bible-ref="${esc(ref)}" aria-label="Open ${esc(ref)} in Bible reader">${escapedRef}</button>`);
 });
 return out.replace(/\n/g,'<br>');
}

function presentationBodyHtml(text=''){
 const lines=String(text||'').replace(/\r/g,'').split('\n');
 let html='';
 for(const raw of lines){
  const line=raw.trim();
  if(!line){html+='<div class="presentation-spacer" aria-hidden="true"></div>';continue}
  const linked=renderTextWithScriptureLinks(line);
  if(/^#{1,3}\s+/.test(line)){const clean=line.replace(/^#{1,3}\s+/,'');html+=`<h2>${renderTextWithScriptureLinks(clean)}</h2>`}
  else if(/^[A-Z][A-Z0-9 /&'’()\-]{3,}:?$/.test(line) && line.length<90){html+=`<h2>${linked.replace(/:$/,'')}</h2>`}
  else if(/^\d+[.)]\s+/.test(line)||/^[•*-]\s+/.test(line)){html+=`<p class="presentation-list-item">${linked}</p>`}
  else html+=`<p>${linked}</p>`;
 }
 return html;
}
let activePresentationSnapshot=null;
const PRESENTATION_SESSION_KEY='dm_active_presentation_v94';
const PRESENTATION_RETURN_KEY='presentationReturnPayloadV94';
let pendingPresentationReturn=null;
function savePresentationReturn(snapshot){
 const payload=snapshot?{...snapshot,active:true}:null;
 pendingPresentationReturn=payload;
 store.set(PRESENTATION_RETURN_KEY,payload);
}
function getPresentationReturn(){
 if(pendingPresentationReturn&&pendingPresentationReturn.active)return pendingPresentationReturn;
 const payload=store.get(PRESENTATION_RETURN_KEY,null);
 if(payload&&payload.active){pendingPresentationReturn=payload;return payload}
 return null;
}
function clearPresentationReturn(){pendingPresentationReturn=null;store.set(PRESENTATION_RETURN_KEY,null)}
function savePresentationSnapshot(snapshot){
 activePresentationSnapshot=snapshot?{...snapshot}:null;
 try{if(snapshot)sessionStorage.setItem(PRESENTATION_SESSION_KEY,JSON.stringify(snapshot));else sessionStorage.removeItem(PRESENTATION_SESSION_KEY)}catch{}
}
function getPresentationSnapshot(){
 if(activePresentationSnapshot)return activePresentationSnapshot;
 try{const raw=sessionStorage.getItem(PRESENTATION_SESSION_KEY);if(raw){activePresentationSnapshot=JSON.parse(raw);return activePresentationSnapshot}}catch{}
 return null;
}
function clearPresentationSnapshot(){savePresentationSnapshot(null)}
function presentationOriginPage(explicit=''){
 const valid=new Set(['read','devotionals','exhortations','studies','kidslibrary','sermon','resource','myresources']);
 if(valid.has(explicit))return explicit;
 if(state.page==='resource'&&valid.has(state.previousPage))return state.previousPage;
 return valid.has(state.page)?state.page:'home';
}

function presentationLanguageOptions(language=appLanguage){const selected=language==='tl'?'tl':'en';return `<label class="presentation-language-control"><span>${ui('Language','Wika')}</span><select id="presentationLanguage" aria-label="${ui('Presentation language','Wika ng presentation')}"><option value="en" ${selected==='en'?'selected':''}>English</option><option value="tl" ${selected==='tl'?'selected':''}>Tagalog</option></select></label>`}
function builtInSource(kind,index,language=appLanguage){
 const sets={devotional:window.DEVOTIONALS||DEVOTIONALS,exhortation:window.EXHORTATIONS||EXHORTATIONS,study:window.BIBLE_STUDIES||BIBLE_STUDIES,kids:window.KIDS_LESSONS||KIDS_LESSONS};
 const i=Number(index);
 const raw=Number.isFinite(i)?sets[kind]?.[i]:null;
 if(!raw)return null;
 // Use the same direct bilingual-source method as Devotionals for every built-in presentation.
 const localized=language==='tl'&&raw.tl?{...raw,...raw.tl}:raw;
 const over=resourceOverrides()[kind+':'+i+':'+language];
 return over?{...localized,...over}:localized;
}
function presentationResourceText(kind,x,language=appLanguage){
 if(!x)return {title:'',passage:'',body:''};
 const previousLanguage=appLanguage;
 appLanguage=language==='tl'?'tl':'en';
 const rows=[]; const add=(heading,value)=>{if(value==null||value==='')return;rows.push(String(heading).toUpperCase());if(Array.isArray(value)){value.forEach(v=>rows.push(Array.isArray(v)?v.join(' — '):String(v)))}else rows.push(String(value));rows.push('')};
 if(kind==='devotional'){add(ui('Reflection','Pagninilay'),x.reflection);add(ui('Application','Aplikasyon'),x.application);add(ui('Reflection Questions','Mga Tanong sa Pagninilay'),x.questions);add(ui('Prayer','Panalangin'),x.prayer);add(ui('Memory Verse','Talatang Isasaulo'),x.memory);add(ui('Suggested Reading','Iminungkahing Pagbasa'),x.reading)}
 else if(kind==='exhortation'){add(ui('Introduction','Panimula'),x.intro);add(ui('Teaching Points','Mga Punto ng Pagtuturo'),x.points);add(ui('Supporting Scriptures','Mga Kaugnay na Talata'),x.support);add(ui('Application','Aplikasyon'),x.application);add(ui('Challenge','Hamon'),x.challenge);add(ui('Prayer','Panalangin'),x.prayer)}
 else if(kind==='study'){add(ui('Objective','Layunin'),x.objective);add(ui('Background and Context','Konteksto'),x.background);add(ui('Discussion Questions','Mga Tanong sa Talakayan'),x.questions);add(ui('Leader Notes','Tala para sa Leader'),x.leader_notes);add(ui('Application','Aplikasyon'),x.application);add(ui('Prayer','Panalangin'),x.prayer)}
 else if(kind==='kids'){add(ui('Lesson Truth','Katotohanan ng Aralin'),x.lesson);add(ui('Opening Prayer','Pambungad na Panalangin'),x.opening_prayer);add(ui('Bible Story','Kuwento sa Biblia'),x.story_guide||x.story);add(ui('Teaching Points','Mga Punto ng Pagtuturo'),x.points);add(ui('Questions','Mga Tanong'),x.questions);add(ui('Memory Verse','Talatang Isasaulo'),x.memory);add(ui('Activity','Gawain'),x.activity);add(ui('Closing Prayer','Pangwakas na Panalangin'),x.closing_prayer)}
 const result={title:x.title||'',passage:x.scripture||x.passage||x.main||x.story||'',body:rows.join('\n')};
 appLanguage=previousLanguage;
 return result;
}
function builtInPresentationVariants(kind,index){
 const enSource=builtInSource(kind,index,'en');
 const tlSource=builtInSource(kind,index,'tl');
 return {
  en:enSource?presentationResourceText(kind,enSource,'en'):null,
  tl:tlSource?presentationResourceText(kind,tlSource,'tl'):null
 };
}
async function changePresentationLanguage(code){
 const overlay=document.getElementById('resourcePresentationOverlay');
 const snapshot=overlay?._presentationSnapshot||getPresentationSnapshot()||getPresentationReturn();
 if(!snapshot)return;
 const requestedLanguage=code==='tl'?'tl':'en';
 const previousLanguage=appLanguage;

 // Read Bible needs the actual Tagalog Bible dataset. A brand-new offline copy cannot
 // switch to Tagalog until that dataset has been downloaded once.
 if(requestedLanguage==='tl'&&snapshot.presentationType==='bibleChapter'&&!window.TAGALOG_VERSES){
  try{await window.DM_TAGALOG_BIBLE.load()}
  catch(e){
   if(overlay?.querySelector('#presentationLanguage'))overlay.querySelector('#presentationLanguage').value=previousLanguage;
   toast(previousLanguage==='tl'?'Hindi available offline ang Tagalog Bible sa unang paggamit. Kumonekta sa internet nang isang beses.':'Tagalog Bible is not available in a brand-new offline copy. Connect once to download it.');
   return;
  }
 }

 appLanguage=requestedLanguage;
 store.set('language',appLanguage);
 buildNavigation();
 const scrollTop=overlay?.scrollTop||snapshot.scrollTop||0;
 let next={...snapshot,language:appLanguage,scrollTop};

 if(snapshot.presentationType==='bibleChapter'){
  const verses=activeVerses().filter(v=>(v.b||v.book)===snapshot.book&&Number(v.c||v.chapter)===Number(snapshot.chapter));
  next={...next,title:`${snapshot.book} ${snapshot.chapter}`,html:`<div class="bible-chapter-presentation">${verses.map(v=>`<p class="presentation-bible-verse${Number(snapshot.focusVerse)===Number(v.v)?' reference-focus':''}"><sup>${v.v}</sup> ${formatBibleVerseText(v.x)}</p>`).join('')}</div>`,body:''};
 }else if(snapshot.source?.type==='builtIn'){
  // Rebuild from the exact same bilingual source used by the normal resource page.
  // This avoids stale/copy-only presentation HTML.
  const sets={devotional:window.DEVOTIONALS||DEVOTIONALS,exhortation:window.EXHORTATIONS||EXHORTATIONS,study:window.BIBLE_STUDIES||BIBLE_STUDIES,kids:window.KIDS_LESSONS||KIDS_LESSONS};
  const raw=sets[snapshot.source.kind]?.[Number(snapshot.source.index)];
  if(raw){
   let localized=requestedLanguage==='tl'&&raw.tl?{...raw,...raw.tl}:{...raw};
   const langOverride=resourceOverrides()[snapshot.source.kind+':'+Number(snapshot.source.index)+':'+requestedLanguage];
   const generalOverride=resourceOverrides()[resourceKey(snapshot.source.kind,Number(snapshot.source.index))];
   if(generalOverride)localized={...localized,...generalOverride};
   if(langOverride)localized={...localized,...langOverride};
   const data=presentationResourceText(snapshot.source.kind,localized,requestedLanguage);
   next={...next,title:data.title||localized.title||'',passage:data.passage||localized.scripture||localized.passage||localized.main||localized.story||'',body:data.body||'',html:'',image:snapshot.source.kind==='kids'?(localized.image||snapshot.image||''):snapshot.image};
  }
 }else if(snapshot.variants?.[requestedLanguage]){
  const variant=snapshot.variants[requestedLanguage];
  next={...next,title:variant.title||'',passage:variant.passage||'',body:variant.body||'',html:variant.html||'',image:variant.image||snapshot.image||''};
 }else{
  // Custom resources and Sermon Studio have only the language the user wrote.
  // Keep the authored text visible and change the presentation controls/Bible language.
  const authoredNote=snapshot.source?.type==='sermonStudio'||snapshot.source?.type==='savedSermon'
   ? (requestedLanguage==='tl'?'\n\nPAALALA: Ang sermon text ay nananatili sa wikang ginamit noong ito ay ginawa. Gumawa o mag-save ng hiwalay na Tagalog sermon para sa buong Tagalog presentation.':'\n\nNOTE: The sermon text remains in the language used when it was created. Create or save a separate English sermon for a fully English presentation.')
   : '';
  next={...next,title:snapshot.title||'',passage:snapshot.passage||'',body:(snapshot.body||'')+authoredNote,html:snapshot.html||''};
 }
 startResourcePresentation(next);
}

function startResourcePresentation({title='',passage='',body='',image='',html='',restoreScroll=0,originPage='',source=null,presentationType='',book='',chapter=0,focusVerse=0,language=appLanguage,variants=null}){
 document.getElementById('resourcePresentationOverlay')?.remove();
 const initialSnapshot={title,passage,body,image,html,scrollTop:Number(restoreScroll)||0,originPage:presentationOriginPage(originPage),source,presentationType,book,chapter,focusVerse,language,variants};
 savePresentationSnapshot(initialSnapshot);
 pendingPresentationReturn={...initialSnapshot,active:true};
 const overlay=document.createElement('section');
 overlay.id='resourcePresentationOverlay';
 overlay.className='resource-presentation-overlay';
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay._presentationSnapshot=initialSnapshot;
 overlay.dataset.presentationActive='true';
 overlay.innerHTML=`<div class="presentation-toolbar">${presentationLanguageOptions(language)}<button type="button" class="primary" id="exitResourcePresentation">✕ ${ui('Exit Presentation','Isara ang Presentation')}</button></div><article class="presentation-document">${image?`<img class="presentation-hero" src="${esc(image)}" alt="${esc(title||ui('Lesson illustration','Larawan ng aralin'))}">`:''}${title?`<h1>${esc(title)}</h1>`:''}${passage?`<div class="presentation-passage">${scriptureLink(passage)}</div>`:''}<div class="presentation-content">${html||presentationBodyHtml(body)}</div></article>`;
 document.body.appendChild(overlay);
 document.body.classList.add('resource-presentation-active');
 const close=()=>{const destination=initialSnapshot.originPage||'home';overlay.remove();document.body.classList.remove('resource-presentation-active');clearPresentationSnapshot();clearPresentationReturn();store.set('returnToPresentation',false);store.set('returnToResource',false);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});route(destination)};
 overlay.querySelector('#exitResourcePresentation').onclick=close;overlay.querySelector('#presentationLanguage').onchange=e=>changePresentationLanguage(e.target.value);
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 makePresentationScripturesClickable(overlay);
 try{if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})}catch{}
 overlay.scrollTop=Number(restoreScroll)||0;
}

function userLibraryKey(kind){return ({study:'userBibleStudies',prayer:'userPrayers',kids:'userKidsLessons',devotional:'userDevotionals',exhortation:'userExhortations',sermon:'sermons'})[kind]||('user'+kind)}
function userLibrary(kind){return store.get(userLibraryKey(kind),[])}
function normaliseResourceText(value=''){return String(value).toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function resourceSignature(item={}){const title=normaliseResourceText(item.title),scripture=normaliseResourceText(item.scripture||item.passage||item.main),body=normaliseResourceText(item.body||item.text).slice(0,180);return {title,scripture,body}}
function findSimilarResource(kind,item){const incoming=resourceSignature(item);return userLibrary(kind).find(existing=>{const current=resourceSignature(existing);if(incoming.title&&current.title===incoming.title)return true;if(incoming.title&&incoming.scripture&&current.title===incoming.title&&current.scripture===incoming.scripture)return true;return incoming.body.length>80&&current.body.length>80&&incoming.body===current.body})}
function saveUserLibrary(kind,item){let a=userLibrary(kind),similar=findSimilarResource(kind,item);if(similar&&!confirm(ui(`A similar saved resource already exists: “${similar.title||'Untitled'}”. Save another copy anyway?`,`May kahawig nang naka-save na resource: “${similar.title||'Walang pamagat'}”. Mag-save pa rin ng isa pang kopya?`)))return null;const saved={...item,id:item.id||Date.now(),kind,created:item.created||new Date().toLocaleString()};a.unshift(saved);store.set(userLibraryKey(kind),a);return saved}
function updateUserLibrary(kind,id,data){let a=userLibrary(kind),i=a.findIndex(x=>String(x.id)===String(id));if(i<0)return false;a[i]={...a[i],...data,modified:new Date().toLocaleString()};store.set(userLibraryKey(kind),a);return true}
function deleteUserLibrary(kind,id){let a=userLibrary(kind).filter(x=>String(x.id)!==String(id));store.set(userLibraryKey(kind),a)}
function openUserResource(kind,id){store.set('openResource',{kind,custom:true,id});route('resource')}

function resourceKey(kind,index){return kind+':'+index+':'+appLanguage}
function resourceOverrides(){return store.get('resourceOverrides',{})}
function resourceDeleted(){return store.get('resourceDeleted',{})}
function effectiveResource(kind,index,raw){let base=localizeResource(raw),over=resourceOverrides()[resourceKey(kind,index)];return over?{...base,...over}:base}
function isResourceDeleted(kind,index){return !!resourceDeleted()[kind+':'+index]}
function saveResourceOverride(kind,index,data){let all=resourceOverrides();all[resourceKey(kind,index)]=data;store.set('resourceOverrides',all)}
function resetResourceOverride(kind,index){let all=resourceOverrides();delete all[resourceKey(kind,index)];store.set('resourceOverrides',all)}
function hideResource(kind,index){let all=resourceDeleted();all[kind+':'+index]=true;store.set('resourceDeleted',all)}
function restoreResource(kind,index){let all=resourceDeleted();delete all[kind+':'+index];store.set('resourceDeleted',all)}
function lines(v){return String(v||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)}
function pairs(v){return lines(v).map(x=>{let a=x.split('|');return [a.shift().trim(),a.join('|').trim()]})}
function resourceEditor(kind,x){let f=[];const input=(id,label,val,wide='')=>`<label class="field-label ${wide}">${label}<input id="ed_${id}" value="${esc(val||'')}"></label>`;const ta=(id,label,val,wide='wide')=>`<label class="field-label ${wide}">${label}<textarea id="ed_${id}" class="resource-edit-area">${esc(val||'')}</textarea></label>`;
 if(kind==='devotional')f=[input('title',ui('Title','Pamagat'),x.title,'wide'),input('theme',ui('Theme','Tema'),x.theme),input('scripture',ui('Main Scripture','Pangunahing Talata'),x.scripture),ta('reflection',ui('Reflection','Pagninilay'),x.reflection),ta('application',ui('Application','Aplikasyon'),x.application),ta('questions',ui('Reflection Questions — one per line','Mga Tanong — isa bawat linya'),(x.questions||[]).join('\n')),ta('prayer',ui('Prayer','Panalangin'),x.prayer),input('memory',ui('Memory Verse','Talatang Isasaulo'),x.memory),input('reading',ui('Suggested Reading','Iminungkahing Pagbasa'),x.reading)];
 if(kind==='exhortation')f=[input('title',ui('Title','Pamagat'),x.title,'wide'),input('category',ui('Category','Kategorya'),x.category),input('main',ui('Main Scripture','Pangunahing Talata'),x.main),ta('intro',ui('Introduction','Panimula'),x.intro),ta('points',ui('Teaching Points — Heading | Explanation, one per line','Teaching Points — Heading | Paliwanag, isa bawat linya'),(x.points||[]).map(a=>a.join(' | ')).join('\n')),ta('support',ui('Supporting Scriptures — one per line','Mga Kaugnay na Talata — isa bawat linya'),(x.support||[]).join('\n')),ta('application',ui('Application','Aplikasyon'),x.application),ta('challenge',ui('Challenge','Hamon'),x.challenge),ta('prayer',ui('Prayer','Panalangin'),x.prayer)];
 if(kind==='study')f=[input('title',ui('Title','Pamagat'),x.title,'wide'),input('type',ui('Study Type','Uri ng Pag-aaral'),x.type),input('passage',ui('Main Passage','Pangunahing Talata'),x.passage),ta('objective',ui('Objective','Layunin'),x.objective),ta('background',ui('Background and Context','Konteksto'),x.background),ta('questions',ui('Discussion Questions — one per line','Mga Tanong — isa bawat linya'),(x.questions||[]).join('\n')),ta('leader_notes',ui('Leader Notes','Tala para sa Leader'),x.leader_notes),ta('application',ui('Application','Aplikasyon'),x.application),ta('prayer',ui('Prayer','Panalangin'),x.prayer)];
 if(kind==='kids')f=[input('title',ui('Lesson Title','Pamagat ng Aralin'),x.title,'wide'),input('age',ui('Age Group','Edad'),x.age),input('story',ui('Bible Story Passage','Talata ng Kuwento'),x.story),input('image',ui('Picture Path','Path ng Larawan'),x.image,'wide'),ta('opening',ui('Opening Prayer','Pambungad na Panalangin'),x.opening),ta('lesson',ui('Teaching Lesson','Aralin'),x.lesson),ta('questions',ui('Questions — one per line','Mga Tanong — isa bawat linya'),(x.questions||[]).join('\n')),ta('activity',ui('Activity','Gawain'),x.activity),ta('craft','Craft',x.craft),input('memory',ui('Memory Verse','Talatang Isasaulo'),x.memory,'wide'),ta('closing',ui('Closing Prayer','Pangwakas na Panalangin'),x.closing)];
 if(kind==='prayer')f=[input('title',ui('Prayer Title','Pamagat ng Panalangin'),x.title,'wide'),input('category',ui('Category','Kategorya'),x.category,'wide'),ta('text',ui('Prayer','Panalangin'),x.text)];
 return `<div id="resourceEditor" class="card resource-editor"><h2>✏️ ${ui('Edit Resource','I-edit ang Materyales')}</h2><div class="form-grid">${f.join('')}</div><div class="creator-buttons"><button class="primary" id="saveResourceEdit">${ui('Save Changes','I-save ang Pagbabago')}</button><button class="ghost" id="cancelResourceEdit">${ui('Cancel','Kanselahin')}</button></div><div class="notice small-note">${ui('Your edits are saved only in this browser. The original built-in resource remains available through Restore Original.','Sa browser lamang mase-save ang edits. Maibabalik ang original gamit ang Restore Original.')}</div></div>`
}
function collectResourceEdit(kind){let g=id=>$('#ed_'+id)?.value.trim()||'',o={};
 if(kind==='devotional')o={title:g('title'),theme:g('theme'),scripture:g('scripture'),reflection:g('reflection'),application:g('application'),questions:lines(g('questions')),prayer:g('prayer'),memory:g('memory'),reading:g('reading')};
 if(kind==='exhortation')o={title:g('title'),category:g('category'),main:g('main'),intro:g('intro'),points:pairs(g('points')),support:lines(g('support')),application:g('application'),challenge:g('challenge'),prayer:g('prayer')};
 if(kind==='study')o={title:g('title'),type:g('type'),passage:g('passage'),objective:g('objective'),background:g('background'),questions:lines(g('questions')),leader_notes:g('leader_notes'),application:g('application'),prayer:g('prayer')};
 if(kind==='kids')o={title:g('title'),age:g('age'),story:g('story'),image:g('image'),opening:g('opening'),lesson:g('lesson'),questions:lines(g('questions')),activity:g('activity'),craft:g('craft'),memory:g('memory'),closing:g('closing')};
 if(kind==='prayer')o={title:g('title'),category:g('category'),text:g('text')};return o}

function openBibleReference(reference,sourceElement=null){
 const r=parseBibleReference(reference);if(!r)return toast('Bible reference was not recognised');
 const sourceOverlay=sourceElement?.closest?.('#resourcePresentationOverlay');
 const presentationOverlay=sourceOverlay||document.getElementById('resourcePresentationOverlay');
 const attachedSnapshot=presentationOverlay?._presentationSnapshot||null;
 const savedPresentation=attachedSnapshot||getPresentationReturn()||getPresentationSnapshot()||pendingPresentationReturn;
 const explicitlyFromPresentation=!!sourceOverlay||sourceElement?.dataset?.fromPresentation==='true'||document.body.classList.contains('resource-presentation-active')||!!presentationOverlay||!!pendingPresentationReturn;
 if(explicitlyFromPresentation&&savedPresentation){
  const payload={...savedPresentation,scrollTop:presentationOverlay?.scrollTop||savedPresentation.scrollTop||0,active:true};
  savePresentationSnapshot(payload);
  savePresentationReturn(payload);
  store.set('returnToPresentation',true);
  store.set('returnToResource',false);
 }else{
  clearPresentationReturn();
  store.set('returnToPresentation',false);
  store.set('returnToResource',true);
 }
 document.getElementById('resourcePresentationOverlay')?.remove();
 document.body.classList.remove('resource-presentation-active');
 document.getElementById('exitResourcePresentation')?.remove();
 state.book=r.book;state.chapter=r.chapter;state.focusVerse=r.verse;route('read');
}
function returnToPresentation(){
 const snapshot=getPresentationReturn()||getPresentationSnapshot();
 store.set('returnToPresentation',false);
 store.set('returnToResource',false);
 state.focusVerse=null;
 if(!snapshot){route('resource');return}
 clearPresentationReturn();
 startResourcePresentation({...snapshot,restoreScroll:snapshot.scrollTop||0});
}
function exitPresentationKeepBible(){
 const snapshot=getPresentationReturn()||getPresentationSnapshot();
 const destination=snapshot?.originPage||'home';
 document.getElementById('resourcePresentationOverlay')?.remove();
 document.getElementById('exitResourcePresentation')?.remove();
 document.body.classList.remove('resource-presentation-active');
 clearPresentationSnapshot();
 clearPresentationReturn();
 store.set('returnToPresentation',false);
 store.set('returnToResource',false);
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 route(destination);
}
function wireScriptureLinks(root=document){
 root.querySelectorAll('[data-bible-ref]').forEach(el=>{
  el.type='button';
  el.style.pointerEvents='auto';
  if(el.closest('#resourcePresentationOverlay'))el.dataset.fromPresentation='true';
  el.onclick=e=>{e.preventDefault();e.stopPropagation();openBibleReference(el.dataset.bibleRef,el)};
 });
}
function makePresentationScripturesClickable(root){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{
  const parent=node.parentElement;
  if(!parent||parent.closest('button,a,script,style,textarea,input'))return;
  const text=node.nodeValue||'',refs=extractBibleReferences(text);
  if(!refs.length)return;
  let cursor=0,frag=document.createDocumentFragment();
  const matches=[];
  refs.forEach(ref=>{let start=text.indexOf(ref,cursor);if(start<0)start=text.indexOf(ref);if(start>=0)matches.push({ref,start,end:start+ref.length})});
  matches.sort((a,b)=>a.start-b.start);
  matches.forEach(m=>{if(m.start<cursor)return;if(m.start>cursor)frag.appendChild(document.createTextNode(text.slice(cursor,m.start)));const b=document.createElement('button');b.type='button';b.className='scripture-link inline-scripture';b.dataset.bibleRef=m.ref;b.textContent=m.ref;b.setAttribute('aria-label','Open '+m.ref+' in Bible reader');frag.appendChild(b);cursor=m.end});
  if(cursor<text.length)frag.appendChild(document.createTextNode(text.slice(cursor)));
  if(matches.length)node.replaceWith(frag);
 });
 wireScriptureLinks(root);
}
// Capture presentation context before any scripture button handler runs.
// This is deliberately independent of GitHub, service workers, and online status.
document.addEventListener('click',e=>{
 const target=e.target?.closest?.('[data-bible-ref]');
 if(!target)return;
 const overlay=document.getElementById('resourcePresentationOverlay');
 if(!overlay&&!document.body.classList.contains('resource-presentation-active'))return;
 const snapshot=overlay?._presentationSnapshot||getPresentationSnapshot()||pendingPresentationReturn;
 if(!snapshot)return;
 const payload={...snapshot,scrollTop:overlay?.scrollTop||snapshot.scrollTop||0,active:true};
 target.dataset.fromPresentation='true';
 savePresentationSnapshot(payload);
 savePresentationReturn(payload);
 store.set('returnToPresentation',true);
 store.set('returnToResource',false);
},true);
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove('show'),1800)}
function closeMenu(){const side=$('#sidebar'),overlay=$('#sidebarOverlay'),menu=$('#menu');side.classList.remove('open');overlay.classList.remove('open');document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')}
function openMenu(){const side=$('#sidebar'),overlay=$('#sidebarOverlay'),menu=$('#menu');side.classList.add('open');overlay.classList.add('open');document.body.classList.add('menu-open');menu.setAttribute('aria-expanded','true')}
function toggleMenu(){const open=$('#sidebar').classList.contains('open');open?closeMenu():openMenu()}


const DEV_BUILD={version:'1.12.3-dev',sprint:'Production Readiness & QA',built:'1 August 2026',repository:'de-mayo-bible-study-dev'};
const QA_FEATURES=[
 ['dashboard','Clean Personal Dashboard','high'],['duplicates','Duplicate-content protection','high'],['mobile','Mobile and tablet validation','high'],['offline','Offline and update validation','high'],['creators','Creator save/edit/delete','critical'],['backup','Backup and restore','critical'],['performance','Performance and Core Web Vitals','medium'],['seo','Production SEO and PWA checks','medium']
];
const QA_DEVICES=[['chrome','Desktop Chrome'],['safari','Desktop Safari'],['edge','Desktop Edge'],['firefox','Desktop Firefox'],['iphone13','iPhone 13 Pro'],['smallphone','Small phone / iPhone SE'],['android','Android phone'],['ipad','iPad portrait'],['tabletland','Tablet landscape']];
const QA_STATUS=['not-tested','in-progress','passed','failed'];
function qaData(){return store.get('qaCentreV2',{features:{},devices:{},bugs:[],notes:'',release:'1.13.0',lastTested:''})}
function qaSave(d){d.lastTested=new Date().toISOString();store.set('qaCentreV2',d)}
function qaStatusLabel(v){return {'not-tested':'Not tested','in-progress':'In progress','passed':'Passed','failed':'Failed'}[v]||'Not tested'}
function qaStatusIcon(v){return {'not-tested':'⚪','in-progress':'🟡','passed':'🟢','failed':'🔴'}[v]||'⚪'}
function qaSelect(scope,id,value){const d=qaData();d[scope][id]=value;qaSave(d);developmentDashboard()}
function qaReadiness(d){
 const req=[...QA_FEATURES.map(x=>d.features[x[0]]||'not-tested'),...QA_DEVICES.map(x=>d.devices[x[0]]||'not-tested')];
 const weights={'not-tested':0,'in-progress':.5,'passed':1,'failed':0};
 const score=Math.round(req.reduce((a,v)=>a+(weights[v]||0),0)/Math.max(1,req.length)*100);
 const criticalFailed=QA_FEATURES.some(([id,,p])=>p==='critical'&&d.features[id]!=='passed');
 const openCritical=d.bugs.some(b=>b.severity==='critical'&&b.status!=='closed');
 return {score,ready:score>=95&&!criticalFailed&&!openCritical,criticalFailed,openCritical};
}
function qaStatusControl(scope,id,current){return `<select class="qa-status-select qa-${current||'not-tested'}" data-qa-scope="${scope}" data-qa-id="${id}">${QA_STATUS.map(v=>`<option value="${v}" ${v===(current||'not-tested')?'selected':''}>${qaStatusIcon(v)} ${qaStatusLabel(v)}</option>`).join('')}</select>`}
function developmentDashboard(){
 title(ui('Development & QA Centre','Development & QA Centre'),ui('Test, record issues, and decide when a build is ready for production.','Subukan, itala ang issues, at alamin kung handa na sa production.'));
 const d=qaData(),r=qaReadiness(d),open=d.bugs.filter(b=>b.status!=='closed'),critical=open.filter(b=>b.severity==='critical').length;
 const featureRows=QA_FEATURES.map(([id,label,priority])=>`<div class="qa-row"><div><b>${esc(label)}</b><small>Priority: ${priority.toUpperCase()}</small></div>${qaStatusControl('features',id,d.features[id])}</div>`).join('');
 const deviceRows=QA_DEVICES.map(([id,label])=>`<div class="qa-row"><div><b>${esc(label)}</b><small>Layout, navigation, and touch controls</small></div>${qaStatusControl('devices',id,d.devices[id])}</div>`).join('');
 const bugs=d.bugs.map((b,i)=>`<article class="qa-bug qa-severity-${esc(b.severity)}"><div><b>${esc(b.title)}</b><small>${esc(b.severity.toUpperCase())} · ${esc(b.status)}</small></div><button class="ghost" data-close-bug="${i}">${b.status==='closed'?'Reopen':'Close'}</button></article>`).join('')||'<p class="muted">No bugs recorded yet.</p>';
 view.innerHTML=`<section class="card qa-hero"><div><span class="pill">DEVELOPMENT ONLY</span><h2>🚀 Mission Control</h2><p>Current build: <b>${DEV_BUILD.version}</b> · Target release: <b>${esc(d.release)}</b></p><div class="qa-meter"><i style="width:${r.score}%"></i></div><strong class="qa-score">${r.score}% — ${r.ready?'READY FOR PRODUCTION':'NOT READY'}</strong></div><button class="ghost" id="qaRefresh">↻ Refresh</button></section>
 <section class="qa-summary"><article class="card"><span>Open bugs</span><b>${open.length}</b></article><article class="card"><span>Critical blockers</span><b>${critical}</b></article><article class="card"><span>Saved data keys</span><b>${DM_DATA_GUARD.userKeys().length}</b></article><article class="card"><span>Last tested</span><b>${d.lastTested?new Date(d.lastTested).toLocaleDateString():'Not yet'}</b></article></section>
 <section class="qa-grid"><article class="card"><h3>📋 Production checklist</h3><p>Set each item to Passed only after you have actually tested it.</p><div class="qa-list">${featureRows}</div></article>
 <article class="card"><h3>📱 Device testing</h3><p>Test portrait and landscape where available.</p><div class="qa-list">${deviceRows}</div></article>
 <article class="card"><h3>🐞 Bug tracker</h3><div class="qa-add-bug"><input id="qaBugTitle" placeholder="Bug title"><select id="qaBugSeverity"><option value="critical">Critical</option><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select><button class="primary" id="qaAddBug">Add bug</button></div><div class="qa-bugs">${bugs}</div></article>
 <article class="card"><h3>📝 QA notes</h3><textarea id="qaNotes" class="dev-notes" placeholder="Testing notes, steps to reproduce, or release comments...">${esc(d.notes||'')}</textarea><div class="resource-buttons"><button class="primary" id="qaSaveNotes">Save notes</button><button class="ghost" id="qaExport">Export QA report</button></div><hr><label>Target production version<input id="qaRelease" value="${esc(d.release)}"></label><button class="danger" id="qaReset">Reset QA Centre</button></article></section>
 <section class="card qa-gate ${r.ready?'qa-ready':'qa-blocked'}"><h3>${r.ready?'✅ Production gate passed':'🚫 Production blocked'}</h3><p>${r.ready?'All required checks have passed. Create a pull request from develop to main.':'Complete all critical checks, close critical bugs, and reach at least 95% readiness.'}</p><div class="dev-links"><a class="ghost button-link" href="https://github.com/romerdemayo/de-mayo-bible-study-dev/issues" target="_blank" rel="noopener">GitHub Issues ↗</a><button class="ghost" onclick="route('backup')">🔒 Backup & Restore</button><button class="ghost" onclick="route('analytics')">📊 Ministry Insights</button></div></section>`;
 document.querySelectorAll('[data-qa-scope]').forEach(x=>x.onchange=()=>qaSelect(x.dataset.qaScope,x.dataset.qaId,x.value));
 $('#qaRefresh').onclick=developmentDashboard;
 $('#qaSaveNotes').onclick=()=>{const x=qaData();x.notes=$('#qaNotes').value;x.release=$('#qaRelease').value.trim()||'1.13.0';qaSave(x);toast('QA notes saved');developmentDashboard()};
 $('#qaAddBug').onclick=()=>{const title=$('#qaBugTitle').value.trim();if(!title)return toast('Enter a bug title');const x=qaData();x.bugs.unshift({title,severity:$('#qaBugSeverity').value,status:'open',created:new Date().toISOString()});qaSave(x);developmentDashboard()};
 document.querySelectorAll('[data-close-bug]').forEach(b=>b.onclick=()=>{const x=qaData(),bug=x.bugs[+b.dataset.closeBug];bug.status=bug.status==='closed'?'open':'closed';qaSave(x);developmentDashboard()});
 $('#qaExport').onclick=()=>{const x=qaData(),rr=qaReadiness(x);const blob=new Blob([JSON.stringify({build:DEV_BUILD,readiness:rr,...x},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`de-mayo-qa-${DEV_BUILD.version}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
 $('#qaReset').onclick=()=>{if(confirm('Reset all QA statuses, bugs, and notes on this device?')){store.set('qaCentreV2',{features:{},devices:{},bugs:[],notes:'',release:'1.13.0',lastTested:''});developmentDashboard()}};
}

const ANALYTICS_KEY='ministryInsightsV107';
function analyticsData(){return store.get(ANALYTICS_KEY,{started:new Date().toISOString(),pageViews:{},daily:{},features:{},chapters:{},sessions:0,lastSession:''})}
function saveAnalytics(a){store.set(ANALYTICS_KEY,a)}
function analyticsDay(){return new Date().toISOString().slice(0,10)}
function recordInsight(type,name){
 const a=analyticsData(),day=analyticsDay();
 a.daily[day]=(a.daily[day]||0)+1;
 if(type==='page')a.pageViews[name]=(a.pageViews[name]||0)+1;
 if(type==='feature')a.features[name]=(a.features[name]||0)+1;
 if(type==='chapter')a.chapters[name]=(a.chapters[name]||0)+1;
 const sessionKey=day+'-'+Math.floor(Date.now()/1800000);
 if(a.lastSession!==sessionKey){a.sessions=(a.sessions||0)+1;a.lastSession=sessionKey}
 saveAnalytics(a);
}
function topInsight(obj,limit=6){return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,limit)}
function insightBars(items,total){return items.length?items.map(([name,count])=>`<div class="insight-row"><div><b>${esc(name)}</b><span>${count}</span></div><div class="insight-bar"><i style="width:${Math.max(5,Math.round(count/Math.max(1,total)*100))}%"></i></div></div>`).join(''):`<p class="empty-state">${ui('No activity recorded on this device yet.','Wala pang naitalang activity sa device na ito.')}</p>`}
function ministryInsights(){
 title(ui('Ministry Insights','Ministry Insights'),ui('Private activity dashboard for this device, with quick access to Cloudflare Web Analytics.','Pribadong activity dashboard para sa device na ito, kasama ang mabilis na access sa Cloudflare Web Analytics.'));
 const a=analyticsData(),views=Object.values(a.pageViews||{}).reduce((x,y)=>x+y,0),features=Object.values(a.features||{}).reduce((x,y)=>x+y,0),chapters=Object.values(a.chapters||{}).reduce((x,y)=>x+y,0);
 const days=Object.entries(a.daily||{}).sort().slice(-7),maxDay=Math.max(1,...days.map(x=>x[1]));
 const dayBars=days.length?days.map(([d,n])=>`<div class="day-column"><b>${n}</b><i style="height:${Math.max(8,Math.round(n/maxDay*100))}%"></i><span>${new Date(d+'T00:00:00').toLocaleDateString('en-NZ',{weekday:'short'})}</span></div>`).join(''):`<p class="empty-state">${ui('Your seven-day chart will appear after the app is used.','Lalabas ang seven-day chart kapag nagamit na ang app.')}</p>`;
 view.innerHTML=`<section class="insights-notice card"><div><span class="pill">PRIVATE ON THIS DEVICE</span><h2>📊 ${ui('Ministry Insights','Ministry Insights')}</h2><p>${ui('This dashboard shows anonymous feature activity saved only in this browser. Cloudflare provides the overall visitors, countries, devices, and page views for your public website.','Ipinapakita ng dashboard na ito ang anonymous feature activity na naka-save lamang sa browser na ito. Ang Cloudflare ang nagpapakita ng kabuuang visitors, countries, devices, at page views ng website.')}</p></div><a class="primary button-link" href="https://dash.cloudflare.com/" target="_blank" rel="noopener">☁️ ${ui('Open Cloudflare Analytics','Buksan ang Cloudflare Analytics')}</a></section>
 <section class="insight-stats"><article class="card"><span>👁️</span><b>${views}</b><small>${ui('app page opens','app page opens')}</small></article><article class="card"><span>⚡</span><b>${features}</b><small>${ui('feature uses','feature uses')}</small></article><article class="card"><span>📖</span><b>${chapters}</b><small>${ui('chapters opened','chapters opened')}</small></article><article class="card"><span>🕒</span><b>${a.sessions||0}</b><small>${ui('local sessions','local sessions')}</small></article></section>
 <section class="insight-grid"><article class="card"><h3>${ui('Last 7 days','Huling 7 araw')}</h3><div class="day-chart">${dayBars}</div></article><article class="card"><h3>${ui('Most-used sections','Pinakaginagamit na sections')}</h3>${insightBars(topInsight(a.pageViews),Math.max(1,views))}</article><article class="card"><h3>${ui('Popular features','Popular na features')}</h3>${insightBars(topInsight(a.features),Math.max(1,features))}</article><article class="card"><h3>${ui('Most-opened chapters','Pinakamadalas buksang chapters')}</h3>${insightBars(topInsight(a.chapters),Math.max(1,chapters))}</article></section>
 <section class="card privacy-panel"><h3>🔒 ${ui('What stays private','Ano ang nananatiling pribado')}</h3><p>${ui('No names, emails, prayers, notes, favourites, or verse text are recorded here. This local dashboard cannot show all visitors across different devices; use the Cloudflare button above for the complete website totals.','Walang pangalan, email, panalangin, notes, favourites, o verse text na nire-record dito. Hindi makikita ng local dashboard na ito ang lahat ng visitors mula sa iba’t ibang device; gamitin ang Cloudflare button sa itaas para sa kumpletong website totals.')}</p><button class="ghost" id="resetInsights">${ui('Reset this device’s insights','I-reset ang insights ng device na ito')}</button></section>`;
 $('#resetInsights').onclick=()=>{if(confirm(ui('Reset the anonymous activity saved on this device?','I-reset ang anonymous activity na naka-save sa device na ito?'))){localStorage.removeItem('dm_'+ANALYTICS_KEY);ministryInsights();toast(ui('Insights reset','Na-reset ang insights'))}};
}

const SOCIAL_STUDIO_KEY='socialStudioDrafts';
const SOCIAL_THEMES={
 sunrise:{name:'Sunrise',colors:['#18392f','#f3b766','#f9e8bd'],accent:'#fff3cf'},
 ocean:{name:'Ocean',colors:['#083b66','#168aad','#bde0fe'],accent:'#e7f7ff'},
 forest:{name:'Forest',colors:['#0b3d2e','#3a7d44','#d8edc8'],accent:'#ecf8e7'},
 night:{name:'Night Prayer',colors:['#111827','#312e81','#7c3aed'],accent:'#f3e8ff'},
 rose:{name:'Soft Rose',colors:['#7f1d4e','#e9a6b8','#fbe7ef'],accent:'#fff4f8'},
 minimal:{name:'Minimal',colors:['#f5f1e8','#ffffff','#e8efe8'],accent:'#173f32'}
};
const SOCIAL_SPIRITUAL_TOPICS={
 hope:{name:'Hope',keywords:['hope','trust','strength','fear','courage'],prayers:{en:['Heavenly Father, when the road ahead feels uncertain, anchor my heart in Your unfailing promises. Replace fear with faith, weakness with Your strength, and confusion with the peace of Your presence. Help me walk today with courage, trusting that You are already before me. In Jesus’ name, Amen.','Lord, lift my eyes above my circumstances and remind me that my hope is found in You alone. Renew my mind through Your Word, strengthen my weary heart, and help me wait with faith for Your perfect timing. May my life reflect quiet confidence in Your goodness. Amen.'],tl:['Ama naming Diyos, kapag hindi malinaw ang aking daraanan, ituon Mo ang puso ko sa Iyong mga pangakong hindi nagbabago. Palitan Mo ang takot ng pananampalataya, ang kahinaan ng Iyong lakas, at ang pag-aalala ng kapayapaang mula sa Iyo. Sa pangalan ni Jesus, Amen.']}},
 guidance:{name:'Guidance',keywords:['way','path','wisdom','guide','understanding'],prayers:{en:['Father, I surrender my plans, decisions, and desires to You. Give me wisdom that is pure, patient, and obedient to Your Word. Close the doors that would lead me away from Your will, and give me courage to walk through the doors You open. Direct my steps for Your glory. In Jesus’ name, Amen.'],tl:['Panginoon, isinusuko ko sa Iyo ang aking mga plano at desisyon. Bigyan Mo ako ng karunungang naaayon sa Iyong Salita. Isara Mo ang mga pintuang maglalayo sa akin sa Iyong kalooban at akayin Mo ako sa landas na nagbibigay-luwalhati sa Iyo. Amen.']}},
 peace:{name:'Peace',keywords:['peace','anxious','anxiety','rest','trouble'],prayers:{en:['Prince of Peace, quiet the noise within me. Guard my heart and mind from fear, and teach me to bring every burden to You in prayer. Help me rest in Your sovereignty, remember Your faithfulness, and receive the peace that circumstances cannot give or take away. Amen.'],tl:['Diyos ng kapayapaan, patahimikin Mo ang aking puso at isip. Tulungan Mo akong ilapit sa Iyo ang bawat alalahanin at magtiwala sa Iyong katapatan. Punuin Mo ako ng kapayapaang hindi kayang ibigay o alisin ng mundo. Amen.']}},
 healing:{name:'Healing',keywords:['heal','healing','sick','restore','comfort'],prayers:{en:['Compassionate Lord, You see every pain that words cannot fully express. Bring healing according to Your wisdom and mercy. Strengthen the body, comfort the heart, guide every person providing care, and let Your presence be near in every moment. Whatever the outcome, keep our faith rooted in Christ. Amen.'],tl:['Maawaing Panginoon, nakikita Mo ang bawat sakit at luha. Magdala Ka ng kagalingan ayon sa Iyong karunungan at awa. Palakasin Mo ang katawan, aliwin ang puso, at ipadama Mo ang Iyong presensya sa bawat sandali. Amen.']}},
 provision:{name:'Provision',keywords:['provide','need','bread','seek','riches'],prayers:{en:['Faithful Provider, You know every need before I speak it. Give me daily bread, wisdom to manage what You entrust to me, diligence in my responsibilities, and freedom from fear. Open the right opportunities and teach me contentment while I wait. May every provision lead me to gratitude and generosity. Amen.'],tl:['Tapat na Tagapaglaan, alam Mo ang bawat pangangailangan ko. Bigyan Mo ako ng pang-araw-araw na pagkain, karunungan sa paghawak ng Iyong ipinagkatiwala, at sipag sa aking mga tungkulin. Buksan Mo ang tamang oportunidad at turuan Mo akong magtiwala habang naghihintay. Amen.']}},
 gratitude:{name:'Gratitude',keywords:['thank','praise','joy','rejoice','good'],prayers:{en:['Gracious God, thank You for mercies new every morning, for salvation in Christ, and for every gift seen and unseen. Keep me from taking Your goodness for granted. Let gratitude shape my words, choices, and relationships today, so that my life becomes an offering of praise to You. Amen.'],tl:['Mapagbiyayang Diyos, salamat sa Iyong habag na bago tuwing umaga, sa kaligtasan kay Cristo, at sa bawat biyayang nakikita at hindi nakikita. Nawa ang pasasalamat ang humubog sa aking salita at gawa ngayong araw. Amen.']}},
 family:{name:'Family',keywords:['love','family','children','house','one another'],prayers:{en:['Heavenly Father, cover my family with Your grace. Teach us to speak with kindness, forgive quickly, serve one another humbly, and build our home upon Your Word. Protect our unity, draw each heart closer to Christ, and use our family to reflect Your love to others. Amen.'],tl:['Ama naming Diyos, balutin Mo ng Iyong biyaya ang aming pamilya. Turuan Mo kaming magsalita nang may kabaitan, magpatawad agad, maglingkod nang mapagpakumbaba, at itayo ang aming tahanan sa Iyong Salita. Amen.']}},
 worship:{name:'Worship',keywords:['worship','praise','holy','glory','lord'],prayers:{en:['Holy God, You alone are worthy of all honour, glory, and praise. Turn my attention away from myself and fix my heart upon Your greatness. Let my worship be more than a song—make my whole life a willing, obedient offering to You through Jesus Christ. Amen.'],tl:['Banal na Diyos, Ikaw lamang ang karapat-dapat sa lahat ng papuri at karangalan. Ilayo Mo ang aking pansin sa sarili at ituon ang puso ko sa Iyong kadakilaan. Gawin Mong pagsamba ang buong buhay ko sa pamamagitan ni Cristo. Amen.']}}
};
let socialStudioState={type:'verse',topic:'hope',format:'square',theme:'sunrise',branding:true,verseText:'',reference:'',prayerText:'',caption:'',hashtags:'#BibleVerse #Faith #DailyEncouragement #DeMayoBibleStudies'};
function socialCanvasSize(format){return format==='story'?{w:1080,h:1920}:format==='landscape'?{w:1200,h:630}:{w:1080,h:1080}}
function socialStudioContent(){
 const isPrayer=socialStudioState.type==='prayer';
 return {body:(isPrayer?socialStudioState.prayerText:socialStudioState.verseText).trim(),reference:isPrayer?'Prayer':socialStudioState.reference.trim(),kind:isPrayer?'PRAYER':'SCRIPTURE'};
}
function socialWrapText(ctx,text,maxWidth){
 const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let line='';
 for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}
 if(line)lines.push(line);return lines;
}
function socialDrawBackground(ctx,w,h,theme){
 const t=SOCIAL_THEMES[theme]||SOCIAL_THEMES.sunrise,g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,t.colors[0]);g.addColorStop(.58,t.colors[1]);g.addColorStop(1,t.colors[2]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.globalAlpha=.16;ctx.fillStyle='#fff';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(w*(.08+i*.15),h*(.12+(i%3)*.28),Math.max(w,h)*(.035+i*.008),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
 const vignette=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.1,w/2,h/2,Math.max(w,h)*.75);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,theme==='minimal'?'rgba(20,50,40,.08)':'rgba(0,0,0,.36)');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}
function drawSocialCanvas(){
 const canvas=$('#socialCanvas');if(!canvas)return;const {w,h}=socialCanvasSize(socialStudioState.format);canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),data=socialStudioContent(),minimal=socialStudioState.theme==='minimal',fg=minimal?'#173f32':'#ffffff',muted=minimal?'#4c665d':'rgba(255,255,255,.86)';socialDrawBackground(ctx,w,h,socialStudioState.theme);
 const pad=Math.round(w*.09),center=w/2;ctx.textAlign='center';ctx.fillStyle=muted;ctx.font=`700 ${Math.round(w*.024)}px system-ui, sans-serif`;ctx.fillText(data.kind,center,Math.round(h*.16));
 let body=data.body||ui('Enter a Bible verse or prayer to create your image.','Maglagay ng Bible verse o panalangin para gumawa ng image.');const maxFont=socialStudioState.format==='landscape'?54:72,minFont=32,maxWidth=w-pad*2,maxHeight=h*(socialStudioState.format==='story'?.48:.43);let font=maxFont,lines=[];
 do{ctx.font=`700 ${font}px Georgia, serif`;lines=socialWrapText(ctx,body,maxWidth);font-=2}while((lines.length*(font*1.32)>maxHeight||lines.length>10)&&font>minFont);
 font+=2;ctx.font=`700 ${font}px Georgia, serif`;ctx.fillStyle=fg;const lineH=font*1.32,startY=h/2-(lines.length*lineH)/2+font*.65;lines.forEach((line,i)=>ctx.fillText(line,center,startY+i*lineH));
 if(data.reference){ctx.font=`700 ${Math.round(w*.031)}px system-ui, sans-serif`;ctx.fillStyle=SOCIAL_THEMES[socialStudioState.theme].accent;ctx.fillText(data.reference,center,Math.min(h*.81,startY+lines.length*lineH+font*.8))}
 if(socialStudioState.branding){ctx.font=`600 ${Math.round(w*.019)}px system-ui, sans-serif`;ctx.fillStyle=muted;ctx.fillText('De Mayo Bible Studies',center,h-Math.round(h*.065))}
}
function socialAutoCaption(){
 const d=socialStudioContent();if(!d.body)return '';
 if(socialStudioState.type==='prayer')return `${d.body}\n\nMay this prayer encourage someone who needs hope today. 🙏`;
 return `Today’s reminder from ${d.reference||'Scripture'}:\n\n“${d.body}”\n\nMay God’s Word guide and strengthen you today.`;
}
function socialTopicVerses(){const all=activeVerses(),topic=SOCIAL_SPIRITUAL_TOPICS[socialStudioState.topic]||SOCIAL_SPIRITUAL_TOPICS.hope,matched=all.filter(v=>topic.keywords.some(k=>plainBibleVerseText(v.x).toLowerCase().includes(k)));return matched.length?matched:all}
function socialGenerateVerse(daily=false){const list=socialTopicVerses(),v=daily?list[(dayOfYear()-1)%list.length]:list[Math.floor(Math.random()*list.length)];socialStudioState.type='verse';socialStudioState.verseText=plainBibleVerseText(v.x);socialStudioState.reference=ref(v);socialStudioState.caption=socialAutoCaption()+`

${ui('Pause today and ask: How can I live this truth?','Huminto sandali at itanong: Paano ko isasabuhay ang katotohanang ito?')}`;socialStudioState.hashtags='#BibleVerse #Faith #Prayer #DailyEncouragement #DeMayoBibleStudies';socialStudioSync();toast(ui('Scripture post created','Nagawa ang Scripture post'))}
function socialGeneratePrayer(){const topic=SOCIAL_SPIRITUAL_TOPICS[socialStudioState.topic]||SOCIAL_SPIRITUAL_TOPICS.hope,langKey=appLanguage==='tl'?'tl':'en',pool=topic.prayers[langKey]||topic.prayers.en;socialStudioState.type='prayer';socialStudioState.prayerText=pool[Math.floor(Math.random()*pool.length)];socialStudioState.caption=ui(`A prayer for ${topic.name.toLowerCase()}. May this lead us back to God’s Word and deeper trust in Him. 🙏`,`Isang panalangin para sa ${topic.name}. Nawa akayin tayo nito pabalik sa Salita ng Diyos at mas malalim na pagtitiwala sa Kanya. 🙏`);socialStudioState.hashtags='#Prayer #Faith #Jesus #ChristianEncouragement #DeMayoBibleStudies';socialStudioSync();toast(ui('Prayer created','Nagawa ang panalangin'))}
function socialGenerateComplete(){Math.random()<.5?socialGenerateVerse():socialGeneratePrayer();socialStudioState.theme=Object.keys(SOCIAL_THEMES)[Math.floor(Math.random()*Object.keys(SOCIAL_THEMES).length)];socialStudioSync()}
function socialUseDailyVerse(){socialGenerateVerse(true)}
function socialUpdatePostPreview(){
 const caption=$('#socialPreviewCaption'),hashtags=$('#socialPreviewHashtags');
 if(caption){caption.textContent=socialStudioState.caption||ui('Your generated caption will appear here.','Lalabas dito ang generated caption.');caption.classList.toggle('is-empty',!socialStudioState.caption)}
 if(hashtags){hashtags.textContent=socialStudioState.hashtags||ui('Your hashtags will appear here.','Lalabas dito ang hashtags.');hashtags.classList.toggle('is-empty',!socialStudioState.hashtags)}
}
function socialStudioSync(){
 const map={socialType:'type',socialTopic:'topic',socialFormat:'format',socialTheme:'theme',socialVerse:'verseText',socialReference:'reference',socialPrayer:'prayerText',socialCaption:'caption',socialHashtags:'hashtags'};Object.entries(map).forEach(([id,key])=>{const el=$('#'+id);if(el){if(el.type==='checkbox')el.checked=!!socialStudioState[key];else el.value=socialStudioState[key]||''}});const brand=$('#socialBranding');if(brand)brand.checked=socialStudioState.branding;const verse=$('#socialVerseFields'),prayer=$('#socialPrayerFields');if(verse)verse.hidden=socialStudioState.type!=='verse';if(prayer)prayer.hidden=socialStudioState.type!=='prayer';drawSocialCanvas();socialUpdatePostPreview();}
function socialPostText(){return [socialStudioState.caption,socialStudioState.hashtags].filter(Boolean).join('\n\n')}
async function socialCopyText(text){try{await navigator.clipboard.writeText(text);return true}catch(e){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}}
function socialDownloadImage(){drawSocialCanvas();const a=document.createElement('a');a.download=`de-mayo-${socialStudioState.type}-${Date.now()}.png`;a.href=$('#socialCanvas').toDataURL('image/png');a.click();recordInsight('feature','social-image-download')}
function socialDevice(){
 const ua=navigator.userAgent||'',platform=navigator.platform||'';
 const ipad=platform==='MacIntel'&&navigator.maxTouchPoints>1;
 if(/iPhone|iPad|iPod/i.test(ua)||ipad)return {kind:'ios',mobile:true,name:'iPhone or iPad'};
 if(/Android/i.test(ua))return {kind:'android',mobile:true,name:'Android'};
 if(/Mac/i.test(platform)||/Macintosh/i.test(ua))return {kind:'mac',mobile:false,name:'Mac'};
 if(/Win/i.test(platform)||/Windows/i.test(ua))return {kind:'windows',mobile:false,name:'Windows PC'};
 return {kind:'desktop',mobile:false,name:'computer'};
}
function socialShareStatus(message,state='working'){
 const box=$('#socialShareStatus');if(!box)return;
 box.hidden=false;box.className=`social-share-status ${state}`;box.innerHTML=message;
}
async function socialCanvasFile(){
 drawSocialCanvas();
 const blob=await new Promise(r=>$('#socialCanvas').toBlob(r,'image/png'));
 if(!blob)throw new Error('Image creation failed');
 return new File([blob],`de-mayo-${socialStudioState.type}-${Date.now()}.png`,{type:'image/png'});
}
async function socialSharePost(){
 const text=socialPostText(),device=socialDevice();
 socialShareStatus(`⏳ ${ui('Preparing your post…','Inihahanda ang post…')}<br><small>${ui('Creating image and copying caption.','Ginagawa ang image at kinokopya ang caption.')}</small>`);
 const copied=await socialCopyText(text);
 let file;
 try{file=await socialCanvasFile()}catch(e){socialShareStatus(`⚠️ ${ui('The image could not be created. Please try Download PNG.','Hindi nagawa ang image. Subukan ang Download PNG.')}`,'error');return}
 if(device.mobile&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
  try{
   socialShareStatus(`✅ ${ui('Caption copied. Choose Facebook in the share menu.','Nakopya ang caption. Piliin ang Facebook sa share menu.')}<br><small>${ui('After Facebook opens, long-press in the post text area and tap Paste.','Pagbukas ng Facebook, long-press sa post text area at piliin ang Paste.')}</small>`,'ready');
   await navigator.share({files:[file],title:'De Mayo Bible Studies'});
   recordInsight('feature','social-image-share');
   toast(ui('Image shared. Your caption is copied—paste it into the Facebook post.','Na-share ang image. Nakopya ang caption—i-paste ito sa Facebook post.'));
   return;
  }catch(e){if(e&&e.name==='AbortError'){socialShareStatus(`ℹ️ ${ui('Sharing was cancelled. Your caption is still copied.','Kinansela ang sharing. Nakopya pa rin ang caption.')}`,'ready');return}}
 }
 socialDownloadImage();
 socialShareStatus(`✅ ${ui('Image downloaded and caption copied.','Na-download ang image at nakopya ang caption.')}<br><small>${device.kind==='mac'?ui('Facebook will open. Click Photo/video, select the downloaded PNG, then press ⌘V to paste the caption.','Bubukas ang Facebook. I-click ang Photo/video, piliin ang PNG, at pindutin ang ⌘V para i-paste ang caption.'):device.kind==='windows'?ui('Facebook will open. Click Photo/video, select the downloaded PNG, then press Ctrl+V to paste the caption.','Bubukas ang Facebook. I-click ang Photo/video, piliin ang PNG, at pindutin ang Ctrl+V para i-paste ang caption.'):ui('Open Facebook, upload the downloaded PNG, then paste the copied caption.','Buksan ang Facebook, i-upload ang PNG, at i-paste ang copied caption.')}</small>`,'ready');
 setTimeout(()=>window.open('https://www.facebook.com/','facebook-home','noopener,noreferrer'),350);
 toast(copied?ui('Image downloaded and caption copied. Facebook is opening.','Na-download ang image at nakopya ang caption. Binubuksan ang Facebook.'):ui('Image downloaded. Copy the caption manually before posting.','Na-download ang image. Kopyahin nang manu-mano ang caption bago mag-post.'));
}
async function socialOpenFacebook(){
 const text=socialPostText(),device=socialDevice();
 const copied=await socialCopyText(text);
 window.open('https://www.facebook.com/','facebook-home','noopener,noreferrer');
 socialShareStatus(`${copied?'✅':'⚠️'} ${copied?ui('Caption copied.','Nakopya ang caption.'):ui('Please copy the caption manually.','Kopyahin nang manu-mano ang caption.')}<br><small>${device.kind==='mac'?ui('Upload the downloaded image, then press ⌘V in the post text area.','I-upload ang image, at pindutin ang ⌘V sa post text area.'):device.kind==='windows'?ui('Upload the downloaded image, then press Ctrl+V in the post text area.','I-upload ang image, at pindutin ang Ctrl+V sa post text area.'):ui('Upload the image and paste the caption into your post.','I-upload ang image at i-paste ang caption sa post.')}</small>`,'ready');
}

const REEL_TOPICS={
 hope:{label:'Hope',hook:'Feeling overwhelmed today? Hold on to this promise.',ref:'Isaiah 41:10',verse:'Do not fear, for I am with you; do not be dismayed, for I am your God.',reflection:'You are not facing today alone. God is present, faithful, and strong enough for what is ahead.',prayer:'Lord, replace my fear with faith and help me trust Your presence today. Amen.'},
 strength:{label:'Strength',hook:'When you feel like giving up, remember this.',ref:'Philippians 4:13',verse:'I can do all things through Christ who strengthens me.',reflection:'God does not always remove the challenge, but He gives strength to walk through it with courage.',prayer:'Jesus, strengthen my heart and help me keep moving forward in faith. Amen.'},
 peace:{label:'Peace',hook:'Is your mind restless today? Listen to this.',ref:'Philippians 4:6–7',verse:'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.',reflection:'Prayer turns our attention from the size of the problem to the faithfulness of God.',prayer:'Prince of Peace, quiet my heart and guard my mind today. Amen.'},
 provision:{label:'Provision',hook:'Worried about tomorrow? This promise is for you.',ref:'Matthew 6:33',verse:'Seek first His kingdom and His righteousness, and all these things will be given to you as well.',reflection:'God calls us to seek Him first while trusting Him with every need and every uncertain tomorrow.',prayer:'Father, provide what I need and teach me to trust Your timing. Amen.'},
 healing:{label:'Healing',hook:'For anyone carrying pain today, hear this hope.',ref:'Psalm 147:3',verse:'He heals the brokenhearted and binds up their wounds.',reflection:'God sees every wound—physical, emotional, and spiritual—and His presence remains close in suffering.',prayer:'Compassionate Lord, bring comfort, strength, and healing according to Your wisdom. Amen.'},
 faith:{label:'Faith',hook:'You may not see the whole path, but you can trust the One leading you.',ref:'Proverbs 3:5–6',verse:'Trust in the Lord with all your heart and lean not on your own understanding.',reflection:'Faith is not having every answer. It is choosing to trust God while the answer is still unfolding.',prayer:'Lord, guide my steps and help me trust You beyond what I can see. Amen.'}
};
let reelState={topic:'hope',duration:30,voice:'female',sound:'soft',scene:0,timer:null,audio:null};
function reelData(){return REEL_TOPICS[reelState.topic]||REEL_TOPICS.hope}
function reelSyncFields(){const d=reelData();['Hook','Verse','Reflection','Prayer'].forEach(k=>{const el=$('#reel'+k);if(el)el.value=d[k.toLowerCase()]||''});const ref=$('#reelReference');if(ref)ref.value=d.ref;reelRenderScene(0)}
function reelRenderScene(i){const phone=$('#reelPhone');if(!phone)return;const d={...reelData(),hook:$('#reelHook')?.value||reelData().hook,verse:$('#reelVerse')?.value||reelData().verse,ref:$('#reelReference')?.value||reelData().ref,reflection:$('#reelReflection')?.value||reelData().reflection,prayer:$('#reelPrayer')?.value||reelData().prayer};const scenes=[{k:'HOOK',t:d.hook},{k:'SCRIPTURE',t:d.verse,s:d.ref},{k:'REFLECTION',t:d.reflection},{k:'PRAYER',t:d.prayer},{k:'FOLLOW',t:'Follow De Mayo Bible Studies',s:'Daily Scripture • Prayer • Encouragement'}];const sc=scenes[i%scenes.length];phone.innerHTML=`<div class="reel-scene reel-scene-${i%5}"><span>${sc.k}</span><strong>${esc(sc.t)}</strong>${sc.s?`<small>${esc(sc.s)}</small>`:''}<em>De Mayo Bible Studies</em></div>`;reelState.scene=i%5}
function reelStartPreview(){reelStopPreview(false);let i=0;reelRenderScene(i);const total=Math.max(15,+($('#reelDuration')?.value||30));const interval=Math.max(1800,(total*1000)/5);reelState.timer=setInterval(()=>{i=(i+1)%5;reelRenderScene(i)},interval);$('#reelPlay').textContent='⏸ Stop preview'}
function reelStopPreview(reset=true){if(reelState.timer){clearInterval(reelState.timer);reelState.timer=null}if(reset)reelRenderScene(0);const b=$('#reelPlay');if(b)b.textContent='▶ Preview animation'}
function reelSpeak(){if(!('speechSynthesis'in window))return toast(ui('Voice reading is not supported on this browser.','Hindi supported ang voice reading sa browser na ito.'));speechSynthesis.cancel();const text=[$('#reelHook').value,$('#reelReference').value,$('#reelVerse').value,$('#reelReflection').value,$('#reelPrayer').value].join('. ');const u=new SpeechSynthesisUtterance(text);u.rate=.9;u.pitch=reelState.voice==='female'?1.08:.92;const voices=speechSynthesis.getVoices();const preferred=voices.find(v=>reelState.voice==='female'?/female|samantha|karen|moira|zira/i.test(v.name):/male|daniel|alex|david|mark/i.test(v.name));if(preferred)u.voice=preferred;speechSynthesis.speak(u);recordInsight('feature','reel-voice-preview')}
function reelStopSound(){if(reelState.audio){try{reelState.audio.ctx.close()}catch(e){}reelState.audio=null}const b=$('#reelSound');if(b)b.textContent='🔊 Preview sound'}
function reelSoundPreview(){reelStopSound();const C=window.AudioContext||window.webkitAudioContext;if(!C)return toast('Audio preview is not supported on this browser.');const ctx=new C(),gain=ctx.createGain();gain.gain.value=.045;gain.connect(ctx.destination);const mode=$('#reelAmbient').value;if(mode==='soft'){const o=ctx.createOscillator();o.type='sine';o.frequency.value=220;o.connect(gain);o.start();reelState.audio={ctx,o}}else{const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const n=Math.random()*2-1;data[i]=mode==='rain'?n*.35:(n*.18+Math.sin(i/1200)*.12)}const src=ctx.createBufferSource();src.buffer=buffer;src.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=mode==='rain'?1400:500;src.connect(filter);filter.connect(gain);src.start();reelState.audio={ctx,src}}$('#reelSound').textContent='🔇 Stop sound';setTimeout(()=>{if(reelState.audio&&reelState.audio.ctx===ctx)reelStopSound()},12000)}


const REEL_RENDER_WORKFLOW_URL='https://github.com/romerdemayo/de-mayo-bible-study-dev/actions/workflows/render-bible-reel.yml';
function reelRenderRequest(){return JSON.stringify({
 hook:$('#reelHook')?.value||'',ref:$('#reelReference')?.value||'',verse:$('#reelVerse')?.value||'',
 reflection:$('#reelReflection')?.value||'',prayer:$('#reelPrayer')?.value||'',
 duration:+($('#reelDuration')?.value||30),voice:$('#reelVoice')?.value||'female',ambient:$('#reelAmbient')?.value||'soft'
})}
async function reelCreateCloudMP4(){
 const status=$('#reelSaveStatus'),request=reelRenderRequest();
 const copied=await socialCopyText(request);
 if(status)status.innerHTML=copied
  ?ui('✅ Reel request copied. GitHub Actions is opening. Tap <b>Run workflow</b>, paste into <b>reel_json</b>, run it, then download the MP4 artifact when complete.','✅ Nakopya ang reel request. Bubukas ang GitHub Actions. Pindutin ang <b>Run workflow</b>, i-paste sa <b>reel_json</b>, patakbuhin, at i-download ang MP4 artifact kapag tapos na.')
  :ui('Copy failed. Use Copy Reel Request, then open the GitHub renderer.','Hindi nakopya. Gamitin ang Copy Reel Request, pagkatapos buksan ang GitHub renderer.');
 window.open(REEL_RENDER_WORKFLOW_URL,'_blank','noopener,noreferrer');
 recordInsight('feature','reel-github-mp4-render');
}
function reelCopyRenderRequest(){socialCopyText(reelRenderRequest()).then(ok=>toast(ok?ui('Reel request copied','Nakopya ang reel request'):ui('Copy failed','Hindi nakopya')))}

function reelExportData(){return {hook:$('#reelHook')?.value||'',ref:$('#reelReference')?.value||'',verse:$('#reelVerse')?.value||'',reflection:$('#reelReflection')?.value||'',prayer:$('#reelPrayer')?.value||''}}
function reelWrapText(ctx,text,maxWidth){const words=String(text||'').trim().split(/\s+/).filter(Boolean),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}if(line)lines.push(line);return lines}
function reelFitText(ctx,text,maxWidth,maxHeight,maxFont=62,minFont=28,maxLines=10){
 for(let size=maxFont;size>=minFont;size-=2){ctx.font=`700 ${size}px system-ui, sans-serif`;const lines=reelWrapText(ctx,text,maxWidth);const lineHeight=Math.round(size*1.22);if(lines.length<=maxLines&&lines.length*lineHeight<=maxHeight)return {size,lines,lineHeight}}
 ctx.font=`700 ${minFont}px system-ui, sans-serif`;let lines=reelWrapText(ctx,text,maxWidth);if(lines.length>maxLines){lines=lines.slice(0,maxLines);const last=lines.length-1;while(ctx.measureText(lines[last]+'…').width>maxWidth&&lines[last].includes(' '))lines[last]=lines[last].replace(/\s+\S+$/,'');lines[last]+='…'}return {size:minFont,lines,lineHeight:Math.round(minFont*1.22)}
}
function reelDrawExportFrame(ctx,w,h,scene,progress){
 const d=reelExportData();const scenes=[{k:'HOOK',t:d.hook},{k:'SCRIPTURE',t:d.verse,s:d.ref},{k:'REFLECTION',t:d.reflection},{k:'PRAYER',t:d.prayer},{k:'FOLLOW',t:'Follow De Mayo Bible Studies',s:'Daily Scripture • Prayer • Encouragement'}];const sc=scenes[scene%5];
 const gradients=[['#10233e','#7c3aed'],['#09203f','#537895'],['#1f4037','#99f2c8'],['#3a1c71','#d76d77'],['#141e30','#243b55']];const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,gradients[scene][0]);g.addColorStop(1,gradients[scene][1]);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.globalAlpha=.16;for(let i=0;i<9;i++){ctx.beginPath();ctx.arc((i*173+scene*71)%w,(i*311+scene*103)%h,45+(i%3)*35,0,Math.PI*2);ctx.fillStyle='#ffffff';ctx.fill()}ctx.globalAlpha=1;
 const fade=Math.min(1,progress/.12,(1-progress)/.12);ctx.globalAlpha=Math.max(.05,fade);ctx.textAlign='center';ctx.textBaseline='middle';
 const topSafe=155,bottomSafe=175,sidePadding=64,labelY=112;ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='700 28px system-ui, sans-serif';ctx.fillText(sc.k,w/2,labelY);
 const subReserve=sc.s?92:0;const contentTop=topSafe,contentBottom=h-bottomSafe-subReserve;const availableHeight=Math.max(220,contentBottom-contentTop);const fitted=reelFitText(ctx,sc.t,w-sidePadding*2,availableHeight,scene===1?58:62,28,10);ctx.font=`700 ${fitted.size}px system-ui, sans-serif`;ctx.fillStyle='#ffffff';
 const blockHeight=fitted.lines.length*fitted.lineHeight;let y=contentTop+(availableHeight-blockHeight)/2+fitted.lineHeight/2;for(const line of fitted.lines){ctx.fillText(line,w/2,y);y+=fitted.lineHeight}
 if(sc.s){const subTop=h-bottomSafe-66;ctx.fillStyle='rgba(255,255,255,.92)';let subSize=32,subLines=[];for(;subSize>=22;subSize-=2){ctx.font=`600 ${subSize}px system-ui, sans-serif`;subLines=reelWrapText(ctx,sc.s,w-150);if(subLines.length<=2)break}const subLh=Math.round(subSize*1.25),subBlock=subLines.length*subLh;let sy=subTop-subBlock/2+subLh/2;for(const line of subLines.slice(0,2)){ctx.fillText(line,w/2,sy);sy+=subLh}}
 ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='600 27px system-ui, sans-serif';ctx.fillText('De Mayo Bible Studies',w/2,h-72);ctx.textBaseline='alphabetic';ctx.globalAlpha=1;
}
async function reelSaveVideo(){
 const btn=$('#reelSave'),status=$('#reelSaveStatus');if(!btn)return;
 if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){status.textContent=ui('Video saving is not supported in this browser. Use Chrome or Edge on your Mac, or screen-record on iPhone.','Hindi supported ang video saving sa browser na ito. Gumamit ng Chrome o Edge sa Mac, o screen recording sa iPhone.');return}
 reelStopPreview();btn.disabled=true;const old=btn.textContent;btn.textContent='⏳ Creating video…';status.textContent=ui('Keep this tab open while the reel is created. The saved video does not yet include browser narration or music.','Panatilihing bukas ang tab habang ginagawa ang reel. Wala pang narration o music ang saved video.');
 try{
  const canvas=document.createElement('canvas');canvas.width=540;canvas.height=960;const ctx=canvas.getContext('2d');const stream=canvas.captureStream(30);let mime='';for(const m of ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm']){if(MediaRecorder.isTypeSupported(m)){mime=m;break}}const chunks=[];const rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:4500000}:undefined);rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};const stopped=new Promise((resolve,reject)=>{rec.onstop=resolve;rec.onerror=e=>reject(e.error||e)});rec.start(250);
  const total=Math.max(15,+($('#reelDuration')?.value||30)),start=performance.now();await new Promise(resolve=>{function frame(now){const elapsed=(now-start)/1000,p=Math.min(1,elapsed/total),scene=Math.min(4,Math.floor(p*5)),sceneProgress=(p*5)-scene;reelDrawExportFrame(ctx,canvas.width,canvas.height,scene,sceneProgress);status.textContent=`Creating video… ${Math.min(100,Math.floor(p*100))}%`;if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});rec.stop();await stopped;
  const blob=new Blob(chunks,{type:mime||'video/webm'});if(!blob.size)throw new Error('Empty video');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`de-mayo-bible-reel-${Date.now()}.webm`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);status.textContent=ui('Video saved as WebM. Upload it to Facebook from your Downloads folder. Voice and music are not included yet.','Na-save ang video bilang WebM. I-upload ito sa Facebook mula sa Downloads folder. Wala pang voice at music.');toast(ui('Reel video saved','Na-save ang reel video'));recordInsight('feature','reel-webm-export');
 }catch(e){console.error(e);status.textContent=ui('The browser could not create the video. Try Chrome on your Mac, then reload the page.','Hindi nagawa ng browser ang video. Subukan ang Chrome sa Mac at i-reload ang page.');toast(ui('Video saving failed','Hindi na-save ang video'))}finally{btn.disabled=false;btn.textContent=old}
}

function reelCopyScript(){const text=`${$('#reelHook').value}\n\n${$('#reelReference').value}\n${$('#reelVerse').value}\n\n${$('#reelReflection').value}\n\nPrayer: ${$('#reelPrayer').value}\n\n#BibleReel #Faith #ChristianEncouragement #DeMayoBibleStudies`;socialCopyText(text).then(ok=>toast(ok?'Reel script copied':'Copy failed'))}
function reelStudioHTML(){return `<section class="card reel-studio"><div class="section-heading compact"><div><span class="eyebrow">BETA · REELS & SHORTS</span><h3>🎬 ${ui('Bible Reel Creator','Bible Reel Creator')}</h3><p>${ui('Create a short animated Scripture reel with voice reading and ambient sound preview.','Gumawa ng maikling animated Scripture reel na may voice reading at ambient sound preview.')}</p></div></div><div class="reel-layout"><div class="reel-controls"><div class="form-grid"><label>${ui('Topic','Paksa')}<select id="reelTopic">${Object.entries(REEL_TOPICS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label><label>${ui('Duration','Tagal')}<select id="reelDuration"><option value="15">15 seconds</option><option value="30" selected>30 seconds</option><option value="45">45 seconds</option><option value="60">60 seconds</option></select></label><label>${ui('Narrator','Tagabasa')}<select id="reelVoice"><option value="female">Female · Gentle</option><option value="male">Male · Warm</option></select></label><label>${ui('Ambient sound','Tunog')}<select id="reelAmbient"><option value="soft">Soft worship tone</option><option value="rain">Gentle rain</option><option value="ocean">Ocean ambience</option></select></label></div><button class="primary wide" id="reelGenerate">✨ ${ui('Generate reel script','Gumawa ng reel script')}</button><label>${ui('Opening hook','Panimulang hook')}<textarea id="reelHook" rows="2"></textarea></label><div class="form-grid"><label>${ui('Verse reference','Verse reference')}<input id="reelReference"></label></div><label>${ui('Verse','Talata')}<textarea id="reelVerse" rows="4"></textarea></label><label>${ui('Reflection','Reflection')}<textarea id="reelReflection" rows="3"></textarea></label><label>${ui('Prayer','Panalangin')}<textarea id="reelPrayer" rows="3"></textarea></label><div class="reel-actions"><button class="primary" id="reelPlay">▶ Preview animation</button><button class="ghost" id="reelVoicePreview">🎙 Read the verse</button><button class="ghost" id="reelSound">🔊 Preview sound</button><button class="ghost" id="reelCopy">📋 Copy script</button><button class="primary" id="reelCloudSave">☁ Create MP4</button><button class="ghost" id="reelCopyRequest">📋 Copy Reel Request</button><button class="ghost" id="reelSave">💻 Save WebM</button></div><p id="reelSaveStatus" class="privacy-note"></p><p class="privacy-note">${ui('Free MP4 export uses GitHub Actions and works from phones and computers. Tap Create MP4, paste the copied Reel Request into the workflow, and download the finished MP4 artifact. Desktop WebM remains available as a quick local option.','Ang libreng MP4 export ay gumagamit ng GitHub Actions at gumagana sa phone at computer. Pindutin ang Create MP4, i-paste ang Reel Request sa workflow, at i-download ang tapos na MP4 artifact. Available pa rin ang desktop WebM bilang mabilis na local option.')}</p></div><div class="reel-preview-column"><div class="reel-phone" id="reelPhone"></div><small>${ui('9:16 phone preview','9:16 phone preview')}</small></div></div></section>`}
function bindReelStudio(){const topic=$('#reelTopic');if(!topic)return;topic.value=reelState.topic;$('#reelDuration').value=reelState.duration;$('#reelVoice').value=reelState.voice;$('#reelAmbient').value=reelState.sound;reelSyncFields();topic.onchange=e=>{reelState.topic=e.target.value;reelSyncFields()};$('#reelDuration').onchange=e=>reelState.duration=+e.target.value;$('#reelVoice').onchange=e=>reelState.voice=e.target.value;$('#reelAmbient').onchange=e=>reelState.sound=e.target.value;$('#reelGenerate').onclick=()=>{reelSyncFields();toast(ui('Reel script generated','Nagawa ang reel script'))};$('#reelPlay').onclick=()=>reelState.timer?reelStopPreview():reelStartPreview();$('#reelVoicePreview').onclick=reelSpeak;$('#reelSound').onclick=()=>reelState.audio?reelStopSound():reelSoundPreview();$('#reelCopy').onclick=reelCopyScript;$('#reelCloudSave').onclick=reelCreateCloudMP4;$('#reelCopyRequest').onclick=reelCopyRenderRequest;$('#reelSave').onclick=reelSaveVideo;['Hook','Reference','Verse','Reflection','Prayer'].forEach(k=>$('#reel'+k).oninput=()=>reelRenderScene(reelState.scene))}

function bibleReelCreator(){
 title(ui('Bible Reel Creator','Bible Reel Creator'),ui('Create Scripture, prayer, encouragement, and spiritual-check reels in a dedicated workspace.','Gumawa ng Scripture, prayer, encouragement, at spiritual-check reels sa sariling workspace.'));
 view.innerHTML=`${reelStudioHTML()}<section class="card reel-posting-guide"><div class="section-heading compact"><div><span class="eyebrow">FACEBOOK REELS</span><h3>f ${ui('How to post your reel','Paano i-post ang iyong reel')}</h3></div></div><ol class="reel-post-steps"><li><b>${ui('Create and preview','Gumawa at i-preview')}</b><span>${ui('Choose a topic, generate the script, then preview the animation and narration.','Pumili ng paksa, gumawa ng script, at i-preview ang animation at narration.')}</span></li><li><b>${ui('Record the preview for testing','I-record ang preview para sa testing')}</b><span>${ui('On iPhone, open Control Centre and use Screen Recording. On Mac, press Shift–Command–5 and record the reel preview area.','Sa iPhone, gamitin ang Screen Recording sa Control Centre. Sa Mac, pindutin ang Shift–Command–5 at i-record ang reel preview area.')}</span></li><li><b>${ui('Open Facebook','Buksan ang Facebook')}</b><span>${ui('Tap Create or the + button, choose Reel, and select the saved vertical video.','Pindutin ang Create o + button, piliin ang Reel, at piliin ang saved vertical video.')}</span></li><li><b>${ui('Add caption and publish','Maglagay ng caption at i-publish')}</b><span>${ui('Use Copy script, paste the text into the reel description, review the audience, then tap Share now.','Gamitin ang Copy script, i-paste sa description, suriin ang audience, at pindutin ang Share now.')}</span></li></ol><div class="publisher-note"><b>${ui('Current beta limitation','Kasalukuyang beta limitation')}:</b> ${ui('This DEV build includes a free GitHub Actions renderer that creates a finished vertical MP4 with narration, captions and a gentle original ambient track. On phones, tap Create MP4 and follow the workflow steps.','Kasama sa DEV build na ito ang libreng GitHub Actions renderer na gumagawa ng vertical MP4 na may narration, captions at mahinang original ambient track. Sa phone, pindutin ang Create MP4 at sundin ang workflow steps.')}</div></section>`;
 bindReelStudio();
}


const CREATOR_STUDIO_CONTENT={
 hope:{label:'Hope',verse:'Romans 15:13',text:'May the God of hope fill you with all joy and peace as you trust in him.',reflection:'Your circumstances may be uncertain, but your hope is anchored in a faithful God.',prayer:'Lord, fill my heart with hope and steady me with Your peace today.'},
 faith:{label:'Faith',verse:'Proverbs 3:5–6',text:'Trust in the Lord with all your heart, and do not lean on your own understanding.',reflection:'Faith does not require you to see the whole road. It asks you to trust the One who leads.',prayer:'Father, help me trust Your wisdom even when I cannot see what comes next.'},
 peace:{label:'Peace',verse:'Philippians 4:6–7',text:'Do not be anxious about anything, but in everything, by prayer and petition with thanksgiving, present your requests to God.',reflection:'Prayer turns panic into surrender and makes room for the peace of Christ.',prayer:'Jesus, quiet my mind and guard my heart with Your peace.'},
 strength:{label:'Strength',verse:'Isaiah 41:10',text:'Do not fear, for I am with you. Do not be dismayed, for I am your God.',reflection:'You are not carrying today alone. God is present, strengthening and upholding you.',prayer:'God, be my strength in every task and every challenge before me.'},
 gratitude:{label:'Gratitude',verse:'1 Thessalonians 5:18',text:'Give thanks in all circumstances, for this is God’s will for you in Christ Jesus.',reflection:'Gratitude does not deny hardship; it recognises God’s goodness within it.',prayer:'Thank You, Lord, for Your mercy, provision, and presence today.'},
 forgiveness:{label:'Forgiveness',verse:'Colossians 3:13',text:'Forgive as the Lord forgave you.',reflection:'Grace received becomes grace shared. Forgiveness releases the heart from carrying yesterday.',prayer:'Lord, help me forgive with the same mercy You have shown me.'}
};
let creatorStudioState={type:'prayer',topic:'hope'};
function creatorStudioBuild(){
 const d=CREATOR_STUDIO_CONTENT[creatorStudioState.topic]||CREATOR_STUDIO_CONTENT.hope;
 if(creatorStudioState.type==='quote')return `“${d.reflection}”\n\n${d.verse}\nDe Mayo Bible Studies`;
 if(creatorStudioState.type==='devotional')return `${d.label}: A Short Devotional\n\nScripture: ${d.verse}\n${d.text}\n\nReflection\n${d.reflection}\n\nToday’s step\nPause for one minute and give this concern to God.\n\nPrayer\n${d.prayer}`;
 if(creatorStudioState.type==='motivation')return `Do not give up. ${d.reflection}\n\n${d.verse}\n${d.text}\n\nKeep trusting God—He is still working.`;
 return `${d.label} Prayer\n\nHeavenly Father,\n\n${d.prayer} ${d.reflection} Teach me to walk by faith, to honour Your Word, and to respond with courage and love.\n\nIn Jesus’ name, Amen.\n\n${d.verse}`;
}
function creatorStudioRefresh(){const out=$('#creatorOutput');if(out)out.value=creatorStudioBuild();const label=$('#creatorOutputLabel');if(label)label.textContent=({prayer:'Prayer',devotional:'Devotional',motivation:'Encouragement',quote:'Christian quote'})[creatorStudioState.type]||'Content'}
function christianCreatorStudio(){
 title(ui('Christian Creator Studio','Christian Creator Studio'),ui('Create free Christian content for reels, posts, prayers, and devotionals.','Gumawa ng libreng Christian content para sa reels, posts, prayers, at devotionals.'));
 view.innerHTML=`<section class="creator-hero card"><div><span class="eyebrow">VERSION 1.14 DEV · FREE CREATOR TOOLS</span><h3>✨ Christian Creator Studio</h3><p>${ui('A private, browser-based ministry workspace. No subscription and no API key required for these tools.','Pribado at browser-based na ministry workspace. Walang subscription at API key na kailangan.')}</p></div><button class="primary" id="creatorOpenReel">🎬 ${ui('Open Bible Reel Creator','Buksan ang Bible Reel Creator')}</button></section>
 <section class="creator-tool-grid"><button class="creator-tool-card" data-creator-type="prayer"><span>🙏</span><b>${ui('Prayer Creator','Prayer Creator')}</b><small>${ui('Morning, family, healing, work, and more','Morning, family, healing, work, at iba pa')}</small></button><button class="creator-tool-card" data-creator-type="devotional"><span>📖</span><b>${ui('Daily Devotional','Daily Devotional')}</b><small>${ui('Scripture, reflection, action, and prayer','Scripture, reflection, action, at prayer')}</small></button><button class="creator-tool-card" data-creator-type="motivation"><span>💪</span><b>${ui('Encouragement','Encouragement')}</b><small>${ui('Short motivational content grounded in Scripture','Maikling motivation na nakabatay sa Scripture')}</small></button><button class="creator-tool-card" data-creator-type="quote"><span>🖼</span><b>${ui('Christian Quote','Christian Quote')}</b><small>${ui('Ready for Social Studio image design','Handa para sa Social Studio image design')}</small></button></section>
 <section class="card creator-workbench"><div class="section-heading compact"><div><span class="eyebrow">CONTENT GENERATOR</span><h3 id="creatorOutputLabel">Prayer</h3></div></div><div class="form-grid"><label>${ui('Content type','Uri ng content')}<select id="creatorType"><option value="prayer">Prayer</option><option value="devotional">Daily devotional</option><option value="motivation">Encouragement / motivation</option><option value="quote">Christian quote</option></select></label><label>${ui('Spiritual theme','Espirituwal na paksa')}<select id="creatorTopic">${Object.entries(CREATOR_STUDIO_CONTENT).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label></div><button class="primary wide" id="creatorGenerate">✨ ${ui('Generate fresh content','Gumawa ng bagong content')}</button><label>${ui('Editable result','Maaaring i-edit na resulta')}<textarea id="creatorOutput" rows="14"></textarea></label><div class="creator-actions"><button class="primary" id="creatorCopy">📋 ${ui('Copy content','Kopyahin')}</button><button class="ghost" id="creatorToSocial">🎨 ${ui('Open Social Studio','Buksan ang Social Studio')}</button><button class="ghost" id="creatorToReel">🎬 ${ui('Turn into a reel','Gawing reel')}</button></div><p class="privacy-note">🔒 ${ui('Generated locally from built-in biblical templates. Nothing is uploaded. Review all content and Scripture references before publishing.','Ginagawa nang lokal mula sa built-in biblical templates. Walang ina-upload. Suriin ang content at Scripture references bago i-publish.')}…36355 tokens truncated…let r=new FileReader;r.onload=()=>{try{resolve(normaliseBackup(JSON.parse(r.result)))}catch(e){reject(e)}};r.onerror=()=>reject(new Error(ui('The selected file could not be read','Hindi mabasa ang napiling file')));r.readAsText(f)});
 $('#file').onchange=async()=>{try{let b=await readSelected(),count=Object.keys(b.data).length;$('#backupStatus').textContent=ui(`Valid backup: ${count} saved data sections found.`,`Valid backup: ${count} bahagi ng saved data ang nakita.`)}catch(e){$('#backupStatus').textContent=e.message}};
 $('#mergeRestore').onclick=async()=>{try{let {data}=await readSelected();if(!confirm(ui('Merge this backup with the data already saved on this device?','Pagsamahin ang backup at kasalukuyang data sa device na ito?')))return;saveSafetySnapshot('before-merge-restore');applyMerge(data);DM_DATA_GUARD.put('after-file-merge');alert(ui('Your backup was merged successfully.','Matagumpay na pinagsama ang backup.'));route('home')}catch(e){alert(e.message)}};
 $('#replaceRestore').onclick=async()=>{try{let {data}=await readSelected();if(!confirm(ui('Replace the saved app data on this device with the selected backup? A safety copy will be created first.','Palitan ang saved app data sa device na ito gamit ang napiling backup? Gagawa muna ng safety copy.')))return;if(!confirm(ui('Please confirm again: continue with Replace Restore?','Pakikumpirma muli: ituloy ang Replace Restore?')))return;saveSafetySnapshot('before-replace-restore');applyReplace(data);DM_DATA_GUARD.put('after-file-replace');alert(ui('Your backup was restored successfully.','Matagumpay na na-restore ang backup.'));route('home')}catch(e){alert(e.message)}};
 $('#undoRestore').onclick=()=>{try{let raw=localStorage.getItem(SNAPSHOT_KEY);if(!raw)return toast(ui('No safety copy is available','Walang available na safety copy'));let {data}=normaliseBackup(JSON.parse(raw));if(!confirm(ui('Restore the safety copy from before the last restore?','Ibalik ang safety copy bago ang huling restore?')))return;applyReplace(data);localStorage.removeItem(SNAPSHOT_KEY);alert(ui('The previous saved data has been restored.','Naibalik ang dating saved data.'));route('home')}catch(e){alert(e.message)}};
 $('#clear').onclick=()=>{if(!confirm(ui('Erase all saved Bible app data from this browser?','Burahin ang lahat ng saved Bible app data sa browser na ito?')))return;if(!confirm(ui('This cannot be undone without a downloaded backup. Erase now?','Hindi ito maibabalik kung walang downloaded backup. Burahin na?')))return;saveSafetySnapshot('before-manual-erase');savedKeys().forEach(k=>localStorage.removeItem(k));alert(ui('Saved data was erased. A temporary safety copy is available under Undo Last Restore.','Nabura ang saved data. May temporary safety copy sa Undo Last Restore.'));backup()}
}
function libraryShell(t,d,createType){return `<div class="library-head"><div><h2>${t}</h2><p>${d}</p></div><div class="library-search"><input id="libq" placeholder="${ui('Search this library...','Maghanap sa aklatang ito...')}"><button class="ghost" id="clearLib">${ui('Clear','Burahin')}</button></div></div><div class="library-actions"><button class="primary" id="createHere">＋ ${ui('Create','Gumawa ng')} ${createType}</button></div><div id="libres" class="library-grid"></div>`}
function wireLibrary(draw,type){$('#libq').oninput=e=>draw(e.target.value);$('#clearLib').onclick=()=>{$('#libq').value='';draw('');$('#libq').focus()};$('#createHere').onclick=()=>{const map={'Bible Study':'Bible Study','Pag-aaral':'Bible Study','Kids Lesson':'Kids Lesson','Aralin':'Kids Lesson','Devotional':'Devotional','Debosyonal':'Devotional','Exhortation':'Exhortation','Prayer':'Prayer','Panalangin':'Prayer'};store.set('creatorType',map[type]||type);route('creator')}}
function openResource(kind,index){store.set('openResource',{kind,index});route('resource')}
function improvedLibraryPrayer(x,details={}){const topic=details.topic||x.title||ui('this need','ang pangangailangang ito'),person=details.person||ui('the person or group concerned','ang taong o grupong ipinapanalangin'),scripture=details.scripture||ui('a suitable Bible passage','angkop na talata sa Biblia'),extra=details.extra||'',tone=details.tone||ui('warm, faith-filled, and pastoral','mainit, puno ng pananampalataya, at pastoral');if(appLanguage==='tl')return `PAMAGAT: ${x.title}\nKATEGORYA: ${x.category}\nPOKUS: ${topic}\nKAUGNAY NA KASULATAN: ${scripture}\nTONO: ${tone}\n\nPAGSAMBA AT PASASALAMAT\nAming Ama sa langit, lumalapit kami sa Iyo nang may pagpapakumbaba at pasasalamat. Ikaw ay mabuti, tapat, mahabagin, at makapangyarihan. Salamat sapagkat nakikinig Ka sa Iyong mga anak at inaanyayahan Mo kaming ilagak sa Iyo ang aming mga alalahanin.\n\nPAGSUKO\nIsinusuko namin sa Iyo ang ${topic.toLowerCase()}. Inaamin naming hindi namin kayang kontrolin ang lahat, kaya nagtitiwala kami sa Iyong karunungan, panahon, at banal na kalooban. Linisin Mo ang aming mga puso sa takot, pag-aalala, pagmamataas, at kawalan ng pananampalataya.\n\nTIYAK NA PANALANGIN\nPanginoon, aming itinataas si/ang ${person}. ${x.text} ${extra}\nIbigay Mo ang karunungang kailangan, lakas para sa bawat araw, kapayapaang nagmumula sa Iyo, at lakas ng loob na sumunod sa Iyong Salita. Magbukas Ka ng tamang mga pintuan at isara ang mga hindi naaayon sa Iyong kalooban.\n\nPANANAMPALATAYA AT PAGSUNOD\nTulungan Mo kaming hindi lamang humingi ng sagot kundi hanapin Ka mismo. Turuan Mo kaming maghintay nang may pananampalataya, kumilos nang may karunungan, magpatawad kung kailangan, at manatiling tapat habang hinihintay ang Iyong sagot.\n\nPAGTATAPOS\nNaniniwala kaming kaya Mong gumawa nang higit sa aming nauunawaan, ngunit higit sa lahat ay nais naming mangyari ang Iyong mabuti at banal na kalooban. Ingatan Mo ang aming puso at isip kay Cristo Jesus. Sa pangalan ni Jesus, Amen.\n\nPANSARILING TALA / SAGOT SA PANALANGIN\n• Ano ang ginawa ng Diyos?\n• Ano ang itinuro Niya sa akin?\n• Ano ang susunod kong hakbang ng pananampalataya?`;return `TITLE: ${x.title}\nCATEGORY: ${x.category}\nFOCUS: ${topic}\nRELATED SCRIPTURE: ${scripture}\nTONE: ${tone}\n\nADORATION AND THANKSGIVING\nHeavenly Father, we come before You with humility and gratitude. You are good, faithful, compassionate, and powerful. Thank You for hearing Your children and inviting us to bring every concern to You.\n\nSURRENDER\nWe surrender ${topic.toLowerCase()} to You. We acknowledge that we cannot control every outcome, so we trust Your wisdom, timing, and holy will. Cleanse our hearts from fear, anxiety, pride, and unbelief.\n\nSPECIFIC PRAYER\nLord, we lift up ${person}. ${x.text} ${extra}\nPlease provide the wisdom that is needed, strength for each day, peace that comes from You, and courage to obey Your Word. Open the right doors and close those that are not aligned with Your will.\n\nFAITH AND OBEDIENCE\nHelp us not only to seek an answer, but to seek You. Teach us to wait faithfully, act wisely, forgive when necessary, and remain obedient while we wait for Your response.\n\nCONCLUSION\nWe believe You are able to do more than we understand, yet above all we ask for Your good and holy will to be done. Guard our hearts and minds in Christ Jesus. In Jesus' name, Amen.\n\nPERSONAL NOTES / ANSWERED PRAYER\n• What has God done?\n• What has He taught me?\n• What is my next step of faith?`}
function libraryPrayerPrompt(x,details={}){return `Create a complete, editable Christian prayer in ${appLanguage==='tl'?'Tagalog':'English'} using the following existing library prayer as the foundation. Prayer title: “${x.title}”. Category: “${x.category}”. Prayer topic: “${details.topic||x.title}”. Person or group: “${details.person||''}”. Related Scripture: “${details.scripture||''}”. Desired tone: “${details.tone||'warm, faith-filled, pastoral, and biblically careful'}”. Additional details: “${details.extra||''}”. Existing prayer: “${x.text}”. Include adoration, thanksgiving, confession or surrender where appropriate, specific requests, Scripture-guided faith, practical obedience, a strong conclusion in Jesus' name, and a short section for answered-prayer notes or spiritual learning. Do not invent Bible quotations, promises, prophecies, or guarantees. Clearly distinguish Scripture from commentary. Keep the prayer compassionate, Christ-centred, and ready for the user to edit before ministry use.`}
function resource(){let o=store.get('openResource',null);if(!o)return route('home');
 if(o.custom){let x=userLibrary(o.kind).find(v=>String(v.id)===String(o.id));const customRoute=({study:'studies',prayer:'prayerlibrary',kids:'kidslibrary',devotional:'devotionals',exhortation:'exhortations'})[o.kind]||'myresources';if(!x)return route(customRoute);title(x.title,ui('Your saved resource','Iyong naka-save na materyales'));let passage=x.scripture||x.passage||x.main||'';let body=x.body||x.text||'';let kidsImage=o.kind==='kids'?(x.image||kidsIllustrationFor(x.title,passage)):'';view.innerHTML=`<button class="ghost" id="backLib">← ${ui('Back to library','Bumalik sa aklatan')}</button><article class="resource-page">${o.kind==='kids'?`<img id="savedKidsIllustration" src="${esc(kidsImage)}" alt="${esc(x.title||ui('Kids lesson illustration','Larawan ng kids lesson'))}" style="display:block;width:100%;max-height:420px;object-fit:contain;margin-bottom:18px">`:''}<span class="pill">${esc(x.category||x.type||ui('Personal Resource','Personal na Materyales'))}</span><label class="field-label">${ui('Title','Pamagat')}<input id="customResourceTitle" value="${esc(x.title||'')}"></label><label class="field-label">${ui('Main Bible Passage','Pangunahing Talata')}<input id="customResourcePassage" value="${esc(passage)}" placeholder="John 3:16"></label>${o.kind==='kids'?`<label class="field-label">${ui('Illustration path','Path ng larawan')}<input id="customKidsImage" value="${esc(kidsImage)}" placeholder="images/lesson-placeholder.svg"></label>`:''}${customScripturePanel(body,passage)}<label class="field-label">${ui('Editable Resource','Editable na Materyales')}<textarea id="customResourceBody" class="draft-area" style="min-height:520px">${esc(body)}</textarea></label><div class="resource-buttons"><button class="primary" id="saveCustomResource">${ui('Save Changes','I-save ang Pagbabago')}</button><button class="ghost" id="refreshScriptureLinks">📖 ${ui('Refresh Scripture Links','I-refresh ang Scripture Links')}</button>${['study','kids','exhortation','devotional'].includes(o.kind)?`<button class="primary" id="presentCustomResource">🖥️ ${ui('Present','I-present')}</button>`:''}<button class="ghost" id="copyCustomResource">${ui('Copy','Kopyahin')}</button><button class="danger" id="deleteCustomResource">${ui('Delete','Burahin')}</button></div></article>`;$('#backLib').onclick=()=>route(customRoute);$('#saveCustomResource').onclick=()=>{let body=$('#customResourceBody').value.trim(),titleValue=$('#customResourceTitle').value.trim()||x.title,passageValue=$('#customResourcePassage').value.trim();updateUserLibrary(o.kind,o.id,{title:titleValue,scripture:passageValue,passage:passageValue,main:passageValue,image:o.kind==='kids'?($('#customKidsImage')?.value.trim()||kidsIllustrationFor(titleValue,passageValue)):x.image,body,text:o.kind==='prayer'?body:x.text});toast(ui('Changes saved','Nai-save ang pagbabago'));resource()};$('#refreshScriptureLinks').onclick=()=>resource();if($('#presentCustomResource'))$('#presentCustomResource').onclick=()=>{
 const currentData={...x,title:$('#customResourceTitle').value.trim(),scripture:$('#customResourcePassage').value.trim(),passage:$('#customResourcePassage').value.trim(),body:$('#customResourceBody').value};
 const variants=o.kind==='study'?generatedStudyPresentationVariants(currentData):null;
 const current=variants?variants[appLanguage==='tl'?'tl':'en']:{title:currentData.title,passage:currentData.passage,body:currentData.body,image:o.kind==='kids'?($('#customKidsImage')?.value.trim()||kidsImage):''};
 startResourcePresentation({...current,originPage:customRoute,source:{type:o.kind==='study'?'generatedStudy':'customResource',kind:o.kind,id:o.id},variants});
};$('#copyCustomResource').onclick=async()=>{try{await navigator.clipboard.writeText($('#customResourceBody').value);toast(ui('Copied','Nakopya'))}catch{}};$('#deleteCustomResource').onclick=()=>{if(confirm(ui('Delete this saved resource?','Burahin ang naka-save na materyales?'))){deleteUserLibrary(o.kind,o.id);route(customRoute)}};wireScriptureLinks();return}
 let maps={devotional:DEVOTIONALS,exhortation:EXHORTATIONS,study:BIBLE_STUDIES,kids:KIDS_LESSONS,prayer:PRAYER_LIBRARY},raw=maps[o.kind]?.[o.index];if(!raw||isResourceDeleted(o.kind,o.index))return route({devotional:'devotionals',exhortation:'exhortations',study:'studies',kids:'kidslibrary',prayer:'prayerlibrary'}[o.kind]);let x=effectiveResource(o.kind,o.index,raw);title(x.title,ui('Complete resource view','Kumpletong materyales'));let body='';
 if(o.kind==='devotional')body=`<span class="pill">${esc(x.theme)}</span><h2>${esc(x.title)}</h2><div class="scripture-banner"><span>${ui('Main Scripture','Pangunahing Talata')}</span>${scriptureLink(x.scripture)}</div><h3>${ui('Reflection','Pagninilay')}</h3><p>${esc(x.reflection)}</p><h3>${ui('Application','Aplikasyon')}</h3><p>${esc(x.application)}</p><h3>${ui('Reflection Questions','Mga Tanong sa Pagninilay')}</h3><ol>${(x.questions||[]).map(q=>`<li>${esc(q)}</li>`).join('')}</ol><h3>${ui('Prayer','Panalangin')}</h3><p>${esc(x.prayer)}</p><div class="resource-foot"><b>${ui('Memory Verse','Talatang Isasaulo')}:</b> ${scriptureLink(x.memory)}<br><b>${ui('Suggested reading','Iminungkahing pagbasa')}:</b> ${scriptureLink(x.reading)}</div>`;
 if(o.kind==='exhortation')body=`<span class="pill">${esc(x.category)}</span><h2>${esc(x.title)}</h2><div class="scripture-banner"><span>${ui('Main Scripture','Pangunahing Talata')}</span>${scriptureLink(x.main)}</div><p>${esc(x.intro)}</p>${(x.points||[]).map((p,i)=>`<section><h3>${i+1}. ${esc(p[0])}</h3><p>${esc(p[1])}</p></section>`).join('')}<h3>${ui('Supporting Scriptures','Mga Kaugnay na Talata')}</h3><p>${scriptureList(x.support||[])}</p><h3>${ui('Application','Aplikasyon')}</h3><p>${esc(x.application)}</p><h3>${ui('Challenge','Hamon')}</h3><p>${esc(x.challenge)}</p><h3>${ui('Prayer','Panalangin')}</h3><p>${esc(x.prayer)}</p>`;
 if(o.kind==='study')body=`<span class="pill">${esc(x.type)}</span><h2>${esc(x.title)}</h2><div class="scripture-banner"><span>${ui('Main Passage','Pangunahing Talata')}</span>${scriptureLink(x.passage)}</div><h3>${ui('Objective','Layunin')}</h3><p>${esc(x.objective)}</p><h3>${ui('Background','Konteksto')}</h3><p>${esc(x.background)}</p><h3>${ui('Discussion Questions','Mga Tanong sa Talakayan')}</h3><ol>${(x.questions||[]).map(q=>`<li>${esc(q)}</li>`).join('')}</ol><h3>${ui('Leader Notes','Tala para sa Leader')}</h3><p>${esc(x.leader_notes)}</p><h3>${ui('Application','Aplikasyon')}</h3><p>${esc(x.application)}</p><h3>${ui('Prayer','Panalangin')}</h3><p>${esc(x.prayer)}</p>`;
 if(o.kind==='kids')body=`<img class="lesson-hero" src="${esc(x.image||'')}" alt="${esc(x.title)}"><span class="pill">${ui('Ages','Edad')} ${esc(x.age)}</span><h2>${esc(x.title)}</h2><div class="scripture-banner"><span>${ui('Bible Story','Kuwento sa Biblia')}</span>${renderTextWithScriptureLinks(x.story)}</div><h3>${ui('Opening Prayer','Pambungad na Panalangin')}</h3><p>${esc(x.opening)}</p><h3>${ui('Teaching Lesson','Aralin')}</h3><p>${esc(x.lesson)}</p><h3>${ui('Questions','Mga Tanong')}</h3><ol>${(x.questions||[]).map(q=>`<li>${esc(q)}</li>`).join('')}</ol><div class="idea-grid"><div><h3>🎲 ${ui('Activity','Gawain')}</h3><p>${esc(x.activity)}</p></div><div><h3>✂️ Craft</h3><p>${esc(x.craft)}</p></div></div><h3>${ui('Memory Verse','Talatang Isasaulo')}</h3><p>${scriptureLink(x.memory)}</p><h3>${ui('Closing Prayer','Pangwakas na Panalangin')}</h3><p>${esc(x.closing)}</p><div class="resource-buttons"><button class="primary" id="libraryKidsPpt">📺 ${ui('Create Presentation Outline','Gumawa ng Presentation Outline')}</button><button class="ghost" id="libraryKidsPack">📦 ${ui('Create Resource Pack','Gumawa ng Resource Pack')}</button></div><div id="libraryKidsPanel" class="notice" style="display:none;margin-top:14px"><textarea id="libraryKidsBody" class="draft-area" style="min-height:420px"></textarea><button class="primary" id="libraryKidsCopy">${ui('Copy Resource','Kopyahin ang Resource')}</button></div>`;
 if(o.kind==='prayer')body=`<span class="pill">${esc(x.category)}</span><h2>${esc(x.title)}</h2><div class="prayer-paper"><p>${esc(x.text)}</p></div><section class="card prayer-ai-card"><h3>✨ ${ui('AI-Assisted Prayer Improvement','AI-Assisted na Pagpapahusay ng Panalangin')}</h3><p>${ui('Add optional details, then create a stronger editable prayer or prepare a prompt for ChatGPT.','Magdagdag ng opsyonal na detalye, pagkatapos ay gumawa ng mas kumpletong editable prayer o maghanda ng prompt para sa ChatGPT.')}</p><div class="form-grid"><input id="prayerAiTopic" value="${esc(x.title)}" placeholder="${ui('Prayer topic or need','Paksa o pangangailangan')}"><input id="prayerAiPerson" placeholder="${ui('Person, family, church, or group','Tao, pamilya, iglesia, o grupo')}"><input id="prayerAiScripture" placeholder="${ui('Related Scripture, optional','Kaugnay na talata, opsyonal')}"><select id="prayerAiTone"><option>${ui('Warm and pastoral','Mainit at pastoral')}</option><option>${ui('Powerful and faith-filled','Makapangyarihan at puno ng pananampalataya')}</option><option>${ui('Simple and comforting','Simple at nakaaaliw')}</option><option>${ui('Corporate church prayer','Panalangin para sa buong iglesia')}</option></select><textarea class="wide" id="prayerAiExtra" placeholder="${ui('Extra situation, requests, names, or details','Dagdag na sitwasyon, kahilingan, pangalan, o detalye')}"></textarea></div><div class="resource-buttons"><button class="primary" id="improveLibraryPrayer">✨ ${ui('Improve Prayer','Pagandahin ang Panalangin')}</button><button class="ghost" id="promptLibraryPrayer">🤖 ${ui('Prepare AI Prompt','Ihanda ang AI Prompt')}</button></div><div id="prayerAiPanel" style="display:none;margin-top:14px"><textarea id="prayerAiDraft" class="draft-area" style="min-height:520px"></textarea><div class="resource-buttons"><button class="primary" id="saveImprovedPrayer">${ui('Save as My Custom Prayer','I-save bilang Custom Prayer')}</button><button class="ghost" id="copyImprovedPrayer">${ui('Copy','Kopyahin')}</button></div><div class="notice small-note">${ui('Review generated wording and Scripture references before using it publicly.','Suriin ang generated wording at mga talata bago gamitin sa publiko.')}</div></div></section>`;
 let customised=!!resourceOverrides()[resourceKey(o.kind,o.index)];view.innerHTML=`<button class="ghost" id="backLib">← ${ui('Back to library','Bumalik sa aklatan')}</button><article class="resource-page" id="resourceDisplay">${body}<div class="resource-buttons"><button class="primary" id="editResource">✏️ ${ui('Edit','I-edit')}</button>${['devotional','exhortation','study','kids'].includes(o.kind)?`<button class="primary" id="presentBuiltInResource">🖥️ ${ui('Present','I-present')}</button>`:''}${customised?`<button class="ghost" id="resetResource">↺ ${ui('Restore Original','Ibalik ang Original')}</button>`:''}<button class="danger" id="removeResource">${ui('Remove','Alisin')}</button><button class="ghost" id="copyResource">${ui('Copy','Kopyahin')}</button><button class="ghost" id="printResource">${ui('Print','I-print')}</button></div></article><div id="resourceEditHost"></div>`;
 wireScriptureLinks();const back=()=>route({devotional:'devotionals',exhortation:'exhortations',study:'studies',kids:'kidslibrary',prayer:'prayerlibrary'}[o.kind]);$('#backLib').onclick=back;if($('#presentBuiltInResource'))$('#presentBuiltInResource').onclick=()=>{const localized=appLanguage==='tl'&&x.tl?{...x,...x.tl}:x;const pdata=presentationResourceText(o.kind,localized);startResourcePresentation({title:pdata.title||localized.title||'',passage:pdata.passage||localized.scripture||localized.story||localized.text||localized.main||'',body:pdata.body||'',image:o.kind==='kids'?(localized.image||x.image||''):'',originPage:({devotional:'devotionals',exhortation:'exhortations',study:'studies',kids:'kidslibrary'})[o.kind]||'resource',source:{type:'builtIn',kind:o.kind,index:Number(o.index)},variants:builtInPresentationVariants(o.kind,Number(o.index))})};$('#copyResource').onclick=async()=>{await navigator.clipboard.writeText($('#resourceDisplay').innerText);toast(ui('Resource copied','Nakopya ang materyales'))};$('#printResource').onclick=()=>window.print();$('#editResource').onclick=()=>{$('#resourceEditHost').innerHTML=resourceEditor(o.kind,x);$('#resourceDisplay').style.display='none';$('#resourceEditor').scrollIntoView({behavior:'smooth',block:'start'});$('#cancelResourceEdit').onclick=()=>resource();$('#saveResourceEdit').onclick=()=>{let data=collectResourceEdit(o.kind);if(!data.title)return toast(ui('Please add a title','Maglagay ng pamagat'));saveResourceOverride(o.kind,o.index,data);toast(ui('Changes saved','Na-save ang pagbabago'));resource()}};$('#removeResource').onclick=()=>{if(confirm(ui('Remove this resource from your library on this device?','Alisin ang materyales na ito sa library sa device na ito?'))){hideResource(o.kind,o.index);back()}};if($('#resetResource'))$('#resetResource').onclick=()=>{if(confirm(ui('Restore the original built-in version?','Ibalik ang original na built-in version?'))){resetResourceOverride(o.kind,o.index);resource()}};
 if(o.kind==='prayer'){const details=()=>({topic:$('#prayerAiTopic').value.trim(),person:$('#prayerAiPerson').value.trim(),scripture:$('#prayerAiScripture').value.trim(),tone:$('#prayerAiTone').value,extra:$('#prayerAiExtra').value.trim()});const showPrayerDraft=text=>{$('#prayerAiDraft').value=text;$('#prayerAiPanel').style.display='block';$('#prayerAiPanel').scrollIntoView({behavior:'smooth',block:'start'})};$('#improveLibraryPrayer').onclick=()=>{showPrayerDraft(improvedLibraryPrayer(x,details()));toast(ui('Improved prayer created','Nagawa ang mas kumpletong panalangin'))};$('#promptLibraryPrayer').onclick=async()=>{let prompt=libraryPrayerPrompt(x,details());showPrayerDraft(prompt);try{await navigator.clipboard.writeText(prompt)}catch{}toast(ui('AI prompt prepared and copied','Naihanda at nakopya ang AI prompt'))};$('#copyImprovedPrayer').onclick=async()=>{try{await navigator.clipboard.writeText($('#prayerAiDraft').value);toast(ui('Prayer copied','Nakopya ang panalangin'))}catch{toast(ui('Select and copy manually','Piliin at kopyahin nang manual'))}};$('#saveImprovedPrayer').onclick=()=>{let text=$('#prayerAiDraft').value.trim();if(!text)return toast(ui('Create or write a prayer first','Gumawa o sumulat muna ng panalangin'));saveResourceOverride('prayer',o.index,{...x,text});toast(ui('Custom prayer saved','Na-save ang custom prayer'));resource()}}
 if(o.kind==='kids'){const kd={title:x.title,passage:x.story,story:x.story,verse:x.memory,memory:x.memory,age:x.age,goal:x.lesson,lesson:x.lesson,notes:x.activity+' '+x.craft};const show=text=>{$('#libraryKidsBody').value=text;$('#libraryKidsPanel').style.display='block';$('#libraryKidsPanel').scrollIntoView({behavior:'smooth',block:'start'})};$('#libraryKidsPpt').onclick=()=>show(kidsPresentationOutline(kd));$('#libraryKidsPack').onclick=()=>show(kidsResourcePack(kd));$('#libraryKidsCopy').onclick=async()=>{try{await navigator.clipboard.writeText($('#libraryKidsBody').value);toast(ui('Resource copied','Nakopya ang resource'))}catch{toast(ui('Select and copy manually','Piliin at kopyahin nang manual'))}}}
}
function devotionals(){title(ui('Devotionals','Mga Debosyonal'),ui('Built-in devotionals and your own saved creations.','Mga built-in devotional at sarili mong naka-save.'));view.innerHTML=libraryShell(ui('Daily Devotional Library','Aklatan ng mga Debosyonal'),ui('Open built-in devotionals or personal created devotionals.','Buksan ang built-in o personal na devotional.'),ui('Devotional','Debosyonal'));const draw=q=>{let mine=userLibrary('devotional').filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));let built=DEVOTIONALS.map((raw,i)=>({...effectiveResource('devotional',i,raw),_i:i})).filter(x=>!isResourceDeleted('devotional',x._i)&&JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));$('#libres').innerHTML=(mine.length?`<h2>${ui('My Saved Devotionals','Aking Naka-save na Debosyonal')}</h2>`+mine.map(x=>`<button class="resource-card" data-custom-devotional="${x.id}"><span class="pill">${esc(x.theme||ui('Personal Devotional','Personal na Debosyonal'))}</span><h3>${esc(x.title)}</h3>${x.scripture?`<b>${esc(x.scripture)}</b>`:''}<p>${esc((x.body||'').slice(0,150))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')+(built.length?`<h2>${ui('Built-in Devotionals','Mga Built-in na Debosyonal')}</h2>`+built.map(x=>`<button class="resource-card" data-i="${x._i}"><span class="pill">${esc(x.theme)}</span><h3>${esc(x.title)}</h3><b>${esc(x.scripture)}</b><p>${esc((x.reflection||'').slice(0,150))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')||`<div class="empty">${ui('No devotionals found.','Walang nahanap na debosyonal.')}</div>`;document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openResource('devotional',+b.dataset.i));document.querySelectorAll('[data-custom-devotional]').forEach(b=>b.onclick=()=>openUserResource('devotional',b.dataset.customDevotional))};draw('');wireLibrary(draw,ui('Devotional','Debosyonal'))}
function exhortations(){title(ui('Exhortations','Mga Exhortation'),ui('Built-in encouragements and your own saved creations.','Mga built-in encouragement at sarili mong naka-save.'));view.innerHTML=libraryShell(ui('Exhortation Library','Aklatan ng mga Exhortation'),ui('Open built-in exhortations or personal created exhortations.','Buksan ang built-in o personal na exhortation.'),ui('Exhortation','Exhortation'));const draw=q=>{let mine=userLibrary('exhortation').filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));let built=EXHORTATIONS.map((raw,i)=>({...effectiveResource('exhortation',i,raw),_i:i})).filter(x=>!isResourceDeleted('exhortation',x._i)&&JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));$('#libres').innerHTML=(mine.length?`<h2>${ui('My Saved Exhortations','Aking Naka-save na Exhortation')}</h2>`+mine.map(x=>`<button class="resource-card" data-custom-exhortation="${x.id}"><span class="pill">${esc(x.category||ui('Personal Exhortation','Personal na Exhortation'))}</span><h3>${esc(x.title)}</h3>${x.scripture?`<b>${esc(x.scripture)}</b>`:''}<p>${esc((x.body||'').slice(0,150))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')+(built.length?`<h2>${ui('Built-in Exhortations','Mga Built-in na Exhortation')}</h2>`+built.map(x=>`<button class="resource-card" data-i="${x._i}"><span class="pill">${esc(x.category)}</span><h3>${esc(x.title)}</h3><b>${esc(x.main)}</b><p>${esc(x.intro)}</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')||`<div class="empty">${ui('No exhortations found.','Walang nahanap na exhortation.')}</div>`;document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openResource('exhortation',+b.dataset.i));document.querySelectorAll('[data-custom-exhortation]').forEach(b=>b.onclick=()=>openUserResource('exhortation',b.dataset.customExhortation))};draw('');wireLibrary(draw,'Exhortation')}
function studies(){title(ui('Bible Studies','Pag-aaral ng Biblia'),ui('Built-in studies and your own saved Bible studies.','Mga built-in study at sarili mong naka-save na Bible study.'));view.innerHTML=libraryShell(ui('Bible Study Library','Aklatan ng Pag-aaral ng Biblia'),ui('Open built-in studies or your personal AI-created studies.','Buksan ang built-in o personal na AI-created studies.'),ui('Bible Study','Pag-aaral'));const draw=q=>{let mine=userLibrary('study').filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));let built=BIBLE_STUDIES.map((raw,i)=>({...effectiveResource('study',i,raw),_i:i})).filter(x=>!isResourceDeleted('study',x._i)&&JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));$('#libres').innerHTML=(mine.length?`<h2>${ui('My Saved Bible Studies','Aking Naka-save na Bible Studies')}</h2>`+mine.map(x=>`<button class="resource-card" data-custom-study="${x.id}"><span class="pill">${esc(x.type||ui('Personal Study','Personal na Pag-aaral'))}</span><h3>${esc(x.title)}</h3>${x.scripture?`<b>${esc(x.scripture)}</b>`:''}<p>${esc((x.body||'').slice(0,150))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')+(built.length?`<h2>${ui('Built-in Bible Studies','Mga Built-in Bible Study')}</h2>`+built.map(x=>`<button class="resource-card" data-i="${x._i}"><span class="pill">${esc(x.type)}</span><h3>${esc(x.title)}</h3><b>${esc(x.passage)}</b><p>${esc(x.objective)}</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')||`<div class="empty">${ui('No studies found.','Walang nahanap na pag-aaral.')}</div>`;document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openResource('study',+b.dataset.i));document.querySelectorAll('[data-custom-study]').forEach(b=>b.onclick=()=>openUserResource('study',b.dataset.customStudy))};draw('');wireLibrary(draw,ui('Bible Study','Pag-aaral'))}
function kidslibrary(){title(ui('Kids Lessons','Mga Aralin para sa Bata'),ui('Built-in lessons and your own saved Kids Ministry Studio lessons.','Mga built-in lesson at sarili mong naka-save mula sa Kids Ministry Studio.'));view.innerHTML=libraryShell(ui("Children's Lesson Library",'Aklatan ng Aralin para sa Bata'),ui('Open built-in lessons or your personal created lessons.','Buksan ang built-in o personal na ginawang lesson.'),ui('Kids Lesson','Aralin'));const draw=q=>{let mine=userLibrary('kids').filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));let built=KIDS_LESSONS.map((raw,i)=>({...effectiveResource('kids',i,raw),_i:i})).filter(x=>!isResourceDeleted('kids',x._i)&&JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));$('#libres').innerHTML=(mine.length?`<h2>${ui('My Saved Kids Lessons','Aking Naka-save na Kids Lessons')}</h2>`+mine.map(x=>`<button class="resource-card illustrated" data-custom-kids="${x.id}"><img src="${esc(x.image||kidsIllustrationFor(x.title,x.scripture||x.passage))}" alt="${esc(x.title||ui('Kids lesson illustration','Larawan ng kids lesson'))}"><div><span class="pill">${esc(x.age||ui('Children','Mga Bata'))}</span><h3>${esc(x.title)}</h3>${x.scripture?`<b>${esc(x.scripture)}</b>`:''}<p>${esc((x.theme||x.body||'').slice(0,150))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></div></button>`).join(''):'')+(built.length?`<h2>${ui('Built-in Kids Lessons','Mga Built-in Kids Lesson')}</h2>`+built.map(x=>`<button class="resource-card illustrated" data-i="${x._i}"><img src="${esc(x.image||'')}" alt=""><div><span class="pill">${ui('Ages','Edad')} ${esc(x.age)}</span><h3>${esc(x.title)}</h3><b>${esc(x.story)}</b><p>${esc((x.lesson||'').slice(0,130))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></div></button>`).join(''):'')||`<div class="empty">${ui('No lessons found.','Walang nahanap na aralin.')}</div>`;document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openResource('kids',+b.dataset.i));document.querySelectorAll('[data-custom-kids]').forEach(b=>b.onclick=()=>openUserResource('kids',b.dataset.customKids))};draw('');wireLibrary(draw,ui('Kids Lesson','Aralin'))}
function prayerlibrary(){title(ui('Prayer Library','Aklatan ng Panalangin'),ui('Built-in prayers and prayers you created and saved.','Mga built-in prayer at sarili mong ginawa at nai-save.'));view.innerHTML=libraryShell(ui('Prayer Library','Aklatan ng Panalangin'),ui('Open built-in prayers or your personal AI-created prayers.','Buksan ang built-in o personal na AI-created prayers.'),ui('Prayer','Panalangin'));const draw=q=>{let mine=userLibrary('prayer').filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));let built=PRAYER_LIBRARY.map((raw,i)=>({...effectiveResource('prayer',i,raw),_i:i})).filter(x=>!isResourceDeleted('prayer',x._i)&&JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));$('#libres').innerHTML=(mine.length?`<h2>${ui('My Saved Prayers','Aking Naka-save na Panalangin')}</h2>`+mine.map(x=>`<button class="resource-card" data-custom-prayer="${x.id}"><span class="pill">${esc(x.category||ui('My Prayer','Aking Panalangin'))}</span><h3>${esc(x.title)}</h3>${x.scripture?`<b>${esc(x.scripture)}</b>`:''}<p>${esc((x.body||x.text||'').slice(0,170))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')+(built.length?`<h2>${ui('Built-in Prayers','Mga Built-in na Panalangin')}</h2>`+built.map(x=>`<button class="resource-card" data-i="${x._i}"><span class="pill">${esc(x.category)}</span><h3>${esc(x.title)}</h3><p>${esc((x.text||'').slice(0,170))}…</p><span class="open-label">${ui('Open or edit →','Buksan o i-edit →')}</span></button>`).join(''):'')||`<div class="empty">${ui('No prayers found.','Walang nahanap na panalangin.')}</div>`;document.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>openResource('prayer',+b.dataset.i));document.querySelectorAll('[data-custom-prayer]').forEach(b=>b.onclick=()=>openUserResource('prayer',b.dataset.customPrayer))};draw('');wireLibrary(draw,ui('Prayer','Panalangin'))}
const creatorFields={
 'Devotional':['Theme','Main Scripture','Audience','Tone','Length'],
 'Exhortation':['Theme','Main Scripture','Audience','Tone','Length'],
 'Prayer':['Prayer Topic','Scripture (optional)','Person or Group','Tone','Length'],
 'Bible Study':['Study Topic','Main Passage','Audience','Study Style','Length'],
 'Kids Lesson':['Lesson Theme','Bible Passage','Age Group','Learning Goal','Length']
};
function makeOfflineDraft(type,v){let topic=v[0]||'Growing in Faith',verse=v[1]||'Proverbs 3:5–6',aud=v[2]||'Adults',tone=v[3]||'Encouraging';if(type==='Prayer')return `Title: Prayer for ${topic}\n\nScripture focus: ${verse}\n\nFather, we come before You concerning ${topic.toLowerCase()}. Help ${aud.toLowerCase()} to trust Your character, receive Your wisdom, and walk in faithful obedience. Where there is fear, give peace. Where there is weakness, provide strength. Let Your Word guide every decision, and may this situation bring honour to Jesus Christ. Amen.`;if(type==='Kids Lesson')return `Title: ${topic}\nAge group: ${aud}\nBible passage: ${verse}\n\nOpening Prayer:\nDear God, help us listen to Your Word and learn how to follow You. Amen.\n\nMain Truth:\nGod is faithful, and we can respond with trust and obedience.\n\nBible Story:\nRead ${verse}. Explain the story in simple language and point children to what it teaches about God.\n\nDiscussion Questions:\n1. What happened in the story?\n2. What do we learn about God?\n3. What can we do this week?\n\nActivity:\nCreate a simple role-play or matching game connected to ${topic.toLowerCase()}.\n\nMemory Verse: ${verse}\n\nClosing Prayer:\nLord, help us remember and obey what we learned. Amen.`;if(type==='Bible Study')return `Title: ${topic}\nMain passage: ${verse}\nAudience: ${aud}\n\nObjective:\nUnderstand what the passage teaches about God, people, faith, and obedient living.\n\nObservation:\nRead the passage twice. Note repeated words, commands, promises, and important people or events.\n\nDiscussion Questions:\n1. What does the passage say?\n2. What does it reveal about God?\n3. What truth corrects or encourages us?\n4. How should we respond this week?\n\nLeader Note:\nKeep the main passage central and distinguish clearly between Scripture and application.\n\nApplication:\nChoose one specific act of obedience.\n\nPrayer:\nAsk God to help the group understand and live out His Word.`;if(type==='Exhortation')return `Title: ${topic}\nMain Scripture: ${verse}\nAudience: ${aud}\nTone: ${tone}\n\nIntroduction:\nOur circumstances may change, but God remains faithful. ${topic} calls us to listen to His Word and respond with trust.\n\n1. Remember who God is\nGod's character is the foundation of our confidence.\n\n2. Receive what Scripture says\nFaith grows as we submit our thoughts and feelings to God's truth.\n\n3. Respond with obedience\nBiblical encouragement should lead to a practical step of faith.\n\nApplication:\nName one area where this truth must shape your decisions today.\n\nClosing Challenge:\nDo not merely admire the message—live it.\n\nPrayer:\nLord, establish this truth in our hearts and help us obey You. Amen.`;return `Title: ${topic}\nScripture: ${verse}\nAudience: ${aud}\nTone: ${tone}\n\nReflection:\nGod invites us to meet Him in His Word. As we consider ${topic.toLowerCase()}, we are reminded that His character is trustworthy and His grace is sufficient. The passage calls us away from self-reliance and toward a faithful response rooted in prayer and obedience.\n\nApplication:\nIdentify one thought, habit, or decision that should change because of this Scripture.\n\nReflection Questions:\n1. What does this passage reveal about God?\n2. What response is God inviting from me?\n\nPrayer:\nFather, teach me through Your Word and help me live this truth today. Amen.`}
function ministryStudioSeed(topic=''){
 const sets=[
  {topic:ui('Trusting God in Uncertain Times','Pagtitiwala sa Diyos sa Panahon ng Kawalan ng Katiyakan'),title:ui('Faith Beyond What We See','Pananampalatayang Higit sa Nakikita'),scripture:'Proverbs 3:5-6'},
  {topic:ui('God’s Faithfulness','Katapatan ng Diyos'),title:ui('Great Is His Faithfulness','Dakila ang Kanyang Katapatan'),scripture:'Lamentations 3:22-23'},
  {topic:ui('Prayer and Peace','Panalangin at Kapayapaan'),title:ui('Peace Through Prayer','Kapayapaan sa Pamamagitan ng Panalangin'),scripture:'Philippians 4:6-7'},
  {topic:ui('Serving Others','Paglilingkod sa Kapwa'),title:ui('Called to Serve in Love','Tinawag na Maglingkod sa Pag-ibig'),scripture:'Galatians 5:13'},
  {topic:ui('Hope During Trials','Pag-asa sa Gitna ng Pagsubok'),title:ui('Hope That Holds Us','Pag-asang Humahawak sa Atin'),scripture:'Romans 5:3-5'},
  {topic:ui('Abiding in Christ','Pananatili kay Cristo'),title:ui('Remain in the True Vine','Manatili sa Tunay na Puno ng Ubas'),scripture:'John 15:1-8'}
 ];
 if(topic.trim()){let base=simpleResourceDefaults('study',{topic});return {topic,title:base.title,scripture:base.scripture}}
 return sets[Math.floor(Math.random()*sets.length)]
}

function ministryIdeaPool(){return [
 {topic:'Trusting God in uncertainty',title:'Faith When the Way Is Unclear',scripture:'Proverbs 3:5-6'},
 {topic:'God’s peace in anxious times',title:'Peace That Guards the Heart',scripture:'Philippians 4:4-9'},
 {topic:'Persevering through trials',title:'Joy and Growth in Trials',scripture:'James 1:2-8'},
 {topic:'Abiding in Christ',title:'Remain in the True Vine',scripture:'John 15:1-11'},
 {topic:'Living by faith',title:'Walking by Faith, Not by Sight',scripture:'2 Corinthians 5:1-10'},
 {topic:'Serving one another',title:'Called to Serve in Love',scripture:'Galatians 5:13-14'},
 {topic:'Forgiveness and grace',title:'Freely Forgiven, Ready to Forgive',scripture:'Colossians 3:12-15'},
 {topic:'Courage in God’s presence',title:'Be Strong and Courageous',scripture:'Joshua 1:1-9'},
 {topic:'Prayer that trusts God',title:'Pray Without Losing Heart',scripture:'Luke 18:1-8'},
 {topic:'The Good Shepherd',title:'Known and Kept by the Shepherd',scripture:'John 10:1-18'},
 {topic:'Hope in suffering',title:'A Living Hope',scripture:'1 Peter 1:3-9'},
 {topic:'Renewing the mind',title:'Transformed by the Renewal of Your Mind',scripture:'Romans 12:1-2'},
 {topic:'God’s faithfulness',title:'Great Is Your Faithfulness',scripture:'Lamentations 3:19-26'},
 {topic:'Love in action',title:'Love That Can Be Seen',scripture:'1 John 3:16-24'},
 {topic:'The armour of God',title:'Standing Firm in God’s Strength',scripture:'Ephesians 6:10-18'},
 {topic:'Jesus calms the storm',title:'Jesus Is Lord Over the Storm',scripture:'Mark 4:35-41'},
 {topic:'The Good Samaritan',title:'Go and Do Likewise',scripture:'Luke 10:25-37'},
 {topic:'David and Goliath',title:'Courage Bigger Than Fear',scripture:'1 Samuel 17'},
 {topic:'Daniel’s faithfulness',title:'Faithful When It Is Difficult',scripture:'Daniel 6'},
 {topic:'The lost sheep',title:'Every One Matters to God',scripture:'Luke 15:1-7'}
]}
function unusedMinistryIdea(type){
 const kind=({Devotional:'devotional',Exhortation:'exhortation','Bible Study':'study','Kids Lesson':'kids',Prayer:'prayer'})[type]||'study';
 const saved=userLibrary(kind); const used=new Set(saved.map(x=>String(x.title||'').toLowerCase().trim()));
 const available=ministryIdeaPool().filter(x=>!used.has(x.title.toLowerCase()));
 const pool=available.length?available:ministryIdeaPool();
 return pool[Math.floor(Math.random()*pool.length)];
}
function completeMinistryDraft(type,d){const t=d.title,topic=d.topic,s=d.scripture,a=d.audience||ui('Everyone','Lahat');
 if(type==='Prayer')return `TITLE: ${t}
TOPIC / PERSON: ${topic}
RELATED SCRIPTURE: ${s}
AUDIENCE: ${a}

SCRIPTURE FOCUS:
Read ${s} slowly and use its truth to guide the prayer.

THANKSGIVING:
Father, thank You for Your goodness, mercy, faithfulness, and presence.

SURRENDER:
We place this need before You and submit our plans, fears, and expectations to Your wisdom.

SPECIFIC PRAYER:
Lord, please give strength, wisdom, provision, healing according to Your will, protection, and peace for ${topic}. Help every person involved to trust You and walk faithfully.

SUPPORTING SCRIPTURES:
Philippians 4:6–7; Psalm 46:1; Isaiah 41:10

FAITH RESPONSE / APPLICATION:
Choose one practical act of faith today: pray again, forgive, ask for help, encourage someone, or take the next wise step.

CLOSING:
We trust Your character even while we wait for Your answer. Lead us by Your Spirit and keep us faithful. In Jesus’ name, amen.`;
 if(type==='Devotional')return `TITLE: ${t}\nTHEME: ${topic}\nMAIN SCRIPTURE: ${s}\nAUDIENCE: ${a}\n\nSUGGESTED READING:\n${s}; Psalm 119:105; James 1:22-25\n\nREFLECTION:\nGod meets us through His Word and calls us to trust His character. Read the passage in context and notice what it reveals about God, the human heart, and faithful living. Biblical devotion is more than receiving encouragement; it invites a response of worship, trust, repentance, and obedience.\n\nPRACTICAL APPLICATIONS:\n1. Write one truth from the passage that you need to remember today.\n2. Identify one attitude, habit, decision, or relationship that should change because of this truth.\n3. Choose one specific act of obedience you can complete within the next twenty-four hours.\n4. Share one encouragement from the passage with another person.\n\nGOOD SUGGESTIONS FOR TODAY:\n• Read the main passage twice in two different translations if available.\n• Pray the main truth back to God in your own words.\n• Put the key verse somewhere visible.\n• End the day by reviewing how you responded.\n\nREFLECTION QUESTIONS WITH SUGGESTED ANSWERS:\n1. What does this passage reveal about God?\nSuggested answer: It shows that God is faithful, present, wise, and worthy of trust. Adjust this answer to the exact emphasis of the passage.\n2. What does it expose or correct in me?\nSuggested answer: It may reveal fear, self-reliance, impatience, unbelief, or delayed obedience.\n3. What promise, command, warning, or example should I notice?\nSuggested answer: State the clearest promise or command from ${s} in your own words.\n4. What faithful response can I make today?\nSuggested answer: Choose one measurable action involving prayer, forgiveness, encouragement, service, or obedience.\n\nCONCLUSION:\nGod’s Word is not only information to understand but truth to live. Let this passage shape your thoughts, choices, relationships, and worship today.\n\nCLOSING PRAYER:\nFather, open my heart to Your Word. Help me trust You, obey what You show me, and reflect Christ in my daily life. Give me wisdom for today and grace to follow through. In Jesus’ name, amen.`;
 if(type==='Exhortation')return `TITLE: ${t}\nTHEME: ${topic}\nMAIN SCRIPTURE: ${s}\nAUDIENCE: ${a}\n\nSUGGESTED READING:\n${s}; Psalm 46:1; Isaiah 41:10; James 1:22\n\nINTRODUCTION:\nWe all face moments when faith must move from words into action. This passage calls us to remember who God is, receive His truth, and respond with courage and obedience.\n\n1. REMEMBER GOD’S CHARACTER\nOur confidence rests not in changing circumstances but in the unchanging character of God.\n\n2. RECEIVE THE TRUTH OF SCRIPTURE\nLet the passage correct fear, renew the mind, and strengthen faith. Keep the main text central and read it in context.\n\n3. RESPOND WITH OBEDIENCE\nTrue encouragement leads to a concrete next step: prayer, forgiveness, service, patience, generosity, or courageous witness.\n\nSUPPORTING SCRIPTURES:\nPsalm 46:1; Isaiah 41:10; Romans 12:2; James 1:22-25\n\nAI APPLICATION:\n1. Name the area where you have been hesitating or afraid.\n2. Write the truth from ${s} that speaks directly to that area.\n3. Take one obedient step within the next forty-eight hours.\n4. Ask a trusted believer to pray with you and help you remain accountable.\n\nCLOSING CHALLENGE:\nDo not leave this truth as a good idea. Carry it into your next conversation, decision, and act of service. Before this day ends, do one thing that demonstrates trust in God.\n\nCONCLUSION:\nThe God who calls us is faithful. We can move forward because His presence, promises, and Word are dependable.\n\nCLOSING PRAYER:\nFaithful God, establish this truth in our hearts. Replace fear with faith, delay with obedience, and discouragement with hope. Give us courage to live what we have heard and grace to encourage others. In Jesus’ name, amen.`;
 if(type==='Bible Study')return `TITLE: ${t}\nTOPIC: ${topic}\nMAIN PASSAGE: ${s}\nAUDIENCE: ${a}\n\nPREPARATION READING:\n${s}; Psalm 119:105; Romans 12:2; James 1:22-25\n\nOBJECTIVE:\nUnderstand what the passage teaches about God, people, faith, and obedient living, then identify a clear personal and group response.\n\nBACKGROUND AND CONTEXT:\nIdentify the biblical book, writer, original audience, surrounding chapter, and situation being addressed. Read before and after the selected verses so conclusions remain faithful to context.\n\nOBSERVATION:\n1. What happens or is taught in the passage?\n2. Which words or ideas are repeated?\n3. What commands, promises, warnings, contrasts, or examples appear?\n\nMAIN TEACHING POINTS:\n1. God reveals His character and purposes.\n2. Scripture exposes the condition and need of the human heart.\n3. Faith responds through trust, repentance, worship, and obedience.\n\nSUPPORTING SCRIPTURES:\nPsalm 119:105; Romans 12:1-2; 2 Timothy 3:16-17; James 1:22-25\n\nDISCUSSION QUESTIONS WITH SUGGESTED ANSWERS:\n1. What is the main message of the passage?\nSuggested answer: Summarise ${s} in one clear sentence, keeping the author’s main emphasis.\n2. What does it reveal about God?\nSuggested answer: It reveals God’s character, authority, mercy, faithfulness, holiness, or saving purpose as shown in the text.\n3. What does it reveal about people?\nSuggested answer: It shows our need for grace, our tendency toward fear or self-reliance, and our responsibility to respond in faith.\n4. Is there a command to obey, promise to trust, sin to avoid, or example to follow?\nSuggested answer: Identify the strongest one directly from the passage and explain it in everyday language.\n5. How does this passage connect to Jesus and the gospel?\nSuggested answer: Explain how the text points to Christ’s character, work, teaching, kingdom, grace, or the believer’s new life in Him.\n6. How can our group live this truth this week?\nSuggested answer: Choose one practical action that is specific, measurable, realistic, and rooted in the passage.\n\nPERSONAL APPLICATION:\nWrite one truth to believe, one behaviour to change, one person to encourage, and one action to complete this week.\n\nLEADER NOTES:\nInvite several answers before offering the suggested response. Keep returning the discussion to the main passage. The answers above are guides and should be edited to fit the exact context and audience.\n\nCONCLUSION:\nBiblical study is complete when understanding becomes faithful living. Return to the main passage and summarise its central truth together.\n\nCLOSING PRAYER:\nFather, give us understanding through Your Word and grace to obey what we have learned. Shape our minds, choices, and relationships through this truth. In Jesus’ name, amen.`;
 if(type==='Kids Lesson')return `LESSON TITLE: ${t}\nMAIN TRUTH: ${topic}\nBIBLE PASSAGE: ${s}\nAGE GROUP: ${d.audience||ui('Ages 6–12','Edad 6–12')}\n\nTEACHER PREPARATION:\nRead ${s} before class. Identify one clear truth about God and one simple response for children.\n\nILLUSTRATION IDEA:\nUse the lesson picture as a visual introduction. Ask the children what they notice, what they think may happen, and how the picture connects to the Bible story.\n\nOPENING PRAYER:\nDear God, help us listen, understand Your Word, and learn to follow Jesus. Amen.\n\nLESSON AIM:\nChildren will understand the main truth and choose one age-appropriate way to practise it.\n\nICEBREAKER:\nAsk children to share a time when they needed help, courage, patience, kindness, or trust.\n\nBIBLE STORY:\nRead or retell ${s} in simple language. Explain who was involved, what happened, what God did, and why it matters. Do not add details that are not in Scripture.\n\nTEACHING POINTS:\n1. God is good and faithful.\n2. We can listen to and trust His Word.\n3. Faith is shown through loving obedience.\n\nDISCUSSION QUESTIONS WITH SUGGESTED ANSWERS:\n1. Who were the main people in the story?\nSuggested answer: Name the people directly mentioned in ${s}.\n2. What happened first, next, and last?\nSuggested answer: Retell the main events in three simple steps.\n3. What do we learn about God?\nSuggested answer: God is good, powerful, faithful, loving, and worthy of trust, according to the story.\n4. What did the people do well or need to change?\nSuggested answer: Point to their faith, obedience, fear, kindness, or need to listen to God.\n5. What should we do this week?\nSuggested answer: Choose one simple action such as telling the truth, helping someone, praying, forgiving, sharing, or obeying quickly.\n\nMEMORY VERSE:\n${s}\nRead it together, explain its meaning, and repeat it with simple hand actions.\n\nGAME:\nCreate a team relay or matching game using key words, events, and the memory verse.\n\nCRAFT:\nMake a Scripture reminder card showing one scene from the story, the main truth, and one action step.\n\nWEEKLY CHALLENGE:\nDo one act of kindness or obedience and tell a parent or teacher what you learned.\n\nREVIEW AND CONCLUSION:\nRepeat the main truth together. Ask children to explain it in their own words and name one way to live it.\n\nPARENT TAKEAWAY:\nRead ${s} together at home and discuss one practical family application.\n\nCLOSING PRAYER:\nLord Jesus, thank You for Your Word. Help us remember this lesson, trust You, and obey You with joyful hearts. Amen.`;
 return ''
}
function creator(){let type=store.get('creatorType','Devotional');const types=['Devotional','Exhortation','Bible Study','Kids Lesson','Prayer'];if(!types.includes(type))type='Devotional';title(ui('AI Ministry Studio','AI Ministry Studio'),ui('Create a complete resource from a few details—or leave everything blank for a random lesson or message.','Gumawa ng kumpletong materyales mula sa kaunting detalye—o iwang blangko para sa random na aralin o mensahe.'));view.innerHTML=`<div class="creator-layout"><section class="card"><label class="field-label">${ui('What would you like to create?','Ano ang nais mong gawin?')}<select id="ctype">${types.map(x=>`<option ${x===type?'selected':''}>${x}</option>`).join('')}</select></label><div class="form-grid"><input id="studioTopic" placeholder="${ui('Topic or theme (optional)','Paksa o tema (opsyonal)')}"><input id="studioTitle" placeholder="${ui('Title (optional)','Pamagat (opsyonal)')}"><input id="studioScripture" placeholder="${ui('Bible passage (optional)','Talata sa Biblia (opsyonal)')}"><input id="studioAudience" placeholder="${ui('Audience or age group (optional)','Audience o edad (opsyonal)')}"><textarea class="wide" id="studioNotes" placeholder="${ui('Extra instructions or personal notes (optional)','Karagdagang tagubilin o personal notes (opsyonal)')}"></textarea><div class="wide ai-assist-row"><button class="primary" id="studioGenerate">✨ ${ui('Generate Complete Resource','Gumawa ng Kumpletong Materyales')}</button><button class="ghost" id="studioRandom">🎲 ${ui('Inspire Me','Bigyan Ako ng Inspirasyon')}</button><button class="ghost" id="studioPack">📦 ${ui('Generate Ministry Pack','Gumawa ng Ministry Pack')}</button><button class="ghost" id="studioClear">${ui('Clear','Burahin')}</button></div></div><div class="notice small-note">${ui('All fields are optional. Blank fields create a fresh random topic, title, Scripture, reading, conclusion, application, and prayer. Always review generated teaching against Scripture before ministry use.','Opsyonal ang lahat ng field. Kapag blangko, gagawa ito ng random na paksa, pamagat, talata, reading, conclusion, application, at prayer. Palaging suriin ayon sa Kasulatan bago gamitin.')}</div></section><section class="card"><div class="draft-head"><h3>${ui('Editable Complete Draft','Editable na Kumpletong Draft')}</h3><span class="pill">${ui('Review before saving','Suriin bago i-save')}</span></div><textarea id="draft" class="draft-area" style="min-height:620px" placeholder="${ui('Your complete ministry resource will appear here...','Lalabas dito ang kumpletong ministry resource...')}"></textarea><div class="creator-buttons"><button class="primary" id="saveDraft">${ui('Save to Correct Library','I-save sa Tamang Library')}</button><button class="ghost" id="copyDraft">${ui('Copy','Kopyahin')}</button></div></section></div>`;
 const fill=(forceRandom=false)=>{let topic=$('#studioTopic').value.trim(),blank=!topic&&!$('#studioTitle').value.trim()&&!$('#studioScripture').value.trim(),seed=(forceRandom||blank)?unusedMinistryIdea(type):ministryStudioSeed(topic);if(forceRandom||!topic)$('#studioTopic').value=seed.topic;if(forceRandom||!$('#studioTitle').value.trim())$('#studioTitle').value=seed.title;if(forceRandom||!$('#studioScripture').value.trim())$('#studioScripture').value=seed.scripture;return {topic:$('#studioTopic').value.trim(),title:$('#studioTitle').value.trim(),scripture:$('#studioScripture').value.trim(),audience:$('#studioAudience').value.trim(),notes:$('#studioNotes').value.trim()}};
 const generate=(random=false)=>{type=$('#ctype').value;store.set('creatorType',type);let d=fill(random);$('#draft').value=completeMinistryDraft(type,d)+(d.notes?`\n\nPERSONAL NOTES / EXTRA INSTRUCTIONS:\n${d.notes}`:'');toast(random?ui('A fresh random resource was created','Nagawa ang bagong random na materyales'):ui('Complete resource created','Nagawa ang kumpletong materyales'))};
 $('#studioGenerate').onclick=()=>generate(false);$('#studioRandom').onclick=()=>generate(true);$('#studioClear').onclick=()=>{['studioTopic','studioTitle','studioScripture','studioAudience','studioNotes','draft'].forEach(id=>$('#'+id).value='')};$('#ctype').onchange=()=>{type=$('#ctype').value;store.set('creatorType',type)};$('#copyDraft').onclick=async()=>{if(!$('#draft').value.trim())generate(false);try{await navigator.clipboard.writeText($('#draft').value);toast(ui('Copied','Nakopya'))}catch{}};
 $('#saveDraft').onclick=()=>{if(!$('#draft').value.trim())generate(false);let d=fill(false),body=$('#draft').value.trim(),map={'Devotional':['devotional','devotionals'],'Exhortation':['exhortation','exhortations'],'Bible Study':['study','studies'],'Kids Lesson':['kids','kidslibrary'],'Prayer':['prayer','prayerlibrary']},[kind,page]=map[type];saveUserLibrary(kind,{title:d.title,topic:d.topic,theme:d.topic,category:ui('Personal '+type,'Personal na '+type),type:ui('Personal '+type,'Personal na '+type),scripture:d.scripture,passage:d.scripture,main:d.scripture,age:d.audience,image:type==='Kids Lesson'?kidsIllustrationFor(d.title,d.scripture):undefined,text:type==='Prayer'?body:'',body});toast(ui(`Saved to ${type} Library`,`Nai-save sa ${type} Library`));route(page)};
 $('#studioPack').onclick=()=>{let d=fill(false),packTypes=['Devotional','Exhortation','Bible Study','Kids Lesson','Prayer'];packTypes.forEach((pt,i)=>{let kind=({Devotional:'devotional',Exhortation:'exhortation','Bible Study':'study','Kids Lesson':'kids',Prayer:'prayer'})[pt];saveUserLibrary(kind,{id:Date.now()+i,title:d.title+(pt==='Devotional'?' — Devotional':pt==='Exhortation'?' — Exhortation':pt==='Bible Study'?' — Bible Study':pt==='Kids Lesson'?' — Kids Lesson':' — Prayer'),topic:d.topic,theme:d.topic,category:'Ministry Pack',type:'Ministry Pack',scripture:d.scripture,passage:d.scripture,main:d.scripture,age:d.audience,body:completeMinistryDraft(pt,{...d,title:d.title}),text:pt==='Prayer'?completeMinistryDraft(pt,{...d,title:d.title}):''})});$('#draft').value=`MINISTRY PACK CREATED\n\nTheme: ${d.topic}\nMain Scripture: ${d.scripture}\n\n✓ Devotional saved to Devotional Library\n✓ Exhortation saved to Exhortation Library\n✓ Bible Study saved to Bible Study Library\n✓ Kids Lesson saved to Kids Lessons\n✓ Prayer saved to Prayer Library\n\nOpen each library to review, edit, copy, or delete its resource.`;toast(ui('Complete Ministry Pack saved to all five libraries','Nai-save ang Ministry Pack sa limang library'))}
}
function myresources(){title('My Resources','Personal drafts saved only in this browser.');let a=store.get('createdResources');view.innerHTML=`<div class="privacy-card"><div class="privacy-icon">📁</div><div><h3>Private to this browser profile</h3><p>These drafts are not added to the public GitHub library. Use My Backup to move them to another device.</p></div></div><div class="entries">${a.length?a.map(x=>`<article class="entry"><span class="pill">${esc(x.type)}</span><h3>${esc(x.title)}</h3><div class="meta">${esc(x.created)}</div><pre class="saved-resource">${esc(x.text)}</pre><button class="ghost" data-copy="${x.id}">Copy</button> <button class="danger" data-del="${x.id}">Delete</button></article>`).join(''):'<div class="empty">You have not saved any created resources yet.</div>'}</div>`;document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{let x=a.find(y=>y.id==b.dataset.copy);await navigator.clipboard.writeText(x.text);toast('Copied')});document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('Delete this personal resource?')){a=a.filter(x=>x.id!=b.dataset.del);store.set('createdResources',a);myresources()}})}



function allReadingPlans(){return [...(window.DM_READING_PLANS||[]),...store.get('customReadingPlans',[])]}
const AUTO_PLAN_THEMES=[
 {key:'faith',title:'Growing in Faith',tlTitle:'Paglago sa Pananampalataya',terms:['faith','trust','pananampalataya','tiwala'],refs:['Hebrews 11','Romans 4','Mark 9','Matthew 14','Proverbs 3','Psalm 37','James 1','Romans 10','2 Corinthians 5','Galatians 2','1 Peter 1','John 20','Habakkuk 3','Philippians 4'],en:'Trust God and respond to His Word with faithful obedience.',tl:'Magtiwala sa Diyos at tumugon sa Kanyang Salita nang may tapat na pagsunod.'},
 {key:'prayer',title:'A Life of Prayer',tlTitle:'Buhay ng Pananalangin',terms:['prayer','pray','panalangin','manalangin'],refs:['Matthew 6','Luke 11','Psalm 5','Psalm 63','Philippians 4','1 Samuel 1','Daniel 6','Nehemiah 1','Acts 4','Acts 12','James 5','John 17','Ephesians 3','Colossians 4'],en:'Learn to pray honestly, persistently, and according to God’s will.',tl:'Matutong manalangin nang tapat, matiyaga, at ayon sa kalooban ng Diyos.'},
 {key:'hope',title:'Hope in Difficult Times',tlTitle:'Pag-asa sa Panahon ng Pagsubok',terms:['hope','hardship','difficult','pag-asa','pagsubok'],refs:['Psalm 23','Psalm 42','Psalm 46','Isaiah 40','Isaiah 41','Lamentations 3','Matthew 11','John 14','Romans 5','Romans 8','2 Corinthians 4','Philippians 4','1 Peter 5','Revelation 21'],en:'Receive biblical hope and take the next faithful step.',tl:'Tanggapin ang biblikal na pag-asa at gawin ang susunod na tapat na hakbang.'},
 {key:'wisdom',title:'Walking in Godly Wisdom',tlTitle:'Pamumuhay sa Maka-Diyos na Karunungan',terms:['wisdom','decision','guidance','karunungan','desisyon','gabay'],refs:['Proverbs 1','Proverbs 2','Proverbs 3','Proverbs 4','Proverbs 8','Proverbs 11','Proverbs 15','Proverbs 16','Proverbs 19','Proverbs 27','Ecclesiastes 3','James 1','James 3','Ephesians 5'],en:'Seek God’s wisdom and apply it to everyday choices.',tl:'Hanapin ang karunungan ng Diyos at isabuhay ito sa araw-araw na pagpili.'},
 {key:'jesus',title:'Knowing Jesus More',tlTitle:'Mas Makilala si Jesus',terms:['jesus','christ','gospel','hesus','cristo','ebanghelyo'],refs:['John 1','John 2','John 3','John 4','John 5','John 6','John 8','John 10','John 11','John 13','John 14','John 15','John 17','John 20'],en:'Notice who Jesus is, what He teaches, and how to follow Him.',tl:'Pansinin kung sino si Jesus, ang Kanyang turo, at kung paano Siya susundin.'},
 {key:'love',title:'Living a Life of Love',tlTitle:'Pamumuhay na Puno ng Pag-ibig',terms:['love','relationships','family','pag-ibig','pamilya','relasyon'],refs:['1 Corinthians 13','John 13','John 15','1 John 3','1 John 4','Romans 12','Ephesians 4','Ephesians 5','Colossians 3','Philippians 2','Luke 10','Matthew 5','Ruth 1','James 2'],en:'Let God’s love shape your words, relationships, and actions.',tl:'Hayaan ang pag-ibig ng Diyos na humubog sa iyong salita, relasyon, at gawa.'},
 {key:'purpose',title:'Purpose and Calling',tlTitle:'Layunin at Pagkatawag',terms:['purpose','calling','work','ministry','layunin','pagkatawag','gawain','ministeryo'],refs:['Genesis 12','Exodus 3','Joshua 1','1 Samuel 16','Esther 4','Nehemiah 2','Isaiah 6','Jeremiah 1','Matthew 28','Luke 5','Acts 9','Romans 12','Ephesians 2','2 Timothy 1'],en:'Discern God’s direction and serve faithfully where you are.',tl:'Kilalanin ang direksyon ng Diyos at maglingkod nang tapat kung nasaan ka.'},
 {key:'peace',title:'Finding Peace in God',tlTitle:'Paghahanap ng Kapayapaan sa Diyos',terms:['peace','anxiety','fear','kapayapaan','pag-aalala','takot'],refs:['Psalm 4','Psalm 23','Psalm 27','Psalm 34','Psalm 91','Isaiah 26','Matthew 6','Matthew 11','John 14','John 16','Romans 8','Philippians 4','Colossians 3','1 Peter 5'],en:'Bring every worry to God and practise trust-filled peace.',tl:'Dalhin sa Diyos ang bawat alalahanin at mamuhay sa kapayapaang may pagtitiwala.'},
 {key:'grace',title:'Living by Grace',tlTitle:'Pamumuhay sa Biyaya',terms:['grace','mercy','biyaya','awa'],refs:['Ephesians 2','Romans 3','Romans 5','Titus 2','Hebrews 4','2 Corinthians 12','Luke 15','John 1','Galatians 2','1 Timothy 1','Psalm 103','Micah 7','Colossians 2','1 Peter 5'],en:'Receive God’s grace and let it transform daily life.',tl:'Tanggapin ang biyaya ng Diyos at hayaang baguhin nito ang araw-araw na buhay.'},
 {key:'forgiveness',title:'The Freedom of Forgiveness',tlTitle:'Kalayaan ng Pagpapatawad',terms:['forgive','forgiveness','patawad','pagpapatawad'],refs:['Matthew 18','Luke 23','Ephesians 4','Colossians 3','Genesis 50','Psalm 32','Psalm 51','Mark 11','Romans 12','2 Corinthians 2','Philemon 1','1 John 1','Micah 7','Luke 15'],en:'Understand forgiveness and practise grace in relationships.',tl:'Unawain ang pagpapatawad at isabuhay ang biyaya sa mga relasyon.'},
 {key:'spirit',title:'Walking with the Holy Spirit',tlTitle:'Pamumuhay Kasama ang Espiritu Santo',terms:['holy spirit','spirit','espiritu santo','espiritu'],refs:['John 14','John 16','Acts 1','Acts 2','Romans 8','Galatians 5','1 Corinthians 12','1 Corinthians 13','1 Corinthians 14','Ephesians 1','Ephesians 5','2 Timothy 1','Titus 3','Jude 1'],en:'Learn to depend on the Holy Spirit and bear godly fruit.',tl:'Matutong umasa sa Espiritu Santo at mamunga ng maka-Diyos na bunga.'},
 {key:'discipleship',title:'Following Jesus Daily',tlTitle:'Araw-araw na Pagsunod kay Jesus',terms:['discipleship','follow jesus','disciple','pagiging alagad','sumunod'],refs:['Matthew 4','Matthew 5','Matthew 6','Matthew 7','Matthew 16','Luke 9','Luke 14','John 8','John 13','John 15','Acts 2','Romans 12','Colossians 3','James 1'],en:'Follow Jesus through surrender, obedience, and spiritual growth.',tl:'Sundin si Jesus sa pagsuko, pagsunod, at espirituwal na paglago.'},
 {key:'worship',title:'A Heart of Worship',tlTitle:'Pusong Sumasamba',terms:['worship','praise','pagsamba','papuri'],refs:['Psalm 8','Psalm 19','Psalm 34','Psalm 95','Psalm 96','Psalm 100','Psalm 103','Psalm 150','John 4','Romans 12','Hebrews 12','Revelation 4','Revelation 5','Colossians 3'],en:'Worship God in spirit, truth, gratitude, and obedience.',tl:'Sambahin ang Diyos sa espiritu, katotohanan, pasasalamat, at pagsunod.'},
 {key:'leadership',title:'Biblical Leadership',tlTitle:'Biblikal na Pamumuno',terms:['leadership','leader','lead','pamumuno','lider'],refs:['Exodus 18','Joshua 1','Nehemiah 1','Nehemiah 2','Mark 10','John 13','Acts 6','Romans 12','1 Corinthians 12','1 Timothy 3','2 Timothy 2','Titus 1','1 Peter 5','James 3'],en:'Lead through service, character, wisdom, and faithfulness.',tl:'Mamuno sa pamamagitan ng paglilingkod, karakter, karunungan, at katapatan.'},
 {key:'family',title:'Faith at Home',tlTitle:'Pananampalataya sa Tahanan',terms:['family','marriage','parent','home','pamilya','tahanan','magulang'],refs:['Deuteronomy 6','Joshua 24','Psalm 127','Proverbs 22','Ruth 1','1 Samuel 1','Luke 2','Ephesians 5','Ephesians 6','Colossians 3','1 Corinthians 13','2 Timothy 1','3 John 1','Acts 16'],en:'Build a Christ-centred home through love, truth, and example.',tl:'Bumuo ng tahanang nakasentro kay Cristo sa pag-ibig, katotohanan, at halimbawa.'}
];
const AUTO_PLAN_EXTRA_REFS=['Genesis 1','Genesis 12','Genesis 22','Exodus 3','Exodus 14','Deuteronomy 6','Joshua 1','Judges 6','Ruth 1','1 Samuel 3','1 Samuel 17','2 Samuel 7','1 Kings 18','2 Kings 5','Ezra 7','Nehemiah 1','Esther 4','Job 1','Job 19','Psalm 1','Psalm 19','Psalm 27','Psalm 34','Psalm 51','Psalm 91','Psalm 103','Psalm 121','Psalm 139','Proverbs 1','Proverbs 3','Proverbs 4','Proverbs 16','Ecclesiastes 3','Isaiah 6','Isaiah 40','Isaiah 53','Jeremiah 1','Jeremiah 29','Lamentations 3','Ezekiel 36','Daniel 1','Daniel 3','Daniel 6','Hosea 6','Joel 2','Micah 6','Habakkuk 3','Zechariah 4','Malachi 3','Matthew 5','Matthew 6','Matthew 7','Matthew 11','Matthew 14','Matthew 18','Matthew 25','Matthew 28','Mark 1','Mark 4','Mark 8','Mark 10','Mark 12','Mark 15','Mark 16','Luke 1','Luke 2','Luke 5','Luke 10','Luke 15','Luke 18','Luke 22','Luke 24','John 1','John 3','John 4','John 6','John 10','John 11','John 13','John 14','John 15','John 17','John 20','Acts 1','Acts 2','Acts 4','Acts 9','Acts 16','Acts 20','Romans 3','Romans 5','Romans 8','Romans 12','1 Corinthians 6','1 Corinthians 13','1 Corinthians 15','2 Corinthians 4','2 Corinthians 5','Galatians 2','Galatians 5','Galatians 6','Ephesians 1','Ephesians 2','Ephesians 4','Ephesians 6','Philippians 1','Philippians 2','Philippians 4','Colossians 1','Colossians 3','1 Thessalonians 4','1 Thessalonians 5','2 Thessalonians 3','1 Timothy 4','2 Timothy 1','2 Timothy 3','Titus 2','Philemon 1','Hebrews 4','Hebrews 11','Hebrews 12','James 1','James 2','James 3','James 5','1 Peter 1','1 Peter 2','1 Peter 5','2 Peter 1','1 John 1','1 John 3','1 John 4','Jude 1','Revelation 1','Revelation 5','Revelation 21','Revelation 22'];
function normalisePlanText(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function planSignature(p){return (p.readings||[]).map(r=>normalisePlanText(r[0])).join('|')}
function planUsesTheme(plan,theme){let key=normalisePlanText(plan.theme||''),name=normalisePlanText(plan.title||''),tl=normalisePlanText(plan.tlTitle||'');return key===normalisePlanText(theme.key)||name.includes(normalisePlanText(theme.title))||tl.includes(normalisePlanText(theme.tlTitle))}
function chooseAutoPlanTheme(theme,title){let q=normalisePlanText(`${theme} ${title}`),plans=allReadingPlans(),unused=AUTO_PLAN_THEMES.filter(x=>!plans.some(p=>planUsesTheme(p,x))),matched=AUTO_PLAN_THEMES.find(x=>x.terms.some(t=>q.includes(normalisePlanText(t))));if(matched&&!plans.some(p=>planUsesTheme(p,matched)))return matched;if(unused.length)return unused[Math.floor(Math.random()*unused.length)];let leastUsed=[...AUTO_PLAN_THEMES].sort((a,b)=>plans.filter(p=>planUsesTheme(p,a)).length-plans.filter(p=>planUsesTheme(p,b)).length);return matched&&plans.filter(p=>planUsesTheme(p,matched)).length===plans.filter(p=>planUsesTheme(p,leastUsed[0])).length?matched:leastUsed[0]}
function generateAutomaticPlan(theme,title,days){let base=chooseAutoPlanTheme(theme,title),existing=new Set(allReadingPlans().map(planSignature)),pool=[...base.refs,...AUTO_PLAN_EXTRA_REFS.filter(r=>!base.refs.includes(r))],offset=Math.floor(Math.random()*Math.max(1,pool.length)),readings=[],tries=0;do{let rotated=pool.slice(offset).concat(pool.slice(0,offset));readings=Array.from({length:days},(_,i)=>{let ref=rotated[(i*3+i%5)%rotated.length],n=i+1;return [ref,`Day ${n}: ${base.en}`,`Araw ${n}: ${base.tl}`]});offset=(offset+1)%pool.length;tries++}while(existing.has(readings.map(r=>normalisePlanText(r[0])).join('|'))&&tries<pool.length*2);let customTitle=(title||'').trim(),finalTitle=customTitle||`${days}-Day ${base.title}`,titles=new Set(allReadingPlans().map(p=>normalisePlanText(p.title)));if(titles.has(normalisePlanText(finalTitle))&&!customTitle){let alternatives=AUTO_PLAN_THEMES.filter(x=>!allReadingPlans().some(p=>planUsesTheme(p,x)));if(alternatives.length){base=alternatives[0];return generateAutomaticPlan('',`${days}-Day ${base.title}`,days)}}if(titles.has(normalisePlanText(finalTitle))&&customTitle)throw new Error(ui('A plan with this title already exists. Please use a different title.','May plano nang may ganitong pamagat. Gumamit ng ibang pamagat.'));return {title:finalTitle,tlTitle:customTitle?finalTitle:`${days}-Araw na ${base.tlTitle}`,readings,theme:base.key}}
function guidedPlans(){
 title(ui('Guided Reading Plans','Mga Gabay sa Pagbasa'),ui('Create and save a complete plan automatically—even when some fields are blank—or enter your own readings.','Awtomatikong gumawa at mag-save ng kumpletong plano kahit may bakanteng field, o ilagay ang sarili mong readings.'));
 const plans=allReadingPlans(),progress=store.get('planProgress',{});
 view.innerHTML=`<section class="card"><h2>✨ ${ui('Automatic Reading Plan Creator','Awtomatikong Reading Plan Creator')}</h2><div class="notice small-note">${ui('Leave the title, theme, or readings blank and the app will complete them for you. It will avoid creating the same plan again.','Iwang blangko ang pamagat, tema, o readings at awtomatikong kukumpletuhin ng app. Iiwasan nitong gumawa muli ng kaparehong plano.')}</div><div class="form-grid"><input id="planTitle" placeholder="${ui('Plan title (optional)','Pamagat ng plano (opsyonal)')}"><input id="planTlTitle" placeholder="${ui('Tagalog title (optional)','Tagalog na pamagat (opsyonal)')}"><input id="planTheme" placeholder="${ui('Theme or goal (optional)','Tema o layunin (opsyonal)')}"><input id="planDays" type="number" min="1" max="365" value="14" placeholder="${ui('Number of days','Bilang ng araw')}"></div><textarea id="planReadings" class="draft-area" style="min-height:180px" placeholder="${ui('Optional: one day per line — John 1 | Who Jesus is | Kung sino si Jesus','Opsyonal: isang araw bawat linya — John 1 | Who Jesus is | Kung sino si Jesus')}"></textarea><div class="resource-buttons"><button class="primary" id="saveCustomPlan">✨ ${ui('Create & Save Plan','Gumawa at I-save ang Plano')}</button><button class="ghost" id="preparePlanAI">🤖 ${ui('Prepare AI Prompt','Ihanda ang AI Prompt')}</button><button class="ghost" id="clearPlanEditor">${ui('Clear','I-clear')}</button></div><div id="planAiPanel" style="display:none;margin-top:14px"><textarea id="planAiPrompt" class="draft-area" style="min-height:260px"></textarea><div class="resource-buttons"><button class="primary" id="copyPlanAI">${ui('Copy AI Prompt','Kopyahin ang AI Prompt')}</button><button class="ghost" id="openPlanChat">${ui('Open ChatGPT','Buksan ang ChatGPT')}</button></div><div class="notice small-note">${ui('Paste the AI result back into the readings box using: Scripture | English guidance | Tagalog guidance. Review every Scripture reference before saving.','I-paste ang AI result sa readings box gamit ang: Talata | English guidance | Tagalog guidance. Suriin ang bawat Scripture reference bago i-save.')}</div></div></section><div class="tool-grid">${plans.map(p=>{let done=p.readings.filter((_,i)=>progress[p.id+'-'+i]).length;return `<article class="card tool-card"><span class="pill">${p.readings.length} ${ui('days','araw')}</span><h2>${esc(appLanguage==='tl'?(p.tlTitle||p.title):p.title)}</h2><p>${done} / ${p.readings.length} ${ui('completed','natapos')}</p><progress value="${done}" max="${p.readings.length}"></progress><div class="resource-buttons"><button class="primary" data-open-plan="${p.id}">${ui('Open plan','Buksan ang plano')}</button>${p.custom?`<button class="ghost" data-edit-plan="${p.id}">${ui('Edit','I-edit')}</button><button class="danger" data-delete-plan="${p.id}">${ui('Delete','Alisin')}</button>`:''}</div></article>`}).join('')}</div><div id="planDetail"></div>`;
 const parseReadings=()=>$('#planReadings').value.split(/\n/).map(x=>x.trim()).filter(Boolean).map(x=>{let p=x.split('|').map(y=>y.trim());return [p[0],p[1]||ui('Read, reflect, and apply this passage.','Basahin, pagnilayan, at isabuhay ang talatang ito.'),p[2]||p[1]||'Basahin, pagnilayan, at isabuhay ang talatang ito.']}).filter(x=>x[0]);
 $('#saveCustomPlan').onclick=()=>{let days=Math.max(1,Math.min(365,+$('#planDays').value||14)),readings=parseReadings(),title=$('#planTitle').value.trim(),tlTitle=$('#planTlTitle').value.trim(),theme=$('#planTheme').value.trim(),autoCreated=false;if(!readings.length){let generated;try{generated=generateAutomaticPlan(theme,title,days)}catch(e){return toast(e.message)}readings=generated.readings;title=generated.title;tlTitle=tlTitle||generated.tlTitle;autoCreated=true;theme=generated.theme}else{title=title||`${readings.length}-Day Personal Reading Plan`;tlTitle=tlTitle||title;let sig=readings.map(r=>normalisePlanText(r[0])).join('|'),duplicate=allReadingPlans().find(p=>planSignature(p)===sig&&!($('#saveCustomPlan').dataset.editId&&p.id===$('#saveCustomPlan').dataset.editId));if(duplicate)return toast(ui('This reading plan already exists. Change a reading or leave the box blank for a new automatic plan.','May kapareho nang reading plan. Baguhin ang isang reading o iwang blangko para gumawa ng bagong awtomatikong plano.'))}let a=store.get('customReadingPlans',[]),edit=$('#saveCustomPlan').dataset.editId,id=edit||('custom-'+Date.now()),plan={id,title,tlTitle,days:readings.length,readings,theme,custom:true,autoCreated};if(edit){let i=a.findIndex(x=>x.id===edit);if(i>=0)a[i]=plan;else a.push(plan)}else a.push(plan);store.set('customReadingPlans',a);toast(autoCreated?ui('A new reading plan was automatically created and saved','Awtomatikong ginawa at na-save ang bagong reading plan'):ui('Reading plan saved','Na-save ang reading plan'));guidedPlans();setTimeout(()=>showPlan(id),0)};
 $('#preparePlanAI').onclick=()=>{let theme=$('#planTheme').value.trim()||$('#planTitle').value.trim()||ui('growing in faith','paglago sa pananampalataya'),days=Math.max(1,Math.min(365,+$('#planDays').value||14));let prompt=`Create a ${days}-day Christian Bible reading plan about “${theme}”. Use ${appLanguage==='tl'?'Tagalog and English':'English with a Tagalog translation'} for each day's short guidance. Return exactly one day per line in this format: Scripture reference | English guidance | Tagalog guidance. Use real Bible chapters or clear verse ranges, avoid repeating readings unless necessary, progress logically from foundation to application, keep each guidance sentence concise, and do not invent Bible quotations or references. The user will review and edit the plan before saving.`;$('#planAiPrompt').value=prompt;$('#planAiPanel').style.display='block';navigator.clipboard?.writeText(prompt);toast(ui('AI prompt prepared and copied','Naihanda at nakopya ang AI prompt'))};
 $('#copyPlanAI').onclick=async()=>{await navigator.clipboard.writeText($('#planAiPrompt').value);toast(ui('AI prompt copied','Nakopya ang AI prompt'))};$('#openPlanChat').onclick=()=>window.open('https://chatgpt.com/','_blank','noopener');
 $('#clearPlanEditor').onclick=()=>{['planTitle','planTlTitle','planTheme','planReadings'].forEach(id=>$('#'+id).value='');$('#planDays').value=14;delete $('#saveCustomPlan').dataset.editId;$('#planAiPanel').style.display='none'};
 document.querySelectorAll('[data-open-plan]').forEach(b=>b.onclick=()=>showPlan(b.dataset.openPlan));
 document.querySelectorAll('[data-edit-plan]').forEach(b=>b.onclick=()=>{let p=allReadingPlans().find(x=>x.id===b.dataset.editPlan);if(!p)return;$('#planTitle').value=p.title;$('#planTlTitle').value=p.tlTitle||'';$('#planDays').value=p.readings.length;$('#planReadings').value=p.readings.map(r=>r.join(' | ')).join('\n');$('#saveCustomPlan').dataset.editId=p.id;window.scrollTo({top:0,behavior:'smooth'});toast(ui('Plan loaded for editing','Na-load ang plano para i-edit'))});
 document.querySelectorAll('[data-delete-plan]').forEach(b=>b.onclick=()=>{if(!confirm(ui('Delete this custom reading plan?','Alisin ang custom reading plan na ito?')))return;let id=b.dataset.deletePlan;store.set('customReadingPlans',store.get('customReadingPlans',[]).filter(x=>x.id!==id));let pr=store.get('planProgress',{});Object.keys(pr).filter(k=>k.startsWith(id+'-')).forEach(k=>delete pr[k]);store.set('planProgress',pr);guidedPlans()});
}
function showPlan(id){const p=allReadingPlans().find(x=>x.id===id),progress=store.get('planProgress',{}),box=$('#planDetail');if(!p)return;box.innerHTML=`<section class="card plan-detail"><h2>${esc(appLanguage==='tl'?(p.tlTitle||p.title):p.title)}</h2>${p.readings.map((r,i)=>{let key=p.id+'-'+i;return `<div class="plan-day ${progress[key]?'done':''}"><label><input type="checkbox" data-plan-check="${key}" ${progress[key]?'checked':''}><span><b>${ui('Day','Araw')} ${i+1}: ${scriptureLink(r[0])}</b><small>${esc(appLanguage==='tl'?(r[2]||r[1]):r[1])}</small></span></label><button class="ghost" data-plan-read="${esc(r[0])}">${ui('Read','Basahin')}</button></div>`}).join('')}</section>`;wireScriptureLinks();document.querySelectorAll('[data-plan-check]').forEach(c=>c.onchange=()=>{let x=store.get('planProgress',{});if(c.checked)x[c.dataset.planCheck]=true;else delete x[c.dataset.planCheck];store.set('planProgress',x);guidedPlans();setTimeout(()=>showPlan(id),0)});document.querySelectorAll('[data-plan-read]').forEach(b=>b.onclick=()=>openBibleReference(b.dataset.planRead));box.scrollIntoView({behavior:'smooth'});
}

function salvationGuide(){
 title(ui('Salvation Guide','Gabay sa Kaligtasan'),ui('A simple biblical explanation of the good news of Jesus.','Isang payak na biblikal na paliwanag ng mabuting balita ni Jesus.'));
 view.innerHTML=`<article class="card long-form"><span class="pill">${ui('THE GOOD NEWS','ANG MABUTING BALITA')}</span><h2>${ui('How can I be saved?','Paano ako maliligtas?')}</h2>
 <h3>1. ${ui('God created us and loves us','Nilalang tayo ng Diyos at mahal Niya tayo')}</h3><p>${ui('God made us for relationship with Him. His love is holy, faithful, and good.','Nilalang tayo ng Diyos upang magkaroon ng ugnayan sa Kanya. Ang Kanyang pag-ibig ay banal, tapat, at mabuti.')}</p><p>${scriptureLink('John 3:16')} · ${scriptureLink('Genesis 1:27')}</p>
 <h3>2. ${ui('Sin separates us from God','Inihihiwalay tayo ng kasalanan sa Diyos')}</h3><p>${ui('Every person has sinned. We cannot repair this separation by our own effort or good works.','Lahat ng tao ay nagkasala. Hindi natin maaayos ang pagkakahiwalay na ito sa sarili nating lakas o mabubuting gawa.')}</p><p>${scriptureLink('Romans 3:23')} · ${scriptureLink('Romans 6:23')}</p>
 <h3>3. ${ui('Jesus died and rose again for us','Namatay at muling nabuhay si Jesus para sa atin')}</h3><p>${ui('Jesus Christ, the Son of God, lived without sin, died for our sins, and rose from the dead. He is the only Saviour.','Si Jesu-Cristo, ang Anak ng Diyos, ay namuhay nang walang kasalanan, namatay para sa ating mga kasalanan, at muling nabuhay. Siya lamang ang Tagapagligtas.')}</p><p>${scriptureLink('1 Corinthians 15:3')} · ${scriptureLink('John 14:6')}</p>
 <h3>4. ${ui('Respond with repentance and faith','Tumugon sa pagsisisi at pananampalataya')}</h3><p>${ui('Turn from sin, trust Jesus, confess Him as Lord, and receive the new life He gives. Salvation is God’s gift of grace.','Talikuran ang kasalanan, magtiwala kay Jesus, ipahayag Siyang Panginoon, at tanggapin ang bagong buhay na ibinibigay Niya. Ang kaligtasan ay kaloob ng biyaya ng Diyos.')}</p><p>${scriptureLink('Acts 3:19')} · ${scriptureLink('Romans 10:9')} · ${scriptureLink('Ephesians 2:8')}</p>
 <h3>${ui('A prayer of response','Panalangin ng pagtugon')}</h3><div class="notice">${ui('Lord Jesus, I admit that I have sinned and need Your forgiveness. I believe You died for my sins and rose again. I turn from my old way of life and place my trust in You. Be my Lord and Saviour. Give me new life and help me follow You. Amen.','Panginoong Jesus, inaamin kong ako ay nagkasala at kailangan ko ang Iyong kapatawaran. Naniniwala akong namatay Ka para sa aking mga kasalanan at muling nabuhay. Tinatalikuran ko ang dati kong pamumuhay at inilalagay ko ang aking tiwala sa Iyo. Ikaw ang maging Panginoon at Tagapagligtas ko. Bigyan Mo ako ng bagong buhay at tulungan Mo akong sumunod sa Iyo. Amen.')}</div>
 <p><b>${ui('Important:','Mahalaga:')}</b> ${ui('A prayer does not save by itself; Jesus saves those who genuinely turn to Him in faith. Begin reading the Gospel of John, pray, and connect with a faithful Bible-believing church.','Hindi ang panalangin mismo ang nagliligtas; si Jesus ang nagliligtas sa mga tunay na lumalapit sa Kanya sa pananampalataya. Simulang basahin ang Ebanghelyo ni Juan, manalangin, at makipag-ugnayan sa isang tapat na iglesiang naniniwala sa Bibliya.')}</p></article>`;wireScriptureLinks();
}
function charactersPage(){title(ui('Bible Characters','Mga Tauhan sa Bibliya'),ui('Meet people in Scripture and learn from their faith, failures, and God’s work in their lives.','Kilalanin ang mga tao sa Kasulatan at matuto sa kanilang pananampalataya, pagkukulang, at pagkilos ng Diyos sa kanilang buhay.'));let a=window.DM_BIBLE_CHARACTERS||[];view.innerHTML=`<input id="toolSearch" class="searchbox" placeholder="${ui('Search a character...','Maghanap ng tauhan...')}"><div id="toolResults" class="tool-grid"></div>`;const draw=()=>{let q=$('#toolSearch').value.toLowerCase();$('#toolResults').innerHTML=a.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).map(x=>`<article class="card tool-card"><h2>${esc(appLanguage==='tl'?x.tlName:x.name)}</h2><p>${esc(appLanguage==='tl'?x.tl:x.summary)}</p><button class="scripture-link" data-bible-ref="${esc(x.ref)}">${esc(x.ref)}</button></article>`).join('');wireScriptureLinks()};$('#toolSearch').oninput=draw;draw()}
function dictionaryPage(){title(ui('Bible Dictionary','Diksyunaryo ng Bibliya'),ui('Simple explanations of important Bible words.','Payak na paliwanag ng mahahalagang salita sa Bibliya.'));let a=window.DM_BIBLE_DICTIONARY||[];view.innerHTML=`<input id="toolSearch" class="searchbox" placeholder="${ui('Search a word...','Maghanap ng salita...')}"><div id="toolResults" class="tool-grid"></div>`;const draw=()=>{let q=$('#toolSearch').value.toLowerCase();$('#toolResults').innerHTML=a.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).map(x=>`<article class="card tool-card"><h2>${esc(appLanguage==='tl'?x.tlTerm:x.term)}</h2><p>${esc(appLanguage==='tl'?x.tl:x.definition)}</p><button class="scripture-link" data-bible-ref="${esc(x.ref)}">${esc(x.ref)}</button></article>`).join('');wireScriptureLinks()};$('#toolSearch').oninput=draw;draw()}


function support(){
 title(ui('Support the Ministry','Suportahan ang Ministeryo'),ui('Help keep De Mayo Bible Ministry free and growing.','Tumulong upang manatiling libre at patuloy na lumago ang De Mayo Bible Ministry.'));
 view.innerHTML=`<section class="support-hero card">
   <div class="support-heart">❤️</div>
   <span class="pill">${ui('GITHUB SPONSORS','GITHUB SPONSORS')}</span>
   <h2>${ui('Support De Mayo Bible Ministry','Suportahan ang De Mayo Bible Ministry')}</h2>
   <p>${ui('This Bible ministry app is provided free of charge for individuals, families, churches, teachers, and ministry leaders. Your sponsorship helps support continued development, maintenance, and the creation of more free Bible resources.','Ang Bible ministry app na ito ay ibinibigay nang libre para sa mga indibidwal, pamilya, iglesya, guro, at ministry leaders. Ang iyong sponsorship ay tumutulong sa patuloy na development, maintenance, at paggawa ng mas marami pang libreng Bible resources.')}</p>
   <blockquote>“${ui('Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.','Magbigay ang bawat isa ayon sa ipinasiya ng kaniyang puso, hindi mabigat sa loob o sapilitan, sapagkat iniibig ng Diyos ang nagbibigay nang masaya.')}”<br><strong>2 Corinthians 9:7</strong></blockquote>
   <a class="primary sponsor-button" href="https://github.com/sponsors/romerdemayo" target="_blank" rel="noopener noreferrer">❤️ ${ui('Become a GitHub Sponsor','Maging GitHub Sponsor')}</a>
   <p class="small-note">${ui('The button opens GitHub securely in a new tab. You may choose any available one-time or monthly sponsorship tier.','Bubuksan ng button ang GitHub nang ligtas sa bagong tab. Maaari kang pumili ng available na one-time o monthly sponsorship tier.')}</p>
 </section>
 <section class="card support-benefits">
   <h3>${ui('Your support helps with','Ang iyong suporta ay tumutulong sa')}</h3>
   <div class="support-grid">
    <div><span>📖</span><b>${ui('Bible study resources','Mga Bible study resource')}</b></div>
    <div><span>🙏</span><b>${ui('Prayer and devotional tools','Prayer at devotional tools')}</b></div>
    <div><span>🎤</span><b>${ui('Sermon preparation features','Sermon preparation features')}</b></div>
    <div><span>👧</span><b>${ui('Children’s ministry lessons','Mga aralin para sa bata')}</b></div>
    <div><span>🤖</span><b>${ui('AI ministry assistance','AI ministry assistance')}</b></div>
    <div><span>🛠️</span><b>${ui('Maintenance and improvements','Maintenance at improvements')}</b></div>
   </div>
   <p>${ui('Financial sponsorship is completely optional. You can also help by sharing the app, reporting problems, suggesting improvements, contributing documentation, and praying for the ministry.','Ganap na opsyonal ang financial sponsorship. Maaari ka ring tumulong sa pag-share ng app, pag-report ng problema, pagmungkahi ng improvements, pag-contribute sa documentation, at pananalangin para sa ministeryo.')}</p>
   <p><strong>${ui('Thank you for helping us continue sharing free Bible resources. God bless you.','Salamat sa pagtulong upang maipagpatuloy ang pagbabahagi ng libreng Bible resources. Pagpalain ka ng Diyos.')}</strong></p>
 </section>`;
}

function feedback(){
 const email='Romer.DeMayo@gmail.com';
 const subject=ui('De Mayo Bible Studies – Feedback','De Mayo Bible Studies – Feedback');
 const body=ui(
  'Hello Romer,\n\nI would like to share the following feedback about De Mayo Bible Studies.\n\nType: Suggestion / Improvement / Bug report / General message\nFeature or page:\nDevice and browser:\nMessage:\n\nThank you.',
  'Hello Romer,\n\nNais kong magbahagi ng feedback tungkol sa De Mayo Bible Studies.\n\nUri: Mungkahi / Improvement / Bug report / Pangkalahatang mensahe\nFeature o page:\nDevice at browser:\nMensahe:\n\nSalamat.'
 );
 const mailto=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 title(ui('Feedback & Contact','Feedback at Contact'),ui('Share suggestions, report a problem, or send a general message.','Magbahagi ng mungkahi, mag-report ng problema, o magpadala ng pangkalahatang mensahe.'));
 view.innerHTML=`
 <section class="card feedback-hero">
   <div class="feedback-icon">💬</div>
   <span class="pill">${ui('HELP US IMPROVE','TULUNGAN KAMING UMUNLAD')}</span>
   <h2>${ui('Your feedback can help improve this ministry app','Makakatulong ang iyong feedback upang mapaganda ang ministry app na ito')}</h2>
   <p>${ui('You are welcome to send feature suggestions, improvement ideas, bug reports, Bible resource ideas, questions, or any general message.','Maaari kang magpadala ng feature suggestions, improvement ideas, bug reports, Bible resource ideas, mga tanong, o anumang pangkalahatang mensahe.')}</p>
   <div class="feedback-email"><span>📧</span><a href="${mailto}">${email}</a></div>
   <div class="creator-buttons feedback-actions">
     <a class="primary feedback-mail-button" href="${mailto}">✉️ ${ui('Send Feedback by Email','Magpadala ng Feedback sa Email')}</a>
     <button class="ghost" id="copyFeedbackEmail">📋 ${ui('Copy Email Address','Kopyahin ang Email Address')}</button>
   </div>
   <p class="small-note">${ui('The email button opens your device’s default email app with a helpful template. Please do not include passwords or other sensitive personal information.','Bubuksan ng email button ang default email app ng iyong device na may nakahandang template. Huwag magsama ng password o sensitibong personal na impormasyon.')}</p>
 </section>
 <section class="card feedback-types">
   <h3>${ui('Messages are welcome about','Tinatanggap ang mga mensahe tungkol sa')}</h3>
   <div class="support-grid">
     <div><span>✨</span><b>${ui('New feature ideas','Mga bagong feature')}</b></div>
     <div><span>🛠️</span><b>${ui('Improvements','Mga improvement')}</b></div>
     <div><span>🐞</span><b>${ui('Problems or bugs','Mga problema o bug')}</b></div>
     <div><span>📖</span><b>${ui('Bible resource ideas','Bible resource ideas')}</b></div>
     <div><span>❓</span><b>${ui('Questions','Mga tanong')}</b></div>
     <div><span>🙏</span><b>${ui('General messages','Pangkalahatang mensahe')}</b></div>
   </div>
   <blockquote>“${ui('As iron sharpens iron, so one person sharpens another.','Kung paanong bakal ang nagpapatalim sa bakal, gayon pinatatalim ng tao ang mukha ng kaniyang kaibigan.')}”<br><strong>Proverbs 27:17</strong></blockquote>
 </section>`;
 $('#copyFeedbackEmail').onclick=async()=>{try{await navigator.clipboard.writeText(email);toast(ui('Email address copied','Nakopya ang email address'))}catch{toast(email)}};
}

function help(){
 title('Help & User Guide','A simple guide to using De Mayo Bible Ministry on any device.');
 view.innerHTML=`
 <section class="help-hero card">
   <div class="help-seal">📖</div>
   <div><span class="pill">WELCOME</span><h2>How to use De Mayo Bible Ministry</h2><p>The easy-to-read World English Bible (WEB) is built into the app, so Bible reading and searching can continue even without internet after the app has loaded.</p></div>
 </section>
 <section class="card"><h3>${appLanguage==='tl'?'Piliin ang Wika':'Choose Language'}</h3><p>${appLanguage==='tl'?'Ang mga menu at gabay ay maaaring ipakita sa English o Tagalog.':'Menus and guides can be displayed in English or Tagalog.'}</p><div class="language-panel"><button class="language-choice ${appLanguage==='en'?'active':''}" data-language-choice="en">🇬🇧 English</button><button class="language-choice ${appLanguage==='tl'?'active':''}" data-language-choice="tl">🇵🇭 Tagalog</button></div><div class="notice small-note">${appLanguage==='tl'?'Kapag Tagalog ang pinili, ang Bible text ay Ang Dating Biblia (1905). Kailangan lamang ng internet sa unang paggamit; pagkatapos ay maaari itong gumana mula sa browser cache.':'English uses the World English Bible (WEB). Tagalog uses the public-domain Ang Dating Biblia (1905). The Tagalog Bible needs internet on first use and is then stored in the browser cache.'}</div></section><div class="help-quick-grid">
   <button class="help-jump card" data-go="read"><span>📖</span><b>Read the Bible</b><small>Choose a book and chapter, adjust text size, highlight verses, add notes, and save favourites.</small></button>
   <button class="help-jump card" data-go="search"><span>🔎</span><b>Search Scripture</b><small>Search a word, phrase, book, or exact reference such as John 3:16.</small></button>
   <button class="help-jump card" data-go="devotionals"><span>📚</span><b>Use the Library</b><small>Open devotionals, exhortations, Bible studies, kids lessons, and prayers.</small></button>
   <button class="help-jump card" data-go="prayer"><span>🙏</span><b>Prayer Journal</b><small>Save private prayer requests, updates, Scriptures, and answered prayers on your device.</small></button>
 </div>
 <section class="help-sections">
   <details open><summary>Getting around the app</summary><div class="help-body"><p><b>On iPhone, Android, or tablet:</b> use the bottom navigation for Home, Bible, Plans, and Create. Tap <b>More</b> or the ☰ menu button to see every section.</p><p><b>On Windows or Mac:</b> use the menu on the left side.</p></div></details>
   <details open><summary>Opening a Scripture reference</summary><div class="help-body"><p>Scripture references inside devotionals, exhortations, Bible studies, kids lessons, and prayers are clickable. Tap a reference such as <b>Galatians 5:13</b> to open the built-in WEB Bible at that chapter. The selected verse is highlighted, and a <b>Back to resource</b> button returns you to the lesson.</p></div></details>
   <details><summary>Reading, highlighting, notes, and favourites</summary><div class="help-body"><ol><li>Open <b>Read Bible</b>.</li><li>Select a book and chapter.</li><li>Tap a verse to open its options.</li><li>Choose a highlight colour, add a note, or save it as a favourite.</li></ol><p>These personal items stay private in the browser on that device.</p></div></details>
   <details><summary>Using the public ministry library</summary><div class="help-body"><p>Choose Devotionals, Exhortations, Bible Studies, Kids Lessons, or Prayer Library. Search by title, topic, Scripture, or keyword. Tap a card to open the complete resource, then copy or print it when needed.</p></div></details>
   <details><summary>Prayer Journal and personal resources</summary><div class="help-body"><p>Your prayer journal, study notes, sermons, kids plans, highlights, favourites, and created resources are stored locally on your device. They are not visible to other visitors.</p></div></details>
   <details><summary>Backup and moving to another device</summary><div class="help-body"><p>Open <b>Backup & Restore</b>, then download your private backup. On another device, open the same page and restore that backup file.</p></div></details>
   <details><summary>Installing on a phone or computer</summary><div class="help-body"><p><b>iPhone/iPad:</b> open the site in Safari, tap Share, then <b>Add to Home Screen</b>.</p><p><b>Android:</b> open the site in Chrome, open the menu, then choose <b>Install app</b> or <b>Add to Home screen</b>.</p><p><b>Windows/Mac:</b> use the browser install icon when available, or bookmark the site.</p></div></details>
   <details><summary>When an older version appears</summary><div class="help-body"><p>First open <b>Backup & Restore</b> and choose <b>Download My Data</b>. Then refresh the live website. Do <b>not</b> delete the Home Screen app unless you have downloaded a backup, because iPhone may remove its locally saved notes, plans, prayers, and progress.</p></div></details>
 </section>`;
 document.querySelectorAll('.help-jump').forEach(b=>b.onclick=()=>route(b.dataset.go));document.querySelectorAll('[data-language-choice]').forEach(b=>b.onclick=()=>setLanguage(b.dataset.languageChoice));
}

function about(){
 title(ui('About & Copyright','Tungkol at Copyright'),ui('Ownership, credits, and permitted use.','Pagmamay-ari, pagkilala, at pinahihintulutang paggamit.'));
 view.innerHTML=`<section class="card about-card">
   <div class="about-mark">✝</div>
   <span class="pill">DE MAYO BIBLE MINISTRY</span>
   <h2>${ui('Created by Romer Sadio De Mayo','Ginawa ni Romer Sadio De Mayo')}</h2>
   <p>${ui('A bilingual Christian ministry application designed in New Zealand to support Bible reading, study, prayer, sermon preparation, and children’s ministry.','Isang bilingual Christian ministry application na ginawa sa New Zealand para sa pagbabasa at pag-aaral ng Bibliya, panalangin, paghahanda ng sermon, at ministeryo para sa mga bata.')}</p>
   <div class="copyright-panel"><strong>Copyright © 2026 Romer Sadio De Mayo</strong><br>${ui('All Rights Reserved.','Lahat ng Karapatan ay Nakalaan.')}</div>
   <h3>${ui('Protected original work','Protektadong orihinal na gawa')}</h3>
   <p>${ui('The original application code, interface design, original devotionals, exhortations, Bible studies, kids lessons, prayer resources, and ministry templates are protected. They may not be copied, modified, redistributed, sublicensed, or sold without prior written permission.','Protektado ang orihinal na app code, disenyo, mga debosyonal, exhortation, Bible study, kids lesson, prayer resources, at ministry templates. Hindi maaaring kopyahin, baguhin, ipamahagi, i-sublicense, o ibenta nang walang paunang nakasulat na pahintulot.')}</p>
   <h3>${ui('Bible translations and third-party material','Mga salin ng Bibliya at third-party material')}</h3>
   <p>${ui('Copyright does not claim ownership of public-domain Bible translations or separately owned third-party material. The World English Bible and Ang Dating Biblia (1905) remain subject to their own legal status and attribution requirements.','Hindi inaangkin ng copyright na ito ang pagmamay-ari ng public-domain Bible translations o hiwalay na third-party material. Ang World English Bible at Ang Dating Biblia (1905) ay nananatiling sakop ng sarili nilang legal status at attribution requirements.')}</p>
   <div class="prepared-credit">${ui('Resources prepared using','Mga materyales na inihanda gamit ang')}<br><b>De Mayo Bible Ministry</b><br>© 2026 Romer Sadio De Mayo</div>
   <p class="small-note">Version 110 · ${ui('Developed in New Zealand','Ginawa sa New Zealand')}</p>
 </section>`;
}

function render(){({home,read,search,devotionals,exhortations,studies,kidslibrary,prayerlibrary,resource,creator,myresources,favourites,highlights:highlightsPage,verseNotes,notes,prayer,sermon,kids,reading,plans:guidedPlans,salvation:salvationGuide,characters:charactersPage,dictionary:dictionaryPage,support,feedback,help,about,creatorstudio:christianCreatorStudio,socialstudio:socialStudio,reelcreator:bibleReelCreator,fbpublisher:facebookPublisher,devdashboard:developmentDashboard,analytics:ministryInsights,backup}[state.page]||home)()}
(async()=>{
 const recovered=await DM_DATA_GUARD.recoverIfEmpty();
 DM_DATA_GUARD.requestPersistence();
 route(location.hash.slice(1)||'home',false);
 if(recovered)setTimeout(()=>toast(ui('Your saved data was recovered from the automatic device backup.','Na-recover ang saved data mula sa automatic device backup.')),500);
 else DM_DATA_GUARD.schedule('app-start');
})();
