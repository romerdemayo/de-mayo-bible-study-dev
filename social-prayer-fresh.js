/* De Mayo Bible Studies - fresh non-repeating Social Studio prayers */
(function(){
'use strict';
const GENERATED_KEY='dm_socialStudioGeneratedHistory';
const POSTED_KEY='dm_socialStudioPostedHistory';
const LAST_KEY='dm_socialPrayerLastIndexes';
const installed=new WeakSet();
const $=s=>document.querySelector(s);
const OPENINGS=[
 'Heavenly Father, thank You for meeting me exactly where I am today.',
 'Lord Jesus, I come to You with an open heart and a willing spirit.',
 'Faithful God, thank You that Your mercy is new again today.',
 'Father, quiet my heart and help me recognise Your presence.',
 'Lord, before I ask for anything, I praise You for who You are.',
 'Gracious God, thank You that I never have to carry life alone.',
 'Father in heaven, draw me closer to You through Your Word today.',
 'Lord, I pause in this moment to place my whole life before You.'
];
const NEEDS=[
 'Give me wisdom for every decision and courage for every faithful step.',
 'Replace my fear with trust, my confusion with clarity, and my weariness with strength.',
 'Help me surrender what I cannot control and obey You in what I can do today.',
 'Guard my thoughts, guide my words, and make my actions reflect the love of Christ.',
 'Teach me to wait without losing hope and to move when You make the way clear.',
 'Heal the places in me that are tired, discouraged, or quietly hurting.',
 'Provide what is needed, open the right doors, and close the paths that would pull me away from You.',
 'Help me forgive freely, love patiently, and respond with grace instead of frustration.',
 'Give me peace that is deeper than my circumstances and faith that remains steady in uncertainty.',
 'Use today’s challenges to shape my character and make me more like Jesus.',
 'Show me who needs encouragement, and give me the right words to share Your hope.',
 'Protect my family, strengthen our relationships, and keep our home centred on You.'
];
const SCRIPTURES=[
 ['Philippians 4:6–7','Remind me to bring every concern to You in prayer and receive Your peace.'],
 ['Proverbs 3:5–6','Teach me to trust You with all my heart instead of leaning only on my own understanding.'],
 ['Isaiah 41:10','Help me remember that I do not need to fear because You are with me.'],
 ['Psalm 46:1','Be my refuge and strength, my present help in every trouble.'],
 ['Romans 8:28','Help me trust that You are still working, even when I cannot yet see the outcome.'],
 ['Matthew 6:33','Keep my priorities centred on Your kingdom and Your righteousness.'],
 ['James 1:5','Give me wisdom generously as I ask You in faith.'],
 ['Psalm 34:18','Draw near to every broken heart and comfort those carrying grief.'],
 ['John 14:27','Let the peace of Jesus settle my heart and silence unnecessary fear.'],
 ['2 Corinthians 12:9','Let Your grace be sufficient and Your strength be seen in my weakness.']
];
const CLOSINGS=[
 'Use my life today to bring hope to someone else. In Jesus’ name, Amen.',
 'Keep me faithful in the small things and ready for whatever You place before me. In Jesus’ name, Amen.',
 'May my thoughts, words, and choices honour You today. In Jesus’ name, Amen.',
 'Lead me one step at a time, and help me recognise Your goodness along the way. Amen.',
 'Let Your will be done in me, through me, and around me today. In Jesus’ name, Amen.',
 'Thank You for hearing me and for staying near through every season. In Jesus’ name, Amen.',
 'Make me a source of peace, kindness, and Gospel hope wherever I go. Amen.',
 'I place this day, my needs, and the people I love into Your faithful hands. Amen.'
];
function read(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function clean(value=''){return String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function signature(body){return clean(`prayer|${body}|Prayer`)}
function used(){const out=new Set(read(GENERATED_KEY));read(POSTED_KEY).forEach(x=>out.add(clean([x?.type,x?.body,x?.reference].join('|'))));return out}
function remember(body){const sig=signature(body),arr=read(GENERATED_KEY).filter(x=>x!==sig);arr.unshift(sig);write(GENERATED_KEY,arr.slice(0,500))}
function randomIndex(length,avoid){if(length<2)return 0;let i=Math.floor(Math.random()*length),guard=0;while(i===avoid&&guard++<8)i=Math.floor(Math.random()*length);return i}
function buildPrayer(){
 const seen=used();let last={};try{last=JSON.parse(localStorage.getItem(LAST_KEY)||'{}')}catch{}
 for(let attempt=0;attempt<120;attempt++){
  const a=randomIndex(OPENINGS.length,last.a),b=randomIndex(NEEDS.length,last.b),c=randomIndex(SCRIPTURES.length,last.c),d=randomIndex(CLOSINGS.length,last.d);
  const body=`${OPENINGS[a]}\n\n${NEEDS[b]}\n\n${SCRIPTURES[c][0]} reminds me: ${SCRIPTURES[c][1]}\n\n${CLOSINGS[d]}`;
  if(!seen.has(signature(body))){localStorage.setItem(LAST_KEY,JSON.stringify({a,b,c,d}));return {body,reference:SCRIPTURES[c][0]};}
 }
 return null;
}
function applyFreshPrayer(message=true){
 let state;try{state=window.socialStudioState}catch{return false}if(!state)return false;
 const item=buildPrayer();if(!item){if(typeof window.toast==='function')window.toast('All available prayer combinations have been used. Clear generated memory to begin a new cycle.');return false}
 Object.assign(state,{type:'prayer',prayerText:item.body,reference:'Prayer',caption:`A prayer inspired by ${item.reference}\n\n${item.body}`,hashtags:'#Prayer #Faith #ChristianEncouragement #DeMayoBibleStudies'});
 remember(item.body);
 if(typeof window.socialStudioSync==='function')window.socialStudioSync();
 if(message&&typeof window.toast==='function')window.toast('Fresh prayer generated — not used before');
 return true;
}
function currentPrayerDuplicate(){try{if(window.socialStudioState?.type!=='prayer')return false;return used().has(signature(window.socialStudioState.prayerText||''))}catch{return false}}
function install(){
 const prayer=$('#socialGeneratePrayer'),surprise=$('#socialGenerateComplete'),daily=$('#socialDaily');
 if(prayer&&!installed.has(prayer)){installed.add(prayer);prayer.onclick=e=>{e?.preventDefault?.();applyFreshPrayer(true)}}
 [surprise,daily].forEach(button=>{if(!button||installed.has(button))return;installed.add(button);const original=button.onclick;button.onclick=e=>{const result=original&&original.call(button,e);setTimeout(()=>{try{if(window.socialStudioState?.type==='prayer'&&currentPrayerDuplicate())applyFreshPrayer(false)}catch{}},0);return result}});
 const fresh=$('#dmFreshIdea');if(fresh&&!fresh.dataset.dmPrayerFreshHook){const original=fresh.onclick;fresh.onclick=e=>{const result=original&&original.call(fresh,e);setTimeout(()=>{try{if(window.socialStudioState?.type==='prayer'&&currentPrayerDuplicate())applyFreshPrayer(false)}catch{}},0);return result};fresh.dataset.dmPrayerFreshHook='1'}
}
function schedule(){requestAnimationFrame(install)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',()=>setTimeout(schedule,20));
const view=$('#view');if(view)new MutationObserver(schedule).observe(view,{childList:true});
window.DM_generateFreshSocialPrayer=applyFreshPrayer;
})();