/* De Mayo Bible Studies - Gemini weekly Reel generator and repeat protection */
(function(){
'use strict';
const API='https://e-mayo-bible-ai.romer-demayo.workers.dev/';
const GENERATED_KEY='dm_reel_gemini_history_v1';
const POSTED_KEY='dm_reel_posted_history_v1';
const FALLBACK_KEY='dm_reel_fallback_history_v2';
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
function contentSignature(item){return clean([item?.reference,item?.verse,item?.reflection,item?.prayer].join('|')).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
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

const FALLBACKS={
English:{
hope:[
['Isaiah 40:31','but those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.','Waiting on God is not wasted time. Keep moving faithfully while He renews your strength for what comes next.','Lord, renew my strength and teach me to trust Your timing today. Amen.'],
['Romans 15:13','Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.','Hope grows when your confidence rests in God instead of circumstances. Ask Him to fill your heart again today.','God of hope, fill me with Your joy and peace and help me overflow with hope. Amen.'],
['Psalm 42:11','Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God.','Speak truth to your own heart when discouragement gets loud. Your feelings are real, but they do not get the final word.','Father, lift my eyes from discouragement and help me hope in You again. Amen.']
],
faith:[
['Hebrews 11:1','Now faith is assurance of things hoped for, proof of things not seen.','Faith does not mean seeing the whole road. It means trusting the One who already knows where the road leads.','Lord, strengthen my faith when I cannot see what comes next. Amen.'],
['2 Corinthians 5:7','for we walk by faith, not by sight.','You may not have every answer today. Take the next faithful step with what God has already shown you.','Jesus, help me walk by faith and obey You one step at a time. Amen.'],
['Mark 9:24','Immediately the father of the child cried out with tears, “I believe. Help my unbelief!”','Faith can be honest about weakness. Bring both your belief and your doubts to Jesus instead of hiding either one.','Lord, I believe. Meet me in my doubts and strengthen my trust in You. Amen.']
],
peace:[
['Philippians 4:7','And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.','God’s peace can guard you before your circumstances change. Bring Him what is weighing on your mind today.','Father, guard my heart and thoughts with Your peace in Christ. Amen.'],
['John 16:33','I have told you these things, that in me you may have peace. In the world you have oppression; but cheer up! I have overcome the world.','Jesus never promised a trouble-free life, but He promised His presence and His victory in the middle of trouble.','Jesus, anchor my heart in Your peace when life feels unsettled. Amen.'],
['Psalm 4:8','In peace I will both lay myself down and sleep, for you alone, Yahweh, make me live in safety.','You do not have to solve tomorrow before you rest tonight. Entrust what you cannot control to God.','Lord, quiet my mind and help me rest in Your care. Amen.']
],
strength:[
['Isaiah 41:10','Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.','God’s strength is not merely something He gives from a distance. He promises to be with you and uphold you.','God, strengthen and uphold me as I face today. Amen.'],
['Psalm 46:1','God is our refuge and strength, a very present help in trouble.','Your strength does not have to come from pretending you are fine. Run to God as your refuge and present help.','Father, be my refuge and strength in every pressure I face today. Amen.'],
['Ephesians 6:10','Finally, be strong in the Lord, and in the strength of his might.','When your own energy runs low, remember where Christian strength comes from: the Lord and His mighty power.','Lord, teach me to depend on Your strength instead of only my own. Amen.']
],
gratitude:[
['Psalm 107:1','Give thanks to Yahweh, for he is good, for his loving kindness endures forever.','Gratitude begins by remembering who God is. His goodness remains steady even when your day feels difficult.','Father, open my eyes to Your goodness and make me thankful today. Amen.'],
['Colossians 3:15','And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.','Thankfulness and peace often grow together. Name one gift from God today and let gratitude redirect your attention.','Lord, make my heart thankful and let Your peace rule within me. Amen.'],
['Psalm 100:4','Enter into his gates with thanksgiving, and into his courts with praise. Give thanks to him, and bless his name.','Thanksgiving changes the posture of the heart. Before asking for more, remember what God has already done.','God, receive my thanks and help me remember Your faithfulness. Amen.']
],
courage:[
['Joshua 1:9','Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.','Courage is not the absence of fear. It is moving forward because God’s presence is greater than what you fear.','Lord, give me courage to obey You and remember that You are with me. Amen.'],
['Psalm 27:14','Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh.','Sometimes courage looks like staying steady while you wait. Do not rush ahead simply because waiting feels uncomfortable.','Father, strengthen my heart and give me courage while I wait on You. Amen.'],
['Deuteronomy 31:8','Yahweh himself is who goes before you. He will be with you. He will not fail you nor forsake you. Don’t be afraid. Don’t be discouraged.','Whatever you are walking into, God is not arriving after you. He goes before you and remains with you.','God, go before me today and replace fear with confident obedience. Amen.']
]
},
Tagalog:{
hope:[
['Roma 15:13','Puspusin nawa kayo ng Diyos ng pag-asa ng buong kagalakan at kapayapaan sa inyong pananampalataya.','Ang pag-asa ay lumalalim kapag ang tiwala mo ay nasa Diyos, hindi lamang sa kalagayan. Kumapit sa Kanya ngayon.','Diyos ng pag-asa, punuin Mo ako ng kagalakan, kapayapaan, at bagong pag-asa. Amen.'],
['Awit 42:11','Bakit ka nanlulumo, O kaluluwa ko? Umasa ka sa Diyos.','Kapag malakas ang panghihina ng loob, kausapin ang sarili mong puso ng katotohanan: hindi pa tapos ang Diyos sa iyong kuwento.','Ama, itaas Mo ang aking paningin at tulungan Mo akong muling umasa sa Iyo. Amen.']
],
faith:[
['2 Corinto 5:7','Sapagkat lumalakad kami sa pamamagitan ng pananampalataya, hindi sa pamamagitan ng paningin.','Hindi mo kailangang makita ang buong daan bago sumunod. Gawin ang susunod na tapat na hakbang kasama ang Diyos.','Panginoon, tulungan Mo akong lumakad sa pananampalataya at sumunod sa Iyo. Amen.'],
['Marcos 9:24','Sumigaw ang ama, “Naniniwala ako; tulungan Mo ang aking kawalan ng pananampalataya!”','Maaaring maging tapat ang pananampalataya tungkol sa pag-aalinlangan. Dalhin pareho kay Jesus.','Jesus, naniniwala ako. Palakasin Mo ang aking pagtitiwala sa Iyo. Amen.']
],
peace:[
['Filipos 4:7','At ang kapayapaan ng Diyos na hindi kayang maunawaan ay mag-iingat sa inyong mga puso at pag-iisip kay Cristo Jesus.','Maaaring bantayan ng kapayapaan ng Diyos ang puso mo kahit hindi pa nagbabago ang sitwasyon.','Ama, bantayan Mo ang aking puso at isip sa Iyong kapayapaan. Amen.'],
['Awit 4:8','Sa kapayapaan ay hihiga ako at matutulog, sapagkat Ikaw lamang, Panginoon, ang nagbibigay sa akin ng katiwasayan.','Hindi mo kailangang lutasin ang bukas bago ka magpahinga ngayong gabi. Ipagkatiwala ito sa Diyos.','Panginoon, patahimikin Mo ang isip ko at turuan Mo akong magpahinga sa Iyo. Amen.']
],
strength:[
['Isaias 41:10','Huwag kang matakot sapagkat Ako ay kasama mo; palalakasin kita at tutulungan kita.','Ang lakas ng Diyos ay kasama ng Kanyang presensya. Hindi mo kailangang harapin ang araw na ito nang mag-isa.','Diyos, palakasin Mo ako at alalayan sa bawat hakbang ngayon. Amen.'],
['Awit 46:1','Ang Diyos ang ating kanlungan at kalakasan, laging handang tumulong sa oras ng kaguluhan.','Hindi kahinaan ang pagtakbo sa Diyos. Siya mismo ang ating kanlungan at lakas.','Ama, maging kanlungan at kalakasan ko sa lahat ng haharapin ko. Amen.']
],
gratitude:[
['Awit 107:1','Magpasalamat kayo sa Panginoon sapagkat Siya ay mabuti; ang Kanyang tapat na pag-ibig ay magpakailanman.','Nagsisimula ang pasasalamat sa pag-alala kung sino ang Diyos. Ang Kanyang kabutihan ay hindi nagbabago.','Ama, buksan Mo ang aking mga mata sa Iyong kabutihan at gawin Mo akong mapagpasalamat. Amen.'],
['Awit 100:4','Pumasok sa Kanyang mga pintuan na may pasasalamat at sa Kanyang mga looban na may pagpupuri.','Bago humingi ng higit pa, alalahanin muna ang mga ginawa na ng Diyos. Binabago nito ang puso.','Diyos, tanggapin Mo ang aking pasasalamat at tulungan Mo akong alalahanin ang Iyong katapatan. Amen.']
],
courage:[
['Josue 1:9','Magpakalakas ka at magpakatapang. Huwag kang matakot sapagkat kasama mo ang Panginoon mong Diyos saan ka man pumunta.','Ang tapang ay hindi kawalan ng takot. Ito ay pagsunod dahil mas dakila ang presensya ng Diyos kaysa sa kinatatakutan mo.','Panginoon, bigyan Mo ako ng tapang na sumunod at alalahaning kasama Kita. Amen.'],
['Awit 27:14','Maghintay ka sa Panginoon; magpakalakas ka at magpakatapang.','Minsan ang tapang ay ang pananatiling matatag habang naghihintay. Huwag magmadali dahil lamang mahirap ang paghihintay.','Ama, palakasin Mo ang aking puso at bigyan Mo ako ng tapang habang naghihintay sa Iyo. Amen.']
]
}
};

function localMotivation(language){
  const base=window.DM_REEL_CREATOR?.getContent?.()||{},theme=clean($('#dmTheme')?.value||'hope'),label=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope');
  const lang=language==='Tagalog'?'Tagalog':'English';
  const pool=FALLBACKS[lang]?.[theme]||FALLBACKS[lang]?.hope||FALLBACKS.English.hope;
  const used=new Set(read(FALLBACK_KEY).map(x=>x.sig));
  let choices=pool.map((row,index)=>({row,index,sig:contentSignature({reference:row[0],verse:row[1],reflection:row[2],prayer:row[3]})})).filter(x=>!used.has(x.sig));
  if(!choices.length){write(FALLBACK_KEY,[]);choices=pool.map((row,index)=>({row,index,sig:contentSignature({reference:row[0],verse:row[1],reflection:row[2],prayer:row[3]})}));}
  const recentGenerated=new Set([...read(GENERATED_KEY),...read(POSTED_KEY)].map(contentSignature));
  const fresh=choices.filter(x=>!recentGenerated.has(x.sig));
  if(fresh.length)choices=fresh;
  const picked=choices[Math.floor(Math.random()*choices.length)]||choices[0];
  const [reference,verse,reflection,prayer]=picked.row;
  write(FALLBACK_KEY,[{sig:picked.sig,theme,language:lang,usedAt:new Date().toISOString()},...read(FALLBACK_KEY).filter(x=>x.sig!==picked.sig)]);
  const hooks=HOOKS[lang]||HOOKS.English,questions=QUESTIONS[lang]||QUESTIONS.English;
  const hook=hooks[Math.floor(Math.random()*hooks.length)],question=questions[Math.floor(Math.random()*questions.length)];
  return {...base,title:`${label} Christian Motivation`,label:'Motivation',contentType:'motivation',reference,verse,reflection,prayer,caption:`${hook} ${reflection} ${question}`,hashtags:'#ChristianMotivation #FaithMotivation #BibleEncouragement #DeMayoBibleStudies',language:lang,source:'Built-in rotating fallback'};
}
function normalize(data,language){
  const g=data?.generated||data?.result||data?.content||data?.data||data||{};
  const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Weekly'),type=contentType();
  return {title:removeJoinThanks(g.title)||(type==='motivation'?`${selectedTheme} Christian Motivation`:`${selectedTheme} for Today`),label:type==='motivation'?'Motivation':'Weekly',contentType:type,reference:clean(g.reference||g.verseReference),verse:clean(g.verse||g.body||g.scripture),reflection:clean(g.reflection),prayer:clean(g.prayer),caption:removeJoinThanks(g.caption),hashtags:Array.isArray(g.hashtags)?g.hashtags.join(' '):clean(g.hashtags),language,source:'Gemini'};
}
function rememberGenerated(item){write(GENERATED_KEY,[{...item,generatedAt:new Date().toISOString()},...read(GENERATED_KEY).filter(x=>signature(x)!==signature(item))])}
function migrateJoinThanks(){
  if(localStorage.getItem('dm_reel_remove_join_thanks_v1')==='done')return;
  const cleanItem=item=>({...item,title:removeJoinThanks(item?.title)||'Weekly Bible Encouragement',caption:removeJoinThanks(item?.caption)});
  write(GENERATED_KEY,read(GENERATED_KEY).map(cleanItem));write(POSTED_KEY,read(POSTED_KEY).map(cleanItem));
  const library=read('dm_reel_library_v1').map(item=>item.content?{...item,content:cleanItem(item.content)}:item);localStorage.setItem('dm_reel_library_v1',JSON.stringify(library));localStorage.setItem('dm_reel_remove_join_thanks_v1','done');
}
function themePrompt(){
  const theme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope');const language=$('#dmReelLanguage')?.value||'English';
  if(contentType()==='motivation')return language==='Tagalog'?`${theme}. Gumawa ng makapangyarihan ngunit mahinahong Christian motivational Reel sa natural na Tagalog. Magsimula sa isang maikling motivational hook. Gumamit ng isang buong Bible verse at tamang reference bilang pundasyon. Sumulat ng nakapagpapalakas na mensahe na may praktikal na hamon o susunod na hakbang, hanggang 55 salita lamang, at isang taos-pusong panalangin hanggang 40 salita. Ang verse, mensahe at panalangin ay dapat kasya sa mahinahong 90-second reading. Iwasan ang garantisadong pangako tungkol sa kayamanan, tagumpay o kagalingan. Ang caption ay dapat walang URL, magtapos sa isang tanong, at magkaroon lamang ng 3 hanggang 5 kaugnay na hashtags.`:`${theme}. Create a strong but compassionate Christian motivational Reel. Begin with a short motivational hook. Use one complete Bible verse and its correct reference as the foundation. Write an uplifting message with one practical challenge or next step, maximum 55 words, followed by a sincere prayer of maximum 40 words. The verse, message and prayer must fit a calm 90-second reading. Avoid guaranteed promises of wealth, success or healing. Use a link-free caption ending with one sincere question and return only 3 to 5 relevant hashtags.`;
  return language==='Tagalog'?`${theme}. Write the verse, reflection, prayer, caption and closing message in natural Tagalog. The spoken verse, reflection and prayer together must fit a calm 90-second reading: keep the reflection to 55 words maximum and the prayer to 40 words maximum. Keep the full Bible verse and its reference. Begin the caption with a short emotional hook, end with one sincere discussion question, use no URL, and return only 3 to 5 relevant hashtags.`:`${theme}. Write clear, warm English suitable for a weekly Facebook Reel. The spoken verse, reflection and prayer together must fit a calm 90-second reading: keep the reflection to 55 words maximum and the prayer to 40 words maximum. Keep the full Bible verse and its reference. Begin the caption with a short emotional hook, end with one sincere discussion question, use no URL, and return only 3 to 5 relevant hashtags.`;
}
function chooseSurpriseTheme(){const select=$('#dmTheme');if(!select)return;const options=[...select.options],choices=options.filter(option=>option.value!==select.value),selected=choices[Math.floor(Math.random()*choices.length)]||options[0];if(selected){currentFreshSignature='';select.value=selected.value;window.DM_REEL_CREATOR?.clearGeneratedContent();}}
async function generate(mode='selected'){
  if(busy||!window.DM_REEL_CREATOR)return;if(mode==='surprise')chooseSurpriseTheme();busy=true;const buttons=[$('#dmRegenerate'),$('#dmReelSurprise')].filter(Boolean);buttons.forEach(button=>button.disabled=true);const activeButton=mode==='surprise'?$('#dmReelSurprise'):$('#dmRegenerate');if(activeButton)activeButton.textContent='✨ Gemini creating…';const language=$('#dmReelLanguage')?.value||'English';const selectedTheme=clean($('#dmTheme')?.selectedOptions?.[0]?.textContent||'Hope'),selectedType=contentTypeLabel();status(`✨ Gemini is creating a fresh ${selectedType} Reel about ${selectedTheme}…`,'loading');
  try{let item=null;for(let attempt=0;attempt<3;attempt++){try{const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'bibleVerse',theme:themePrompt(),previousItems:previousItems()})});const data=await response.json().catch(()=>({}));if(!response.ok||data?.ok===false){const error=new Error(data?.error||data?.message||`Gemini request failed (${response.status})`);error.temporary=response.status===429||response.status===503||/high demand|temporar|overload|quota|limit/i.test(error.message);throw error;}const candidate=normalize(data,language);if(!candidate.reference||!candidate.verse)throw new Error('Gemini returned incomplete Reel content.');if(!history().some(old=>signature(old)===signature(candidate))){item=candidate;break;}}catch(error){if(error.temporary&&attempt<2){const box=$('#dmReelGeminiStatus');if(box){box.hidden=false;box.dataset.type='loading';box.textContent=`Gemini is busy or quota-limited. Retrying automatically (${attempt+2} of 3)…`;}await wait(1500*(attempt+1));continue;}throw error;}}
    if(!item)throw new Error('Gemini repeated a recent verse three times. Please try again.');currentFreshSignature=signature(item);window.DM_REEL_CREATOR.setGeneratedContent(item);rememberGenerated(item);updatePostedStatus();status(`✅ Fresh ${selectedType} Reel created in ${language} — not posted yet.`,'success');
  }catch(error){console.error('Reel Gemini:',error);if(contentType()==='motivation'){const fallback=localMotivation(language);currentFreshSignature=signature(fallback);window.DM_REEL_CREATOR.setGeneratedContent(fallback);rememberGenerated(fallback);updatePostedStatus();status(`✅ Gemini is unavailable or quota-limited, so a fresh built-in ${contentTypeLabel()} Reel was created instead.`,'success');}else status(`⚠️ ${error.message} Built-in Reel content is still available.`,'error');}
  finally{busy=false;buttons.forEach(button=>button.disabled=false);const selectedButton=$('#dmRegenerate');if(selectedButton)selectedButton.textContent='✨ Generate Selected Theme';const surpriseButton=$('#dmReelSurprise');if(surpriseButton)surpriseButton.textContent='🎲 Surprise Me';}
}
function markPosted(){const item=window.DM_REEL_CREATOR?.getContent();if(!item?.reference)return status('Create or open a Reel before marking it as posted.','error');const posted=read(POSTED_KEY);if(posted.some(old=>signature(old)===signature(item))){currentFreshSignature='';updatePostedStatus();return status(`${item.reference} is already marked as posted.`,'info');}write(POSTED_KEY,[{...item,postedAt:new Date().toISOString()},...posted]);currentFreshSignature='';updatePostedStatus();status(`✅ ${item.reference} marked as posted. Gemini will avoid it in future Reels.`,'success');}
function updatePostedStatus(){const item=window.DM_REEL_CREATOR?.getContent();const itemSignature=signature(item);const isPosted=item&&itemSignature!==currentFreshSignature&&read(POSTED_KEY).some(old=>signature(old)===itemSignature);const button=$('#dmMarkReelPosted');if(button){button.textContent=isPosted?'✓ Already Posted':'✓ Mark as Posted';button.disabled=!!isPosted;}const count=$('#dmPostedReelCount');if(count)count.textContent=`${read(POSTED_KEY).length} posted Reel${read(POSTED_KEY).length===1?'':'s'} protected from repeats`;}
function hashtagsText(item){const theme=clean($('#dmTheme')?.value||'hope').toLowerCase();const themeTags={hope:'#HopeInGod',faith:'#WalkByFaith',peace:'#PeaceInChrist',strength:'#GodIsMyStrength',gratitude:'#ThankfulToGod',courage:'#CourageInChrist'};const isMotivation=item?.contentType==='motivation'||contentType()==='motivation';const topic=isMotivation?'#ChristianMotivation':(themeTags[theme]||'#BibleEncouragement');return `${topic} #BibleVerse #Faith #DeMayoBibleStudies`;}
function install(){migrateJoinThanks();const controls=$('.dm-reel-controls');if(!controls||$('#dmReelGeminiPanel'))return;const panel=document.createElement('section');panel.id='dmReelGeminiPanel';panel.className='card';panel.innerHTML=`<h3>✨ AI Reel content</h3><div class="dm-form-grid"><label>Language<select id="dmReelLanguage"><option>English</option><option>Tagalog</option></select></label><label>Content type<select id="dmReelContentType"><option value="devotional">Verse, Message & Prayer</option><option value="motivation">Christian Motivational</option></select></label></div><div class="dm-reel-ai-actions"><button id="dmReelSurprise" class="ghost">🎲 Surprise Me</button><button id="dmMarkReelPosted" class="ghost">✓ Mark as Posted</button></div><p id="dmPostedReelCount" class="small-note"></p><p id="dmReelGeminiStatus" class="small-note" hidden></p>`;controls.insertAdjacentElement('afterend',panel);$('#dmReelSurprise').onclick=()=>generate('surprise');$('#dmMarkReelPosted').onclick=markPosted;const old=$('#dmRegenerate');if(old){old.textContent='✨ Generate Selected Theme';old.onclick=()=>generate('selected');}updatePostedStatus();document.addEventListener('dm-reel-content-change',updatePostedStatus);}
window.addEventListener('load',()=>setTimeout(install,100));window.addEventListener('hashchange',()=>setTimeout(install,100));document.addEventListener('dm-reel-studio-ready',install);
})();
