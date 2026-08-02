/* De Mayo Bible Studies - definitive Reel export cleanup */
(function(){
'use strict';
const OLD_IDS=['dmCreateMp4','dmOpenMp4','dmSaveFinishedVideo','dmFinishedVideoPicker','dmSaveVideo'];
const OLD_TEXT=[/copy reel request/i,/save webm/i,/create phone mp4/i,/create finished mp4/i,/open mp4 downloads/i,/save finished video/i,/github actions/i,/run workflow/i];
function removeLegacy(){
  OLD_IDS.forEach(id=>{const el=document.getElementById(id);if(el&&id!=='dmBrowserMp4')el.remove();});
  document.querySelectorAll('.dm-reel-actions button,.dm-reel-actions input,.dm-iphone-guide,.dm-reel-export-note,.dm-save-help').forEach(el=>{
    if(el.id==='dmBrowserMp4'||el.id==='dmIphoneShare')return;
    const text=(el.textContent||'').trim();
    if(OLD_TEXT.some(rx=>rx.test(text)))el.remove();
  });
  const status=document.querySelector('#dmExportStatus');
  if(status&&/github actions|workflow|reel_json|artifact/i.test(status.textContent||'')){
    status.hidden=true;status.textContent='';
  }
  document.querySelectorAll('p,small,div,section').forEach(el=>{
    if(el.closest('.dm-reel-actions'))return;
    const text=(el.textContent||'').trim();
    if(text.length<500&&/github actions.*workflow|copy reel request|download the mp4 artifact/i.test(text))el.remove();
  });
}
function guardLegacyClicks(event){
  const target=event.target.closest('button,a');
  if(!target||target.id==='dmBrowserMp4'||target.id==='dmIphoneShare')return;
  const text=(target.textContent||'').trim();
  const href=target.getAttribute('href')||'';
  if(OLD_TEXT.some(rx=>rx.test(text))||/actions\/workflows\/render-bible-reel/i.test(href)){
    event.preventDefault();event.stopImmediatePropagation();
    removeLegacy();
    document.querySelector('#dmBrowserMp4')?.focus();
  }
}
document.addEventListener('click',guardLegacyClicks,true);
new MutationObserver(removeLegacy).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',removeLegacy);
removeLegacy();
})();