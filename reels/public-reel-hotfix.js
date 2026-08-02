/* De Mayo Bible Studies - public Reel Creator control hotfix */
(function(){
'use strict';
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function hideLegacyControls(){
  document.querySelectorAll('button,a').forEach(el=>{
    const text=(el.textContent||'').replace(/\s+/g,' ').trim();
    if(/Copy Reel Request|Save WebM|Create phone MP4|Open MP4 Downloads|Save Finished Video to Photos/i.test(text)){
      el.hidden=true;
      el.style.display='none';
      el.setAttribute('aria-hidden','true');
    }
  });
  document.querySelectorAll('.dm-iphone-guide,.dm-browser-mp4-guide').forEach((el,i)=>{if(i>0)el.remove();});
}
function ensureBrowserButton(){
  const actions=document.querySelector('.dm-reel-actions');
  if(!actions)return;
  hideLegacyControls();
  let button=document.querySelector('#dmBrowserMp4');
  if(button){button.hidden=false;button.style.display='';button.textContent=IOS?'🎬 Create MP4 & Save to Photos':'🎬 Create MP4';return;}
  button=document.createElement('button');
  button.id='dmBrowserMp4Hotfix';
  button.className='primary';
  button.textContent=IOS?'🎬 Create MP4 & Save to Photos':'🎬 Create MP4';
  button.addEventListener('click',()=>{
    const real=document.querySelector('#dmBrowserMp4');
    if(real){real.click();return;}
    const status=document.querySelector('#dmExportStatus');
    if(status){status.hidden=false;status.dataset.type='error';status.textContent='MP4 exporter is still loading. Please wait a few seconds and tap again.';}
  });
  actions.appendChild(button);
  if(!document.querySelector('.dm-browser-mp4-guide')){
    const guide=document.createElement('section');
    guide.className='card dm-browser-mp4-guide';
    guide.innerHTML='<h3>One-button MP4 export</h3><p>Tap <b>Create MP4 & Save to Photos</b>. Keep Safari open while the Reel is created. When the Share Sheet opens, choose <b>Save Video</b> or <b>Facebook</b>.</p><p class="small-note">For the first test, use a 15-second Reel.</p>';
    actions.insertAdjacentElement('afterend',guide);
  }
}
function apply(){hideLegacyControls();ensureBrowserButton();}
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',apply);
window.addEventListener('load',apply);
setInterval(apply,1200);
})();
