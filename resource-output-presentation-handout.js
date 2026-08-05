/* De Mayo Bible Studies - Build 1.23.2 Presentation + Handout Outputs */
(function(){
'use strict';
const RESOURCE_KEY='dm_unifiedCreatorResources';
const $=s=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(){try{const v=JSON.parse(localStorage.getItem(RESOURCE_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function write(v){localStorage.setItem(RESOURCE_KEY,JSON.stringify(v))}
function notify(m){window.toast?.(m)}
function find(resource,re){return (resource.sections||[]).find(s=>re.test(String(s.heading||'')))?.content||''}
function scripture(resource){return find(resource,/selected scripture|talata sa bibliya|napiling kasulatan/i)||resource.reference||'Selected Scripture'}
function reflection(resource){return find(resource,/reflection|pagninilay|main message|pangunahing mensahe|introduction|panimula/i)||(resource.sections?.[1]?.content||resource.body||'').slice(0,1200)}
function application(resource){return find(resource,/application|aplikasyon|challenge|hamon|action plan|plano/i)||'Choose one faithful action to practise this week.'}
function prayer(resource){return find(resource,/closing prayer|pangwakas na panalangin|prayer|panalangin/i)||'Lord, help us understand, believe, and obey Your Word through Jesus Christ. Amen.'}
function questions(resource){return find(resource,/discussion questions|mga tanong|reflection question|tanong sa pagninilay/i)||'1. What stands out in this passage?\n2. What does it reveal about God?\n3. What faithful response should follow?'}
function language(resource){return resource.language||'English'}
function pair(en,tl,lang){return lang==='Tagalog'?tl:lang==='Bilingual'?`${en}\n\nTAGALOG\n${tl}`:en}
function presentation(resource){
 const l=language(resource),title=resource.title||resource.topic||'Ministry Presentation',topic=resource.topic||title;
 return {title:pair(`Presentation: ${title}`,`Presentasyon: ${title}`,l),fields:[
  ['Slide 1 · Title',title],
  ['Slide 2 · Selected Scripture',scripture(resource)],
  ['Slide 3 · Main Truth',reflection(resource)],
  ['Slide 4 · Application',application(resource)],
  ['Slide 5 · Discussion',questions(resource)],
  ['Slide 6 · Prayer',prayer(resource)],
  ['Speaker Notes',pair(`Introduce the theme of ${topic}. Read the full selected Scripture slowly, explain the main truth in context, invite practical response, allow time for discussion, and close in prayer.`,`Ipakilala ang paksa na ${topic}. Basahin nang malinaw ang buong napiling Kasulatan, ipaliwanag ang pangunahing katotohanan ayon sa konteksto, anyayahan ang praktikal na tugon, maglaan ng oras sa talakayan, at magtapos sa panalangin.`,l)]
 ]};
}
function handout(resource){
 const l=language(resource),title=resource.title||resource.topic||'Bible Study Handout';
 return {title:pair(`Handout: ${title}`,`Handout: ${title}`,l),fields:[
  [pair('Theme and Audience','Paksa at Tagapakinig',l),`${resource.topic||title}\n${resource.audience||'Personal'}`],
  [pair('Selected Scripture','Napiling Kasulatan',l),scripture(resource)],
  [pair('Reflection','Pagninilay',l),reflection(resource)],
  [pair('Application','Aplikasyon',l),application(resource)],
  [pair('Discussion Questions','Mga Tanong sa Talakayan',l),questions(resource)],
  [pair('Prayer','Panalangin',l),prayer(resource)],
  [pair('Personal Notes','Personal na Tala',l),'\n\n\n\n']
 ]};
}
function save(resource,index,type,data){
 const rows=read(),current=rows[index];if(!current)return;
 current.outputs=Array.isArray(current.outputs)?current.outputs:[];const now=Date.now();
 current.outputs.unshift({id:`${type}-${now}-${Math.random().toString(36).slice(2,6)}`,type,title:data.title,fields:data.fields.map(([heading,content])=>({heading,content})),body:data.fields.map(([h,c])=>`${h}\n${c}`).join('\n\n'),createdAt:now,updatedAt:now,status:'draft'});
 current.updatedAt=now;rows[index]=current;write(rows);notify(`${type==='presentation'?'Presentation':'Handout'} saved to this resource`);
 window.dispatchEvent(new CustomEvent('dm-resource-output-saved',{detail:{resourceId:current.id,type}}));
}
function printHandout(data){
 const w=window.open('','_blank');if(!w){notify('Allow pop-ups to print the handout.');return}
 const sections=data.fields.map(([h,c])=>`<section><h2>${esc(h)}</h2><div>${esc(c).replace(/\n/g,'<br>')}</div></section>`).join('');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(data.title)}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:32px auto;padding:0 24px;color:#17211e}h1{border-bottom:3px solid #173f35;padding-bottom:12px}h2{font-size:18px;margin-top:24px}section{page-break-inside:avoid;line-height:1.55}@media print{body{margin:0;max-width:none}}</style></head><body><h1>${esc(data.title)}</h1>${sections}<script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();
}
function openEditor(resource,index,type){
 const data=type==='presentation'?presentation(resource):handout(resource);$('#dmResourceOutputModal')?.remove();
 const wrap=document.createElement('div');wrap.id='dmResourceOutputModal';wrap.className='dm-capture-modal';
 wrap.innerHTML=`<div class="dm-capture-dialog dm-output-studio-dialog"><div class="dm-output-head"><div><small>Build 1.23.2 · Resource Output Studio</small><h2>${type==='presentation'?'📊':'📄'} ${esc(data.title)}</h2><p>Generated directly from <b>${esc(resource.title||'saved resource')}</b>. Everything remains editable.</p></div><button class="ghost" id="dmOutputClose">×</button></div><label>Title<input id="dmOutputTitle" value="${esc(data.title)}"></label><div id="dmOutputFields">${data.fields.map(([h,c])=>`<article class="dm-output-field"><label>Section<input class="dm-output-heading" value="${esc(h)}"></label><label>Content<textarea class="dm-output-content" rows="7">${esc(c)}</textarea></label></article>`).join('')}</div><div class="dm-output-actions"><button class="primary" id="dmOutputSave">💾 Save Output</button><button class="ghost" id="dmOutputCopy">📋 Copy</button>${type==='handout'?'<button class="ghost" id="dmOutputPrint">🖨 Print / Save PDF</button>':''}</div></div>`;
 document.body.appendChild(wrap);
 const capture=()=>({title:$('#dmOutputTitle').value.trim(),fields:[...wrap.querySelectorAll('.dm-output-field')].map(x=>[x.querySelector('.dm-output-heading').value.trim()||'Section',x.querySelector('.dm-output-content').value.trim()])});
 $('#dmOutputClose').onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
 $('#dmOutputSave').onclick=()=>{save(resource,index,type,capture());wrap.remove()};
 $('#dmOutputCopy').onclick=()=>{const x=capture(),text=[x.title,...x.fields.flatMap(v=>v)].join('\n\n');navigator.clipboard?.writeText(text).then(()=>notify('Output copied')).catch(()=>notify('Copy failed'))};
 if(type==='handout')$('#dmOutputPrint').onclick=()=>printHandout(capture());
}
function install(){
 const previous=window.DM_RESOURCE_OUTPUTS?.open;
 window.DM_RESOURCE_OUTPUTS={...(window.DM_RESOURCE_OUTPUTS||{}),open(resource,index,type){
  if(type==='presentation'||type==='handout'){openEditor(resource,index,type);return}
  if(typeof previous==='function'){previous(resource,index,type);return}
  notify('Output Studio is still loading. Please try again.');
 }};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();