/* De Mayo Bible Studies - single Reel Creator entry point */
(function(){
'use strict';
const renderV2=window.bibleReelCreator;
if(typeof renderV2!=='function'){
  console.error('Bible Reel Creator V2 failed to load.');
  return;
}
window.bibleReelCreatorV2=renderV2;

function openV2(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
    if(typeof event.stopImmediatePropagation==='function')event.stopImmediatePropagation();
  }
  try{
    renderV2();
    document.dispatchEvent(new CustomEvent('dm-reel-studio-ready'));
    if(location.hash!=='#reelcreator')history.replaceState(null,'','#reelcreator');
    document.body.classList.remove('menu-open');
    const sidebar=document.querySelector('#sidebar');
    const menu=document.querySelector('#menu');
    if(sidebar)sidebar.classList.remove('open');
    if(menu)menu.setAttribute('aria-expanded','false');
  }catch(error){
    console.error('Unable to open Bible Reel Creator V2',error);
    const view=document.querySelector('#view');
    if(view)view.innerHTML='<section class="card"><h2>Bible Reel Creator</h2><p>The creator could not open. Refresh the page and try again.</p></section>';
  }
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-page="reelcreator"]');
  if(target)openV2(event);
},true);

window.addEventListener('hashchange',()=>{
  if(location.hash==='#reelcreator')openV2();
});

window.addEventListener('load',()=>{
  if(location.hash==='#reelcreator')requestAnimationFrame(()=>openV2());
});
})();
