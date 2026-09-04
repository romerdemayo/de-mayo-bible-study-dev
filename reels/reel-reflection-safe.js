/* De Mayo Bible Studies — Reflection Reel safety v3
   Long reflections are shown in readable parts instead of being truncated. */
(function(){
'use strict';
const PART_WORDS=38;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function splitWords(text,maxWords=PART_WORDS){
 const words=clean(text).split(' ').filter(Boolean);if(words.length<=maxWords)return [words.join(' ')];
 const parts=[];for(let i=0;i<words.length;i+=maxWords)parts.push(words.slice(i,i+maxWords).join(' '));return parts;
}
function currentReflection(){try{return clean(window.DM_REEL_CREATOR?.getContent?.().reflection||'')}catch{return''}}
function apply(){
 const canvas=document.querySelector('.dm-reel-canvas');if(!canvas)return;
 const kicker=canvas.querySelector('.dm-reel-kicker'),message=canvas.querySelector('.dm-reel-message');if(!kicker||!message)return;
 const label=clean(kicker.textContent).toLowerCase();if(label!=='reflection'&&label!=='repleksyon'&&!label.startsWith('reflection ')&&!label.startsWith('repleksyon '))return;
 const original=currentReflection()||clean(message.dataset.dmFullReflection||message.textContent);if(!original)return;
 const parts=splitWords(original),countEl=document.querySelector('#dmSceneCount');
 let part=0;
 if(parts.length>1){
   const shown=clean(message.textContent),found=parts.findIndex(p=>shown===p);part=found>=0?found:0;
   /* Normal Reel Creator has one Reflection scene. Display part 1 here; the MP4 exporter reads all parts through the API below. */
   message.textContent=parts[part];kicker.textContent=`${label.startsWith('repleksyon')?'Repleksyon':'Reflection'} ${part+1}/${parts.length}`;
 }
 message.dataset.dmFullReflection=original;
 message.classList.remove('dm-text-short','dm-text-medium','dm-text-long','dm-text-xl');
 message.classList.add('dm-text-long','dm-reflection-safe');canvas.classList.add('dm-reflection-scene');
 if(countEl&&parts.length>1)countEl.dataset.dmReflectionParts=String(parts.length);
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
const observer=new MutationObserver(schedule);
function boot(){observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});document.addEventListener('dm-reel-content-change',schedule);window.addEventListener('hashchange',schedule);schedule();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.DM_REFLECTION_REEL_SAFE={apply,split:splitWords,limit:PART_WORDS,getParts:()=>splitWords(currentReflection())};
})();
