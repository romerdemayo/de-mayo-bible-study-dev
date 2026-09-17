/* De Mayo Bible Studies — Reel caption/hashtag + generation recovery v2 */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let timer=null,lastRef='',startedAt=0;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function current(){return window.DM_REEL_CREATOR?.getContent?.()||null;}
function theme(){return clean($('#dmTheme')?.value||'hope').toLowerCase();}
function makeCaption(item){
  if(!item)return '';
  const ref=clean(item.reference),reflection=clean(item.reflection),verse=clean(item.verse);
  const lead=item.contentType==='motivation'?'Take this encouragement with you today. 🙏':'Let this Scripture speak to your heart today. 🙏';
  const body=reflection||verse;
  const scripture=ref?`“${verse}” — ${ref}`:'';
  const close=item.contentType==='motivation'?'Keep moving forward with faith. God is with you. ❤️🙏':'What part of this message speaks to you today? ❤️🙏';
  return [lead,body,scripture,close].filter(Boolean).join('\n\n');
}
function makeHashtags(item){
  const map={hope:'#HopeInGod',faith:'#WalkByFaith',peace:'#PeaceInChrist',strength:'#GodIsMyStrength',gratitude:'#ThankfulToGod',courage:'#CourageInChrist'};
  const topic=item?.contentType==='motivation'?'#ChristianMotivation':(map[theme()]||'#ChristianEncouragement');
  return [topic,'#TrustGod','#BibleVerse','#DailyPrayer','#Jesus','#ChristianReels','#DeMayoBibleStudies'].join(' ');
}
function ensureSocial(force=false){
  const item=current();if(!item?.reference)return false;
  const generic=/^#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies$/i.test(clean(item.hashtags));
  if(force||!clean(item.caption)||/What part of this message speaks to you today\?$/i.test(clean(item.caption)))item.caption=makeCaption(item);
  if(force||!clean(item.hashtags)||generic)item.hashtags=makeHashtags(item);
  lastRef=clean(item.reference);return true;
}
function diagnosticMessage(reason){
  const seconds=startedAt?Math.max(1,Math.round((Date.now()-startedAt)/1000)):0;
  if(reason==='offline')return '📴 Device is offline. A fresh built-in Reel was created. Reconnect to use Gemini.';
  if(reason==='timeout')return `⏱️ Internet is available, but Gemini did not respond within ${seconds||20}s. A fresh built-in Reel was created.`;
  return '⚠️ Gemini generation could not complete. A fresh built-in Reel was created instead.';
}
function finishFallback(reason){
  clearTimeout(timer);timer=null;
  const box=$('#dmReelGeminiStatus');
  if(!box||box.dataset.type!=='loading')return;
  const actualReason=reason||(navigator.onLine===false?'offline':'timeout');
  const fallback=window.DM_REEL_QUOTA_FALLBACK;
  if(fallback?.applyFallback){fallback.applyFallback();ensureSocial(true);}
  const selected=$('#dmRegenerate'),surprise=$('#dmReelSurprise');
  if(selected){selected.disabled=false;selected.textContent='✨ Generate Selected Theme';}
  if(surprise){surprise.disabled=false;surprise.textContent='🎲 Surprise Me';}
  box.dataset.type=actualReason==='offline'?'error':'warning';
  box.dataset.generationReason=actualReason;
  box.textContent=diagnosticMessage(actualReason);
  window.DM_REEL_COPY_TOOLS?.schedule?.(20);
}
function startWatch(){
  clearTimeout(timer);startedAt=Date.now();
  const box=$('#dmReelGeminiStatus');
  if(navigator.onLine===false){
    if(box){box.hidden=false;box.dataset.type='loading';box.textContent='📴 No internet connection detected. Preparing built-in Reel…';}
    timer=setTimeout(()=>finishFallback('offline'),150);
    return;
  }
  if(box){box.hidden=false;box.dataset.type='loading';box.dataset.generationReason='waiting';box.textContent='✨ Internet connected. Waiting for Gemini…';}
  timer=setTimeout(()=>finishFallback('timeout'),20000);
}
function boot(){
  document.addEventListener('click',e=>{if(e.target?.id==='dmRegenerate'||e.target?.id==='dmReelSurprise')startWatch();},true);
  document.addEventListener('dm-reel-content-change',()=>{setTimeout(()=>{ensureSocial(false);window.DM_REEL_COPY_TOOLS?.schedule?.(20);},30);});
  document.addEventListener('dm-reel-manual-content-ready',()=>{setTimeout(()=>{ensureSocial(true);window.DM_REEL_COPY_TOOLS?.schedule?.(20);},40);});
  window.addEventListener('online',()=>{const box=$('#dmReelGeminiStatus');if(box){box.hidden=false;box.dataset.type='info';box.textContent='🌐 Internet connection restored. Gemini generation is available to try again.';}});
  window.addEventListener('offline',()=>{const box=$('#dmReelGeminiStatus');if(box){box.hidden=false;box.dataset.type='error';box.textContent='📴 Device is currently offline. Built-in Reel generation remains available.';}});
  setTimeout(()=>ensureSocial(false),300);
}
window.DM_REEL_SOCIAL_RECOVERY={ensureSocial,makeCaption,makeHashtags,finishFallback,startWatch};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
