/* De Mayo Bible Studies — Reel sharing/copy tools restore */
(function(){
'use strict';
const MAIN_APP_URL='https://romerdemayo.github.io/de-mayo-bible-study/';
const $=(s,r=document)=>r.querySelector(s);
function clean(v=''){return String(v||'').trim()}
function current(){return window.DM_REEL_CREATOR?.getContent?.()||{}}
function theme(){return clean($('#dmTheme')?.value||'hope').toLowerCase()}
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
 if(!text){
  const parts=[];
  if(item?.reference)parts.push(item.reference);
  if(item?.reflection)parts.push(item.reflection);
  if(item?.prayer)parts.push('Prayer: '+item.prayer);
  text=parts.join('\n\n');
 }
 return text.replace(/https?:\/\/\S+/gi,'').replace(/\n{3,}/g,'\n\n').trim();
}
function fullPost(item){return [caption(item),hashtags(item),MAIN_APP_URL].filter(Boolean).join('\n\n')}
async function copy(value,label){
 const text=clean(value);if(!text)return window.toast?.('Nothing to copy yet.');
 try{await navigator.clipboard.writeText(text);window.toast?.(label+' copied.');}
 catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');window.toast?.(label+' copied.');}catch{window.toast?.('Copy failed.');}t.remove();}
}
function render(){
 const actions=$('.dm-reel-actions');
 if(!actions)return false;
 let panel=$('#dmReelCopyTools');
 if(!panel){
  panel=document.createElement('section');panel.id='dmReelCopyTools';panel.className='card';
  panel.innerHTML=`<h3>📣 Caption, hashtags & link</h3><p class="small-note">Copy these separately or copy everything together for Facebook Reels.</p><div class="dm-form-grid"><label>Caption<textarea id="dmReelCaptionPreview" rows="5" readonly></textarea></label><label>Hashtags<textarea id="dmReelHashtagsPreview" rows="5" readonly></textarea></label></div><p><a id="dmReelAppLink" class="text-link" href="${MAIN_APP_URL}" target="_blank" rel="noopener noreferrer">${MAIN_APP_URL}</a></p><div class="dm-reel-ai-actions"><button type="button" id="dmCopyReelCaption" class="ghost">📋 Copy caption</button><button type="button" id="dmCopyReelHashtags" class="ghost">#️⃣ Copy hashtags</button><button type="button" id="dmCopyReelLink" class="ghost">🔗 Copy Bible app link</button><button type="button" id="dmCopyReelAll" class="primary">📲 Copy all for Facebook</button></div>`;
  actions.insertAdjacentElement('afterend',panel);
  $('#dmCopyReelCaption').onclick=()=>copy(caption(current()),'Caption');
  $('#dmCopyReelHashtags').onclick=()=>copy(hashtags(current()),'Hashtags');
  $('#dmCopyReelLink').onclick=()=>copy(MAIN_APP_URL,'Bible app link');
  $('#dmCopyReelAll').onclick=()=>copy(fullPost(current()),'Facebook post');
 }
 const item=current();
 const cap=$('#dmReelCaptionPreview'),tags=$('#dmReelHashtagsPreview');
 if(cap)cap.value=caption(item);if(tags)tags.value=hashtags(item);
 return true;
}
let timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(render,60)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',schedule);document.addEventListener('dm-reel-studio-ready',schedule);document.addEventListener('dm-reel-content-change',schedule);
document.addEventListener('change',e=>{if(['dmTheme','dmReelContentType','dmReelLanguage'].includes(e.target?.id))schedule()});
})();
