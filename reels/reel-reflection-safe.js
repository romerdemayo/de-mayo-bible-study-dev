/* De Mayo Bible Studies — Reflection Reel safety v2
   Keeps the Reflection scene readable without dropping a large part of the message. */
(function(){
'use strict';
const MAX_REFLECTION_WORDS=55;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function shorten(text,maxWords=MAX_REFLECTION_WORDS){
  const words=clean(text).split(' ').filter(Boolean);
  if(words.length<=maxWords)return words.join(' ');
  return words.slice(0,maxWords).join(' ').replace(/[,:;\-–—]+$/,'').trim()+'…';
}
function apply(){
  const canvas=document.querySelector('.dm-reel-canvas');
  if(!canvas)return;
  const kicker=canvas.querySelector('.dm-reel-kicker');
  const message=canvas.querySelector('.dm-reel-message');
  if(!kicker||!message)return;
  const label=clean(kicker.textContent).toLowerCase();
  if(label!=='reflection'&&label!=='repleksyon')return;
  const live=clean(message.textContent);
  const previousSafe=clean(message.dataset.dmSafeReflection||'');
  let original=clean(message.dataset.dmFullReflection||'');
  if(!original||live!==previousSafe){original=live;message.dataset.dmFullReflection=original;}
  const safe=shorten(original);
  message.dataset.dmSafeReflection=safe;
  if(message.textContent!==safe)message.textContent=safe;
  message.classList.remove('dm-text-short','dm-text-medium','dm-text-long','dm-text-xl');
  const count=clean(safe).split(' ').filter(Boolean).length;
  message.classList.add(count>44?'dm-text-long':'dm-text-xl','dm-reflection-safe');
  canvas.classList.add('dm-reflection-scene');
}
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
const observer=new MutationObserver(schedule);
function boot(){
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.addEventListener('dm-reel-content-change',()=>{const m=document.querySelector('.dm-reel-message');if(m){delete m.dataset.dmFullReflection;delete m.dataset.dmSafeReflection;}schedule();});
  window.addEventListener('hashchange',schedule);
  schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.DM_REFLECTION_REEL_SAFE={apply,shorten,limit:MAX_REFLECTION_WORDS};
})();
