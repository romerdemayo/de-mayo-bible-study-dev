/* De Mayo Bible Studies - Build 1.24.0 Resource Output Library */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const $=s=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const ICONS={social:'📱',reel:'🎬',presentation:'📊',handout:'📄',prayer:'🙏',kids:'🧒',smallgroup:'👥'};
const LABELS={social:'Social Post',reel:'Reel Script',presentation:'Presentation',handout:'Handout',prayer:'Prayer',kids:'Kids Lesson',smallgroup:'Small Group Guide'};
function read(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function write(v){localStorage.setItem(RESOURCE_KEY,JSON.stringify(v))}
function notify(m){window.toast?.(m)}
function resourceIndexByCard(card){
 const title=(card.querySelector('h3')?.textContent||'').trim().toLowerCase();
 const rows=read();let index=rows.findIndex(x=>String(x.title||'').trim().toLowerCase()===title);
 if(index<0)index=rows.findIndex(x=>title.includes(String(x.title||'').trim().toLowerCase())||String(x.title||'').trim().toLowerCase().includes(title));
 return index;
}
function fieldsOf(output){
 if(Array.isArray(output.fields))return output.fields.map(f=>Array.isArray(f)?{heading:f[0],content:f[1]}:f);
 return [{heading:'Content',content:output.body||''}];
}
function outputText(output){return [output.title,...fieldsOf(output).flatMap(f=>[f.heading,f.content])].filter(Boolean).join('\n\n')}
function saveEdit(resourceIndex,outputIndex,data){
 const rows=read(),resource=rows[resourceIndex];if(!resource||!Array.isArray(resource.outputs)||!resource.outputs[outputIndex])return;
 const current=resource.outputs[outputIndex];current.title=data.title;current.fields=data.fields;current.body=data.fields.map(f=>`${f.heading}\n${f.content}`).join('\n\n');current.updatedAt=Date.now();
 resource.updatedAt=Date.now();rows[resourceIndex]=resource;write(rows);notify('Output updated');window.dispatchEvent(new Event('dm-resource-output-saved'));
}
function removeOutput(resourceIndex,outputIndex){
 const rows=read(),resource=rows[resourceIndex];if(!resource||!Array.isArray(resource.outputs))return;
 resource.outputs.splice(outputIndex,1);resource.updatedAt=Date.now();rows[resourceIndex]=resource;write(rows);notify('Output deleted');window.dispatchEvent(new Event('dm-resource-output-saved'));
}
function openEditor(resourceIndex,outputIndex){
 const rows=read(),resource=rows[resourceIndex],output=resource?.outputs?.[outputIndex];if(!output)return;
 $('#dmOutputLibraryModal')?.remove();
 const wrap=document.createElement('div');wrap.id='dmOutputLibraryModal';wrap.className='dm-capture-modal';
 const fields=fieldsOf(output);
 wrap.innerHTML=`<div class="dm-capture-dialog dm-output-library-dialog"><div class="dm-output-library-head"><div><small>${ICONS[output.type]||'📄'} ${esc(LABELS[output.type]||output.type||'Output')} · ${new Date(output.createdAt||Date.now()).toLocaleString()}</small><h2>${esc(output.title||'Saved output')}</h2><p>Linked to <b>${esc(resource.title||'saved resource')}</b>.</p></div><button class="ghost" id="dmOutputLibraryClose">×</button></div><label>Title<input id="dmOutputLibraryTitle" value="${esc(output.title||'')}"></label><div id="dmOutputLibraryFields">${fields.map(f=>`<article class="dm-output-field"><label>Section<input class="dm-output-library-heading" value="${esc(f.heading||'Section')}"></label><label>Content<textarea class="dm-output-library-content" rows="7">${esc(f.content||'')}</textarea></label></article>`).join('')}</div><div class="dm-output-actions"><button class="primary" id="dmOutputLibrarySave">💾 Save Changes</button><button class="ghost" id="dmOutputLibraryCopy">📋 Copy</button><button class="danger" id="dmOutputLibraryDelete">🗑 Delete</button></div></div>`;
 document.body.appendChild(wrap);
 const capture=()=>({title:$('#dmOutputLibraryTitle').value.trim(),fields:[...wrap.querySelectorAll('.dm-output-field')].map(x=>({heading:x.querySelector('.dm-output-library-heading').value.trim()||'Section',content:x.querySelector('.dm-output-library-content').value.trim()}))});
 $('#dmOutputLibraryClose').onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
 $('#dmOutputLibrarySave').onclick=()=>{saveEdit(resourceIndex,outputIndex,capture());wrap.remove()};
 $('#dmOutputLibraryCopy').onclick=()=>navigator.clipboard?.writeText(outputText({...output,...capture()})).then(()=>notify('Output copied')).catch(()=>notify('Copy failed'));
 $('#dmOutputLibraryDelete').onclick=()=>{if(!confirm('Delete this saved output? The original resource will remain.'))return;removeOutput(resourceIndex,outputIndex);wrap.remove()};
}
function renderForCard(card){
 const resourceIndex=resourceIndexByCard(card);if(resourceIndex<0)return;
 const resource=read()[resourceIndex],outputs=Array.isArray(resource.outputs)?resource.outputs:[];
 let details=card.querySelector('.dm-output-library');if(details)details.remove();
 details=document.createElement('details');details.className='dm-output-library';
 details.innerHTML=`<summary>Saved Outputs <span>${outputs.length}</span></summary><div class="dm-output-library-list">${outputs.length?outputs.map((o,i)=>`<article><div><small>${ICONS[o.type]||'📄'} ${esc(LABELS[o.type]||o.type||'Output')} · ${new Date(o.createdAt||Date.now()).toLocaleDateString()}</small><b>${esc(o.title||'Untitled output')}</b></div><div class="dm-output-library-actions"><button class="ghost" data-output-open="${i}">Open</button><button class="ghost" data-output-copy="${i}">Copy</button><button class="danger" data-output-delete="${i}">Delete</button></div></article>`).join(''):'<p class="dm-ai-note">No saved outputs yet. Use Create Output to make one.</p>'}</div>`;
 const hub=card.querySelector('.dm-resource-hub');(hub||card).appendChild(details);
 details.querySelectorAll('[data-output-open]').forEach(b=>b.onclick=e=>{e.preventDefault();openEditor(resourceIndex,+b.dataset.outputOpen)});
 details.querySelectorAll('[data-output-copy]').forEach(b=>b.onclick=e=>{e.preventDefault();const o=read()[resourceIndex]?.outputs?.[+b.dataset.outputCopy];if(o)navigator.clipboard?.writeText(outputText(o)).then(()=>notify('Output copied')).catch(()=>notify('Copy failed'))});
 details.querySelectorAll('[data-output-delete]').forEach(b=>b.onclick=e=>{e.preventDefault();if(!confirm('Delete this saved output?'))return;removeOutput(resourceIndex,+b.dataset.outputDelete)});
}
function addStyles(){if($('#dmOutputLibraryStyles'))return;const s=document.createElement('style');s.id='dmOutputLibraryStyles';s.textContent=`.dm-output-library{margin-top:14px;border-top:1px solid var(--border,#d7dedb);padding-top:10px}.dm-output-library summary{cursor:pointer;font-weight:700;display:flex;justify-content:space-between}.dm-output-library-list{display:grid;gap:8px;margin-top:10px}.dm-output-library-list article{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid var(--border,#d7dedb);border-radius:12px;padding:10px}.dm-output-library-list article div:first-child{display:grid;gap:3px}.dm-output-library-actions{display:flex;gap:6px;flex-wrap:wrap}.dm-output-library-dialog{max-width:780px;max-height:90vh;overflow:auto}.dm-output-library-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}@media(max-width:600px){.dm-output-library-list article{align-items:stretch;flex-direction:column}.dm-output-library-actions>*{flex:1 1 auto}}`;document.head.appendChild(s)}
function enhance(){if(location.hash!=='#mylibrary')return;addStyles();document.querySelectorAll('.dm-resource-hub-card').forEach(renderForCard)}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(enhance,70)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('dm-resource-output-saved',schedule);document.addEventListener('click',e=>{if(e.target.closest('#dmMyLibraryNav,#dmAiLibrary'))schedule()});
})();
