/* De Mayo Bible Studies - Gemini weekly Reel generator and repeat protection */
(function(){
'use strict';
const API='https://e-mayo-bible-ai.romer-demayo.workers.dev/';
const GENERATED_KEY='dm_reel_gemini_history_v1';
const POSTED_KEY='dm_reel_posted_history_v1';
const $=s=>document.querySelector(s);
let busy=false;

function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value.slice(0,120)))}
function clean(value){return String(value||'').trim()}
function signature(item){return clean(item?.reference).toLowerCase().replace(/[^a-z0-9]+/g,'-')}
function history(){
  const library=read('dm_reel_library_v1').map(item=>item.content||item);
  return [...read(POSTED_KEY),...read(GENERATED_KEY),...library]
    .filter(item=>item?.reference)
    .filter((item,index,all)=>all.findIndex(other=>signature(other)===signature(item))===index);
}
function previousItems(){return history().slice(0,50).map(item=>`${item.reference} — ${item.verse||''}`.trim())}
function status(message,type='info'){
  const box=$('#dmReelGeminiStatus');
  if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}
  window.toast?.(message);
}
function normalize(data,language){
  const g=data?.generated||data?.result||data?.content||data?.data||data||{};
  return {
    title:clean(g.title)||clean(g.closingMessage)||'Weekly Bible Encouragement',
    label:'Weekly',reference:clean(g.reference||g.verseReference),verse:clean(g.verse||g.body||g.scripture),
    reflection:clean(g.reflection),prayer:clean(g.prayer),caption:clean(g.caption),
    hashtags:Array.isArray(g.hashtags)?g.hashtags.join(' '):clean(g.hashtags),language,source:'Gemini'
  };
}
function rememberGenerated(item){write(GENERATED_KEY,[{...item,generatedAt:new Date().toISOString()},...read(GENERATED_KEY).filter(x=>signature(x)!==signature(item))])}
function themePrompt(){
  const theme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope');
  const language=$('#dmReelLanguage')?.value||'English';
  return language==='Tagalog'
    ? `${theme}. Write the verse, reflection, prayer, caption and closing message in natural Tagalog. Keep the Bible reference in its standard form.`
    : `${theme}. Write clear, warm English suitable for a weekly Facebook Reel.`;
}
function chooseSurpriseTheme(){
  const select=$('#dmTheme');
  if(!select)return;
  const options=[...select.options];
  const choices=options.filter(option=>option.value!==select.value);
  const selected=choices[Math.floor(Math.random()*choices.length)]||options[0];
  if(selected){select.value=selected.value;window.DM_REEL_CREATOR?.clearGeneratedContent();}
}
async function generate(mode='selected'){
  if(busy||!window.DM_REEL_CREATOR)return;
  if(mode==='surprise')chooseSurpriseTheme();
  busy=true;
  const buttons=[$('#dmRegenerate'),$('#dmReelSurprise')].filter(Boolean);
  buttons.forEach(button=>button.disabled=true);
  const activeButton=mode==='surprise'?$('#dmReelSurprise'):$('#dmRegenerate');
  if(activeButton)activeButton.textContent='✨ Gemini creating…';
  const language=$('#dmReelLanguage')?.value||'English';
  const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope');
  status(`✨ Gemini is creating a fresh ${selectedTheme} Reel…`,'loading');
  try{
    let item=null;
    for(let attempt=0;attempt<3;attempt++){
      const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'bibleVerse',theme:themePrompt(),previousItems:previousItems()})});
      const data=await response.json();
      if(!response.ok||data?.ok===false)throw new Error(data?.error||data?.message||`Gemini request failed (${response.status})`);
      const candidate=normalize(data,language);
      if(!candidate.reference||!candidate.verse)throw new Error('Gemini returned incomplete Reel content.');
      if(!history().some(old=>signature(old)===signature(candidate))){item=candidate;break;}
    }
    if(!item)throw new Error('Gemini repeated a recent verse three times. Please try again.');
    window.DM_REEL_CREATOR.setGeneratedContent(item);
    rememberGenerated(item);
    updatePostedStatus();
    status(`✅ Fresh ${selectedTheme} Reel created in ${language} — not posted yet.`,'success');
  }catch(error){
    console.error('Reel Gemini:',error);
    status(`⚠️ ${error.message} Built-in Reel content is still available.`,'error');
  }finally{
    busy=false;
    buttons.forEach(button=>button.disabled=false);
    const selectedButton=$('#dmRegenerate');if(selectedButton)selectedButton.textContent='✨ Generate Selected Theme';
    const surpriseButton=$('#dmReelSurprise');if(surpriseButton)surpriseButton.textContent='🎲 Surprise Me';
  }
}
function markPosted(){
  const item=window.DM_REEL_CREATOR?.getContent();
  if(!item?.reference)return status('Create or open a Reel before marking it as posted.','error');
  const posted=read(POSTED_KEY);
  if(posted.some(old=>signature(old)===signature(item)))return status(`${item.reference} is already marked as posted.`,'info');
  write(POSTED_KEY,[{...item,postedAt:new Date().toISOString()},...posted]);
  updatePostedStatus();
  status(`✅ ${item.reference} marked as posted. Gemini will avoid it in future Reels.`,'success');
}
function updatePostedStatus(){
  const item=window.DM_REEL_CREATOR?.getContent();
  const isPosted=item&&read(POSTED_KEY).some(old=>signature(old)===signature(item));
  const button=$('#dmMarkReelPosted');
  if(button){button.textContent=isPosted?'✓ Already Posted':'✓ Mark as Posted';button.disabled=!!isPosted;}
  const count=$('#dmPostedReelCount');
  if(count)count.textContent=`${read(POSTED_KEY).length} posted Reel${read(POSTED_KEY).length===1?'':'s'} protected from repeats`;
}
function install(){
  if(location.hash!=='#reelcreator'||!window.DM_REEL_CREATOR)return;
  const controls=$('.dm-reel-controls');
  if(controls&&!$('#dmReelGeminiControls')){
    const panel=document.createElement('div');
    panel.id='dmReelGeminiControls';panel.className='notice';
    panel.innerHTML='<b>✨ Gemini weekly content</b><label>Language<select id="dmReelLanguage"><option>English</option><option>Tagalog</option></select></label><p class="small-note">New Gemini Reels check created, saved and posted history before being accepted.</p>';
    controls.insertAdjacentElement('afterbegin',panel);
  }
  const newIdea=$('#dmRegenerate');
  if(newIdea&&!newIdea.dataset.gemini){
    newIdea.dataset.gemini='true';newIdea.textContent='✨ Generate Selected Theme';newIdea.onclick=()=>generate('selected');
    const surprise=document.createElement('button');surprise.id='dmReelSurprise';surprise.className='ghost';surprise.textContent='🎲 Surprise Me';surprise.onclick=()=>generate('surprise');newIdea.insertAdjacentElement('afterend',surprise);
  }
  const theme=$('#dmTheme');
  if(theme&&!theme.dataset.geminiReset){theme.dataset.geminiReset='true';theme.addEventListener('change',()=>window.DM_REEL_CREATOR?.clearGeneratedContent());}
  document.querySelectorAll('[data-dm-type]').forEach(button=>{if(!button.dataset.geminiReset){button.dataset.geminiReset='true';button.addEventListener('click',()=>window.DM_REEL_CREATOR?.clearGeneratedContent());}});
  const actions=$('.dm-reel-actions');
  if(actions&&!$('#dmMarkReelPosted')){
    const button=document.createElement('button');button.id='dmMarkReelPosted';button.textContent='✓ Mark as Posted';button.onclick=markPosted;actions.appendChild(button);
    const statusBox=document.createElement('div');statusBox.id='dmReelGeminiStatus';statusBox.className='dm-export-status';statusBox.hidden=true;actions.insertAdjacentElement('afterend',statusBox);
    const count=document.createElement('p');count.id='dmPostedReelCount';count.className='small-note';statusBox.insertAdjacentElement('afterend',count);
  }
  updatePostedStatus();
}
window.addEventListener('load',install);
window.addEventListener('hashchange',()=>setTimeout(install,100));
new MutationObserver(()=>{if(location.hash==='#reelcreator'&&$('#dmRegenerate')&&!$('#dmReelGeminiControls'))install()}).observe(document.documentElement,{childList:true,subtree:true});
})();
