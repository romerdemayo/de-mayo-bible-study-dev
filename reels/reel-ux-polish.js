/* De Mayo Bible Studies - Reel Creator UX polish */
(function(){
'use strict';
function polish(){
  const actions=document.querySelector('.dm-reel-actions');
  if(!actions)return;
  const project=document.querySelector('#dmSaveProject');
  if(project){project.textContent='💾 Save editable project (.json)';project.title='Save an editable Reel project file. This is not the finished video.';}
  const library=document.querySelector('#dmSaveLibrary');
  if(library){library.textContent='📚 Save to My Reels';library.title='Keep this Reel in the private library on this device.';}
  const cover=document.querySelector('#dmCover');
  if(cover){cover.textContent='🖼 Save cover image';cover.title='Save a PNG picture for the Reel cover.';}
  const copy=document.querySelector('#dmCopy');
  if(copy)copy.textContent='📋 Copy caption & script';
  let note=document.querySelector('#dmFileTypeGuide');
  if(!note){
    note=document.createElement('div');
    note.id='dmFileTypeGuide';
    note.className='notice small-note';
    note.innerHTML='<b>Choose the right save option:</b><br>🎬 <b>Create MP4</b> = finished video for Facebook, Instagram, TikTok or YouTube.<br>💾 <b>Save editable project (.json)</b> = settings you can reopen later.<br>🖼 <b>Save cover image</b> = picture only.';
    actions.insertAdjacentElement('beforebegin',note);
  }
  const engine=window.DM_MP4_ENGINE;
  const help=document.querySelector('.dm-browser-mp4-guide');
  if(help&&engine==='native')help.innerHTML='<h3>Fast MP4 export for Chrome</h3><p>Tap <b>Create MP4</b>, keep this page open while it renders, then use <b>Save MP4 As…</b> to choose Downloads or Desktop.</p><p class="small-note">The finished MP4 is separate from the editable JSON project.</p>';
}
new MutationObserver(polish).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',polish);
})();