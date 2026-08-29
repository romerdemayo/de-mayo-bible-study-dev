/* De Mayo Bible Studies — Weekly recap voice-over bridge
   Uses a concise 60–90 second summary when the Weekly Reel is active.
   v2: avoids DOM-observer feedback loops that can freeze iPhone during Weekly Reel generation. */
(function(){
'use strict';
const PROJECT_KEY='dm_weekly_reel_project_v1';
const $=s=>document.querySelector(s);
let scheduled=false,lastScript='';
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function words(v=''){return clean(v).split(' ').filter(Boolean);}
function firstWords(v,limit){const a=words(v);return a.length<=limit?a.join(' '):a.slice(0,limit).join(' ').replace(/[,:;\-–—]+$/,'')+'…';}
function readProject(){try{return JSON.parse(localStorage.getItem(PROJECT_KEY)||'null')}catch{return null}}
function weeklyActive(){return !!$('.dm-reel-canvas.dm-weekly-scene');}
function buildScript(){
 const project=readProject();
 if(!weeklyActive()||!project?.items?.length)return '';
 const items=project.items.slice(0,7);
 const names=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
 const parts=['Here is our weekly Bible encouragement recap. This week, God reminded us to keep our hearts anchored in His Word.'];
 items.forEach((item,i)=>{
   const ref=clean(item.reference);
   const thought=firstWords(item.body||item.caption,12);
   parts.push(`${names[i]}${ref?`, from ${ref}`:''}: ${thought}`);
 });
 parts.push('As you enter a new week, carry these truths with you. Do not try to remember every word; remember the God who spoke through His Word and remains faithful each day.');
 parts.push('Let us pray. Father, thank You for guiding us through this week. Help us live what we have learned, trust You in every season, and encourage someone else with Your Word. In Jesus’ name, amen.');
 let script=parts.join('\n\n');
 const all=words(script);
 if(all.length>150)script=all.slice(0,150).join(' ').replace(/[,:;\-–—]+$/,'')+'.';
 return script;
}
function setText(el,value){if(el&&el.textContent!==value)el.textContent=value;}
function apply(){
 scheduled=false;
 const script=buildScript();if(!script)return false;
 const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');
 if(area&&area.textContent!==script){area.textContent=script;area.scrollTop=0;area.dataset.dmWeeklyScript='1';}
 if(full&&full.textContent!==script){full.textContent=script;full.scrollTop=0;full.dataset.dmWeeklyScript='1';}
 const count=words(script).length,estimate=Math.ceil(count/105*60),info=$('#dmVoiceoverWordCount');
 setText(info,`Weekly recap: ${count} words • about ${estimate} seconds at a calm reading pace`);
 const status=$('#dmVoiceoverStatus');
 const statusText='📅 Weekly Reel detected — a concise weekly voice-over script is ready so you can finish the full recap comfortably.';
 if(status&&!window.DM_REEL_VOICEOVER_BLOB){status.hidden=false;status.dataset.type='info';setText(status,statusText);}
 lastScript=script;
 return true;
}
function schedule(delay=60){
 if(scheduled)return;
 scheduled=true;
 setTimeout(apply,delay);
}
function boot(){
 schedule(100);
 /* Weekly builder already fires dm-reel-content-change after rendering.
    Listen to that event instead of observing every DOM mutation. */
 document.addEventListener('dm-reel-content-change',()=>schedule(50));
 document.addEventListener('dm-reel-studio-ready',()=>schedule(100));
 document.addEventListener('click',e=>{
   if(e.target?.id==='dmRefreshVoiceoverScript'||e.target?.id==='dmBuildWeeklyReel')schedule(120);
 });
 /* Small bounded retry handles cases where the voice-over card mounts after the weekly preview. */
 let tries=0;
 const retry=setInterval(()=>{
   tries++;
   if(weeklyActive()&&$('#dmVoiceoverScript')){apply();clearInterval(retry);}
   else if(tries>=20)clearInterval(retry);
 },250);
}
window.DM_WEEKLY_VOICEOVER={apply,buildScript,isActive:weeklyActive};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
