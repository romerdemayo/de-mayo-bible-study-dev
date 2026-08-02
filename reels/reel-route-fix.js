/* De Mayo Bible Studies - force the V2 Reel Creator on the reelcreator route */
(function(){
'use strict';
let rendering=false;
function isReelRoute(){return location.hash.replace(/^#/,'')==='reelcreator';}
function renderV2(){
  if(rendering||!isReelRoute())return false;
  const creator=window.bibleReelCreator;
  if(typeof creator!=='function')return false;
  if(document.querySelector('.dm-reel-v2'))return true;
  rendering=true;
  try{
    creator();
    return !!document.querySelector('.dm-reel-v2');
  }catch(error){
    console.error('Unable to open Reel Creator V2',error);
    return false;
  }finally{
    rendering=false;
  }
}
function schedule(){setTimeout(renderV2,0);setTimeout(renderV2,80);setTimeout(renderV2,250);}
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-page="reelcreator"],a[href$="#reelcreator"]');
  if(target)schedule();
},true);
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
new MutationObserver(()=>{if(isReelRoute()&&!document.querySelector('.dm-reel-v2'))schedule();}).observe(document.documentElement,{childList:true,subtree:true});
schedule();
})();
