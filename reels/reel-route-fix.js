/* De Mayo Bible Studies - ensure the V2 Reel Creator owns the reelcreator route */
(function(){
'use strict';
function installRouteFix(){
  const creator=window.bibleReelCreatorV2||window.bibleReelCreator;
  if(typeof creator!=='function')return false;
  try{
    bibleReelCreator=creator;
    window.bibleReelCreator=creator;
    return true;
  }catch(error){
    console.error('Unable to install Reel Creator V2 route',error);
    return false;
  }
}
if(!installRouteFix())window.addEventListener('load',installRouteFix,{once:true});
})();
