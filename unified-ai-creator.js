/* De Mayo Bible Studies - Unified editable AI-assisted creator */
(function(){
'use strict';
const $=s=>document.querySelector(s),KEY='dm_unifiedCreatorResources';
const TYPES={prayer:{icon:'🙏',label:'Prayer'},devotional:{icon:'🌅',label:'Devotional'},study:{icon:'📚',label:'Bible Study'},social:{icon:'📱',label:'Social Post'}};
let state={type:'prayer',topic:'Faith in difficult times',reference:'',title:'',body:''};
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v));}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function notify(m){if(typeof window.toast==='function')window.toast(m)}
function routeTo(page){if(typeof window.route==='function')window.route(page);else location.hash=page}
function currentReference(){return state.reference.trim()||'Selected Scripture';}
function generate(){
 const topic=state.topic.trim()||'Faith';const ref=currentReference();const t=state.type;
 if(t==='prayer'){
  state.title=`Prayer for ${topic}`;
  state.body=`Heavenly Father,\n\nThank You that Your Word speaks into ${topic.toLowerCase()}. As I reflect on ${ref}, help me trust Your character, obey Your guidance, and respond with faith. Search my heart, strengthen what is weak, and shape my choices so they honour Jesus Christ.\n\nGive me wisdom for today, patience in uncertainty, courage to do what is right, and compassion for others who may be walking through similar struggles. Let Your peace guard my heart and mind.\n\nIn Jesus’ name, Amen.`;
 }else if(t==='devotional'){
  state.title=`Hope for Today: ${topic}`;
  state.body=`MAIN SCRIPTURE\n${ref}\n\nREFLECTION\n${topic} invites us to look beyond our immediate circumstances and remember who God is. Scripture does not deny difficulty; it calls us to trust God within it. As you read ${ref}, notice what the passage reveals about God, what it asks of you, and what promise or truth you can carry into today.\n\nPERSONAL APPLICATION\n1. Name one concern you need to surrender to God.\n2. Choose one practical act of faith or obedience today.\n3. Encourage one person with the truth of this passage.\n\nREFLECTION QUESTION\nWhat would change today if I truly believed God is present and trustworthy?\n\nCLOSING PRAYER\nLord, help me live out the truth of ${ref}. Give me faith, wisdom, and courage today. Amen.`;
 }else if(t==='study'){
  state.title=`Bible Study: ${topic}`;
  state.body=`TITLE\n${state.title}\n\nMAIN PASSAGE\n${ref}\n\nPURPOSE\nTo understand what Scripture teaches about ${topic.toLowerCase()} and apply it faithfully.\n\nOPENING QUESTION\nWhen do people find it hardest to trust God in this area?\n\nKEY OBSERVATIONS\n1. What does the passage reveal about God?\n2. What command, warning, promise, or example appears in the text?\n3. How does this passage point us toward Christlike faith and obedience?\n\nDISCUSSION QUESTIONS\n1. Which phrase in ${ref} stands out most, and why?\n2. What false belief does this passage correct?\n3. What practical response should follow this week?\n\nSUGGESTED ANSWERS\nAnswers should remain grounded in the passage, recognise God’s character, and lead to a specific faithful response rather than vague inspiration.\n\nAPPLICATION\nWrite one action you will take, one prayer you will pray, and one person you will encourage.\n\nCLOSING PRAYER\nAsk God for understanding, obedience, and lasting transformation through His Word.`;
 }else{
  state.title=`Social Post: ${topic}`;
  state.body=`${topic}\n\n${ref}\n\nGod’s Word reminds us that our circumstances do not have the final word. We can bring our fears, questions, and hopes to Him, then take the next faithful step with courage.\n\nWhat truth from Scripture are you holding onto today?\n\n#BibleVerse #Faith #ChristianEncouragement #DeMayoBibleStudies`;
 }
 sync();notify('Editable draft generated');
}
function sync(){
 const title=$('#dmAiTitle'),body=$('#dmAiBody'),topic=$('#dmAiTopic'),ref=$('#dmAiReference');
 if(title)title.value=state.title;if(body)body.value=state.body;if(topic)topic.value=state.topic;if(ref)ref.value=state.reference;
 document.querySelectorAll('[data-dm-ai-type]').forEach(b=>b.classList.toggle('is-active',b.dataset.dmAiType===state.type));
}
function transform(kind){
 let text=state.body.trim();if(!text)return notify('Generate or write content first.');
 if(kind==='shorter')text=text.split(/\n\n/).slice(0,Math.max(2,Math.ceil(text.split(/\n\n/).length*.65))).join('\n\n');
 if(kind==='deeper')text+=`\n\nDEEPER REFLECTION\nConsider the wider biblical context, the character of God revealed here, and how the passage challenges both belief and behaviour.`;
 if(kind==='simple')text=text.replace(/circumstances/g,'situation').replace(/transformation/g,'change').replace(/faithfully/g,'with faith').replace(/obedience/g,'doing what God says');
 if(kind==='scripture')text+=`\n\nSUPPORTING SCRIPTURES\nPsalm 46:1 · Proverbs 3:5–6 · Philippians 4:6–7 · Romans 8:28`;
 state.body=text;sync();notify('Draft updated');
}
function save(){
 state.title=$('#dmAiTitle').value.trim();state.body=$('#dmAiBody').value.trim();state.topic=$('#dmAiTopic').value.trim();state.reference=$('#dmAiReference').value.trim();
 if(!state.title||!state.body)return notify('Add a title and content first.');
 const arr=read();arr.unshift({id:Date.now(),...state,updatedAt:Date.now(),status:'draft'});write(arr.slice(0,200));notify('Saved to My Library');renderSaved();
}
function copy(){navigator.clipboard?.writeText(`${state.title}\n\n${state.body}`).then(()=>notify('Copied')).catch(()=>notify('Copy failed'))}
function renderSaved(){const box=$('#dmAiSaved');if(!box)return;const rows=read().slice(0,8);box.innerHTML=rows.length?rows.map((x,i)=>`<article><small>${TYPES[x.type]?.icon||'✨'} ${TYPES[x.type]?.label||x.type}</small><h4>${esc(x.title)}</h4><p>${esc(String(x.body).slice(0,140))}</p><div class="dm-ai-actions"><button class="ghost" data-ai-load="${i}">Edit</button><button class="ghost" data-ai-delete="${i}">Delete</button></div></article>`).join(''):'<p class="dm-ai-note">No saved AI-assisted drafts yet.</p>';
 box.querySelectorAll('[data-ai-load]').forEach(b=>b.onclick=()=>{const x=read()[+b.dataset.aiLoad];if(x){state={type:x.type,topic:x.topic,reference:x.reference,title:x.title,body:x.body};sync();window.scrollTo({top:0,behavior:'smooth'})}});
 box.querySelectorAll('[data-ai-delete]').forEach(b=>b.onclick=()=>{const arr=read();arr.splice(+b.dataset.aiDelete,1);write(arr);renderSaved()});
}
function render(){const view=$('#view');if(!view)return;$('#pageTitle').textContent='Unified AI Creator';$('#pageSub').textContent='AI prepares the draft. You edit, approve, save, and share.';
 view.innerHTML=`<section class="dm-ai-shell"><article class="card dm-ai-hero"><div><span class="dm-library-badge">AI prepares · You approve</span><h2>✨ Unified AI Creator</h2><p>Create an editable first draft from a topic or Scripture. Nothing is locked, and nothing is shared until you choose.</p></div><button class="ghost" id="dmAiLibrary">📚 My Library</button></article><section class="dm-ai-grid"><article class="card dm-ai-controls"><h3>1. Choose what to create</h3><div class="dm-ai-type-grid">${Object.entries(TYPES).map(([k,v])=>`<button class="dm-ai-type ${k===state.type?'is-active':''}" data-dm-ai-type="${k}">${v.icon} <b>${v.label}</b></button>`).join('')}</div><label>Topic or purpose<input id="dmAiTopic" value="${esc(state.topic)}" placeholder="Faith, forgiveness, healing…"></label><label>Scripture reference<input id="dmAiReference" value="${esc(state.reference)}" placeholder="Romans 8:28"></label><button class="primary" id="dmAiGenerate">✨ Generate editable draft</button><p class="dm-ai-note">This free DEV version uses built-in ministry drafting templates. It does not send private content to an external AI service.</p></article><article class="card dm-ai-editor"><div class="dm-ai-toolbar"><h3>2. Edit your draft</h3><span class="dm-ai-status">Fully editable</span></div><label>Title<input id="dmAiTitle" value="${esc(state.title)}"></label><label>Content<textarea id="dmAiBody">${esc(state.body)}</textarea></label><div class="dm-ai-actions"><button class="ghost" data-ai-transform="shorter">Make shorter</button><button class="ghost" data-ai-transform="deeper">Make deeper</button><button class="ghost" data-ai-transform="simple">Simplify</button><button class="ghost" data-ai-transform="scripture">Add Scripture</button></div><div class="dm-ai-actions"><button class="primary" id="dmAiSave">💾 Save to My Library</button><button class="ghost" id="dmAiCopy">Copy</button><button class="ghost" id="dmAiSocial">Open Social Studio</button></div></article></section><article class="card"><h3>Recent editable drafts</h3><div id="dmAiSaved" class="dm-ai-saved"></div></article></section>`;
 document.querySelectorAll('[data-dm-ai-type]').forEach(b=>b.onclick=()=>{state.type=b.dataset.dmAiType;sync()});
 $('#dmAiGenerate').onclick=()=>{state.topic=$('#dmAiTopic').value;state.reference=$('#dmAiReference').value;generate()};
 $('#dmAiTitle').oninput=e=>state.title=e.target.value;$('#dmAiBody').oninput=e=>state.body=e.target.value;$('#dmAiTopic').oninput=e=>state.topic=e.target.value;$('#dmAiReference').oninput=e=>state.reference=e.target.value;
 document.querySelectorAll('[data-ai-transform]').forEach(b=>b.onclick=()=>transform(b.dataset.aiTransform));$('#dmAiSave').onclick=save;$('#dmAiCopy').onclick=copy;$('#dmAiLibrary').onclick=()=>{location.hash='mylibrary'};$('#dmAiSocial').onclick=()=>routeTo('socialstudio');renderSaved();
}
function install(){const nav=$('#nav');if(nav&&!$('#dmUnifiedAiNav')){const b=document.createElement('button');b.id='dmUnifiedAiNav';b.textContent='✨ Unified AI Creator';b.onclick=()=>{location.hash='aicreator';render()};nav.prepend(b)}if(location.hash==='#aicreator')render()}
window.addEventListener('hashchange',()=>{if(location.hash==='#aicreator')render()});window.addEventListener('load',install);new MutationObserver(()=>{const nav=$('#nav');if(nav&&!$('#dmUnifiedAiNav'))install()}).observe(document.documentElement,{childList:true,subtree:true});
})();
