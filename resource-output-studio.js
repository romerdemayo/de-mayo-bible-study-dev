/* De Mayo Bible Studies - Build 1.23.1 Resource Output Studio */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const $=s=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function write(v){localStorage.setItem(RESOURCE_KEY,JSON.stringify(v))}
function notify(m){window.toast?.(m)}
function findSection(resource,pattern){return (resource.sections||[]).find(s=>pattern.test(String(s.heading||'')))?.content||''}
function scripture(resource){
 const section=findSection(resource,/selected scripture|talata sa bibliya|napiling kasulatan/i);
 if(section)return section;
 return resource.reference||'Selected Scripture';
}
function reflection(resource){return findSection(resource,/reflection|pagninilay|main message|pangunahing mensahe|introduction|panimula/i)||(resource.sections?.[1]?.content||resource.body||'').slice(0,900)}
function application(resource){return findSection(resource,/application|aplikasyon|challenge|hamon|action plan|plano/i)||'Choose one faithful action and encourage someone with this truth.'}
function lang(resource){return resource.language||'English'}
function pair(en,tl,language){return language==='Tagalog'?tl:language==='Bilingual'?`${en}\n\nTAGALOG\n${tl}`:en}
function tagsFor(resource){
 const text=`${resource.topic||''} ${resource.title||''} ${reflection(resource)}`.toLowerCase();
 const tags=['#BibleVerse','#Scripture','#Faith'];
 if(/hope|pag-asa/.test(text))tags.push('#HopeInGod');
 if(/fear|anxiety|worry|takot|pag-aalala/.test(text))tags.push('#FaithOverFear');
 if(/heal|sick|cancer|pagpapagaling/.test(text))tags.push('#HealingPrayer');
 if(/wisdom|guidance|karunungan|gabay/.test(text))tags.push('#GodsWisdom');
 if(/strength|weary|lakas|pagod/.test(text))tags.push('#StrengthInChrist');
 if(/peace|kapayapaan/.test(text))tags.push('#PeaceInGod');
 tags.push('#Jesus','#DeMayoBibleStudies');
 return [...new Set(tags)].slice(0,8).join(' ');
}
function social(resource){
 const language=lang(resource),s=scripture(resource),r=reflection(resource),a=application(resource);
 return {
  title:pair(`Social Post: ${resource.topic||resource.title}`,`Social Post: ${resource.topic||resource.title}`,language),
  fields:[
   ['Caption',pair(`${r}\n\n${s}\n\n${a}`,`${r}\n\n${s}\n\n${a}`,language)],
   ['Engagement Question',pair('What truth from this Scripture will you carry into today?','Anong katotohanan mula sa Kasulatang ito ang isasabuhay mo ngayong araw?',language)],
   ['Hashtags',tagsFor(resource)]
  ]
 };
}
function reel(resource){
 const language=lang(resource),s=scripture(resource),r=reflection(resource),a=application(resource);
 return {
  title:pair(`Reel Script: ${resource.topic||resource.title}`,`Reel Script: ${resource.topic||resource.title}`,language),
  fields:[
   ['Hook',pair('Stop scrolling—this Scripture may be the reminder you need today.','Sandali—maaaring ito ang paalala ng Diyos na kailangan mo ngayon.',language)],
   ['Selected Scripture',s],
   ['Narration',r],
   ['Application',a],
   ['Call to Action',pair('Save this, share it, and read the full passage today.','I-save at ibahagi ito, at basahin ang buong talata ngayong araw.',language)],
   ['Caption',tagsFor(resource)]
  ]
 };
}
function prayer(resource){
 const language=lang(resource),s=scripture(resource),topic=resource.topic||resource.title||'this truth',a=application(resource);
 return {
  title:pair(`Prayer: ${topic}`,`Panalangin: ${topic}`,language),
  fields:[
   ['Selected Scripture',s],
   ['Prayer',pair(`Heavenly Father, thank You for speaking through this passage. Help me trust You concerning ${topic.toLowerCase()}. Give me wisdom, courage, peace, and strength to obey Your Word. ${a} Shape my heart and let my life honour Jesus. Amen.`,`Ama naming Diyos, salamat sa Iyong Salita. Tulungan Mo akong magtiwala sa Iyo tungkol sa ${topic.toLowerCase()}. Bigyan Mo ako ng karunungan, tapang, kapayapaan, at lakas upang sundin ang Iyong Salita. ${a} Hubugin Mo ang aking puso at hayaang parangalan ng aking buhay si Jesus. Amen.`,language)]
  ]
 };
}
function generate(resource,type){return type==='social'?social(resource):type==='reel'?reel(resource):prayer(resource)}
function saveOutput(resource,index,type,data){
 const rows=read(),current=rows[index];if(!current)return;
 current.outputs=Array.isArray(current.outputs)?current.outputs:[];
 const now=Date.now();
 current.outputs.unshift({id:`${type}-${now}-${Math.random().toString(36).slice(2,6)}`,type,title:data.title,fields:data.fields.map(([heading,content])=>({heading,content})),body:data.fields.map(([h,c])=>`${h}\n${c}`).join('\n\n'),createdAt:now,updatedAt:now,status:'draft'});
 current.updatedAt=now;rows[index]=current;write(rows);notify(`${type==='social'?'Social post':type==='reel'?'Reel script':'Prayer'} saved to this resource`);
 window.dispatchEvent(new CustomEvent('dm-resource-output-saved',{detail:{resourceId:current.id,type}}));
}
function open(resource,index,type){
 if(!['social','reel','prayer'].includes(type)){notify('This output arrives in the next Resource Hub build.');return}
 const data=generate(resource,type);$('#dmResourceOutputModal')?.remove();
 const wrap=document.createElement('div');wrap.id='dmResourceOutputModal';wrap.className='dm-capture-modal';
 wrap.innerHTML=`<div class="dm-capture-dialog dm-output-studio-dialog"><div class="dm-output-head"><div><small>Build 1.23.1 · Resource Output Studio</small><h2>${type==='social'?'📱':type==='reel'?'🎬':'🙏'} ${esc(data.title)}</h2><p>Generated from <b>${esc(resource.title||'saved resource')}</b>. Everything remains editable.</p></div><button class="ghost" id="dmOutputClose">×</button></div><label>Title<input id="dmOutputTitle" value="${esc(data.title)}"></label><div id="dmOutputFields">${data.fields.map(([h,c],i)=>`<article class="dm-output-field"><label>Section<input class="dm-output-heading" value="${esc(h)}"></label><label>Content<textarea class="dm-output-content" rows="${type==='reel'?5:7}">${esc(c)}</textarea></label></article>`).join('')}</div><div class="dm-output-actions"><button class="primary" id="dmOutputSave">💾 Save Output</button><button class="ghost" id="dmOutputCopy">📋 Copy</button>${type==='social'?'<button class="ghost" id="dmOutputSend">📱 Send to Social Studio</button>':type==='reel'?'<button class="ghost" id="dmOutputSend">🎬 Send to Reel Creator</button>':''}</div></div>`;
 document.body.appendChild(wrap);
 const capture=()=>({title:$('#dmOutputTitle').value.trim(),fields:[...wrap.querySelectorAll('.dm-output-field')].map(x=>[x.querySelector('.dm-output-heading').value.trim()||'Section',x.querySelector('.dm-output-content').value.trim()])});
 $('#dmOutputClose').onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
 $('#dmOutputSave').onclick=()=>{const edited=capture();saveOutput(resource,index,type,edited);wrap.remove()};
 $('#dmOutputCopy').onclick=()=>{const edited=capture(),text=[edited.title,...edited.fields.flatMap(x=>x)].join('\n\n');navigator.clipboard?.writeText(text).then(()=>notify('Output copied')).catch(()=>notify('Copy failed'))};
 const send=$('#dmOutputSend');if(send)send.onclick=()=>{const edited=capture();saveOutput(resource,index,type,edited);if(type==='social'){localStorage.setItem('dm_aiCreatorShareDraft',JSON.stringify({title:edited.title,type:'social',body:edited.fields.map(x=>x.join('\n')).join('\n\n'),sections:edited.fields.map(([heading,content])=>({heading,content})),reference:resource.reference,topic:resource.topic,audience:resource.audience,language:resource.language}));location.hash='socialstudio'}else{localStorage.setItem('dm_resourceHubReelDraft',JSON.stringify({title:edited.title,fields:edited.fields,reference:resource.reference,topic:resource.topic,language:resource.language}));location.hash='reelcreator'};wrap.remove()};
}
function addStyles(){if($('#dmOutputStudioStyles'))return;const s=document.createElement('style');s.id='dmOutputStudioStyles';s.textContent=`.dm-output-studio-dialog{max-width:780px;max-height:90vh;overflow:auto}.dm-output-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.dm-output-head h2{margin:.25rem 0}.dm-output-field{padding:12px;border:1px solid var(--border,#d7dedb);border-radius:12px;margin:10px 0}.dm-output-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}@media(max-width:600px){.dm-output-actions>*{flex:1 1 100%}}`;document.head.appendChild(s)}
addStyles();window.DM_RESOURCE_OUTPUTS={open};
})();