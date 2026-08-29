/* De Mayo Bible Studies — Reel content length guard
   Protects preview + MP4 layouts from generated text that exceeds the safe reading area. */
(function(){
'use strict';
const MAX_REFLECTION_WORDS=55;
const MAX_PRAYER_WORDS=40;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function shorten(text,maxWords){
  const value=clean(text),words=value.split(' ').filter(Boolean);
  if(words.length<=maxWords)return value;
  const hard=words.slice(0,maxWords).join(' ');
  const minChars=Math.floor(hard.length*.62);
  const matches=[...hard.matchAll(/[.!?](?=\s|$)/g)];
  const last=matches.map(m=>m.index+1).filter(i=>i>=minChars).pop();
  return last?hard.slice(0,last).trim():hard.replace(/[,:;\-–—]+$/,'').trim()+'…';
}
function guard(content){
  if(!content||typeof content!=='object')return content;
  const originalReflection=clean(content.reflection);
  const originalPrayer=clean(content.prayer);
  const reflection=shorten(originalReflection,MAX_REFLECTION_WORDS);
  const prayer=shorten(originalPrayer,MAX_PRAYER_WORDS);
  let caption=clean(content.caption);
  if(originalReflection!==reflection && !caption.includes(originalReflection)){
    caption=[caption,originalReflection].filter(Boolean).join('\n\n');
  }
  return {...content,reflection,prayer,caption};
}
function loadReflectionSafety(){
  if(window.DM_REFLECTION_REEL_SAFE||document.querySelector('script[data-dm-reflection-safe]'))return;
  const script=document.createElement('script');
  script.src='reels/reel-reflection-safe.js?v=12745';
  script.defer=true;
  script.dataset.dmReflectionSafe='1';
  document.head.appendChild(script);
}
function install(){
  const api=window.DM_REEL_CREATOR;
  if(!api||api.__lengthGuardInstalled||typeof api.setGeneratedContent!=='function')return false;
  const original=api.setGeneratedContent.bind(api);
  api.setGeneratedContent=function(content){return original(guard(content));};
  api.__lengthGuardInstalled=true;
  window.DM_REEL_CONTENT_GUARD={guard,limits:{reflection:MAX_REFLECTION_WORDS,prayer:MAX_PRAYER_WORDS}};
  loadReflectionSafety();
  return true;
}
function boot(){
  loadReflectionSafety();
  if(install())return;
  let tries=0;
  const timer=setInterval(()=>{tries++;if(install()||tries>40)clearInterval(timer);},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
