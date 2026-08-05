/* De Mayo Bible Studies - Build 1.22.1b language-aware Scripture integration */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const BOOK_TL={
'Genesis':'Genesis','Exodus':'Exodo','Leviticus':'Levitico','Numbers':'Mga Bilang','Deuteronomy':'Deuteronomio','Joshua':'Josue','Judges':'Mga Hukom','Ruth':'Ruth','1 Samuel':'1 Samuel','2 Samuel':'2 Samuel','1 Kings':'1 Mga Hari','2 Kings':'2 Mga Hari','1 Chronicles':'1 Mga Cronica','2 Chronicles':'2 Mga Cronica','Ezra':'Ezra','Nehemiah':'Nehemias','Esther':'Esther','Job':'Job','Psalms':'Mga Awit','Psalm':'Awit','Proverbs':'Mga Kawikaan','Ecclesiastes':'Eclesiastes','Song of Solomon':'Awit ni Solomon','Isaiah':'Isaias','Jeremiah':'Jeremias','Lamentations':'Mga Panaghoy','Ezekiel':'Ezekiel','Daniel':'Daniel','Hosea':'Oseas','Joel':'Joel','Amos':'Amos','Obadiah':'Obadias','Jonah':'Jonas','Micah':'Mikas','Nahum':'Nahum','Habakkuk':'Habacuc','Zephaniah':'Sofonias','Haggai':'Hagai','Zechariah':'Zacarias','Malachi':'Malakias','Matthew':'Mateo','Mark':'Marcos','Luke':'Lucas','John':'Juan','Acts':'Mga Gawa','Romans':'Mga Taga-Roma','1 Corinthians':'1 Mga Taga-Corinto','2 Corinthians':'2 Mga Taga-Corinto','Galatians':'Mga Taga-Galacia','Ephesians':'Mga Taga-Efeso','Philippians':'Mga Taga-Filipos','Colossians':'Mga Taga-Colosas','1 Thessalonians':'1 Mga Taga-Tesalonica','2 Thessalonians':'2 Mga Taga-Tesalonica','1 Timothy':'1 Timoteo','2 Timothy':'2 Timoteo','Titus':'Tito','Philemon':'Filemon','Hebrews':'Mga Hebreo','James':'Santiago','1 Peter':'1 Pedro','2 Peter':'2 Pedro','1 John':'1 Juan','2 John':'2 Juan','3 John':'3 Juan','Jude':'Judas','Revelation':'Apocalipsis'};
const TL_TO_EN=Object.fromEntries(Object.entries(BOOK_TL).map(([en,tl])=>[tl,en]));
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function language(){return $('#dmAiLanguage')?.value||'English'}
function parseRef(value=''){
 const text=String(value).trim().replace(/[–—]/g,'-');
 const match=text.match(/^(.+?)\s+(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/);
 if(!match)return null;
 let book=match[1].trim();book=TL_TO_EN[book]||book;
 if(book==='Psalm')book='Psalms';
 return {book,chapter:+match[2],start:+match[3],endChapter:+(match[4]||match[2]),end:+(match[5]||match[3])};
}
function englishReference(parsed){if(!parsed)return'';const end=parsed.endChapter===parsed.chapter?(parsed.end===parsed.start?'':`-${parsed.end}`):`-${parsed.endChapter}:${parsed.end}`;return `${parsed.book} ${parsed.chapter}:${parsed.start}${end}`}
function tagalogReference(parsed){if(!parsed)return'';let book=BOOK_TL[parsed.book]||parsed.book;if(parsed.book==='Psalms')book='Mga Awit';const end=parsed.endChapter===parsed.chapter?(parsed.end===parsed.start?'':`-${parsed.end}`):`-${parsed.endChapter}:${parsed.end}`;return `${book} ${parsed.chapter}:${parsed.start}${end}`}
function localReference(parsed,lang){const en=englishReference(parsed),tl=tagalogReference(parsed);return lang==='Tagalog'?tl:lang==='Bilingual'?`${en} / ${tl}`:en}
async function ensureTagalog(){if(window.TAGALOG_VERSES)return window.TAGALOG_VERSES;if(!window.DM_TAGALOG_BIBLE?.load)return null;try{return await window.DM_TAGALOG_BIBLE.load()}catch(e){window.toast?.('Hindi ma-load ang Tagalog Bible sa ngayon.');return null}}
function versesFrom(list,parsed){if(!Array.isArray(list)||!parsed)return'';return list.filter(v=>v.b===parsed.book&&((v.c===parsed.chapter&&v.v>=parsed.start&&(parsed.endChapter!==parsed.chapter||v.v<=parsed.end))||(parsed.endChapter!==parsed.chapter&&v.c>parsed.chapter&&v.c<parsed.endChapter)||(parsed.endChapter!==parsed.chapter&&v.c===parsed.endChapter&&v.v<=parsed.end))).map(v=>v.x).join(' ').trim()}
function selectedEnglish(){try{const x=JSON.parse(localStorage.getItem('dm_aiSelectedScripture')||'null');return x&&x.reference?x:null}catch{return null}}
async function selectedData(){
 const lang=language(),stored=selectedEnglish(),input=$('#dmAiReference')?.value||stored?.reference||'';
 const parsed=parseRef(stored?.reference||input);if(!parsed)return null;
 const enRef=englishReference(parsed),tlRef=tagalogReference(parsed),enText=stored?.verse||'';
 let tlText='';if(lang!=='English'){const list=await ensureTagalog();tlText=versesFrom(list,parsed)}
 return {parsed,enRef,tlRef,enText,tlText,reference:localReference(parsed,lang),text:lang==='Tagalog'?(tlText||enText):lang==='Bilingual'?[enText,tlText].filter(Boolean).join('\n\nTAGALOG\n'):enText};
}
async function localiseSelection(){
 if(location.hash!=='#aicreator')return;
 const data=await selectedData();if(!data)return;const lang=language(),ref=$('#dmAiReference');
 if(ref&&ref.value!==data.reference){ref.value=data.reference;ref.dispatchEvent(new Event('input',{bubbles:true}))}
 const panel=$('#dmScriptureIntelligence');if(panel){
  const small=panel.querySelector('.dm-scripture-head small');if(small)small.textContent=`${lang==='Tagalog'?'Napili':lang==='Bilingual'?'Selected / Napili':'Selected'}: ${data.reference}`;
  panel.querySelectorAll('.dm-scripture-card').forEach(card=>{const h=card.querySelector('h4'),q=card.querySelector('blockquote');if(!h||!q)return;const p=parseRef(h.dataset.enRef||h.textContent);if(!p)return;if(!h.dataset.enRef)h.dataset.enRef=englishReference(p);const isChosen=englishReference(p)===data.enRef;if(isChosen){h.textContent=data.reference;q.textContent=data.text||q.textContent;card.classList.add('is-selected')}});
 }
 localStorage.setItem('dm_aiSelectedScriptureLocalized',JSON.stringify(data));
}
function scriptureSectionExists(){return [...document.querySelectorAll('.dm-ai-heading')].some(x=>/^(Selected Scripture|Scripture Text|Talata sa Bibliya|Napiling Kasulatan|Selected Scripture \/ Napiling Kasulatan)$/i.test(x.value.trim()))}
async function insertVerseIntoEditor(){
 const box=$('#dmAiSections');if(!box)return;const data=await selectedData();if(!data||!data.text)return;
 const lang=language(),heading=lang==='Tagalog'?'Talata sa Bibliya':lang==='Bilingual'?'Selected Scripture / Napiling Kasulatan':'Selected Scripture';
 const content=`${data.reference}\n\n${data.text}`;
 if(scriptureSectionExists()){
  const section=[...document.querySelectorAll('.dm-ai-section')].find(x=>/^(Selected Scripture|Scripture Text|Talata sa Bibliya|Napiling Kasulatan|Selected Scripture \/ Napiling Kasulatan)$/i.test(x.querySelector('.dm-ai-heading')?.value.trim()||''));
  if(section){section.querySelector('.dm-ai-heading').value=heading;section.querySelector('.dm-ai-content').value=content;section.querySelectorAll('input,textarea').forEach(x=>x.dispatchEvent(new Event('input',{bubbles:true})));return}
 }
 const article=document.createElement('article');article.className='dm-ai-section';article.dataset.section='0';article.innerHTML=`<div class="dm-ai-section-head"><input class="dm-ai-heading" value="${esc(heading)}" aria-label="Section heading"><div class="dm-ai-section-actions"><button class="ghost" data-up="0">↑</button><button class="ghost" data-down="0">↓</button><button class="danger" data-delete="0">×</button></div></div><textarea class="dm-ai-content" rows="6">${esc(content)}</textarea>`;
 box.prepend(article);article.querySelectorAll('input,textarea').forEach(x=>x.dispatchEvent(new Event('input',{bubbles:true})));
 window.toast?.(lang==='Tagalog'?'Idinagdag ang napiling talata sa materyal.':lang==='Bilingual'?'Selected Scripture added in English and Tagalog.':'Selected Scripture added to the resource.');
}
document.addEventListener('click',e=>{if(e.target.closest('[data-use]'))setTimeout(localiseSelection,80);if(e.target.closest('#dmAiGenerate'))setTimeout(insertVerseIntoEditor,80)},false);
document.addEventListener('change',e=>{if(e.target?.id==='dmAiLanguage')setTimeout(localiseSelection,0)});
window.addEventListener('hashchange',()=>setTimeout(localiseSelection,100));window.addEventListener('load',()=>setTimeout(localiseSelection,100));
})();