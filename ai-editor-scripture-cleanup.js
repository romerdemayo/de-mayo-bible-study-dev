/* De Mayo Bible Studies - Build 1.22.1d one canonical full-verse Scripture block */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function selected(){
 try{return JSON.parse(localStorage.getItem('dm_aiSelectedScriptureLocalized')||localStorage.getItem('dm_aiSelectedScripture')||'null')}catch{return null}
}
function lang(){return $('#dmAiLanguage')?.value||'English'}
function topic(){return $('#dmAiTopic')?.value.trim()||'this topic'}
function norm(v=''){return String(v).trim().toLowerCase().replace(/[·•]/g,' ').replace(/\s+/g,' ')}
function dispatch(section){section.querySelectorAll('input,textarea').forEach(x=>x.dispatchEvent(new Event('input',{bubbles:true})))}
function isCanonicalHeading(value=''){
 return /^(selected scripture|scripture text|talata sa bibliya|napiling kasulatan|selected scripture \/ napiling kasulatan)$/i.test(String(value).trim());
}
function isDuplicateScriptureHeading(value=''){
 const h=norm(value);
 if(isCanonicalHeading(value))return false;
 return /(^|\s)(main scripture|pangunahing kasulatan|scripture|kasulatan|bible passage|talata sa bibliya|memory verse|talatang isasaulo)(\s|$)/i.test(h);
}
function canonicalContent(data){
 const reference=data?.reference||data?.enRef||$('#dmAiReference')?.value||'';
 const text=data?.text||data?.verse||data?.enText||'';
 return [reference,text].filter(Boolean).join('\n\n');
}
function cleanup(){
 const box=$('#dmAiSections');if(!box)return;
 const sections=[...box.querySelectorAll('.dm-ai-section')];
 const selectedSection=sections.find(x=>isCanonicalHeading(x.querySelector('.dm-ai-heading')?.value||''));
 if(!selectedSection)return;
 const data=selected();
 if(data){
  const language=lang();
  const heading=language==='Tagalog'?'Talata sa Bibliya':language==='Bilingual'?'Selected Scripture / Napiling Kasulatan':'Selected Scripture';
  selectedSection.querySelector('.dm-ai-heading').value=heading;
  const full=canonicalContent(data);
  if(full)selectedSection.querySelector('.dm-ai-content').value=full;
  dispatch(selectedSection);
 }
 [...box.querySelectorAll('.dm-ai-section')].forEach(section=>{
  if(section===selectedSection)return;
  const heading=section.querySelector('.dm-ai-heading')?.value||'';
  if(isDuplicateScriptureHeading(heading))section.remove();
 });
 const reflection=[...box.querySelectorAll('.dm-ai-section')].find(x=>/^(reflection|pagninilay|reflection \/ pagninilay)$/i.test(x.querySelector('.dm-ai-heading')?.value.trim()||''));
 if(reflection&&data){
  const reason=data.reason||'This passage calls us to trust God and respond faithfully.';
  const reference=data.reference||data.enRef||$('#dmAiReference')?.value||'the selected passage';
  const en=`${reference} teaches us to trust God rather than depend only on our own understanding. ${reason} In relation to ${topic().toLowerCase()}, the passage invites us to seek God’s wisdom, follow His direction, and take the next faithful step.`;
  const tl=`Itinuturo ng ${reference} na magtiwala tayo sa Diyos at huwag umasa lamang sa sarili nating pagkaunawa. Inaanyayahan tayo ng talata na humingi ng karunungan sa Diyos, sundin ang Kanyang patnubay, at gawin ang susunod na tapat na hakbang tungkol sa ${topic().toLowerCase()}.`;
  const language=lang();
  reflection.querySelector('.dm-ai-content').value=language==='Tagalog'?tl:language==='Bilingual'?`${en}\n\nTAGALOG\n${tl}`:en;
  dispatch(reflection);
 }
 [...box.querySelectorAll('.dm-ai-section')].forEach((section,i)=>section.dataset.section=String(i));
}
document.addEventListener('click',e=>{if(e.target.closest('#dmAiGenerate'))setTimeout(cleanup,240)},false);
})();
