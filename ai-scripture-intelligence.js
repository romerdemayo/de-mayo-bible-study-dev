/* De Mayo Bible Studies - Build 1.19.2 Scripture Intelligence Engine */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const TOPIC_SETS=[
 {words:['anxiety','anxious','worry','worried','fear','afraid'],items:[
  ['Philippians 4:6–7','In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.','Prayer replaces anxious isolation with trust in God’s peace.',96,'Prayer'],
  ['Isaiah 41:10','Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.','God’s presence and help answer fear directly.',91,'Promise'],
  ['Psalm 56:3–4','When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid. What can flesh do to me?','Shows a practical response when fear rises.',86,'Trust'] ]},
 {words:['hope','hopeless','future','unemployment','jobless'],items:[
  ['Romans 15:13','Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.','Centres hope in God and the Holy Spirit rather than circumstances.',95,'Hope'],
  ['Jeremiah 29:11','For I know the thoughts that I think toward you, says Yahweh, thoughts of peace, and not of evil, to give you hope and a future.','Speaks of God’s peaceful purpose and future hope.',88,'Promise'],
  ['Psalm 42:11','Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God.','Models speaking hope to a discouraged soul.',84,'Encouragement'] ]},
 {words:['financial','money','finance','provision','needs','hardship'],items:[
  ['Philippians 4:19','My God will supply every need of yours according to his riches in glory in Christ Jesus.','Directly addresses confidence in God’s provision.',96,'Promise'],
  ['Matthew 6:33','But seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.','Reorders priorities while trusting God for daily needs.',90,'Command'],
  ['Psalm 23:1','Yahweh is my shepherd: I shall lack nothing.','Presents God as the faithful shepherd and provider.',85,'Trust'] ]},
 {words:['faith','trust','believe','uncertainty'],items:[
  ['Proverbs 3:5–6','Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.','Directly teaches trust and guidance.',96,'Wisdom'],
  ['Hebrews 11:1','Now faith is assurance of things hoped for, proof of things not seen.','Provides a concise biblical description of faith.',90,'Teaching'],
  ['2 Corinthians 5:7','For we walk by faith, not by sight.','Calls believers to live beyond what is immediately visible.',85,'Encouragement'] ]},
 {words:['forgive','forgiveness','unforgiveness','hurt','offence'],items:[
  ['Ephesians 4:32','And be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you.','Grounds forgiveness in Christ’s forgiveness.',97,'Command'],
  ['Colossians 3:13','Bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.','Connects patience and forgiveness in relationships.',91,'Command'],
  ['Matthew 6:14','For if you forgive men their trespasses, your heavenly Father will also forgive you.','Shows the seriousness of a forgiving heart.',84,'Teaching'] ]},
 {words:['healing','heal','sick','sickness','cancer','health'],items:[
  ['Psalm 103:2–3','Praise Yahweh, my soul, and don’t forget all his benefits; who forgives all your sins; who heals all your diseases.','Remembers God’s mercy, forgiveness, and healing.',93,'Praise'],
  ['James 5:15','And the prayer of faith will save him who is sick, and the Lord will raise him up. If he has committed sins, he will be forgiven.','Connects prayer, care, and trust in the Lord.',88,'Prayer'],
  ['Isaiah 53:5','But he was pierced for our transgressions. He was crushed for our iniquities. The punishment that brought our peace was on him; and by his wounds we are healed.','Points to Christ’s suffering and the deepest healing of sin and peace.',86,'Christ'] ]},
 {words:['grief','loss','mourning','death','bereavement'],items:[
  ['Psalm 34:18','Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.','Assures grieving people of God’s nearness.',97,'Comfort'],
  ['Matthew 5:4','Blessed are those who mourn, for they shall be comforted.','Promises comfort to those who mourn.',91,'Promise'],
  ['Revelation 21:4','He will wipe away from them every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.','Gives future hope beyond death and sorrow.',89,'Hope'] ]},
 {words:['love','loving','relationship','marriage'],items:[
  ['1 Corinthians 13:4–7','Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil, doesn’t rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, and endures all things.','Describes the character and endurance of biblical love.',97,'Teaching'],
  ['John 13:34–35','A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another. By this everyone will know that you are my disciples, if you have love for one another.','Connects Christlike love with Christian witness.',93,'Command'],
  ['1 John 4:19','We love him, because he first loved us.','Shows that our love begins with God’s love.',87,'Gospel'] ]},
 {words:['salvation','saved','gospel','eternal life','jesus'],items:[
  ['John 3:16','For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.','Summarises God’s love, Christ’s gift, faith, and eternal life.',99,'Gospel'],
  ['Romans 10:9','That if you will confess with your mouth that Jesus is Lord, and believe in your heart that God raised him from the dead, you will be saved.','Clearly connects faith in the risen Christ with salvation.',95,'Gospel'],
  ['Ephesians 2:8–9','For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, that no one would boast.','Explains salvation by grace through faith.',94,'Grace'] ]},
 {words:['wisdom','decision','guidance','direction','choice'],items:[
  ['James 1:5','But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.','Directly invites prayer for wisdom.',97,'Prayer'],
  ['Psalm 32:8','I will instruct you and teach you in the way which you shall go. I will counsel you with my eye on you.','Promises personal instruction and counsel.',90,'Promise'],
  ['Proverbs 16:9','A man’s heart plans his course, but Yahweh directs his steps.','Balances responsible planning with God’s direction.',86,'Wisdom'] ]},
 {words:['strength','weak','weakness','tired','weary'],items:[
  ['Isaiah 40:31','But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.','Promises renewed strength to those who wait for God.',97,'Promise'],
  ['2 Corinthians 12:9','He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.” Most gladly therefore I will rather glory in my weaknesses, that the power of Christ may rest on me.','Shows Christ’s power working through weakness.',94,'Grace'],
  ['Psalm 46:1','God is our refuge and strength, a very present help in trouble.','Declares God’s present help in hardship.',90,'Comfort'] ]},
 {words:['peace','rest','stress','overwhelmed'],items:[
  ['John 14:27','Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don’t let your heart be troubled, neither let it be fearful.','Jesus gives a distinct peace that answers fear.',97,'Promise'],
  ['Matthew 11:28','Come to me, all you who labor and are heavily burdened, and I will give you rest.','Invites burdened people to receive rest from Christ.',94,'Invitation'],
  ['Isaiah 26:3','You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.','Connects steadfast trust with peace.',89,'Trust'] ]},
 {words:['purpose','calling','plan','meaning'],items:[
  ['Romans 8:28','We know that all things work together for good for those who love God, to those who are called according to his purpose.','Connects God’s purpose with every circumstance.',96,'Promise'],
  ['Ephesians 2:10','For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.','Shows believers as God’s workmanship with prepared good works.',93,'Calling'],
  ['Proverbs 19:21','There are many plans in a man’s heart, but Yahweh’s counsel will prevail.','Places human plans under God’s enduring counsel.',86,'Wisdom'] ]},
 {words:['trial','trials','suffering','hardship','difficult times','challenge'],items:[
  ['James 1:2–4','Count it all joy, my brothers, when you fall into various temptations, knowing that the testing of your faith produces endurance. Let endurance have its perfect work, that you may be perfect and complete, lacking in nothing.','Explains how tested faith produces endurance and maturity.',97,'Teaching'],
  ['Romans 5:3–5','Not only this, but we also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope; and hope doesn’t disappoint us, because God’s love has been poured into our hearts through the Holy Spirit who was given to us.','Traces suffering toward perseverance, character, and hope.',93,'Hope'],
  ['1 Peter 5:10','But may the God of all grace, who called you to his eternal glory by Christ Jesus, after you have suffered a little while, perfect, establish, strengthen, and settle you.','Promises God’s restoring work after suffering.',89,'Promise'] ]}
];
const FALLBACK={items:[
 ['Psalm 119:105','Your word is a lamp to my feet, and a light for my path.','A strong starting point for seeking direction from Scripture.',82,'Wisdom'],
 ['2 Timothy 3:16–17','Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness, that each person who belongs to God may be complete, thoroughly equipped for every good work.','Explains how Scripture equips believers.',78,'Teaching'],
 ['Hebrews 4:12','For the word of God is living and active, and sharper than any two-edged sword, piercing even to the dividing of soul and spirit, of both joints and marrow, and is able to discern the thoughts and intentions of the heart.','Emphasises the living and discerning power of God’s Word.',74,'Teaching'] ]};
let timer=null;
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]))}
function findSet(topic){const value=String(topic||'').toLowerCase();return TOPIC_SETS.find(s=>s.words.some(w=>value.includes(w)))||FALLBACK}
function readRoute(reference){const m=String(reference).match(/^((?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)/);if(!m)return;localStorage.setItem('dm_aiReadReference',reference);if(typeof window.route==='function')window.route('read');else location.hash='read'}
function setSelected(item){const ref=$('#dmAiReference');if(ref){ref.value=item[0];ref.dispatchEvent(new Event('input',{bubbles:true}))}localStorage.setItem('dm_aiSelectedScripture',JSON.stringify({reference:item[0],verse:item[1],reason:item[2],score:item[3],category:item[4]}));document.querySelectorAll('.dm-scripture-card').forEach(c=>c.classList.toggle('is-selected',c.dataset.reference===item[0]));const chosen=$('#dmScriptureChosen');if(chosen)chosen.textContent=`Selected: ${item[0]}`;if(typeof window.toast==='function')window.toast(`${item[0]} selected`)}
function render(){const topic=$('#dmAiTopic'),reference=$('#dmAiReference'),controls=document.querySelector('.dm-ai-controls');if(!topic||!reference||!controls)return;
 let panel=$('#dmScriptureIntelligence');if(!panel){panel=document.createElement('section');panel.id='dmScriptureIntelligence';panel.className='dm-scripture-intelligence';const typeGrid=controls.querySelector('.dm-ai-type-grid');(typeGrid||reference.parentElement).insertAdjacentElement('beforebegin',panel)}
 const set=findSet(topic.value),items=set.items||FALLBACK.items;panel.innerHTML=`<div class="dm-scripture-head"><div><span class="dm-ai-step">📖</span><h3>Discover Scripture first</h3></div><small id="dmScriptureChosen">Choose a passage before generating</small></div><p class="dm-ai-note">Read the verse, see why it fits, then select the passage you want the resource to use.</p><div class="dm-scripture-list">${items.map((x,i)=>`<article class="dm-scripture-card ${reference.value.trim()===x[0]?'is-selected':''}" data-reference="${esc(x[0])}"><div class="dm-scripture-meta"><span>${i===0?'⭐ Best match':x[4]}</span><b>${x[3]}% match</b></div><h4>${esc(x[0])}</h4><blockquote>${esc(x[1])}</blockquote><p><b>Why this Scripture?</b> ${esc(x[2])}</p><div class="dm-scripture-actions"><button class="primary" data-use-scripture="${i}">✓ Use this passage</button><button class="ghost" data-read-scripture="${i}">📖 Read chapter</button></div></article>`).join('')}</div>`;
 panel.querySelectorAll('[data-use-scripture]').forEach(b=>b.onclick=()=>setSelected(items[+b.dataset.useScripture]));panel.querySelectorAll('[data-read-scripture]').forEach(b=>b.onclick=()=>readRoute(items[+b.dataset.readScripture][0]));
}
function install(){const topic=$('#dmAiTopic'),generate=$('#dmAiGenerate');if(!topic||!generate)return;if(!topic.dataset.intelligenceInstalled){topic.dataset.intelligenceInstalled='1';topic.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,180)});topic.addEventListener('change',render);generate.addEventListener('click',e=>{const ref=$('#dmAiReference');if(!ref?.value.trim()){e.preventDefault();e.stopImmediatePropagation();render();if(typeof window.toast==='function')window.toast('Choose a Scripture passage first.');}},true)}render()}
const view=$('#view');if(view)new MutationObserver(()=>queueMicrotask(install)).observe(view,{childList:true,subtree:true});window.addEventListener('load',install);window.addEventListener('hashchange',()=>setTimeout(install,0));
})();