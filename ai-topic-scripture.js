/* De Mayo Bible Studies - AI Creator topic-to-Scripture suggestions */
(function(){
'use strict';
const TOPICS=[
 {words:['salvation','saved','gospel','eternal life'],ref:'John 3:16'},
 {words:['hope','hopeless','future'],ref:'Jeremiah 29:11'},
 {words:['faith','trust','believe'],ref:'Proverbs 3:5–6'},
 {words:['fear','afraid','anxiety','anxious','worry','worried'],ref:'Philippians 4:6–7'},
 {words:['healing','heal','sickness','sick','cancer'],ref:'Psalm 103:2–3'},
 {words:['forgiveness','forgive','unforgiveness'],ref:'Ephesians 4:32'},
 {words:['love','loving'],ref:'1 Corinthians 13:4–7'},
 {words:['family','marriage','home'],ref:'Joshua 24:15'},
 {words:['children','child','parenting'],ref:'Proverbs 22:6'},
 {words:['prayer','pray'],ref:'Philippians 4:6'},
 {words:['strength','weak','weakness'],ref:'Isaiah 40:31'},
 {words:['peace','rest'],ref:'John 14:27'},
 {words:['grief','loss','mourning','death'],ref:'Psalm 34:18'},
 {words:['work','job','career','employment'],ref:'Colossians 3:23'},
 {words:['money','financial','finance','provision'],ref:'Philippians 4:19'},
 {words:['wisdom','decision','guidance'],ref:'James 1:5'},
 {words:['temptation','tempted'],ref:'1 Corinthians 10:13'},
 {words:['purpose','calling'],ref:'Romans 8:28'},
 {words:['gratitude','thankful','thanksgiving'],ref:'1 Thessalonians 5:18'},
 {words:['worship','praise'],ref:'Psalm 95:6'},
 {words:['obedience','obey'],ref:'John 14:15'},
 {words:['humility','humble'],ref:'Philippians 2:3–4'},
 {words:['unity','together'],ref:'Ephesians 4:3'},
 {words:['evangelism','witness','share the gospel'],ref:'Matthew 28:19–20'},
 {words:['trials','trial','suffering','hardship','difficult times'],ref:'James 1:2–4'}
];
const REFERENCE=/\b(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}(?::\d{1,3}(?:\s*[-–]\s*\d{1,3})?)?\b/;
let timer=null,lastSuggested='';
function suggest(topic){
 const raw=String(topic||'').trim();if(!raw)return'';
 const direct=raw.match(REFERENCE);if(direct)return direct[0].replace(/\s+/g,' ').trim();
 const value=raw.toLowerCase();
 const match=TOPICS.find(x=>x.words.some(w=>value.includes(w)));
 return match?match.ref:'';
}
function apply(force=false){
 const topic=document.querySelector('#dmAiTopic'),reference=document.querySelector('#dmAiReference');
 if(!topic||!reference)return;
 const next=suggest(topic.value);if(!next)return;
 const current=reference.value.trim();
 if(force||!current||current===lastSuggested){reference.value=next;reference.dispatchEvent(new Event('input',{bubbles:true}));lastSuggested=next;reference.dataset.autoSuggested='true';}
}
function install(){
 const topic=document.querySelector('#dmAiTopic'),reference=document.querySelector('#dmAiReference'),generate=document.querySelector('#dmAiGenerate');
 if(!topic||!reference||topic.dataset.scriptureSuggestInstalled)return;
 topic.dataset.scriptureSuggestInstalled='true';
 topic.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>apply(false),220)});
 topic.addEventListener('change',()=>apply(false));
 reference.addEventListener('input',()=>{if(reference.value.trim()!==lastSuggested)reference.dataset.autoSuggested='false'});
 if(generate){generate.addEventListener('click',()=>apply(!reference.value.trim()),true)}
 apply(false);
}
const view=document.querySelector('#view');
if(view)new MutationObserver(()=>queueMicrotask(install)).observe(view,{childList:true,subtree:true});
window.addEventListener('load',install);
window.addEventListener('hashchange',()=>setTimeout(install,0));
})();
