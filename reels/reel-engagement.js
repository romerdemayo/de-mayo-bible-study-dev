/* De Mayo Bible Studies — Reel engagement layer v1
   Adds a contextual conversation question to captions, weekly recap and preview without engagement bait. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const MAP={
 hope:['What are you trusting God for today?','Where do you need God’s hope this week?','What promise from God are you holding onto?'],
 faith:['What step of faith is God asking you to take?','What helps you keep trusting God when you cannot see the outcome?','Where are you choosing faith over fear today?'],
 peace:['What Bible verse brings you peace when life feels heavy?','What do you need to place in God’s hands today?','Where do you need the peace of Christ right now?'],
 strength:['Where do you need God’s strength today?','What has God helped you through recently?','Who could use this reminder of God’s strength today?'],
 gratitude:['What is one thing you are thanking God for today?','Where have you seen God’s goodness this week?','What blessing do you not want to take for granted today?'],
 courage:['Where do you need courage to follow God this week?','What fear are you choosing to surrender to God?','When has God given you courage at just the right time?']
};
function theme(){return clean($('#dmTheme')?.value||'hope').toLowerCase();}
function hash(v){let h=0;for(const c of clean(v))h=((h<<5)-h+c.charCodeAt(0))|0;return Math.abs(h);}
function current(){return window.DM_REEL_CREATOR?.getContent?.()||{};}
function weekly(){return !!$('.dm-reel-canvas.dm-weekly-scene');}
function question(item=current()){
 if(weekly())return 'Which message spoke to you most this week — Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday?';
 const pool=MAP[theme()]||MAP.hope;
 return pool[hash(`${item.reference||''}|${item.reflection||item.verse||''}`)%pool.length];
}
function addToCaption(text,item=current()){
 const q=question(item),base=String(text||'').trim();
 if(!q||base.includes(q))return base;
 return [base,`💬 Reflection: ${q}`].filter(Boolean).join('\n\n');
}
function card(){
 let el=$('#dmReelEngagementCard');if(el)return el;
 const actions=$('.dm-reel-actions');if(!actions)return null;
 el=document.createElement('section');el.id='dmReelEngagementCard';el.className='card';
 el.innerHTML='<div class="section-heading compact"><div><span class="eyebrow">ENGAGE YOUR VIEWERS</span><h3>💬 Conversation starter</h3></div></div><p id="dmReelEngagementQuestion" class="dm-engagement-question"></p><p class="small-note">This question is added automatically to your copied caption. Invite a real response rather than asking only for “Amen”.</p>';
 actions.insertAdjacentElement('beforebegin',el);return el;
}
function render(){const el=card(),p=$('#dmReelEngagementQuestion');if(el&&p)p.textContent=question();}
function appendWeeklyScene(){
 const project=(()=>{try{return JSON.parse(localStorage.getItem('dm_weekly_reel_project_v1')||'null')}catch{return null}})();
 if(!project?.scenes?.length)return;
 if(!project.scenes.some(s=>s&&s.dmEngagement)){
  project.scenes.push({k:'Your Turn',text:question(),ref:'Share your answer in the comments 💬',dmEngagement:true});
  localStorage.setItem('dm_weekly_reel_project_v1',JSON.stringify(project));
 }
}
function boot(){render();window.addEventListener('hashchange',()=>setTimeout(render,100));document.addEventListener('dm-reel-content-change',()=>setTimeout(render,50));document.addEventListener('click',e=>{if(e.target?.id==='dmBuildWeeklyReel'){setTimeout(()=>{appendWeeklyScene();render();},120)}});}
window.DM_REEL_ENGAGEMENT={question,addToCaption,render,appendWeeklyScene};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
