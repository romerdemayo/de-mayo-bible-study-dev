/* De Mayo Bible Studies - Build 1.22.3 Presentation + Printable Handout */
(function(){
'use strict';
const PACK_KEY='dm_ministryPacks';
const $=s=>document.querySelector(s);
function read(){try{const x=JSON.parse(localStorage.getItem(PACK_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function write(v){localStorage.setItem(PACK_KEY,JSON.stringify(v))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function text(s=''){return String(s||'').trim()}
function notify(m){window.toast?.(m)}
function findPack(id){return read().find(x=>x.id===id)}
function savePack(pack){const all=read(),i=all.findIndex(x=>x.id===pack.id);if(i<0)return;pack.updatedAt=Date.now();all[i]=pack;write(all)}
function scriptureBlock(pack){
 const sourceSections=pack.source?.sections||[];
 const hit=sourceSections.find(s=>/selected scripture|talata sa bibliya|napiling kasulatan/i.test(s.heading||''));
 return text(hit?.content)||text(pack.scripture)||'Selected Scripture';
}
function sourceSections(pack){return (pack.source?.sections||[]).filter(s=>text(s.content));}
function reflectionText(pack){const rows=sourceSections(pack);const hit=rows.find(s=>/reflection|pagninilay|introduction|panimula|main message|pangunahing mensahe/i.test(s.heading||''));return text(hit?.content)||text(pack.source?.body).slice(0,1000)||`Explore ${pack.theme} through ${pack.scripture}.`}
function applicationText(pack){const rows=sourceSections(pack);const hit=rows.find(s=>/application|aplikasyon|challenge|hamon|action plan|plano/i.test(s.heading||''));return text(hit?.content)||'Choose one truth to believe and one faithful action to take this week.'}
function prayerText(pack){const rows=sourceSections(pack);const hit=rows.find(s=>/prayer|panalangin/i.test(s.heading||''));return text(hit?.content)||'Lord, help us understand and live out Your Word through Jesus Christ. Amen.'}
function labels(lang){
 if(lang==='Tagalog')return {title:'Pamagat',scripture:'Napiling Kasulatan',truth:'Pangunahing Katotohanan',reflection:'Pagninilay',application:'Aplikasyon',questions:'Mga Tanong',prayer:'Panalangin',notes:'Mga Tala ng Tagapagsalita',handout:'Printable na Handout'};
 if(lang==='Bilingual')return {title:'Title / Pamagat',scripture:'Selected Scripture / Napiling Kasulatan',truth:'Main Truth / Pangunahing Katotohanan',reflection:'Reflection / Pagninilay',application:'Application / Aplikasyon',questions:'Questions / Mga Tanong',prayer:'Prayer / Panalangin',notes:'Speaker Notes / Mga Tala',handout:'Printable Handout / Handout'};
 return {title:'Title',scripture:'Selected Scripture',truth:'Main Truth',reflection:'Reflection',application:'Application',questions:'Discussion Questions',prayer:'Prayer',notes:'Speaker Notes',handout:'Printable Handout'};
}
function createPresentation(pack){
 const l=labels(pack.language),scripture=scriptureBlock(pack),reflection=reflectionText(pack),application=applicationText(pack),prayer=prayerText(pack);
 const slides=[
  {title:pack.title,content:`${pack.theme}\n${pack.audience}`,notes:`Introduce the theme and explain why it matters for ${pack.audience}.`},
  {title:l.scripture,content:scripture,notes:'Read the Scripture slowly. Encourage listeners to notice the key words and context.'},
  {title:l.truth,content:reflection,notes:'Explain the main meaning of the selected passage without removing it from its biblical context.'},
  {title:l.application,content:application,notes:'Invite one clear personal and one shared response.'},
  {title:l.questions,content:'1. What stands out in the passage?\n2. What belief or action is being challenged?\n3. What faithful step should follow?',notes:'Allow time for reflection or group discussion.'},
  {title:l.prayer,content:prayer,notes:'Close by praying directly from the truth and application of the passage.'}
 ];
 if(String(pack.source?.body||'').length>2500)slides.splice(4,0,{title:l.reflection,content:text(pack.source.body).slice(0,1200),notes:'Use this slide only if more explanation is needed.'});
 return {title:pack.title,language:pack.language,audience:pack.audience,scripture,slides,createdAt:Date.now(),updatedAt:Date.now()};
}
function createHandout(pack){
 const l=labels(pack.language);
 return {title:pack.title,subtitle:`${pack.theme} · ${pack.audience}`,language:pack.language,scripture:scriptureBlock(pack),sections:[
  {heading:l.reflection,content:reflectionText(pack)},
  {heading:l.application,content:applicationText(pack)},
  {heading:l.questions,content:'1. What does this passage reveal about God?\n2. What does it reveal about us?\n3. What will I do differently this week?'},
  {heading:l.prayer,content:prayerText(pack)},
  {heading:l.notes,content:'\n\n\n'}
 ],createdAt:Date.now(),updatedAt:Date.now()};
}
function updateOutput(pack,key,data){
 pack.generated=pack.generated||{};pack.generated[key]=data;pack.outputs=pack.outputs||{};pack.outputs[key]={...(pack.outputs[key]||{}),status:'draft',resourceId:`${pack.id}-${key}`,updatedAt:Date.now()};
 savePack(pack);notify(`${key==='presentation'?'Presentation':'Handout'} created and linked to this Ministry Pack.`)
}
function modal(title,body){let w=$('#dm1223Modal');if(!w){w=document.createElement('div');w.id='dm1223Modal';w.className='dm-pack-modal';document.body.appendChild(w)}w.innerHTML=`<div class="dm-pack-dialog dm1223-dialog"><div class="dm-pack-head"><div><span class="dm-library-badge">Build 1.22.3</span><h2>${esc(title)}</h2></div><button class="ghost" id="dm1223Close">×</button></div>${body}</div>`;$('#dm1223Close').onclick=()=>w.remove();w.onclick=e=>{if(e.target===w)w.remove()};return w}
function showPresentation(pack){
 const p=pack.generated?.presentation||createPresentation(pack);if(!pack.generated?.presentation)updateOutput(pack,'presentation',p);
 const w=modal('📊 Presentation Outline',`<p>${esc(p.slides.length)} slides · ${esc(pack.language)} · ${esc(pack.audience)}</p><div class="dm1223-slides">${p.slides.map((s,i)=>`<article class="card"><label>Slide ${i+1} title<input data-slide-title="${i}" value="${esc(s.title)}"></label><label>Slide content<textarea data-slide-content="${i}" rows="5">${esc(s.content)}</textarea></label><details><summary>Speaker notes</summary><textarea data-slide-notes="${i}" rows="4">${esc(s.notes||'')}</textarea></details></article>`).join('')}</div><div class="dm-pack-actions"><button class="primary" id="dm1223SavePresentation">💾 Save presentation outline</button><button class="ghost" id="dm1223CopyPresentation">📋 Copy outline</button></div>`);
 $('#dm1223SavePresentation').onclick=()=>{p.slides=p.slides.map((s,i)=>({...s,title:w.querySelector(`[data-slide-title="${i}"]`).value.trim(),content:w.querySelector(`[data-slide-content="${i}"]`).value.trim(),notes:w.querySelector(`[data-slide-notes="${i}"]`).value.trim()}));p.updatedAt=Date.now();updateOutput(pack,'presentation',p);pack.outputs.presentation.status='complete';savePack(pack);notify('Presentation outline saved as complete.')};
 $('#dm1223CopyPresentation').onclick=()=>{const out=p.slides.map((s,i)=>`SLIDE ${i+1}: ${s.title}\n${s.content}\n\nSPEAKER NOTES\n${s.notes||''}`).join('\n\n----------------\n\n');navigator.clipboard?.writeText(out).then(()=>notify('Presentation outline copied.'))}
}
function handoutHtml(pack,h){return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(h.title)}</title><style>body{font-family:Arial,sans-serif;max-width:820px;margin:36px auto;padding:0 24px;color:#1f2d29;line-height:1.55}h1{margin-bottom:4px}h2{margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:6px}.scripture{background:#f4f6f3;border-left:5px solid #2f745f;padding:18px;white-space:pre-wrap}.section{white-space:pre-wrap}.meta{color:#596762}.footer{margin-top:40px;font-size:12px;color:#666}@media print{button{display:none}body{margin:0;max-width:none}}</style></head><body><button onclick="window.print()">Print / Save as PDF</button><h1>${esc(h.title)}</h1><p class="meta">${esc(h.subtitle)}</p><h2>${esc(labels(pack.language).scripture)}</h2><div class="scripture">${esc(h.scripture)}</div>${h.sections.map(s=>`<h2>${esc(s.heading)}</h2><div class="section">${esc(s.content)}</div>`).join('')}<div class="footer">De Mayo Bible Studies · Ministry Pack</div></body></html>`}
function showHandout(pack){
 const h=pack.generated?.handout||createHandout(pack);if(!pack.generated?.handout)updateOutput(pack,'handout',h);
 const w=modal('📄 Printable Handout',`<label>Title<input id="dm1223HandoutTitle" value="${esc(h.title)}"></label><label>Subtitle<input id="dm1223HandoutSubtitle" value="${esc(h.subtitle)}"></label><label>${esc(labels(pack.language).scripture)}<textarea id="dm1223HandoutScripture" rows="6">${esc(h.scripture)}</textarea></label><div>${h.sections.map((s,i)=>`<article class="card"><label>Heading<input data-handout-heading="${i}" value="${esc(s.heading)}"></label><label>Content<textarea data-handout-content="${i}" rows="5">${esc(s.content)}</textarea></label></article>`).join('')}</div><div class="dm-pack-actions"><button class="primary" id="dm1223PrintHandout">🖨 Print / Save PDF</button><button class="ghost" id="dm1223SaveHandout">💾 Save handout</button></div>`);
 function capture(){h.title=$('#dm1223HandoutTitle').value.trim();h.subtitle=$('#dm1223HandoutSubtitle').value.trim();h.scripture=$('#dm1223HandoutScripture').value.trim();h.sections=h.sections.map((s,i)=>({...s,heading:w.querySelector(`[data-handout-heading="${i}"]`).value.trim(),content:w.querySelector(`[data-handout-content="${i}"]`).value}));h.updatedAt=Date.now()}
 $('#dm1223SaveHandout').onclick=()=>{capture();updateOutput(pack,'handout',h);notify('Handout saved as draft.')};
 $('#dm1223PrintHandout').onclick=()=>{capture();updateOutput(pack,'handout',h);pack.outputs.handout.status='complete';savePack(pack);const win=window.open('','_blank');if(!win)return notify('Allow pop-ups to open the printable handout.');win.document.open();win.document.write(handoutHtml(pack,h));win.document.close();setTimeout(()=>win.focus(),100)}
}
function enhancePackModal(){
 const dialog=$('#dmMinistryPackModal .dm-pack-dialog');if(!dialog||$('#dm1223PackActions'))return;
 const packId=[...document.querySelectorAll('[data-dm-open-pack]')].find(b=>b.dataset.activePack)?.dataset.dmOpenPack||null;
 const title=$('#dmPackTitle')?.value;const pack=read().find(x=>x.title===title)||read().find(x=>x.id===sessionStorage.getItem('dm_active_pack'));
 if(!pack)return;
 sessionStorage.setItem('dm_active_pack',pack.id);
 const box=document.createElement('section');box.id='dm1223PackActions';box.className='card';box.innerHTML=`<div class="dm-pack-status-head"><div><span class="dm-library-badge">ONE-CLICK OUTPUTS</span><h3>Build 1.22.3</h3><p>Create connected presentation and handout outputs from this Ministry Pack.</p></div></div><div class="dm-pack-actions"><button class="primary" id="dmCreatePresentation">📊 Create presentation</button><button class="ghost" id="dmCreateHandout">📄 Create printable handout</button></div>`;
 const actions=dialog.querySelector('.dm-pack-actions');dialog.insertBefore(box,actions||null);
 $('#dmCreatePresentation').onclick=()=>showPresentation(pack);$('#dmCreateHandout').onclick=()=>showHandout(pack)
}
document.addEventListener('click',e=>{const open=e.target.closest('[data-dm-open-pack],[data-dm-create-pack]');if(open)setTimeout(enhancePackModal,100);if(e.target.closest('#dmPackSave,#dmPackNewVersion'))setTimeout(enhancePackModal,100)});
window.addEventListener('load',()=>setTimeout(enhancePackModal,200));
})();