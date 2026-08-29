/* De Mayo Bible Studies — Reel refresh + source status repair */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
let libraryOpenPending=false;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function current(){return window.DM_REEL_CREATOR?.getContent?.()||{};}
function statusBox(){return $('#dmReelGeminiStatus');}
function ensureSourceNote(){
  const grid=$('#dmPlay')?.parentElement||$('#dmCopyScript')?.parentElement||$('#dmSaveProject')?.parentElement;
  if(!grid)return null;
  let note=$('#dmReelSourceStatus');
  if(!note){
    note=document.createElement('p');note.id='dmReelSourceStatus';note.className='small-note';
    note.style.gridColumn='1 / -1';note.style.margin='4px 2px 0';note.style.fontWeight='700';
    grid.insertAdjacentElement('afterend',note);
  }
  return note;
}
function sourceLabel(){
  if(libraryOpenPending)return '📚 Loaded from My Reels library';
  const item=current();
  const source=clean(item?.source).toLowerCase();
  if(source.includes('gemini'))return '✨ Created by Gemini';
  if(source.includes('quota fallback'))return '📖 Fresh built-in Reel used because Gemini is unavailable';
  if(source.includes('rotating fallback'))return '📖 Fresh built-in motivational Reel used';
  if(source)return `ℹ️ Source: ${clean(item.source)}`;
  return '📖 Built-in Reel content';
}
function updateSource(){const note=ensureSourceNote();if(note)note.textContent=sourceLabel();}
function repairGeminiAndRetry(button){
  const oldPanel=$('#dmReelGeminiPanel');
  if(oldPanel)oldPanel.remove();
  document.dispatchEvent(new CustomEvent('dm-reel-studio-ready'));
  setTimeout(()=>{
    const fresh=$('#dmRegenerate');
    if(fresh&&fresh!==button){fresh.click();return;}
    const box=statusBox();
    if(box){box.hidden=false;box.dataset.type='error';box.textContent='⚠️ Reel refresh was reconnected. Please tap Generate Selected Theme again.';}
  },180);
}
function watchRefresh(){
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#dmRegenerate');if(!button)return;
    const before=clean(current()?.reference)+'|'+clean(current()?.verse);
    const beforeStatus=clean(statusBox()?.textContent);
    setTimeout(()=>{
      const box=statusBox();
      const afterStatus=clean(box?.textContent);
      const after=clean(current()?.reference)+'|'+clean(current()?.verse);
      const working=box?.dataset.type==='loading'||afterStatus!==beforeStatus||after!==before;
      if(!working)repairGeminiAndRetry(button);
    },500);
  },true);
}
function watchLibrary(){
  document.addEventListener('click',event=>{
    const open=event.target.closest?.('[data-lib-action="open"]');
    if(!open)return;
    libraryOpenPending=true;
    setTimeout(()=>{updateSource();libraryOpenPending=false;},120);
  },true);
}
function watchStatus(){
  const attach=()=>{
    const box=statusBox();if(!box||box.dataset.dmSourceWatch==='1')return;
    box.dataset.dmSourceWatch='1';
    new MutationObserver(()=>{libraryOpenPending=false;updateSource();}).observe(box,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-type']});
  };
  attach();let n=0;const t=setInterval(()=>{n++;attach();if(n>100)clearInterval(t);},150);
}
function boot(){watchRefresh();watchLibrary();watchStatus();updateSource();}
window.addEventListener('load',boot,{once:true});
window.addEventListener('hashchange',()=>setTimeout(()=>{watchStatus();updateSource();},120));
document.addEventListener('dm-reel-studio-ready',()=>setTimeout(()=>{watchStatus();updateSource();},80));
document.addEventListener('dm-reel-content-change',()=>setTimeout(updateSource,80));
if(document.readyState==='complete')boot();
})();
