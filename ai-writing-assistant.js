/* De Mayo Bible Studies - Build 1.20 AI Writing Assistant */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let currentSection=null;
const SUPPORTING='\n\nSupporting Scripture: Psalm 46:1 — God is our refuge and strength, a very present help in trouble.';
const ACTIONS={
 improve:t=>t.replace(/\s+/g,' ').trim()+"\n\nThis truth invites a clear response of faith, obedience, and trust in God.",
 rewrite:t=>`In fresh words: ${t}`,
 expand:t=>`${t}\n\nTake a moment to consider what this reveals about God, what it exposes in us, and how it calls us to respond in Christlike faith.`,
 shorten:t=>t.split(/(?<=[.!?])\s+/).slice(0,2).join(' '),
 simplify:t=>t.replace(/circumstances/gi,'situation').replace(/transformation/gi,'change').replace(/obedience/gi,'doing what God says').replace(/faithfully/gi,'with faith'),
 scripture:t=>t+SUPPORTING,
 illustration:t=>`${t}\n\nIllustration: Like a lighthouse in a storm, God’s Word does not remove every wave, but it gives direction, safety, and hope.`,
 application:t=>`${t}\n\nApplication: Name one concern to surrender, one step of obedience to take, and one person to encourage this week.`,
 prayer:t=>`${t}\n\nPrayer: Lord, help us understand this truth, trust You fully, and live it out with courage and love. Amen.`,
 question:t=>`${t}\n\nDiscussion Question: What would change in your choices this week if you truly believed this passage?`,
 youth:t=>`Youth version: ${t}\n\nKeep it real: What pressure are young people facing here, and what faithful next step can they take today?`,
 children:t=>`Children’s version: ${t}\n\nBig idea: God is good, God is with us, and we can trust and obey Him.`,
 church:t=>`Church application: ${t}\n\nAs a church family, how can we practise this truth together?`,
 evangelism:t=>`${t}\n\nGospel connection: This points us to Jesus Christ, who meets our deepest need and calls us to faith and new life.`,
 tagalog:t=>`Tagalog draft guide:\n\n${t}\n\nPaki-edit ang bahaging ito sa natural na Tagalog bago gamitin o ibahagi.`,
 bilingual:t=>`ENGLISH\n${t}\n\nTAGALOG\nPaki-edit ang salin sa natural na Tagalog bago gamitin o ibahagi.`
};
function notify(m){if(typeof window.toast==='function')window.toast(m)}
function openSheet(section){currentSection=section;let sheet=$('#dmAiAssistantSheet');if(!sheet){sheet=document.createElement('div');sheet.id='dmAiAssistantSheet';sheet.className='dm-ai-assistant-sheet';sheet.innerHTML=`<button class="dm-ai-sheet-backdrop" aria-label="Close assistant"></button><section class="dm-ai-sheet-panel"><div class="dm-ai-sheet-handle"></div><header><div><small>Build 1.20</small><h3>✨ Writing Assistant</h3></div><button class="ghost" data-ai-close>Close</button></header><div class="dm-ai-tool-groups"><div><h4>Writing</h4><div class="dm-ai-tool-grid">${tool('improve','✨ Improve')}${tool('rewrite','🔄 Rewrite')}${tool('expand','➕ Expand')}${tool('shorten','✂ Shorten')}${tool('simplify','🪶 Simplify')}</div></div><div><h4>Bible & Ministry</h4><div class="dm-ai-tool-grid">${tool('scripture','📖 Add Scripture')}${tool('illustration','💡 Illustration')}${tool('application','📝 Application')}${tool('prayer','🙏 Prayer')}${tool('question','❓ Discussion')}</div></div><div><h4>Audience</h4><div class="dm-ai-tool-grid">${tool('youth','Youth')}${tool('children','Children')}${tool('church','Church')}${tool('evangelism','Evangelism')}</div></div><div><h4>Language</h4><div class="dm-ai-tool-grid">${tool('tagalog','Tagalog guide')}${tool('bilingual','Bilingual')}</div></div></div></section>`;document.body.appendChild(sheet);sheet.addEventListener('click',handleSheetClick)}sheet.classList.add('is-open');document.body.classList.add('dm-ai-sheet-open')}
function tool(id,label){return `<button class="ghost" data-ai-action="${id}">${label}</button>`}
function closeSheet(){const s=$('#dmAiAssistantSheet');if(s)s.classList.remove('is-open');document.body.classList.remove('dm-ai-sheet-open')}
function handleSheetClick(e){if(e.target.matches('[data-ai-close],.dm-ai-sheet-backdrop'))return closeSheet();const b=e.target.closest('[data-ai-action]');if(!b||!currentSection)return;const ta=$('.dm-ai-content',currentSection);if(!ta)return;const fn=ACTIONS[b.dataset.aiAction];if(fn){ta.value=fn(ta.value.trim());ta.dispatchEvent(new Event('input',{bubbles:true}));notify('Section updated');closeSheet()}}
function addButtons(root=document){$$('.dm-ai-section',root).forEach(section=>{if($('.dm-ai-assist-btn',section))return;const actions=$('.dm-ai-section-actions',section);if(!actions)return;const b=document.createElement('button');b.className='ghost dm-ai-assist-btn';b.type='button';b.textContent='✨ AI';b.onclick=()=>openSheet(section);actions.prepend(b)})}
function reviewDraft(){const sections=$$('.dm-ai-section');const text=sections.map(s=>$('.dm-ai-content',s)?.value||'').join(' ');const checks=[['Main Scripture',/\b(?:Psalm|John|Romans|Matthew|Mark|Luke|Acts|Corinthians|Galatians|Ephesians|Philippians|Colossians|Timothy|Peter|James|Isaiah|Jeremiah|Genesis|Exodus|Proverbs)\b/i.test(text)],['Clear application',/application|apply|action|step/i.test(text)],['Prayer',/prayer|pray|amen/i.test(text)],['Christ-centred',/Jesus|Christ|gospel/i.test(text)],['Discussion or reflection',/question|reflect|discussion/i.test(text)]];let box=$('#dmAiReviewBox');if(!box){box=document.createElement('article');box.id='dmAiReviewBox';box.className='card dm-ai-review-box';$('.dm-ai-editor')?.insertAdjacentElement('afterend',box)}if(box)box.innerHTML=`<div class="dm-ai-toolbar"><h3>✅ Draft Review</h3><small>Suggestions only</small></div>${checks.map(([n,ok])=>`<p class="${ok?'ok':'needs'}">${ok?'✓':'○'} ${n}</p>`).join('')}`;notify('Draft review completed')}
function addReviewButton(){const editor=$('#dmAiEditor');if(!editor||$('#dmAiReview'))return;const actions=$('.dm-ai-primary-actions',editor);if(!actions)return;const b=document.createElement('button');b.id='dmAiReview';b.className='ghost';b.textContent='✅ Review draft';b.onclick=reviewDraft;actions.appendChild(b)}
function install(){if(location.hash!=='#aicreator')return;addButtons();addReviewButton();const editor=$('#dmAiEditor');if(editor&&!editor.dataset.aiWritingObserver){editor.dataset.aiWritingObserver='1';new MutationObserver(()=>{addButtons(editor);addReviewButton()}).observe(editor,{childList:true,subtree:true})}}
window.addEventListener('load',()=>setTimeout(install,50));window.addEventListener('hashchange',()=>setTimeout(install,50));document.addEventListener('click',e=>{if(e.target.closest('#dmAiGenerate,#dmAiAddSection,[data-load],[data-up],[data-down]'))setTimeout(install,30)});
})();