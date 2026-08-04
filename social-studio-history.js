/* De Mayo Bible Studies - lightweight Social Studio fresh-content memory */
(function(){
'use strict';
const GENERATED_KEY='dm_socialStudioGeneratedHistory';
const POSTED_KEY='dm_socialStudioPostedHistory';
const MAX_GENERATED=300,MAX_POSTED=200;
let installed=false,retrying=false;
const $=s=>document.querySelector(s);
function read(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function clean(value=''){return String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function current(){try{const s=window.socialStudioState;if(!s)return null;const type=s.type||'verse';const body=type==='prayer'?s.prayerText:s.verseText;return {type,body:String(body||'').trim(),reference:type==='prayer'?'Prayer':String(s.reference||'').trim(),topic:s.topic||'',caption:s.caption||'',hashtags:s.hashtags||'',createdAt:Date.now()}}catch{return null}}
function signature(item){return clean([item?.type,item?.body,item?.reference].join('|'))}
function usedSet(type){const generated=read(GENERATED_KEY);const posted=read(POSTED_KEY).map(signature);const all=[...generated,...posted];return new Set(type?all.filter(x=>x.startsWith(type+' ')):all)}
function remember(item){const sig=signature(item);if(!sig)return;const arr=read(GENERATED_KEY).filter(x=>x!==sig);arr.unshift(sig);write(GENERATED_KEY,arr.slice(0,MAX_GENERATED));updateCounts()}
function notify(msg){window.toast?.(msg)}
function updateCounts(){const box=$('#dmSocialFreshCounts');if(box)box.textContent=`${read(POSTED_KEY).length} posted items protected · ${read(GENERATED_KEY).length} generated ideas remembered`}
function afterGenerate(button,type,attempt=0){setTimeout(()=>{const item=current();if(!item||item.type!==type||!item.body)return;const sig=signature(item),used=usedSet(type);if(!retrying&&used.has(sig)&&attempt<6){retrying=true;button.click();retrying=false;afterGenerate(button,type,attempt+1);return}remember(item);if(attempt>0)notify(type==='prayer'?'Fresh prayer generated':'Fresh Bible verse generated')},0)}
function markPosted(){const item=current();if(!item||!item.body)return notify('Generate or enter a post first.');const arr=read(POSTED_KEY).filter(x=>signature(x)!==signature(item));arr.unshift({...item,postedAt:Date.now()});write(POSTED_KEY,arr.slice(0,MAX_POSTED));remember(item);notify('Marked as posted. Social Studio will avoid repeating it.');updateCounts()}
function freshSelected(){const type=window.socialStudioState?.type==='prayer'?'prayer':'verse';const button=$(type==='prayer'?'#socialGeneratePrayer':'#socialGenerateVerse');if(!button)return notify('Generator is still loading.');button.click();afterGenerate(button,type)}
function installPanel(){const controls=$('.social-controls');if(!controls||$('#dmSocialFreshPanel'))return;const panel=document.createElement('article');panel.id='dmSocialFreshPanel';panel.className='card';panel.innerHTML=`<div class="section-heading compact"><div><span class="eyebrow">FRESH CONTENT MEMORY</span><h3>♻️ Avoid repeated posts</h3></div></div><p class="small-note">Fresh Idea follows the selected type and checks generated and posted history.</p><div class="social-auto-actions"><button class="primary" id="dmFreshIdea">✨ Generate fresh idea</button><button class="ghost" id="dmMarkPosted">✅ Mark current as posted</button></div><p id="dmSocialFreshCounts"></p>`;controls.insertAdjacentElement('afterend',panel);$('#dmFreshIdea').addEventListener('click',freshSelected);$('#dmMarkPosted').addEventListener('click',markPosted);updateCounts()}
function install(){if(installed)return;const controls=$('.social-controls');const verse=$('#socialGenerateVerse'),prayer=$('#socialGeneratePrayer'),surprise=$('#socialGenerateComplete');if(!controls||!verse||!prayer||!surprise)return;installed=true;installPanel();verse.addEventListener('click',()=>{if(!retrying)afterGenerate(verse,'verse')});prayer.addEventListener('click',()=>{if(!retrying)afterGenerate(prayer,'prayer')});surprise.addEventListener('click',()=>setTimeout(()=>{const item=current();if(item?.body)remember(item)},0));const fb=$('#socialFacebook');if(fb)fb.addEventListener('click',markPosted)}
function tryInstall(){installed=false;setTimeout(install,30)}
window.addEventListener('load',tryInstall);window.addEventListener('hashchange',tryInstall);
})();