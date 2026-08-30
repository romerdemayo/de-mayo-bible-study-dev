/* De Mayo Bible Studies — narration-aware Reel scene timing bridge v2
   Keeps native MP4 scene timing locked to the prepared voice-over sections for the full export:
   Scripture -> Reflection/Message -> Prayer + Engagement. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let restoreTimer=null,originalGetContent=null,installed=false;
function words(v=''){return String(v||'').trim().split(/\s+/).filter(Boolean);}
function countsFromScript(){
 const text=String($('#dmVoiceoverScript')?.textContent||'').trim();
 if(!text)return null;
 const prayerMark=/\bLet us pray\.\s*/i,match=text.match(prayerMark);if(!match)return null;
 const before=text.slice(0,match.index).trim(),after=text.slice(match.index+match[0].length).trim();
 const content=window.DM_REEL_CREATOR?.getContent?.()||{},verseRef=`${content.verse||''} ${content.reference||''}`.trim();
 const verseCount=Math.max(6,words(verseRef).length+3),beforeCount=words(before).length;
 const messageCount=Math.max(8,beforeCount-Math.min(beforeCount,words(verseRef).length)+3);
 const prayerEngagementCount=Math.max(10,words(after).length+3);
 return [verseCount,messageCount,prayerEngagementCount];
}
function fakeWords(count){return Array.from({length:Math.max(1,count)},()=> 'sync').join(' ');}
function prepare(){
 const api=window.DM_REEL_CREATOR;if(!api||typeof api.getContent!=='function')return;
 if(window.__DM_SCENE_SYNC_ACTIVE)restore();
 const counts=countsFromScript();if(!counts)return;
 originalGetContent=api.getContent.bind(api);
 api.getContent=function(){const c=originalGetContent();return {...c,reflection:fakeWords(counts[1]-3),prayer:fakeWords(counts[2]-3)};};
 window.__DM_SCENE_SYNC_ACTIVE=true;window.DM_REEL_SCENE_SYNC_COUNTS=counts;
 clearTimeout(restoreTimer);
 /* MP4 creation itself can take up to 120 seconds on iPhone. The old 8-second restore
    could remove the timing bridge before native sceneTiming() ran. Keep it alive through export. */
 restoreTimer=setTimeout(restore,135000);
}
function restore(){const api=window.DM_REEL_CREATOR;if(api&&originalGetContent)api.getContent=originalGetContent;originalGetContent=null;window.__DM_SCENE_SYNC_ACTIVE=false;clearTimeout(restoreTimer);restoreTimer=null;}
function boot(){if(installed)return;installed=true;document.addEventListener('click',e=>{if(e.target?.closest?.('#dmNativeMp4'))prepare();},true);document.addEventListener('dm-reel-content-change',()=>{if(window.__DM_SCENE_SYNC_ACTIVE)restore();});}
window.DM_REEL_VOICE_SCENE_SYNC={prepare,restore,countsFromScript};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
