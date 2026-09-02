/* De Mayo Bible Studies — Gemini -> offline Reel handoff fix v1
   Ensures devotional generation automatically switches to fresh built-in content
   when Gemini repeats, hits quota, rate limits, or is temporarily unavailable. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let lastToken='',running=false,observer=null;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function devotional(){return ($('#dmReelContentType')?.value||'devotional')==='devotional';}
function needsFallback(box){
  if(!box||!devotional())return false;
  const text=clean(box.textContent).toLowerCase();
  const failed=box.dataset.type==='error'||text.startsWith('⚠');
  return failed&&/repeated a recent verse|quota|rate limit|429|503|unavailable|high demand|temporar|busy|limit|failed/.test(text);
}
function handoff(){
  const box=$('#dmReelGeminiStatus');if(!needsFallback(box)||running)return;
  const token=clean(box.textContent)+'|'+box.dataset.type;
  if(token===lastToken)return;lastToken=token;running=true;
  setTimeout(()=>{
    try{
      const fallback=window.DM_REEL_QUOTA_FALLBACK;
      if(fallback?.applyFallback){
        fallback.applyFallback();
      }else{
        box.hidden=false;box.dataset.type='loading';box.textContent='Gemini could not provide a fresh verse. Loading a fresh built-in Reel…';
        let tries=0;const timer=setInterval(()=>{tries++;if(window.DM_REEL_QUOTA_FALLBACK?.applyFallback){clearInterval(timer);window.DM_REEL_QUOTA_FALLBACK.applyFallback();}else if(tries>=30){clearInterval(timer);box.dataset.type='error';box.textContent='Built-in Reel generator is still loading. Refresh once and try again.';}},100);
      }
    }finally{setTimeout(()=>{running=false;},500);}
  },60);
}
function watch(){
  const box=$('#dmReelGeminiStatus');
  if(!box){setTimeout(watch,120);return;}
  if(observer)observer.disconnect();
  observer=new MutationObserver(handoff);
  observer.observe(box,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-type','hidden']});
  handoff();
}
function boot(){watch();document.addEventListener('dm-reel-studio-ready',()=>setTimeout(watch,50));document.addEventListener('dm-reel-content-change',()=>{if(!needsFallback($('#dmReelGeminiStatus')))lastToken='';});window.addEventListener('hashchange',()=>setTimeout(watch,80));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.DM_REEL_FALLBACK_HANDOFF_FIX={handoff,watch};
})();
