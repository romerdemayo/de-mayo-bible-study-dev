/* De Mayo Bible Studies - preserve the V2 Reel Creator before route handling */
(function(){
'use strict';
if(typeof window.bibleReelCreator==='function'){
  window.bibleReelCreatorV2=window.bibleReelCreator;
}
})();
