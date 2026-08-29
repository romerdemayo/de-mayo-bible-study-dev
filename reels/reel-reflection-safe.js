/* De Mayo Bible Studies — Reflection Reel safety
   Protects the Reflection scene itself (preview + MP4 snapshot) from long text overflow. */
(function(){
'use strict';
const MAX_REFLECTION_WORDS=44;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function shorten(text,maxWords=MAX_REFLECTION_WORDS){
  const words=clean(text).split(' ').filter(Boolean);
  if(words.length<=maxWords)return words.join(' ');
  const sliced=words.slice(0,maxWords).join(' ');
  const min=Math.floor(sliced.length*.58);
  const stops=[...sliced.matchAll(/[.!?](?=\s|$)/g)].map(m=>m.index+1).filter(i=>i>=min);
  return stops.length?sliced.slice(0,stops[stops.length-1]).trim():sliced.replace(/[,:;\-–—]+$/,'').trim()+'…';
}
function apply(){
  const canvas=document.querySelector('.dm-reel-canvas');
  if(!canvas)return;
  const kicker=canvas.querySelector('.dm-reel-kicker');
  const message=canvas.querySelector('.dm-reel-message');
  if(!kicker||!message)return;
  const label=clean(kicker.textContent).toLowerCase();
  if(label!=='reflection'&&label!=='repleksyon')return;
  const original=message.dataset.dmFullReflection||clean(message.textContent);
  message.dataset.dmFullReflection=original;
  const safe=shorten(original);
  if(message.textContent!==safe)message.textContent=safe;
  message.classList.remove('dm-text-short','dm-text-medium','dm-text-long');
  message.classList.add('dm-text-xl','dm-reflection-safe');
  canvas.classList.add('dm-reflection-scene');
}
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
const observer=new MutationObserver(schedule);
function boot(){
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.addEventListener('dm-reel-content-change',schedule);
  window.addEventListener('hashchange',schedule);
  schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.DM_REFLECTION_REEL_SAFE={apply,shorten,limit:MAX_REFLECTION_WORDS};
})();
