/* De Mayo Bible Studies - Build 1.23.3 Kids Lesson + Small Group outputs */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const $=s=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function write(v){localStorage.setItem(RESOURCE_KEY,JSON.stringify(v))}
function notify(m){window.toast?.(m)}
function findSection(resource,pattern){return (resource.sections||[]).find(s=>pattern.test(String(s.heading||'')))?.content||''}
function scripture(resource){return findSection(resource,/selected scripture|talata sa bibliya|napiling kasulatan/i)||resource.reference||'Selected Scripture'}
function reflection(resource){return findSection(resource,/reflection|pagninilay|main message|pangunahing mensahe|introduction|panimula/i)||(resource.sections?.[1]?.content||resource.body||'').slice(0,900)}
function application(resource){return findSection(resource,/application|aplikasyon|challenge|hamon|action plan|plano/i)||'Choose one faithful action to practise this week.'}
function lang(resource){return resource.language||'English'}
function pair(en,tl,language){return language==='Tagalog'?tl:language==='Bilingual'?`${en}\n\nTAGALOG\n${tl}`:en}
function kids(resource){
 const language=lang(resource),s=scripture(resource),r=reflection(resource),a=application(resource),topic=resource.topic||resource.title||'God’s truth';
 return {title:pair(`Kids Lesson: ${topic}`,`Aralin para sa Bata: ${topic}`,language),fields:[
  ['Selected Scripture',s],
  ['Big Idea',pair(`God wants children to understand and live out this truth about ${topic.toLowerCase()}.`,`Nais ng Diyos na maunawaan at maisabuhay ng mga bata ang katotohanang ito tungkol sa ${topic.toLowerCase()}.`,language)],
  ['Simple Explanation',pair(`In simple words: ${r}`,`Sa simpleng salita: ${r}`,language)],
  ['Memory Verse',s],
  ['Activity',pair('Draw, act out, or write one way you can obey God this week.','Iguhit, isadula, o isulat ang isang paraan ng pagsunod sa Diyos ngayong linggo.',language)],
  ['Discussion Questions',pair('1. What does this passage teach us about God?\n2. What should we do because of it?\n3. Who can we encourage with this truth?','1. Ano ang itinuturo ng talata tungkol sa Diyos?\n2. Ano ang dapat nating gawin dahil dito?\n3. Sino ang maaari nating palakasin gamit ang katotohanang ito?',language)],
  ['Action Step',a],
  ['Closing Prayer',pair('Lord, help us understand Your Word and obey You with joy. Help us trust Jesus and show Your love this week. Amen.','Panginoon, tulungan Mo kaming maunawaan ang Iyong Salita at sumunod nang may kagalakan. Tulungan Mo kaming magtiwala kay Jesus at ipakita ang Iyong pag-ibig ngayong linggo. Amen.',language)]
 ]};
}
function smallgroup(resource){
 const language=lang(resource),s=scripture(resource),r=reflection(resource),a=application(resource),topic=resource.topic||resource.title||'this passage';
 return {title:pair(`Small Group Guide: ${topic}`,`Gabay sa Maliit na Grupo: ${topic}`,language),fields:[
  ['Opening Icebreaker',pair('Share one situation this week where you needed wisdom, courage, peace, or faith.','Magbahagi ng isang sitwasyon ngayong linggo kung saan kinailangan mo ng karunungan, tapang, kapayapaan, o pananampalataya.',language)],
  ['Selected Scripture',s],
  ['Main Truth',r],
  ['Observation Questions',pair('1. What words or ideas stand out?\n2. What does the passage reveal about God?\n3. What promise, command, warning, or example do you see?','1. Anong mga salita o ideya ang kapansin-pansin?\n2. Ano ang ipinapakita ng talata tungkol sa Diyos?\n3. Anong pangako, utos, babala, o halimbawa ang makikita?',language)],
  ['Application Questions',pair('1. Where is this truth difficult to practise?\n2. What needs to change in our thinking or behaviour?\n3. How can the group support one another this week?','1. Saan mahirap isabuhay ang katotohanang ito?\n2. Ano ang kailangang baguhin sa ating pag-iisip o kilos?\n3. Paano susuportahan ng grupo ang isa’t isa ngayong linggo?',language)],
  ['Group Action Step',a],
  ['Closing Prayer',pair('Pray for understanding, obedience, unity, and courage to live out the passage together.','Manalangin para sa pagkaunawa, pagsunod, pagkakaisa, at tapang na sabay-sabay isabuhay ang talata.',language)]
 ]};
}
function saveOutput(resource,index,type,data){
 const rows=read(),current=rows[index];if(!current)return;current.outputs=Array.isArray(current.outputs)?current.outputs:[];const now=Date.now();
 current.outputs.unshift({id:`${type}-${now}-${Math.random().toString(36).slice(2,6)}`,type,title:data.title,fields:data.fields.map(([heading,content])=>({heading,content})),body:data.fields.map(([h,c])=>`${h}\n${c}`).join('\n\n'),createdAt:now,updatedAt:now,status:'draft'});
 current.updatedAt=now;rows[index]=current;write(rows);notify(`${type==='kids'?'Kids lesson':'Small group guide'} saved to this resource`);window.dispatchEvent(new CustomEvent('dm-resource-output-saved',{detail:{resourceId:current.id,type}}));
}
function openEditor(resource,index,type){
 const data=type==='kids'?kids(resource):smallgroup(resource);$('#dmResourceOutputModal')?.remove();const wrap=document.createElement('div');wrap.id='dmResourceOutputModal';wrap.className='dm-capture-modal';
 wrap.innerHTML=`<div class="dm-capture-dialog dm-output-studio-dialog"><div class="dm-output-head"><div><small>Build 1.23.3 · Resource Output Studio</small><h2>${type==='kids'?'🧒':'👥'} ${esc(data.title)}</h2><p>Generated from <b>${esc(resource.title||'saved resource')}</b>. Everything remains editable.</p></div><button class="ghost" id="dmOutputClose">×</button></div><label>Title<input id="dmOutputTitle" value="${esc(data.title)}"></label><div id="dmOutputFields">${data.fields.map(([h,c])=>`<article class="dm-output-field"><label>Section<input class="dm-output-heading" value="${esc(h)}"></label><label>Content<textarea class="dm-output-content" rows="6">${esc(c)}</textarea></label></article>`).join('')}</div><div class="dm-output-actions"><button class="primary" id="dmOutputSave">💾 Save Output</button><button class="ghost" id="dmOutputCopy">📋 Copy</button></div></div>`;
 document.body.appendChild(wrap);const capture=()=>({title:$('#dmOutputTitle').value.trim(),fields:[...wrap.querySelectorAll('.dm-output-field')].map(x=>[x.querySelector('.dm-output-heading').value.trim()||'Section',x.querySelector('.dm-output-content').value.trim()])});
 $('#dmOutputClose').onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};$('#dmOutputSave').onclick=()=>{saveOutput(resource,index,type,capture());wrap.remove()};$('#dmOutputCopy').onclick=()=>{const edited=capture(),text=[edited.title,...edited.fields.flatMap(x=>x)].join('\n\n');navigator.clipboard?.writeText(text).then(()=>notify('Output copied')).catch(()=>notify('Copy failed'))};
}
function install(){
 const api=window.DM_RESOURCE_OUTPUTS;if(!api?.open){setTimeout(install,40);return}
 if(api.__kidsSmallGroupReady)return;const original=api.open.bind(api);api.open=(resource,index,type)=>{if(type==='kids'||type==='smallgroup'){openEditor(resource,index,type);return}original(resource,index,type)};api.__kidsSmallGroupReady=true;
}
install();
})();