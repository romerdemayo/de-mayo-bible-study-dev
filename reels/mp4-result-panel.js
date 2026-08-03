/* De Mayo Bible Studies - persistent MP4 result panel */
(function(){
'use strict';
let latestUrl='',latestBlob=null,latestName='';
const originalCreate=URL.createObjectURL.bind(URL);
const originalRevoke=URL.revokeObjectURL.bind(URL);
function fileName(){return `de-mayo-bible-reel-${new Date().toISOString().slice(0,10)}.mp4`;}
function ensurePanel(){
  let panel=document.querySelector('#dmMp4Result');
  if(panel)return panel;
  const actions=document.querySelector('.dm-reel-actions');
  if(!actions)return null;
  panel=document.createElement('section');
  panel.id='dmMp4Result';
  panel.className='card dm-mp4-result';
  panel.hidden=true;
  panel.innerHTML='<h3>✅ MP4 ready</h3><p>Your finished video will stay available here until you leave or refresh this page.</p><div class="dm-library-actions"><a id="dmMp4Download" class="primary" href="#">⬇ Download MP4</a><a id="dmMp4Preview" href="#" target="_blank" rel="noopener">▶ Preview MP4</a><button id="dmMp4Share" type="button">📤 Share MP4</button></div><p class="small-note">On Mac or PC, use <b>Download MP4</b>. On iPhone, use <b>Share MP4</b>, then choose <b>Save Video</b>.</p>';
  const guide=document.querySelector('.dm-browser-mp4-guide');
  (guide||actions).insertAdjacentElement('afterend',panel);
  panel.querySelector('#dmMp4Share').addEventListener('click',shareLatest);
  return panel;
}
function showResult(blob,url){
  latestBlob=blob;latestUrl=url;latestName=fileName();
  const panel=ensurePanel();if(!panel)return;
  const download=panel.querySelector('#dmMp4Download');
  const preview=panel.querySelector('#dmMp4Preview');
  download.href=url;download.download=latestName;
  preview.href=url;
  panel.hidden=false;
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
async function shareLatest(){
  if(!latestBlob)return;
  const file=new File([latestBlob],latestName||fileName(),{type:'video/mp4'});
  try{
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'De Mayo Bible Reel',text:'Created with De Mayo Bible Studies'});
      return;
    }
  }catch(error){if(error&&error.name==='AbortError')return;}
  const link=document.querySelector('#dmMp4Download');if(link)link.click();
}
URL.createObjectURL=function(value){
  const url=originalCreate(value);
  if(value instanceof Blob&&value.type==='video/mp4')showResult(value,url);
  return url;
};
URL.revokeObjectURL=function(url){
  if(url===latestUrl)return;
  return originalRevoke(url);
};
new MutationObserver(ensurePanel).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pagehide',()=>{if(latestUrl)originalRevoke(latestUrl);});
})();