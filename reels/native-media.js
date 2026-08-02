/* De Mayo Bible Studies - Native media bridge */
(function(){
'use strict';
const cap=window.Capacitor;
const isNative=!!(cap&&typeof cap.isNativePlatform==='function'&&cap.isNativePlatform());
function plugin(name){return cap&&cap.Plugins&&cap.Plugins[name];}
function status(message,type='success'){
  if(typeof window.toast==='function')window.toast(message);
  const box=document.querySelector('#dmExportStatus');
  if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}
}
async function fileToDataUrl(file){
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result||''));
    reader.onerror=()=>reject(reader.error||new Error('Unable to read video file'));
    reader.readAsDataURL(file);
  });
}
async function saveVideoToPhotos(file){
  if(!file||!(file.type==='video/mp4'||/\.mp4$/i.test(file.name||''))){
    status('Please choose a finished MP4 Reel video.','error');
    return false;
  }
  if(!isNative)return false;
  const Media=plugin('Media');
  if(!Media||typeof Media.saveVideo!=='function'){
    status('The native Photos saver is not installed in this build.','error');
    return false;
  }
  try{
    status('Saving Reel video to Photos…','info');
    const path=await fileToDataUrl(file);
    await Media.saveVideo({path});
    status('Reel saved directly to Photos.','success');
    return true;
  }catch(error){
    console.error(error);
    status('Could not save directly to Photos. Please use the Share Sheet.','error');
    return false;
  }
}
if(isNative){
  document.addEventListener('change',event=>{
    const input=event.target;
    if(!(input instanceof HTMLInputElement)||input.id!=='dmFinishedVideoPicker')return;
    const file=input.files&&input.files[0];
    if(!file)return;
    event.stopImmediatePropagation();
    saveVideoToPhotos(file).finally(()=>{input.value='';});
  },true);
  document.addEventListener('click',event=>{
    const button=event.target&&event.target.closest&&event.target.closest('#dmSaveFinishedVideo');
    if(button)button.textContent='📲 Save MP4 Directly to Photos';
  },true);
}
window.DeMayoNativeMedia={isNative,saveVideoToPhotos};
})();
