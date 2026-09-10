/* De Mayo Bible Studies — Reel caption/hashtag + generation recovery v1 */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let timer=null,lastRef='';
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
function finishFallback(){
  const box=$('#dmReelGeminiStatus');
  if(!box||box.dataset.type!=='loading')return;
  const fallback=window.DM_REEL_QUOTA_FALLBACK;
  if(fallback?.applyFallback){fallback.applyFallback();ensureSocial(true);}
  const selected=$('#dmRegenerate'),surprise=$('#dmReelSurprise');
  if(selected){selected.disabled=false;selected.textContent='✨ Generate Selected Theme';}
  if(surprise){surprise.disabled=false;surprise.textContent='🎲 Surprise Me';}
  if(box.dataset.type==='loading'){box.dataset.type='success';box.textContent='✅ Gemini did not respond, so a fresh built-in Reel was created instead.';}
  window.DM_REEL_COPY_TOOLS?.schedule?.(20);
}
function startWatch(){clearTimeout(timer);timer=setTimeout(finishFallback,12000);}
function boot(){
  document.addEventListener('click',e=>{if(e.target?.id==='dmRegenerate'||e.target?.id==='dmReelSurprise')startWatch();},true);
  document.addEventListener('dm-reel-content-change',()=>{setTimeout(()=>{ensureSocial(false);window.DM_REEL_COPY_TOOLS?.schedule?.(20);},30);});
  document.addEventListener('dm-reel-manual-content-ready',()=>{setTimeout(()=>{ensureSocial(true);window.DM_REEL_COPY_TOOLS?.schedule?.(20);},40);});
  window.addEventListener('online',()=>{const box=$('#dmReelGeminiStatus');if(box&&box.dataset.type==='error')box.textContent='Connection restored. You can try Gemini again.';});
  setTimeout(()=>ensureSocial(false),300);
}
window.DM_REEL_SOCIAL_RECOVERY={ensureSocial,makeCaption,makeHashtags,finishFallback};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
