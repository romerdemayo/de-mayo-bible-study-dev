/* De Mayo Bible Studies — narration-aware Reel scene timing bridge v1
   Makes the native MP4 scene timing follow the prepared voice-over sections:
   Scripture -> Reflection/Message -> Prayer/Closing. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let restoreTimer=null,originalGetContent=null,installed=false;
function words(v=''){return String(v||'').trim().split(/\s+/).filter(Boolean);}
function countsFromScript(){
 const text=String($('#dmVoiceoverScript')?.textContent||'').trim();
 if(!text)return null;
 const prayerMark=/\bLet us pray\.\s*/i;
 const match=text.match(prayerMark);
 if(!match)return null;
 const prayerIndex=match.index;
 const before=text.slice(0,prayerIndex).trim();
 const after=text.slice(prayerIndex+match[0].length).trim();
 const content=window.DM_REEL_CREATOR?.getContent?.()||{};
 const verseRef=`${content.verse||''} ${content.reference||''}`.trim();
 const firstCount=Math.max(6,words(verseRef).length+3);
 let beforeWords=words(before);
 const verseWords=words(verseRef).length;
 const middleCount=Math.max(8,beforeWords.length-Math.min(beforeWords.length,verseWords)+3);
 const lastCount=Math.max(10,words(after).length+3);
 return [firstCount,middleCount,lastCount];
}
function fakeWords(count){return Array.from({length:Math.max(1,count)},()=> 'sync').join(' ');}
function prepare(){
 const api=window.DM_REEL_CREATOR;
 if(!api||typeof api.getContent!=='function'||window.__DM_SCENE_SYNC_ACTIVE)return;
 const counts=countsFromScript();if(!counts)return;
 originalGetContent=api.getContent.bind(api);
 api.getContent=function(){
   const c=originalGetContent();
   return {...c,reflection:fakeWords(counts[1]-3),prayer:fakeWords(counts[2]-3)};
 };
 window.__DM_SCENE_SYNC_ACTIVE=true;
 window.DM_REEL_SCENE_SYNC_COUNTS=counts;
 clearTimeout(restoreTimer);
 restoreTimer=setTimeout(restore,8000);
}
function restore(){
 const api=window.DM_REEL_CREATOR;
 if(api&&originalGetContent)api.getContent=originalGetContent;
 originalGetContent=null;
 window.__DM_SCENE_SYNC_ACTIVE=false;
}
function boot(){
 if(installed)return;installed=true;
 document.addEventListener('click',e=>{if(e.target?.closest?.('#dmNativeMp4'))prepare();},true);
 document.addEventListener('dm-reel-voiceover-ready',restore);
 document.addEventListener('dm-reel-content-change',()=>{if(!window.__DM_SCENE_SYNC_ACTIVE)return;});
}
window.DM_REEL_VOICE_SCENE_SYNC={prepare,restore,countsFromScript};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
