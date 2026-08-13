/* De Mayo Bible Studies - persistent MP4 result panel */
(function(){
'use strict';
let latestUrl='',latestBlob=null,latestName='';
const originalCreate=URL.createObjectURL.bind(URL);
const originalRevoke=URL.revokeObjectURL.bind(URL);
const isPhone=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function fileName(){return `de-mayo-bible-reel-${new Date().toISOString().slice(0,10)}.mp4`;}
function setStatus(message,type='success'){
  const box=document.querySelector('#dmExportStatus');
  if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}
  if(typeof window.toast==='function')window.toast(message);
}
function ensurePanel(){
  let panel=document.querySelector('#dmMp4Result');
  if(panel)return panel;
  const actions=document.querySelector('.dm-reel-actions');
  if(!actions)return null;
  if(!document.querySelector('#dmShareLastMp4')){
    const shareButton=document.createElement('button');
    shareButton.id='dmShareLastMp4';
    shareButton.type='button';
    shareButton.textContent='📤 Share MP4';
    shareButton.disabled=true;
    shareButton.title='Create an MP4 first';
    shareButton.addEventListener('click',shareLatest);
    actions.appendChild(shareButton);
  }
  if(!document.querySelector('#dmSaveLastMp4')){
    const saveButton=document.createElement('button');
    saveButton.id='dmSaveLastMp4';
    saveButton.type='button';
    saveButton.className='primary';
    saveButton.textContent=isPhone?'💾 Save to Phone':'💾 Save MP4 As…';
    saveButton.disabled=true;
    saveButton.title='Create an MP4 first';
    saveButton.addEventListener('click',saveForDevice);
    actions.appendChild(saveButton);
  }
  panel=document.createElement('section');
  panel.id='dmMp4Result';
  panel.className='card dm-mp4-result';
  panel.hidden=true;
  panel.innerHTML='<h3>✅ MP4 ready</h3><p>Your finished video will stay available here until you leave or refresh this page.</p><div class="dm-library-actions"><button id="dmMp4Download" class="primary" type="button">💾 Save MP4 As…</button><a id="dmMp4Preview" href="#" target="_blank" rel="noopener">▶ Preview MP4</a><button id="dmMp4Share" type="button">📤 Share MP4</button></div><p class="small-note">On Mac or Windows, choose <b>Save MP4 As…</b> and select the folder yourself. On iPhone, choose <b>Share MP4</b>, then <b>Save Video</b>.</p>';
  const guide=document.querySelector('.dm-browser-mp4-guide');
  (guide||actions).insertAdjacentElement('afterend',panel);
  panel.querySelector('#dmMp4Download').textContent=isPhone?'💾 Save to Phone':'💾 Save MP4 As…';
  panel.querySelector('#dmMp4Download').addEventListener('click',saveForDevice);
  panel.querySelector('#dmMp4Share').addEventListener('click',shareLatest);
  return panel;
}
function showResult(blob,url){
  latestBlob=blob;latestUrl=url;latestName=fileName();
  const panel=ensurePanel();if(!panel)return;
  const shareButton=document.querySelector('#dmShareLastMp4');
  if(shareButton){shareButton.disabled=false;shareButton.title='Share the finished MP4';}
  const saveButton=document.querySelector('#dmSaveLastMp4');
  if(saveButton){saveButton.disabled=false;saveButton.title=isPhone?'Save the finished MP4 to this phone':'Choose where to save the finished MP4';}
  panel.querySelector('#dmMp4Preview').href=url;
  panel.hidden=false;
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  setStatus('MP4 created. Choose Save MP4 As… to write it to your Mac.');
}
async function saveLatest(){
  if(!latestBlob){setStatus('Create the MP4 first.','error');return;}
  try{
    if(!isPhone&&'showSaveFilePicker' in window){
      const handle=await window.showSaveFilePicker({
        suggestedName:latestName||fileName(),
        types:[{description:'MP4 video',accept:{'video/mp4':['.mp4']}}]
      });
      const writable=await handle.createWritable();
      await writable.write(latestBlob);
      await writable.close();
      const saved=await handle.getFile();
      setStatus(`MP4 saved successfully: ${saved.name} (${Math.max(1,Math.round(saved.size/1024/1024))} MB).`);
      return;
    }
  }catch(error){
    if(error&&error.name==='AbortError'){setStatus('Save cancelled.','info');return;}
    console.error('Save As failed',error);
  }
  const a=document.createElement('a');
  a.href=latestUrl;
  a.download=latestName||fileName();
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus('Download started. Check Chrome Downloads.');
}
async function saveForDevice(){
  if(isPhone)return shareLatest();
  return saveLatest();
}
async function shareLatest(){
  if(!latestBlob){setStatus('Create the MP4 first.','error');return;}
  const file=new File([latestBlob],latestName||fileName(),{type:'video/mp4'});
  try{
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'De Mayo Bible Reel',text:'Created with De Mayo Bible Studies'});
      setStatus('Share menu opened. On iPhone choose Save Video to place the Reel in Photos.','success');
      return;
    }
  }catch(error){if(error&&error.name==='AbortError')return;console.error(error);}
  await saveLatest();
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
