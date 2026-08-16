/* De Mayo Bible Studies - Gemini weekly Reel generator and repeat protection */
(function(){
'use strict';
const API='https://e-mayo-bible-ai.romer-demayo.workers.dev/';
const GENERATED_KEY='dm_reel_gemini_history_v1';
const POSTED_KEY='dm_reel_posted_history_v1';
const MAIN_APP_URL='https://romerdemayo.github.io/de-mayo-bible-study/';
const $=s=>document.querySelector(s);
let busy=false,currentFreshSignature='';
const HOOKS={English:['God has not forgotten you.','Pause—this may be the reminder you need today.','Read this if your heart needs encouragement.','Take this truth with you today.'],Tagalog:['Hindi ka nakakalimutan ng Diyos.','Sandali—maaaring ito ang paalala na kailangan mo ngayon.','Basahin ito kung kailangan ng puso mo ng lakas.','Dalhin mo ang katotohanang ito ngayong araw.']};
const QUESTIONS={English:['What are you trusting God for today?','Which part of this message speaks to you?','Who might need this encouragement today?','How has God been faithful to you?'],Tagalog:['Ano ang ipinagkakatiwala mo sa Diyos ngayon?','Aling bahagi ng mensaheng ito ang nangusap sa iyo?','Sino ang maaaring mangailangan ng paalalang ito?','Paano naging tapat ang Diyos sa iyo?']};

function read(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value.slice(0,120)))}
function clean(value){return String(value||'').trim()}
function contentType(){return $('#dmReelContentType')?.value||'devotional'}
function contentTypeLabel(){return contentType()==='motivation'?'Christian Motivational':'Verse, Message & Prayer'}
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
  const toastMessage=message.length>120?(type==='error'?'Gemini is temporarily busy. Please try again.':'Reel content updated.'):message;
  window.toast?.(toastMessage);
}
const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
function localMotivation(language){
  const base=window.DM_REEL_CREATOR?.getContent?.()||{},theme=clean($('#dmTheme')?.value||'hope'),label=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope');
  const english={hope:'Do not let today’s uncertainty decide tomorrow’s courage. God is present, so take the next faithful step even when you cannot see the whole path.',faith:'Faith does not require every answer before you move. Trust God with what you cannot control, then act faithfully with what He has placed in your hands today.',peace:'You do not have to carry every burden at once. Pause, pray, and place today in Christ’s hands. Let His peace guide your next decision.',strength:'Your strength is not measured by never feeling tired. Keep leaning on Christ, take one faithful step, and allow His grace to sustain you today.',gratitude:'Gratitude changes what difficulty cannot. Notice one evidence of God’s goodness today, thank Him for it, and let that truth strengthen your heart.',courage:'Courage is choosing faithful obedience while fear is still speaking. God goes with you, so take the next right step and trust Him with the outcome.'};
  const tagalog={hope:'Huwag hayaang ang kawalan ng katiyakan ngayon ang magpasya sa iyong tapang bukas. Kasama mo ang Diyos, kaya gawin ang susunod na tapat na hakbang kahit hindi mo pa nakikita ang buong landas.',faith:'Hindi kailangan ng pananampalataya ang lahat ng sagot bago ka kumilos. Ipagkatiwala sa Diyos ang hindi mo makontrol at gawin nang tapat ang ipinagkaloob Niya sa iyo ngayon.',peace:'Hindi mo kailangang dalhin ang lahat ng pasanin nang sabay-sabay. Huminto, manalangin, at ilagay ang araw na ito sa kamay ni Cristo. Hayaan mong gabayan ka ng Kanyang kapayapaan.',strength:'Ang iyong lakas ay hindi nasusukat sa hindi pagkakaroon ng pagod. Patuloy na umasa kay Cristo, gumawa ng isang tapat na hakbang, at hayaang palakasin ka ng Kanyang biyaya.',gratitude:'Binabago ng pasasalamat ang hindi kayang baguhin ng problema. Pansinin ang isang patunay ng kabutihan ng Diyos ngayon, magpasalamat, at hayaang palakasin nito ang iyong puso.',courage:'Ang tapang ay ang pagpili ng tapat na pagsunod kahit nagsasalita pa ang takot. Kasama mo ang Diyos, kaya gawin ang susunod na tamang hakbang at ipagkatiwala sa Kanya ang resulta.'};
  const isTagalog=language==='Tagalog',reflection=(isTagalog?tagalog:english)[theme]||(isTagalog?tagalog.hope:english.hope);
  return {...base,title:`${label} Christian Motivation`,label:'Motivation',contentType:'motivation',reflection,caption:isTagalog?`${label}: Hindi ka nag-iisa. Kumapit sa Salita ng Diyos at gawin ang susunod na tapat na hakbang. Ano ang hakbang na gagawin mo ngayon?`:`${label}: You are not walking alone. Hold on to God’s Word and take the next faithful step. What step will you take today?`,hashtags:'#ChristianMotivation #FaithMotivation #BibleEncouragement #DeMayoBibleStudies',language,source:'Built-in fallback'};
}
function normalize(data,language){
  const g=data?.generated||data?.result||data?.content||data?.data||data||{};
  const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Weekly'),type=contentType();
  return {
    title:removeJoinThanks(g.title)||(type==='motivation'?`${selectedTheme} Christian Motivation`:`${selectedTheme} for Today`),
    label:type==='motivation'?'Motivation':'Weekly',contentType:type,reference:clean(g.reference||g.verseReference),verse:clean(g.verse||g.body||g.scripture),
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
  if(contentType()==='motivation')return language==='Tagalog'
    ? `${theme}. Gumawa ng makapangyarihan ngunit mahinahong Christian motivational Reel sa natural na Tagalog. Magsimula sa isang maikling motivational hook. Gumamit ng isang buong Bible verse at tamang reference bilang pundasyon. Sumulat ng nakapagpapalakas na mensahe na may praktikal na hamon o susunod na hakbang, hanggang 55 salita lamang, at isang taos-pusong panalangin hanggang 40 salita. Ang verse, mensahe at panalangin ay dapat kasya sa mahinahong 90-second reading. Iwasan ang garantisadong pangako tungkol sa kayamanan, tagumpay o kagalingan. Ang caption ay dapat walang URL, magtapos sa isang tanong, at magkaroon lamang ng 3 hanggang 5 kaugnay na hashtags.`
    : `${theme}. Create a strong but compassionate Christian motivational Reel. Begin with a short motivational hook. Use one complete Bible verse and its correct reference as the foundation. Write an uplifting message with one practical challenge or next step, maximum 55 words, followed by a sincere prayer of maximum 40 words. The verse, message and prayer must fit a calm 90-second reading. Avoid guaranteed promises of wealth, success or healing. Use a link-free caption ending with one sincere question and return only 3 to 5 relevant hashtags.`;
  return language==='Tagalog'
    ? `${theme}. Write the verse, reflection, prayer, caption and closing message in natural Tagalog. The spoken verse, reflection and prayer together must fit a calm 90-second reading: keep the reflection to 55 words maximum and the prayer to 40 words maximum. Keep the full Bible verse and its reference. Begin the caption with a short emotional hook, end with one sincere discussion question, use no URL, and return only 3 to 5 relevant hashtags.`
    : `${theme}. Write clear, warm English suitable for a weekly Facebook Reel. The spoken verse, reflection and prayer together must fit a calm 90-second reading: keep the reflection to 55 words maximum and the prayer to 40 words maximum. Keep the full Bible verse and its reference. Begin the caption with a short emotional hook, end with one sincere discussion question, use no URL, and return only 3 to 5 relevant hashtags.`;
}
function chooseSurpriseTheme(){
  const select=$('#dmTheme');
  if(!select)return;
  const options=[...select.options];
  const choices=options.filter(option=>option.value!==select.value);
  const selected=choices[Math.floor(Math.random()*choices.length)]||options[0];
  if(selected){currentFreshSignature='';select.value=selected.value;window.DM_REEL_CREATOR?.clearGeneratedContent();}
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
   const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope'),selectedType=contentTypeLabel();
   status(`✨ Gemini is creating a fresh ${selectedType} Reel about ${selectedTheme}…`,'loading');
  try{
    let item=null;
    for(let attempt=0;attempt<3;attempt++){
      try{
        const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'bibleVerse',theme:themePrompt(),previousItems:previousItems()})});
        const data=await response.json().catch(()=>({}));
        if(!response.ok||data?.ok===false){const error=new Error(data?.error||data?.message||`Gemini request failed (${response.status})`);error.temporary=response.status===429||response.status===503||/high demand|temporar|overload/i.test(error.message);throw error;}
        const candidate=normalize(data,language);
        if(!candidate.reference||!candidate.verse)throw new Error('Gemini returned incomplete Reel content.');
        if(!history().some(old=>signature(old)===signature(candidate))){item=candidate;break;}
      }catch(error){
        if(error.temporary&&attempt<2){const box=$('#dmReelGeminiStatus');if(box){box.hidden=false;box.dataset.type='loading';box.textContent=`Gemini is busy. Retrying automatically (${attempt+2} of 3)…`;}await wait(1500*(attempt+1));continue;}
        throw error;
      }
    }
    if(!item)throw new Error('Gemini repeated a recent verse three times. Please try again.');
    currentFreshSignature=signature(item);
    window.DM_REEL_CREATOR.setGeneratedContent(item);
    rememberGenerated(item);
    updatePostedStatus();
     status(`✅ Fresh ${selectedType} Reel created in ${language} — not posted yet.`,'success');
  }catch(error){
    console.error('Reel Gemini:',error);
    if(contentType()==='motivation'){
      const fallback=localMotivation(language);currentFreshSignature=signature(fallback);window.DM_REEL_CREATOR.setGeneratedContent(fallback);rememberGenerated(fallback);updatePostedStatus();status(`✅ Gemini is temporarily busy, so a built-in ${contentTypeLabel()} Reel was created instead.`,'success');
    }else status(`⚠️ ${error.message} Built-in Reel content is still available.`,'error');
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
  if(posted.some(old=>signature(old)===signature(item))){currentFreshSignature='';updatePostedStatus();return status(`${item.reference} is already marked as posted.`,'info');}
  write(POSTED_KEY,[{...item,postedAt:new Date().toISOString()},...posted]);
  currentFreshSignature='';
  updatePostedStatus();
  status(`✅ ${item.reference} marked as posted. Gemini will avoid it in future Reels.`,'success');
}
function updatePostedStatus(){
  const item=window.DM_REEL_CREATOR?.getContent();
  const itemSignature=signature(item);
  const isPosted=item&&itemSignature!==currentFreshSignature&&read(POSTED_KEY).some(old=>signature(old)===itemSignature);
  const button=$('#dmMarkReelPosted');
  if(button){button.textContent=isPosted?'✓ Already Posted':'✓ Mark as Posted';button.disabled=!!isPosted;}
  const count=$('#dmPostedReelCount');
  if(count)count.textContent=`${read(POSTED_KEY).length} posted Reel${read(POSTED_KEY).length===1?'':'s'} protected from repeats`;
}
function hashtagsText(item){
  const raw=clean(item?.hashtags)||(item?.contentType==='motivation'?'#ChristianMotivation #FaithMotivation #BibleEncouragement #DeMayoBibleStudies':'#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies');
  const tags=[...new Set(raw.split(/[\s,]+/).filter(Boolean).map(tag=>tag.startsWith('#')?tag:'#'+tag))].slice(0,5);
  if(!tags.some(tag=>tag.toLowerCase()==='#demayobiblestudies')){if(tags.length===5)tags[4]='#DeMayoBibleStudies';else tags.push('#DeMayoBibleStudies');}
  return tags.join(' ');
}
function removeCaptionLinks(value){
  return String(value||'')
    .replace(/https?:\/\/\S+/gi,'')
    .replace(/^\s*(?:Read, study and grow with us|Visit|Learn more)\s*:\s*$/gim,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}
function captionText(item){
  const language=item?.language==='Tagalog'?'Tagalog':'English';
  const seed=String(item?.reference||item?.title||'De Mayo').split('').reduce((sum,char)=>sum+char.charCodeAt(0),0);
  const hook=HOOKS[language][seed%HOOKS[language].length],question=QUESTIONS[language][seed%QUESTIONS[language].length];
  const share=language==='Tagalog'?'Ibahagi ito sa isang taong maaaring mangailangan ng lakas ngayon.':'Share this with someone who may need encouragement today.';
  let main=removeCaptionLinks(removeJoinThanks(item?.caption)||`${item?.title||'Weekly Bible Encouragement'}\n\n${item?.reflection||''}`.trim()).replace(/(?:^|\s)#[\p{L}\p{N}_-]+/gu,'').replace(/\n{3,}/g,'\n\n').trim();
  if(!main.toLowerCase().startsWith(hook.toLowerCase()))main=`${hook}\n\n${main}`;
  if(!/[?？]\s*$/.test(main))main=`${main}\n\n${question}`;
  if(!main.toLowerCase().includes(share.toLowerCase()))main=`${main}\n\n${share}`;
  return main.trim();
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
    panel.innerHTML='<b>✨ Gemini weekly content</b><label>Content type<select id="dmReelContentType"><option value="devotional">Verse, Message &amp; Prayer</option><option value="motivation">Christian Motivational</option></select></label><label>Language<select id="dmReelLanguage"><option>English</option><option>Tagalog</option></select></label><p class="small-note">Christian Motivational creates a Bible-grounded hook, practical encouragement and short prayer. New Reels check created, saved and posted history before being accepted.</p>';
    controls.insertAdjacentElement('afterbegin',panel);
  }
  const newIdea=$('#dmRegenerate');
  if(newIdea&&!newIdea.dataset.gemini){
    newIdea.dataset.gemini='true';newIdea.textContent='✨ Generate Selected Theme';newIdea.onclick=()=>generate('selected');
    const surprise=document.createElement('button');surprise.id='dmReelSurprise';surprise.className='ghost';surprise.textContent='🎲 Surprise Me';surprise.onclick=()=>generate('surprise');newIdea.insertAdjacentElement('afterend',surprise);
  }
  const theme=$('#dmTheme');
  if(theme&&!theme.dataset.geminiReset){theme.dataset.geminiReset='true';theme.addEventListener('change',()=>{currentFreshSignature='';window.DM_REEL_CREATOR?.clearGeneratedContent();});}
  const type=$('#dmReelContentType');
  if(type&&!type.dataset.geminiReset){type.dataset.geminiReset='true';type.addEventListener('change',()=>{currentFreshSignature='';window.DM_REEL_CREATOR?.clearGeneratedContent();status(`${contentTypeLabel()} selected. Choose a theme, then tap Generate Selected Theme.`,'info')});}
  document.querySelectorAll('[data-dm-type]').forEach(button=>{if(!button.dataset.geminiReset){button.dataset.geminiReset='true';button.addEventListener('click',()=>{currentFreshSignature='';window.DM_REEL_CREATOR?.clearGeneratedContent();});}});
  const actions=$('.dm-reel-actions');
  if(actions&&!$('#dmMarkReelPosted')){
    const button=document.createElement('button');button.id='dmMarkReelPosted';button.textContent='✓ Mark as Posted';button.onclick=markPosted;actions.appendChild(button);
    const statusBox=document.createElement('div');statusBox.id='dmReelGeminiStatus';statusBox.className='dm-export-status';statusBox.hidden=true;actions.insertAdjacentElement('afterend',statusBox);
    const count=document.createElement('p');count.id='dmPostedReelCount';count.className='small-note';statusBox.insertAdjacentElement('afterend',count);
  }
  if(actions&&!$('#dmReelPostingPanel')){
    const panel=document.createElement('section');panel.id='dmReelPostingPanel';panel.className='card';
    panel.innerHTML='<h3>📱 Facebook Reel caption and hashtags</h3><label>Facebook Reel caption — no external link<textarea id="dmReelCaption" rows="6" readonly></textarea></label><label>Hashtags<textarea id="dmReelHashtags" rows="2" readonly></textarea></label><label>Optional Bible app link<input id="dmReelAppLink" type="url" readonly></label><div class="dm-reel-actions"><button id="dmCopyReelCaption">📋 Copy Caption</button><button id="dmCopyReelHashtags"># Copy Hashtags</button><button id="dmCopyReelLink">🔗 Copy App Link</button><button id="dmCopyReelAll" class="primary">📋 Copy Caption + Hashtags</button></div><p class="small-note">For better Facebook Reel reach, the caption and Copy Caption + Hashtags exclude the external link. Copy App Link remains available separately when you need it.</p>';
    const anchor=$('#dmPostedReelCount')||actions;anchor.insertAdjacentElement('afterend',panel);
    panel.querySelector('#dmCopyReelCaption').onclick=()=>copy($('#dmReelCaption').value,'Caption');
    panel.querySelector('#dmCopyReelHashtags').onclick=()=>copy($('#dmReelHashtags').value,'Hashtags');
    panel.querySelector('#dmCopyReelLink').onclick=()=>copy(MAIN_APP_URL,'Bible app link');
    panel.querySelector('#dmCopyReelAll').onclick=()=>copy(`${$('#dmReelCaption').value}\n\n${$('#dmReelHashtags').value}`,'Caption and hashtags');
  }
  updatePostingPanel();
}
document.addEventListener('dm-reel-content-change',updatePostingPanel);
window.addEventListener('load',install);
window.addEventListener('hashchange',()=>setTimeout(install,100));
document.addEventListener('dm-reel-studio-ready',install);
})();
