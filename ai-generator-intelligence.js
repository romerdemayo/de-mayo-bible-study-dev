/* De Mayo Bible Studies - Build 1.22.1a generator intelligence */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const EN={
 intro:(t,r,a)=>`This resource explores ${t.toLowerCase()} through ${r}. It is written for ${a.toLowerCase()} and should be reviewed carefully alongside the full Bible passage.`,
 truth:(r)=>`Read ${r} in context. Identify what the passage reveals about God, what it reveals about people, and the faithful response it calls for.`,
 apply:(a)=>({Personal:'Choose one belief to strengthen and one obedient step to take today.',Youth:'Connect this truth to school, friendships, online life, pressure, and the decisions young people face.',Church:'Consider how the whole church can believe, practise, and share this truth together.',Evangelism:'Explain the good news of Jesus clearly and invite the listener to respond with repentance and faith.',Children:'Choose one simple action a child can practise this week.'}[a]||'Choose one practical response this week.'),
 prayer:(r)=>`Lord, help us understand and obey the truth of ${r}. Shape our faith, choices, relationships, and witness through Jesus Christ. Amen.`,
 question:(t)=>`Where is ${t.toLowerCase()} most difficult in everyday life?`,
 gospel:'Show how this passage points to God’s grace, the work of Jesus Christ, and the response of faith and obedience.'
};
const TL={
 intro:(t,r,a)=>`Sinusuri ng materyal na ito ang ${t.toLowerCase()} sa pamamagitan ng ${r}. Inihanda ito para sa ${audienceTL(a)} at dapat suriin kasama ang buong talata ng Bibliya.`,
 truth:(r)=>`Basahin ang ${r} sa tamang konteksto. Tukuyin kung ano ang ipinapakita nito tungkol sa Diyos, sa tao, at sa tapat na tugon na hinihingi ng talata.`,
 apply:(a)=>({Personal:'Pumili ng isang katotohanang paniniwalaan at isang hakbang ng pagsunod na gagawin ngayong araw.',Youth:'Iugnay ang katotohanang ito sa paaralan, pagkakaibigan, online na buhay, pressure, at mga desisyon ng kabataan.',Church:'Pag-isipan kung paano ito paniniwalaan, isasabuhay, at ibabahagi ng buong iglesia.',Evangelism:'Ipaliwanag nang malinaw ang mabuting balita ni Jesus at anyayahan ang tao na tumugon sa pagsisisi at pananampalataya.',Children:'Pumili ng isang simpleng gawaing maaaring gawin ng bata ngayong linggo.'}[a]||'Pumili ng isang praktikal na tugon ngayong linggo.'),
 prayer:(r)=>`Panginoon, tulungan Mo kaming maunawaan at sundin ang katotohanan ng ${r}. Hubugin Mo ang aming pananampalataya, pasya, relasyon, at patotoo sa pamamagitan ni Jesu-Cristo. Amen.`,
 question:(t)=>`Saang bahagi ng araw-araw na buhay pinakamahirap isabuhay ang ${t.toLowerCase()}?`,
 gospel:'Ipakita kung paano itinuturo ng talata ang biyaya ng Diyos, ang ginawa ni Jesu-Cristo, at ang tugon ng pananampalataya at pagsunod.'
};
function audienceTL(a){return {Personal:'personal na pagninilay',Youth:'kabataan',Church:'iglesia',Evangelism:'pagbabahagi ng ebanghelyo',Children:'mga bata'}[a]||'mambabasa'}
function pair(en,tl,lang){return lang==='Tagalog'?tl:lang==='Bilingual'?`${en}\n\nTAGALOG\n${tl}`:en}
function heading(en,tl,lang){return lang==='Tagalog'?tl:lang==='Bilingual'?`${en} / ${tl}`:en}
function values(){return {type:document.querySelector('.dm-ai-type.is-active')?.dataset.type||'devotional',topic:$('#dmAiTopic')?.value.trim()||'Faith',reference:$('#dmAiReference')?.value.trim()||'Selected Scripture',audience:$('#dmAiAudience')?.value||'Personal',length:$('#dmAiLength')?.value||'Medium',language:$('#dmAiLanguage')?.value||'English'}}
function common(v){return {intro:pair(EN.intro(v.topic,v.reference,v.audience),TL.intro(v.topic,v.reference,v.audience),v.language),truth:pair(EN.truth(v.reference),TL.truth(v.reference),v.language),apply:pair(EN.apply(v.audience),TL.apply(v.audience),v.language),prayer:pair(EN.prayer(v.reference),TL.prayer(v.reference),v.language),question:pair(EN.question(v.topic),TL.question(v.topic),v.language),gospel:pair(EN.gospel,TL.gospel,v.language)}}
function build(v){
 const c=common(v),h=(en,tl)=>heading(en,tl,v.language),rows=[];
 const add=(en,tl,text)=>rows.push([h(en,tl),text]);
 if(v.type==='prayer'){
  add('Opening','Pambungad',pair(`Heavenly Father, thank You for speaking through ${v.reference}.`,`Ama naming Diyos, salamat sa Iyong Salita sa ${v.reference}.`,v.language));
  add('Main Prayer','Pangunahing Panalangin',pair(`Guide us in ${v.topic.toLowerCase()}. Give wisdom, courage, patience, compassion, and a heart that honours Christ.`,`Gabayan Mo kami sa ${v.topic.toLowerCase()}. Bigyan Mo kami ng karunungan, tapang, pagtitiis, malasakit, at pusong nagbibigay-lugod kay Cristo.`,v.language));
  add('Closing','Pangwakas',c.prayer);
 }else if(v.type==='social'){
  add('Caption','Caption',pair(`${v.topic}\n\n${v.reference}\n\nGod’s Word calls us to trust Him and take the next faithful step.`,`${v.topic}\n\n${v.reference}\n\nTinatawag tayo ng Salita ng Diyos na magtiwala sa Kanya at gawin ang susunod na tapat na hakbang.`,v.language));
  add('Engagement Question','Tanong',c.question);add('Hashtags','Mga Hashtag','#BibleVerse #Faith #Jesus #ChristianEncouragement #DeMayoBibleStudies');
 }else if(v.type==='reel'){
  add('Hook','Panimulang Linya',pair(`When ${v.topic.toLowerCase()} feels difficult, remember this truth.`,`Kapag mahirap ang ${v.topic.toLowerCase()}, alalahanin ang katotohanang ito.`,v.language));add('Scripture','Kasulatan',v.reference);add('Main Message','Pangunahing Mensahe',c.intro);add('Application','Aplikasyon',c.apply);add('Call to Action','Hamon',pair('Read the passage, pray about it, and share this encouragement.','Basahin ang talata, ipanalangin ito, at ibahagi ang mensaheng ito.',v.language));
 }else if(v.type==='presentation'){
  add('Slide 1 · Title','Slide 1 · Pamagat',v.topic);add('Slide 2 · Scripture','Slide 2 · Kasulatan',v.reference);add('Slide 3 · Main Truth','Slide 3 · Pangunahing Katotohanan',c.intro);add('Slide 4 · Application','Slide 4 · Aplikasyon',c.apply);add('Slide 5 · Prayer','Slide 5 · Panalangin',c.prayer);
 }else if(v.type==='kids'){
  add('Lesson Title','Pamagat ng Aralin',v.topic);add('Bible Passage','Talata sa Bibliya',v.reference);add('Big Idea','Pangunahing Aral',pair(`God helps children trust and obey Him in ${v.topic.toLowerCase()}.`,`Tinutulungan ng Diyos ang mga bata na magtiwala at sumunod sa Kanya tungkol sa ${v.topic.toLowerCase()}.`,v.language));add('Story and Teaching','Kuwento at Pagtuturo',c.intro);add('Activity','Gawain',pair('Draw or act out one way to obey God this week.','Iguhit o isadula ang isang paraan ng pagsunod sa Diyos ngayong linggo.',v.language));add('Memory Verse','Talatang Isasaulo',v.reference);add('Prayer','Panalangin',c.prayer);
 }else if(v.type==='sermon'){
  add('Main Scripture','Pangunahing Kasulatan',v.reference);add('Introduction','Panimula',c.intro);add('Point 1 · What the passage reveals about God','Punto 1 · Ano ang ipinapakita tungkol sa Diyos',c.truth);add('Point 2 · What the passage reveals about us','Punto 2 · Ano ang ipinapakita tungkol sa atin',pair('Explain the human need, struggle, promise, command, or warning in the passage.','Ipaliwanag ang pangangailangan, pakikibaka, pangako, utos, o babala sa talata.',v.language));add('Point 3 · Christ-centred response','Punto 3 · Tugon na nakasentro kay Cristo',c.gospel);add('Application','Aplikasyon',c.apply);add('Closing Prayer','Pangwakas na Panalangin',c.prayer);
 }else if(v.type==='study'){
  add('Purpose','Layunin',pair(`Understand what ${v.reference} teaches about ${v.topic.toLowerCase()} and apply it faithfully.`,`Unawain ang itinuturo ng ${v.reference} tungkol sa ${v.topic.toLowerCase()} at tapat itong isabuhay.`,v.language));add('Opening Question','Pambungad na Tanong',c.question);add('Key Observations','Mahahalagang Obserbasyon',c.truth);add('Discussion Questions','Mga Tanong sa Talakayan',pair('1. What stands out?\n2. What belief or behaviour is challenged?\n3. What response should follow?','1. Ano ang kapansin-pansin?\n2. Anong paniniwala o kilos ang hinahamon?\n3. Anong tugon ang dapat gawin?',v.language));add('Application','Aplikasyon',c.apply);add('Closing Prayer','Pangwakas na Panalangin',c.prayer);
 }else if(v.type==='exhortation'){
  add('Opening','Panimula',c.intro);add('Main Encouragement','Pangunahing Pagpapalakas',pair(`Do not let present circumstances silence the truth of ${v.reference}. God remains faithful and calls us to trust and obey.`,`Huwag hayaang patahimikin ng kasalukuyang kalagayan ang katotohanan ng ${v.reference}. Tapat ang Diyos at tinatawag Niya tayong magtiwala at sumunod.`,v.language));add('Challenge','Hamon',c.apply);add('Closing Prayer','Pangwakas na Panalangin',c.prayer);
 }else{
  add('Main Scripture','Pangunahing Kasulatan',v.reference);add('Reflection','Pagninilay',c.intro);add('Application','Aplikasyon',c.apply);add('Reflection Question','Tanong sa Pagninilay',c.question);add('Closing Prayer','Pangwakas na Panalangin',c.prayer);
 }
 if(v.length==='Short')return rows.slice(0,Math.max(3,Math.min(4,rows.length)));
 if(v.length==='Detailed'){
  const insert=Math.max(2,rows.length-1);
  rows.splice(insert,0,[h('Supporting Scriptures','Mga Kaugnay na Kasulatan'),pair(`Add 2–4 passages that support ${v.reference}, then explain how each one connects without removing the original context.`,`Magdagdag ng 2–4 na talatang sumusuporta sa ${v.reference}, at ipaliwanag ang kaugnayan ng bawat isa nang hindi inaalis ang orihinal na konteksto.`,v.language)]);
  rows.splice(insert+1,0,[h('Deeper Study','Mas Malalim na Pag-aaral'),pair('Study the surrounding chapter, key words, repeated ideas, promises, commands, warnings, and the passage’s connection to the Gospel.','Pag-aralan ang buong kabanata, mahahalagang salita, paulit-ulit na ideya, pangako, utos, babala, at kaugnayan ng talata sa Ebanghelyo.',v.language)]);
  rows.splice(rows.length-1,0,[h('Action Plan','Plano ng Pagsasabuhay'),pair('Write one personal action, one family or church action, and one person to encourage this week.','Isulat ang isang personal na hakbang, isang hakbang para sa pamilya o iglesia, at isang taong palalakasin ngayong linggo.',v.language)]);
 }
 return rows;
}
function enhance(){
 const editor=$('#dmAiEditor');if(!editor||!$('#dmAiSections'))return;
 const v=values(),rows=build(v),title=pair(`${({prayer:'Prayer',devotional:'Devotional',study:'Bible Study',sermon:'Sermon',exhortation:'Exhortation',kids:'Kids Lesson',social:'Social Post',reel:'Reel Script',presentation:'Presentation'}[v.type]||'Resource')}: ${v.topic}`,`${({prayer:'Panalangin',devotional:'Debosyonal',study:'Pag-aaral ng Bibliya',sermon:'Sermon',exhortation:'Exhortation',kids:'Aralin para sa Bata',social:'Social Post',reel:'Reel Script',presentation:'Presentasyon'}[v.type]||'Materyal')}: ${v.topic}`,v.language);
 const titleInput=$('#dmAiTitle');if(titleInput){titleInput.value=title;titleInput.dispatchEvent(new Event('input',{bubbles:true}))}
 const box=$('#dmAiSections');box.innerHTML=rows.map((r,i)=>`<article class="dm-ai-section" data-section="${i}"><div class="dm-ai-section-head"><input class="dm-ai-heading" value="${r[0].replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" aria-label="Section heading"><div class="dm-ai-section-actions"><button class="ghost" data-up="${i}">↑</button><button class="ghost" data-down="${i}">↓</button><button class="danger" data-delete="${i}">×</button></div></div><textarea class="dm-ai-content" rows="${v.length==='Detailed'?7:5}">${r[1].replace(/&/g,'&amp;').replace(/</g,'&lt;')}</textarea></article>`).join('');
 box.querySelectorAll('.dm-ai-heading,.dm-ai-content').forEach(el=>el.dispatchEvent(new Event('input',{bubbles:true})));
 const status=editor.querySelector('.dm-ai-status');if(status)status.textContent=`${v.audience} · ${v.length} · ${v.language}`;
 if(typeof window.toast==='function')window.toast(`${v.language} ${v.length.toLowerCase()} resource prepared for ${v.audience.toLowerCase()}`);
}
document.addEventListener('click',e=>{if(e.target.closest('#dmAiGenerate'))setTimeout(enhance,0)},false);
})();