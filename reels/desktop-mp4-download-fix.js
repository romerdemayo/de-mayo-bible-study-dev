/* De Mayo Bible Studies - force reliable MP4 download on desktop browsers */
(function(){
'use strict';
const MOBILE=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(MOBILE||typeof navigator.canShare!=='function')return;
const originalCanShare=navigator.canShare.bind(navigator);
try{
  navigator.canShare=function(data){
    const files=Array.isArray(data&&data.files)?data.files:[];
    if(files.some(file=>file&&(/video\/mp4/i.test(file.type||'')||/\.mp4$/i.test(file.name||''))))return false;
    return originalCanShare(data);
  };
}catch(error){
  console.warn('Desktop MP4 download preference could not be installed.',error);
}
})();
