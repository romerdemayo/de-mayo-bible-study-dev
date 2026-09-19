/* De Mayo Bible Studies — Reel Action Center v1
   Collects existing Reel actions into one compact panel without replacing their original handlers. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const GROUPS=[
 {title:'Create',ids:['dmRegenerate','dmReelSurprise','dmManualOnePaste']},
 {title:'Recording',ids:['dmStartVoiceover','dmStopVoiceover','dmFullscreenStop','dmRefreshVoiceoverScript']},
 {title:'Export',ids:['dmNativeMp4','dmSilentMp4','dmCreateMp4','dmSaveVideo']},
 {title:'Publishing',ids:['dmCopyCaption','dmCopyHashtags','dmMarkPosted']}
];
function build(){
 if(location.hash!=='#reelcreator')return false;
 let panel=$('#dmReelActionCenter');
 if(!panel){
  const host=$('.dm-reel-v2'); if(!host)return false;
  panel=document.createElement('section');panel.id='dmReelActionCenter';panel.className='card dm-action-center';
  panel.innerHTML='<div class="dm-action-center-head"><div><span class="pill">QUICK CONTROLS</span><h3>🎬 Reel Controls</h3><p>All your main Reel actions in one place.</p></div></div><div id="dmActionCenterGroups"></div>';
  const hero=host.querySelector('.dm-reel-hero');(hero||host.firstElementChild)?.insertAdjacentElement('afterend',panel);
 }
 const wrap=$('#dmActionCenterGroups'); if(!wrap)return false;
 const seen=new Set();
 for(const group of GROUPS){
  let box=wrap.querySelector('[data-action-group="'+group.title+'"]');
  if(!box){box=document.createElement('div');box.className='dm-action-group';box.dataset.actionGroup=group.title;box.innerHTML='<h4>'+group.title+'</h4><div class="dm-action-grid"></div>';wrap.appendChild(box);}
  const grid=box.querySelector('.dm-action-grid');
  group.ids.forEach(id=>{
   const original=$('#'+id);if(!original||original.closest('#dmReelActionCenter')||seen.has(id))return;seen.add(id);
   let proxy=grid.querySelector('[data-action-for="'+id+'"]');
   if(!proxy){proxy=document.createElement('button');proxy.type='button';proxy.dataset.actionFor=id;grid.appendChild(proxy);proxy.addEventListener('click',()=>{const target=$('#'+id);if(target&&!target.disabled)target.click();});}
   proxy.innerHTML=original.innerHTML||original.textContent;proxy.className=original.classList.contains('primary')?'primary':'';
   proxy.disabled=!!original.disabled;proxy.hidden=!!original.hidden;
  });
 }
 wrap.querySelectorAll('[data-action-for]').forEach(proxy=>{if(!$('#'+proxy.dataset.actionFor))proxy.remove();});
 return true;
}
function sync(){const panel=$('#dmReelActionCenter');if(!panel)return;panel.querySelectorAll('[data-action-for]').forEach(proxy=>{const o=$('#'+proxy.dataset.actionFor);if(!o)return;proxy.innerHTML=o.innerHTML||o.textContent;proxy.disabled=!!o.disabled;proxy.hidden=!!o.hidden;proxy.className=o.classList.contains('primary')?'primary':'';});}
function boot(){let tries=0;const timer=setInterval(()=>{tries++;build();sync();if(tries>80)clearInterval(timer);},125);document.addEventListener('dm-reel-studio-ready',()=>setTimeout(build,50));document.addEventListener('dm-reel-content-change',()=>setTimeout(()=>{build();sync();},50));document.addEventListener('click',()=>setTimeout(()=>{build();sync();},80),true);window.addEventListener('hashchange',()=>setTimeout(build,80));}
window.DM_REEL_ACTION_CENTER={build,sync};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();