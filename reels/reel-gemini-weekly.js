/* De Mayo Bible Studies - Gemini weekly Reel generator and repeat protection */
(function(){
'use strict';
const API='https://e-mayo-bible-ai.romer-demayo.workers.dev/';
const GENERATED_KEY='dm_reel_gemini_history_v1';
const POSTED_KEY='dm_reel_posted_history_v1';
const MAIN_APP_URL='https://romerdemayo.github.io/de-mayo-bible-study/';
const $=s=>document.querySelector(s);
let busy=false;

function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value.slice(0,120)))}
function clean(value){return String(value||'').trim()}
function removeJoinThanks(value){return clean(value).replace(/(?:thank you|thanks)\s+for\s+joining\s+(?:us\s+at\s+)?de\s+mayo\s+bible\s+studies(?:\s+today)?[.!]?/gi,'').replace(/\n{3,}/g,'\n\n').trim()}
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
  const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Weekly');
  return {
    title:removeJoinThanks(g.title)||`${selectedTheme} for Today`,
    label:'Weekly',reference:clean(g.reference||g.verseReference),verse:clean(g.verse||g.body||g.scripture),
    reflection:clean(g.reflection),prayer:clean(g.prayer),caption:removeJoinThanks(g.caption),
    hashtags:Array.isArray(g.hashtags)?g.hashtags.join(' '):clean(g.hashtags),language,source:'Gemini'
  };
}
function rememberGenerated(item){write(GENERATED_KEY,[{...item,generatedAt:new Date().toISOString()},...read(GENERATED_KEY).filter(x=>signature(x)!==signature(item))])}
function migrateJoinThanks(){
  if(localStorage.getItem('dm_reel_remove_join_thanks_v1')==='done')return;
  const cleanItem=item=>({...item,title:removeJoinThanks(item?.title)||'Weekly Bible Encouragement',caption:removeJoinThanks(item?.caption)});
  write(GENERATED_KEY,read(GENERATED_KEY).map(cleanItem));
  write(POSTED_KEY,read(POSTED_KEY).map(cleanItem));
  const library=read('dm_reel_library_v1').map(item=>item.content?{...item,content:cleanItem(item.content)}:item);
  localStorage.setItem('dm_reel_library_v1',JSON.stringify(library));
  localStorage.setItem('dm_reel_remove_join_thanks_v1','done');
}
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
function hashtagsText(item){
  const raw=clean(item?.hashtags)||'#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies';
  return raw.split(/[\s,]+/).filter(Boolean).map(tag=>tag.startsWith('#')?tag:'#'+tag).join(' ');
}
function captionText(item){
  const main=removeJoinThanks(item?.caption)||`${item?.title||'Weekly Bible Encouragement'}\n\n${item?.reflection||''}`.trim();
  return `${main}\n\nRead, study and grow with us:\n${MAIN_APP_URL}`.trim();
}
async function copy(value,label){
  try{await navigator.clipboard.writeText(value);status(`${label} copied.`,'success');}
  catch{const area=document.createElement('textarea');area.value=value;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();status(`${label} copied.`,'success');}
}
function updatePostingPanel(){
  const item=window.DM_REEL_CREATOR?.getContent();
  const caption=$('#dmReelCaption');if(caption)caption.value=captionText(item);
  const hashtags=$('#dmReelHashtags');if(hashtags)hashtags.value=hashtagsText(item);
  const link=$('#dmReelAppLink');if(link)link.value=MAIN_APP_URL;
  updatePostedStatus();
}
function install(){
  if(location.hash!=='#reelcreator'||!window.DM_REEL_CREATOR)return;
  migrateJoinThanks();
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
  if(actions&&!$('#dmReelPostingPanel')){
    const panel=document.createElement('section');panel.id='dmReelPostingPanel';panel.className='card';
    panel.innerHTML='<h3>📱 Facebook caption and hashtags</h3><label>Caption<textarea id="dmReelCaption" rows="6" readonly></textarea></label><label>Hashtags<textarea id="dmReelHashtags" rows="2" readonly></textarea></label><label>Main Bible app link<input id="dmReelAppLink" type="url" readonly></label><div class="dm-reel-actions"><button id="dmCopyReelCaption">📋 Copy Caption</button><button id="dmCopyReelHashtags"># Copy Hashtags</button><button id="dmCopyReelLink">🔗 Copy App Link</button><button id="dmCopyReelAll" class="primary">📋 Copy All</button></div><p class="small-note">Copy All includes the caption, main Bible app link and hashtags, ready to paste into Facebook.</p>';
    const anchor=$('#dmPostedReelCount')||actions;anchor.insertAdjacentElement('afterend',panel);
    panel.querySelector('#dmCopyReelCaption').onclick=()=>copy($('#dmReelCaption').value,'Caption');
    panel.querySelector('#dmCopyReelHashtags').onclick=()=>copy($('#dmReelHashtags').value,'Hashtags');
    panel.querySelector('#dmCopyReelLink').onclick=()=>copy(MAIN_APP_URL,'Bible app link');
    panel.querySelector('#dmCopyReelAll').onclick=()=>copy(`${$('#dmReelCaption').value}\n\n${$('#dmReelHashtags').value}`,'Caption, link and hashtags');
  }
  updatePostingPanel();
}
document.addEventListener('dm-reel-content-change',updatePostingPanel);
window.addEventListener('load',install);
window.addEventListener('hashchange',()=>setTimeout(install,100));
document.addEventListener('dm-reel-studio-ready',install);
})();
