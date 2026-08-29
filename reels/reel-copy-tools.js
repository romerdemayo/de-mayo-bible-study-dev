/* De Mayo Bible Studies — Reel copy actions integrated with main toolbar v6 */
(function(){
'use strict';
const MAIN_APP_URL='https://romerdemayo.github.io/de-mayo-bible-study/';
const POSTED_KEY='dm_reel_posted_history_v1';
const $=(s,r=document)=>r.querySelector(s);
function clean(v=''){return String(v||'').trim();}
function current(){return window.DM_REEL_CREATOR?.getContent?.()||{};}
function theme(){return clean($('#dmTheme')?.value||'hope').toLowerCase();}
function signature(item){return clean(item?.reference).toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function readPosted(){try{const v=JSON.parse(localStorage.getItem(POSTED_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[];}}
function writePosted(items){localStorage.setItem(POSTED_KEY,JSON.stringify(items.slice(0,120)));}
function isPosted(item=current()){const sig=signature(item);return !!sig&&readPosted().some(x=>signature(x)===sig);}
function hashtags(item){
 const map={hope:'#HopeInGod',faith:'#WalkByFaith',peace:'#PeaceInChrist',strength:'#GodIsMyStrength',gratitude:'#ThankfulToGod',courage:'#CourageInChrist'};
 const motivation=item?.contentType==='motivation';
 const topic=motivation?'#ChristianMotivation':(map[theme()]||'#FaithInGod');
 const raw=clean(item?.hashtags);
 const generated=raw?raw.split(/[\s,]+/).filter(Boolean):['#ChristianReels','#BibleVerse',topic,'#ChristianEncouragement','#DeMayoBibleStudies'];
 const tags=[];
 for(const value of generated){const tag=value.startsWith('#')?value:'#'+value;if(!tags.some(x=>x.toLowerCase()===tag.toLowerCase()))tags.push(tag);}
 if(!tags.some(x=>x.toLowerCase()==='#demayobiblestudies'))tags.push('#DeMayoBibleStudies');
 return tags.slice(0,7).join(' ');
}
function caption(item){
 let text=clean(item?.caption);
 if(!text){const parts=[];if(item?.reference)parts.push(item.reference);if(item?.reflection)parts.push(item.reflection);if(item?.prayer)parts.push('Prayer: '+item.prayer);text=parts.join('\n\n');}
 return text.replace(/https?:\/\/\S+/gi,'').replace(/\n{3,}/g,'\n\n').trim();
}
function captionAndHashtags(item){return [caption(item),hashtags(item)].filter(Boolean).join('\n\n');}
function fullPost(item){return [caption(item),hashtags(item),MAIN_APP_URL].filter(Boolean).join('\n\n');}
async function copy(value,label){
 const text=clean(value);if(!text)return window.toast?.('Nothing to copy yet.');
 try{await navigator.clipboard.writeText(text);window.toast?.(label+' copied.');}
 catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');window.toast?.(label+' copied.');}catch{window.toast?.('Copy failed.');}t.remove();}
}
function actionGrid(){
 const play=$('#dmPlay');
 if(play?.parentElement)return play.parentElement;
 const copyScript=$('#dmCopyScript');
 if(copyScript?.parentElement)return copyScript.parentElement;
 const saveProject=$('#dmSaveProject');
 if(saveProject?.parentElement)return saveProject.parentElement;
 return null;
}
function addButton(grid,id,label,handler,primary=false){
 let button=$('#'+id);
 if(button&&button.parentElement!==grid)grid.appendChild(button);
 button=$('#'+id);
 if(!button){
  const template=$('#dmCopyScript')||$('#dmSaveProject')||$('#dmPlay')||grid.querySelector('button');
  button=document.createElement('button');button.type='button';button.id=id;button.textContent=label;
  if(template?.className)button.className=template.className;
  if(primary){button.classList.remove('ghost');button.classList.add('primary');}
  grid.appendChild(button);
 }
 if(handler)button.onclick=handler;
 return button;
}
function markPostedFallback(){
 const item=current();
 if(!item?.reference){window.toast?.('Create or open a Reel before marking it as posted.');return;}
 if(isPosted(item)){updatePostedButton();window.toast?.(`${item.reference} is already marked as posted.`);return;}
 writePosted([{...item,postedAt:new Date().toISOString()},...readPosted().filter(x=>signature(x)!==signature(item))]);
 updatePostedButton();
 const count=$('#dmPostedReelCount');if(count)count.textContent=`${readPosted().length} posted Reel${readPosted().length===1?'':'s'} protected from repeats`;
 window.toast?.(`${item.reference} marked as posted.`);
}
function updatePostedButton(){
 const button=$('#dmMarkReelPosted');if(!button)return;
 const posted=isPosted();button.textContent=posted?'✓ Already Posted':'✓ Mark as Posted';button.disabled=posted;
}
function ensurePostedButton(grid){
 let button=$('#dmMarkReelPosted');
 if(button){
  if(button.parentElement!==grid)grid.appendChild(button);
  const template=$('#dmCopyScript')||$('#dmSaveProject')||$('#dmPlay');if(template?.className)button.className=template.className;
 }else{
  button=addButton(grid,'dmMarkReelPosted','✓ Mark as Posted',markPostedFallback);
 }
 updatePostedButton();
 return button;
}
function render(){
 const onReel=location.hash==='#reelcreator'||!!$('#dmReelPreview');
 if(!onReel)return false;
 const oldPanel=$('#dmReelCopyTools');if(oldPanel)oldPanel.remove();
 const grid=actionGrid();if(!grid)return false;
 grid.dataset.dmCopyTools='inline';
 addButton(grid,'dmCopyReelCaption','📋 Copy caption',()=>copy(caption(current()),'Caption'));
 addButton(grid,'dmCopyReelHashtags','#️⃣ Copy hashtags',()=>copy(hashtags(current()),'Hashtags'));
 addButton(grid,'dmCopyReelCaptionHashtags','📋#️⃣ Copy caption + hashtags',()=>copy(captionAndHashtags(current()),'Caption and hashtags'));
 addButton(grid,'dmCopyReelLink','🔗 Copy Bible app link',()=>copy(MAIN_APP_URL,'Bible app link'));
 addButton(grid,'dmCopyReelAll','📲 Copy all for Facebook',()=>copy(fullPost(current()),'Facebook post'),true);
 ensurePostedButton(grid);
 return true;
}
let timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(render,60);}
function boot(){schedule();const observer=new MutationObserver(()=>{if(location.hash==='#reelcreator'||$('#dmReelPreview'))schedule();});observer.observe(document.body,{childList:true,subtree:true});let n=0;const retry=setInterval(()=>{n++;if(render()||n>120)clearInterval(retry);},100);}
window.DM_REEL_COPY_TOOLS={render,schedule,updatePostedButton};
window.addEventListener('load',boot,{once:true});window.addEventListener('hashchange',schedule);document.addEventListener('dm-reel-studio-ready',()=>{render();setTimeout(render,100);});document.addEventListener('dm-reel-content-change',()=>{schedule();setTimeout(updatePostedButton,80);});document.addEventListener('change',e=>{if(['dmTheme','dmReelContentType','dmReelLanguage'].includes(e.target?.id))schedule();});
if(document.readyState!=='loading')boot();
})();
