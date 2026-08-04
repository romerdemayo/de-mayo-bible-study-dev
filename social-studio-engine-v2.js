/* De Mayo Bible Studies - Social Studio 2.0 offline engine */
(function(){
'use strict';
const HISTORY_KEY='dm_social_v2_history';
const POSTED_KEY='dm_social_v2_posted';
const MAX_HISTORY=600;
const $=s=>document.querySelector(s);
let installedControls=null;
let installTimer=0;

const VERSES=[
 ['Isaiah 41:10','Don’t be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.','courage'],
 ['Philippians 4:6–7','In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.','peace'],
 ['Romans 8:28','We know that all things work together for good for those who love God, to those who are called according to his purpose.','hope'],
 ['Psalm 46:1','God is our refuge and strength, a very present help in trouble.','strength'],
 ['Proverbs 3:5–6','Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.','guidance'],
 ['Matthew 11:28','Come to me, all you who labor and are heavily burdened, and I will give you rest.','rest'],
 ['John 14:27','Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don’t let your heart be troubled, neither let it be fearful.','peace'],
 ['Psalm 34:18','Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.','comfort'],
 ['James 1:5','But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.','wisdom'],
 ['2 Corinthians 12:9','My grace is sufficient for you, for my power is made perfect in weakness.','grace'],
 ['Romans 15:13','Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.','hope'],
 ['Psalm 23:1','Yahweh is my shepherd: I shall lack nothing.','provision'],
 ['Matthew 6:33','But seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.','priority'],
 ['Ephesians 4:32','Be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you.','forgiveness'],
 ['Joshua 1:9','Haven’t I commanded you? Be strong and courageous. Don’t be afraid, neither be dismayed; for Yahweh your God is with you wherever you go.','courage'],
 ['Psalm 119:105','Your word is a lamp to my feet, and a light for my path.','guidance'],
 ['Galatians 6:9','Let us not be weary in doing good, for we will reap in due season, if we don’t give up.','perseverance'],
 ['1 Peter 5:7','Casting all your worries on him, because he cares for you.','care'],
 ['Lamentations 3:22–23','It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning. Great is your faithfulness.','faithfulness'],
 ['Psalm 37:5','Commit your way to Yahweh. Trust also in him, and he will do this.','trust']
];
const OPENINGS=['Heavenly Father','Faithful God','Lord Jesus','Gracious Father','God of hope','Merciful Lord','Loving Father','Almighty God'];
const PRAISE=['thank You that Your mercy is new every morning','I praise You because You remain faithful in every season','thank You that Your presence is nearer than my fear','I worship You as my refuge, strength, and provider','thank You for loving me before I knew how to seek You','I honour You because Your wisdom is higher than mine'];
const NEEDS=['Give me wisdom for the decisions before me','Replace my fear with steady trust','Strengthen me where I feel weak and discouraged','Help me forgive freely and respond with grace','Provide what is needed and teach me to depend on You','Guard my thoughts and fill me with Your peace','Lead my family and keep our home centred on Christ','Use today’s challenges to shape me into the likeness of Jesus','Show me who needs encouragement and give me the right words','Teach me to wait faithfully without losing hope'];
const ACTIONS=['Help me take one obedient step today','Let my words carry kindness and truth','Make my life a quiet witness of the Gospel','Teach me to notice Your goodness in ordinary moments','Help me serve without seeking recognition','Give me courage to do what is right even when it is difficult','Keep me humble, teachable, and ready to listen'];
const CLOSINGS=['In Jesus’ name, Amen.','I place this day into Your faithful hands. Amen.','Lead me and be glorified through my life today. Amen.','Thank You for hearing me and staying near. In Jesus’ name, Amen.','May Your will be done in me and through me. Amen.'];
const CAPTIONS=[
 ref=>`Today’s reminder from ${ref}: God is present, faithful, and still working.`,
 ref=>`Hold on to this truth from ${ref}. You are not walking through today alone.`,
 ref=>`${ref} is a good verse to carry into prayer today.`,
 ref=>`Pause, breathe, and let the promise of ${ref} settle your heart.`,
 ref=>`Someone may need this encouragement from ${ref} today.`
];

function read(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
function clean(v=''){return String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function sig(item){return clean([item.type,item.reference,item.body,item.caption].join('|'))}
function used(){return new Set([...read(HISTORY_KEY),...read(POSTED_KEY).map(sig)])}
function remember(item){const s=sig(item);if(!s)return;const arr=read(HISTORY_KEY).filter(x=>x!==s);arr.unshift(s);write(HISTORY_KEY,arr.slice(0,MAX_HISTORY))}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function shuffled(arr){return [...arr].sort(()=>Math.random()-.5)}
function state(){return window.socialStudioState||null}
function sync(){if(typeof window.socialStudioSync==='function')window.socialStudioSync()}
function toast(m){if(typeof window.toast==='function')window.toast(m)}

function createVerse(){
 const seen=used();
 for(const v of shuffled(VERSES)){
  for(const makeCaption of shuffled(CAPTIONS)){
   const item={type:'verse',reference:v[0],body:v[1],caption:makeCaption(v[0]),hashtags:`#BibleVerse #${v[2][0].toUpperCase()+v[2].slice(1)} #Faith #DeMayoBibleStudies`};
   if(!seen.has(sig(item)))return item;
  }
 }
 const v=pick(VERSES);return {type:'verse',reference:v[0],body:v[1],caption:pick(CAPTIONS)(v[0]),hashtags:'#BibleVerse #Faith #DeMayoBibleStudies'};
}
function createPrayer(){
 const seen=used();
 for(let i=0;i<120;i++){
  const verse=pick(VERSES);
  const body=`${pick(OPENINGS)}, ${pick(PRAISE)}.\n\n${pick(NEEDS)}. ${pick(ACTIONS)}.\n\nYour Word in ${verse[0]} reminds me: “${verse[1]}”\n\n${pick(CLOSINGS)}`;
  const item={type:'prayer',reference:'Prayer',body,caption:`A prayer inspired by ${verse[0]}\n\n${body}`,hashtags:'#Prayer #Faith #ChristianEncouragement #DeMayoBibleStudies'};
  if(!seen.has(sig(item)))return item;
 }
 const verse=pick(VERSES),body=`${pick(OPENINGS)}, ${pick(PRAISE)}.\n\n${pick(NEEDS)}. ${pick(ACTIONS)}.\n\n${pick(CLOSINGS)}`;
 return {type:'prayer',reference:'Prayer',body,caption:`A prayer inspired by ${verse[0]}\n\n${body}`,hashtags:'#Prayer #Faith #DeMayoBibleStudies'};
}
function apply(item,message){
 const s=state();if(!s)return false;
 Object.assign(s,{type:item.type,reference:item.reference,verseText:item.type==='verse'?item.body:'',prayerText:item.type==='prayer'?item.body:'',caption:item.caption,hashtags:item.hashtags});
 remember(item);sync();toast(message);return true;
}
function generate(type){return apply(type==='prayer'?createPrayer():createVerse(),type==='prayer'?'Fresh prayer created':'Fresh Bible verse post created')}
function surprise(){return generate(Math.random()<.5?'prayer':'verse')}
function selectedType(){return state()?.type==='prayer'?'prayer':'verse'}
function markPosted(){
 const s=state();if(!s)return;
 const type=selectedType(),body=type==='prayer'?s.prayerText:s.verseText;
 if(!String(body||'').trim())return toast('Create a post first.');
 const item={type,reference:type==='prayer'?'Prayer':s.reference,body,caption:s.caption||'',hashtags:s.hashtags||'',postedAt:Date.now()};
 const arr=read(POSTED_KEY).filter(x=>sig(x)!==sig(item));arr.unshift(item);write(POSTED_KEY,arr.slice(0,300));remember(item);toast('Marked as posted. This content will be avoided.');renderPanel();
}
function renderPanel(){
 const controls=$('.social-controls');if(!controls)return;
 let panel=$('#dmSocialV2Panel');if(!panel){panel=document.createElement('article');panel.id='dmSocialV2Panel';panel.className='card';controls.insertAdjacentElement('afterend',panel)}
 const posted=read(POSTED_KEY),history=read(HISTORY_KEY);
 panel.innerHTML=`<div class="section-heading compact"><div><span class="eyebrow">SOCIAL STUDIO 2.0</span><h3>✨ Offline fresh-content engine</h3></div></div><p class="small-note">No API. Prayer and Bible verse generation use separate local memory and avoid previously generated or posted content.</p><div class="social-auto-actions"><button class="primary" id="dmSocialFreshSelected">Generate fresh ${selectedType()==='prayer'?'prayer':'Bible verse'}</button><button class="ghost" id="dmSocialMarkPosted">✅ Mark current as posted</button></div><p><b>${history.length}</b> ideas remembered · <b>${posted.length}</b> posted items protected</p>`;
 $('#dmSocialFreshSelected').onclick=()=>generate(selectedType());$('#dmSocialMarkPosted').onclick=markPosted;
}
function bind(id,fn){const b=$('#'+id);if(!b)return false;b.onclick=e=>{e?.preventDefault?.();fn();renderPanel()};return true}
function install(){
 clearTimeout(installTimer);
 const controls=$('.social-controls');if(!controls||controls===installedControls)return;
 const ok1=bind('socialGenerateVerse',()=>generate('verse'));
 const ok2=bind('socialGeneratePrayer',()=>generate('prayer'));
 const ok3=bind('socialGenerateComplete',surprise);
 if(!ok1&&!ok2&&!ok3)return;
 installedControls=controls;renderPanel();
 const fb=$('#socialFacebook');if(fb&&!fb.dataset.dmV2Posted){fb.addEventListener('click',markPosted,{capture:true});fb.dataset.dmV2Posted='1'}
}
function scheduleInstall(){clearTimeout(installTimer);installTimer=setTimeout(install,40)}
window.addEventListener('load',scheduleInstall);
window.addEventListener('hashchange',scheduleInstall);
scheduleInstall();
})();