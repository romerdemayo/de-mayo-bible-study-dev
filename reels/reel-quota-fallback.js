/* De Mayo Bible Studies — quota fallback for Reel Creator
   Creates a fresh local Verse, Message & Prayer reel when Gemini quota/rate limit blocks generation. */
(function(){
'use strict';
const KEY='dm_reel_quota_fallback_history_v1';
const $=s=>document.querySelector(s);
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v.slice(0,80)))}
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim()}
const POOLS={
English:{
hope:[
['Lamentations 3:22-23','It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning; great is your faithfulness.','A difficult season does not cancel God’s faithfulness. His mercy meets you again today, so receive this morning as a fresh opportunity to trust Him.','Father, thank You for mercies that are new every morning. Help me trust Your faithfulness today. Amen.'],
['Psalm 62:5-6','My soul, wait in silence for God alone, for my expectation is from him. He alone is my rock and my salvation, my fortress. I will not be shaken.','Hope becomes steadier when it is anchored in God rather than outcomes. Let Him be your rock while you wait for answers.','Lord, steady my heart while I wait and keep my hope anchored in You. Amen.'],
['1 Peter 1:3','Blessed be the God and Father of our Lord Jesus Christ, who according to his great mercy became our father again to a living hope through the resurrection of Jesus Christ from the dead.','Christian hope is alive because Jesus is alive. Whatever today looks like, your future is not limited to what you can presently see.','Jesus, renew my hope and help me live today in the light of Your resurrection. Amen.']
],
faith:[
['Proverbs 3:5-6','Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.','You do not need complete understanding before you can trust God. Acknowledge Him in the next decision and allow Him to direct your path.','Lord, help me trust You above my own understanding and guide my steps today. Amen.'],
['Hebrews 10:23','Let us hold fast the confession of our hope without wavering; for he who promised is faithful.','Faith keeps holding on because the One who promised is faithful. When feelings shift, God’s character remains steady.','Father, strengthen me to hold firmly to Your promises because You are faithful. Amen.'],
['James 1:6','But let him ask in faith, without any doubting, for he who doubts is like a wave of the sea, driven by the wind and tossed.','Bring your need to God with a heart that expects Him to hear you. Faith does not control the answer; it trusts the One who answers.','God, teach me to pray with trust and to rest in Your wisdom. Amen.']
],
peace:[
['Isaiah 26:3','You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.','Peace grows as your attention returns to God. When anxious thoughts multiply, deliberately bring your mind back to His character and promises.','Lord, fix my mind on You and fill me with Your peace today. Amen.'],
['Psalm 29:11','Yahweh will give strength to his people. Yahweh will bless his people with peace.','God can give both strength and peace at the same time. You do not have to choose between being brave and being calm in Him.','Father, give me strength for today and peace in the middle of every pressure. Amen.'],
['Colossians 3:15','Let the peace of Christ rule in your hearts, to which also you were called in one body, and be thankful.','Let Christ’s peace have the deciding voice in your heart. Slow down enough to notice where fear is trying to take control.','Jesus, let Your peace rule my heart and guide my responses today. Amen.']
],
strength:[
['Psalm 18:2','Yahweh is my rock, my fortress, and my deliverer; my God, my rock, in whom I take refuge; my shield, and the horn of my salvation, my high tower.','You were never meant to be your own fortress. Run to God as your refuge and let His strength carry what feels too heavy.','Lord, be my rock and refuge and strengthen me for what I must face. Amen.'],
['2 Corinthians 12:9','He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.”','Weakness is not the end of usefulness. God’s grace can meet you precisely where your own strength runs out.','Jesus, let Your grace be sufficient for me and show Your strength in my weakness. Amen.'],
['Nehemiah 8:10','Don’t be grieved, for the joy of Yahweh is your strength.','God’s joy is deeper than a passing mood. Let the certainty of His goodness strengthen you when the day feels heavy.','Father, renew my joy in You and make that joy my strength today. Amen.']
],
gratitude:[
['1 Chronicles 16:34','Oh give thanks to Yahweh, for he is good, for his loving kindness endures forever.','Gratitude begins with God’s unchanging goodness. Even on a hard day, His faithful love gives you a reason to thank Him.','Lord, help me notice Your goodness and respond with genuine thanksgiving. Amen.'],
['Philippians 4:6','In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.','Thanksgiving can sit beside honest requests. Bring God what concerns you, but also remember what He has already done.','Father, I bring You my needs with thanksgiving. Remind me of Your past faithfulness. Amen.'],
['Psalm 92:1-2','It is a good thing to give thanks to Yahweh, to sing praises to your name, Most High; to proclaim your loving kindness in the morning, and your faithfulness every night.','Make gratitude part of the rhythm of your day. Begin by remembering God’s love and end by remembering His faithfulness.','God, make thanksgiving a daily rhythm in my heart. Amen.']
],
courage:[
['Psalm 56:3-4','When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid.','Courage does not deny fear; it decides where to place fear. When anxiety rises, move your trust deliberately toward God.','Lord, when I am afraid, help me put my trust in You. Amen.'],
['1 Corinthians 16:13','Watch! Stand firm in the faith! Be courageous! Be strong!','Some days require a simple decision to stand firm. Stay awake spiritually, hold to your faith, and take the next brave step.','Father, make me watchful, steady, courageous, and strong in faith today. Amen.'],
['Psalm 31:24','Be strong, and let your heart take courage, all you who hope in Yahweh.','Hope and courage belong together. As you place your expectation in God, allow your heart to become strong again.','Lord, strengthen my heart and give me courage as I hope in You. Amen.']
]
},
Tagalog:{
hope:[
['Mga Panaghoy 3:22-23','Dahil sa tapat na pag-ibig ng Panginoon ay hindi tayo nauubos; ang Kanyang habag ay hindi nagwawakas. Bago ito tuwing umaga.','Hindi kinakansela ng mahirap na panahon ang katapatan ng Diyos. May sariwang awa Siya para sa iyo ngayong araw.','Ama, salamat sa Iyong bagong awa bawat umaga. Tulungan Mo akong magtiwala sa Iyo ngayon. Amen.'],
['Awit 62:5-6','Sa Diyos lamang maghintay ang aking kaluluwa, sapagkat mula sa Kanya ang aking pag-asa. Siya lamang ang aking bato at kaligtasan.','Mas tumitibay ang pag-asa kapag nakasandig ito sa Diyos at hindi sa resulta.','Panginoon, patatagin Mo ang puso ko habang naghihintay ako sa Iyo. Amen.']
],
faith:[
['Kawikaan 3:5-6','Magtiwala ka sa Panginoon nang buong puso at huwag kang manalig sa sarili mong pagkaunawa.','Hindi mo kailangang maunawaan ang lahat bago magtiwala. Kilalanin ang Diyos sa susunod mong hakbang.','Panginoon, tulungan Mo akong magtiwala sa Iyo higit sa sarili kong pagkaunawa. Amen.'],
['Hebreo 10:23','Panghawakan nating matatag ang pag-asa na ating ipinahahayag sapagkat tapat ang nangako.','Kumakapit ang pananampalataya dahil tapat ang Diyos. Maaaring magbago ang damdamin, ngunit hindi ang Kanyang katapatan.','Ama, palakasin Mo akong kumapit sa Iyong mga pangako. Amen.']
],
peace:[
['Isaias 26:3','Iyong iingatan sa ganap na kapayapaan ang taong matatag ang isip sapagkat nagtitiwala siya sa Iyo.','Lumalaki ang kapayapaan kapag ibinabalik mo ang isip mo sa Diyos sa gitna ng pag-aalala.','Panginoon, ituon Mo ang isip ko sa Iyo at punuin Mo ako ng kapayapaan. Amen.'],
['Awit 29:11','Bibigyan ng Panginoon ng lakas ang Kanyang bayan; pagpapalain Niya sila ng kapayapaan.','Maaaring ibigay ng Diyos ang lakas at kapayapaan nang sabay.','Ama, bigyan Mo ako ng lakas at kapayapaan ngayong araw. Amen.']
],
strength:[
['2 Corinto 12:9','Sapat sa iyo ang Aking biyaya sapagkat ang Aking kapangyarihan ay nagiging ganap sa kahinaan.','Hindi hadlang ang kahinaan sa pagkilos ng Diyos. Maaaring doon mismo makita ang Kanyang lakas.','Jesus, gawin Mong sapat sa akin ang Iyong biyaya at lakas. Amen.'],
['Awit 18:2','Ang Panginoon ang aking bato, kuta, at tagapagligtas.','Hindi mo kailangang maging sarili mong kuta. Tumakbo sa Diyos bilang iyong kanlungan.','Panginoon, maging bato at kanlungan ko at palakasin Mo ako. Amen.']
],
gratitude:[
['1 Cronica 16:34','Magpasalamat sa Panginoon sapagkat Siya ay mabuti at ang Kanyang tapat na pag-ibig ay magpakailanman.','Nagsisimula ang pasasalamat sa hindi nagbabagong kabutihan ng Diyos.','Panginoon, tulungan Mo akong makita ang Iyong kabutihan at magpasalamat. Amen.'],
['Filipos 4:6','Huwag kayong mabalisa sa anumang bagay kundi ilapit sa Diyos ang lahat sa panalangin na may pasasalamat.','Maaari mong dalhin ang pangangailangan sa Diyos habang naaalala rin ang mga ginawa na Niya.','Ama, tinatanggap ko ang Iyong katapatan at dinadala ko sa Iyo ang aking mga alalahanin. Amen.']
],
courage:[
['Awit 56:3','Kapag ako ay natatakot, sa Iyo ako magtitiwala.','Hindi itinatanggi ng tapang ang takot. Pinipili lamang nitong ilagay ang tiwala sa Diyos.','Panginoon, kapag natatakot ako, tulungan Mo akong magtiwala sa Iyo. Amen.'],
['1 Corinto 16:13','Magbantay kayo, manindigan sa pananampalataya, magpakatapang, at magpakalakas.','May mga araw na kailangan lamang nating manindigan at gawin ang susunod na tamang hakbang.','Ama, gawin Mo akong matatag, mapagbantay, at matapang sa pananampalataya. Amen.']
]
}
};
function pick(){
  const lang=$('#dmReelLanguage')?.value==='Tagalog'?'Tagalog':'English';
  const theme=clean($('#dmTheme')?.value||'hope').toLowerCase();
  const pool=POOLS[lang]?.[theme]||POOLS[lang]?.hope||POOLS.English.hope;
  const used=new Set(read().map(x=>x.key));
  let available=pool.map((row,i)=>({row,i,key:`${lang}|${theme}|${row[0]}`})).filter(x=>!used.has(x.key));
  if(!available.length){write([]);available=pool.map((row,i)=>({row,i,key:`${lang}|${theme}|${row[0]}`}));}
  const chosen=available[Math.floor(Math.random()*available.length)]||available[0];
  write([{key:chosen.key,usedAt:new Date().toISOString()},...read().filter(x=>x.key!==chosen.key)]);
  const [reference,verse,reflection,prayer]=chosen.row;
  const label=$('#dmTheme')?.selectedOptions?.[0]?.textContent||'Bible Encouragement';
  return {title:`${label} for Today`,label:'Weekly',contentType:'devotional',reference,verse,reflection,prayer,caption:`${reflection} What part of this message speaks to you today?`,hashtags:'#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies',language:lang,source:'Built-in quota fallback'};
}
function applyFallback(){
  const api=window.DM_REEL_CREATOR;
  if(!api?.setGeneratedContent)return;
  const item=pick();
  api.setGeneratedContent(item);
  const box=$('#dmReelGeminiStatus');
  if(box){box.hidden=false;box.dataset.type='success';box.textContent='✅ Gemini quota reached, so a fresh built-in Verse, Message & Prayer Reel was created instead.';}
  window.toast?.('Fresh offline Reel created while Gemini quota is reached.');
}
function shouldFallback(box){
  if(!box)return false;
  const text=clean(box.textContent).toLowerCase();
  const error=box.dataset.type==='error'||text.startsWith('⚠');
  return error&&/quota|limit|429|unavailable|busy|high demand|temporar|failed|repeated/.test(text);
}
let lastHandled='';
function watch(){
  const box=$('#dmReelGeminiStatus');
  if(!box||box.dataset.dmQuotaWatch==='1')return;
  box.dataset.dmQuotaWatch='1';
  const check=()=>{
    const token=clean(box.textContent)+'|'+box.dataset.type;
    if(token===lastHandled)return;
    if(shouldFallback(box)&&($('#dmReelContentType')?.value||'devotional')==='devotional'){
      lastHandled=token;
      setTimeout(applyFallback,50);
    }
  };
  new MutationObserver(check).observe(box,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-type']});
  check();
}
function boot(){watch();let tries=0;const t=setInterval(()=>{tries++;watch();if(tries>100)clearInterval(t);},150);}
window.addEventListener('load',boot);window.addEventListener('hashchange',()=>setTimeout(boot,100));document.addEventListener('dm-reel-studio-ready',boot);if(document.readyState!=='loading')boot();
window.DM_REEL_QUOTA_FALLBACK={applyFallback,pick};
})();