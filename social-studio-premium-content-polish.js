/* De Mayo Bible Studies — Premium Social Studio content-aware lower section */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const THEMES={
 hope:{label:'Hope',reflection:'God is still working even when you cannot see the whole picture. Hold on to His promises and keep moving forward in faith.',prayer:'Lord, fill me with hope through Your Word. Help me trust Your promises even when I cannot yet see what You are doing.',tagline:'KEEP HOPING. GOD IS STILL AT WORK.'},
 faith:{label:'Faith',reflection:'Faith chooses to trust God beyond what is visible. Keep believing His character, His Word, and His timing.',prayer:'Lord, strengthen my faith. Help me trust You beyond what I can see and obey what Your Word is teaching me today.',tagline:'WALK BY FAITH. TRUST GOD WITH THE NEXT STEP.'},
 peace:{label:'Peace',reflection:'God’s peace is not dependent on perfect circumstances. Bring your worries to Him and rest in His presence today.',prayer:'Lord, quiet my heart and replace my worry with Your peace. Help me rest in Your presence and trust You with what I cannot control.',tagline:'BE STILL. GOD IS WITH YOU.'},
 guidance:{label:'Guidance',reflection:'You do not have to know every step before you move. Ask God for wisdom, stay close to His Word, and follow the direction He gives.',prayer:'Lord, give me wisdom and clear direction. Help me recognise Your leading, obey Your Word, and trust You with every next step.',tagline:'ASK FOR WISDOM. LET GOD DIRECT YOUR PATH.'},
 strength:{label:'Strength',reflection:'God meets you in weakness with strength that is greater than your own. Keep leaning on Him when the journey feels heavy.',prayer:'Lord, be my strength when I feel weak. Help me keep going with courage and depend on Your power rather than my own.',tagline:'LEAN ON GOD. HIS STRENGTH IS ENOUGH.'},
 healing:{label:'Healing',reflection:'Healing can be a process, but God remains present in every part of it. Bring Him your pain and trust Him with what you cannot repair yourself.',prayer:'Lord, bring healing where there is pain. Give comfort, patience, and courage, and help me trust Your presence through the healing process.',tagline:'GOD IS NEAR. BRING HIM YOUR HEART.'},
 gratitude:{label:'Gratitude',reflection:'Gratitude helps us notice God’s faithfulness in ordinary moments. Remember what He has done and thank Him for what He is still doing.',prayer:'Lord, thank You for Your faithfulness. Open my eyes to Your goodness and teach me to live with a grateful heart today.',tagline:'REMEMBER HIS GOODNESS. GIVE THANKS TODAY.'}
};
let currentTheme='hope',timer=0;
function type(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function currentData(){return THEMES[currentTheme]||THEMES.hope}
function contentText(){return type()==='prayer'?($('#socialPrayer')?.value||''):($('#socialVerse')?.value||'')}
function dynamicTagline(){
 const text=(contentText()+' '+($('#socialReference')?.value||'')).toLowerCase();
 if(/wisdom|guide|path|way|direct|decision/.test(text))return 'SEEK GOD’S WISDOM. LET HIM LEAD THE WAY.';
 if(/fear|afraid|anxious|anxiety|worry|peace/.test(text))return 'CHOOSE PEACE. GOD IS WITH YOU IN THIS MOMENT.';
 if(/strength|weak|weary|tired|courage/.test(text))return 'KEEP GOING. GOD WILL GIVE YOU STRENGTH.';
 if(/heal|healing|sick|pain|broken|restore/.test(text))return 'TRUST GOD WITH THE HEALING JOURNEY.';
 if(/thank|grateful|gratitude|praise|bless/.test(text))return 'REMEMBER HIS GOODNESS. GIVE THANKS TODAY.';
 if(/faith|believe|trust/.test(text))return 'TRUST GOD. KEEP WALKING BY FAITH.';
 if(/hope|wait|future|promise/.test(text))return 'HOLD ON TO HOPE. GOD IS STILL WORKING.';
 return currentData().tagline;
}
function reflectionForVerse(){
 const verse=($('#socialVerse')?.value||'').trim();
 const ref=($('#socialReference')?.value||'').trim();
 if(!verse)return currentData().reflection;
 const intro=ref?`${ref} reminds us that `:'This Scripture reminds us that ';
 const t=currentTheme;
 const truth={hope:'God’s promises give us reason to keep hoping even when circumstances are difficult.',faith:'trust in God is a daily choice that shapes how we respond to uncertainty.',peace:'God invites us to bring our worries to Him and receive peace that circumstances cannot provide.',guidance:'God gives wisdom and direction as we seek Him and follow His Word.',strength:'our strength is not limited to what we can produce on our own; God supplies what we need.',healing:'God remains present in pain and invites us to trust Him through every stage of healing.',gratitude:'remembering God’s goodness changes how we see today and strengthens our worship.'}[t]||currentData().reflection;
 return intro+truth;
}
function prayerForVerse(){
 const ref=($('#socialReference')?.value||'').trim();
 const base=currentData().prayer;
 return ref?`${base} Help me live out the truth of ${ref} today.`:base;
}
function setLegacyTheme(value){
 const select=$('#socialSpiritualTheme')||$('#socialThemeSelect')||$('#socialTheme');
 if(!select)return;
 const target=[...select.options].find(o=>String(o.value).toLowerCase()===value||String(o.textContent).trim().toLowerCase()===value);
 if(target){select.value=target.value;select.dispatchEvent(new Event('change',{bubbles:true}))}
}
function ensureThemeSelector(){
 const designer=$('#dmSocialDesigner');if(!designer||$('#dmPremiumSpiritualThemes'))return;
 const head=$('.dm-premium-head',designer);if(!head)return;
 const box=document.createElement('section');box.id='dmPremiumSpiritualThemes';box.innerHTML=`<h3>SPIRITUAL THEME</h3><div class="dm-spiritual-theme-grid">${Object.entries(THEMES).map(([k,v])=>`<button type="button" data-spiritual-theme="${k}" class="${k===currentTheme?'active':''}">${v.label}</button>`).join('')}</div>`;
 head.insertAdjacentElement('afterend',box);
 if(!$('#dmPremiumSpiritualThemeStyles')){const s=document.createElement('style');s.id='dmPremiumSpiritualThemeStyles';s.textContent=`#dmPremiumSpiritualThemes{max-width:980px;margin:0 auto 18px;padding:14px;border:1px solid var(--border,#d8dedb);border-radius:14px;background:var(--surface,#fff)}#dmPremiumSpiritualThemes h3{text-align:center;margin:0 0 10px;color:#274c3c}.dm-spiritual-theme-grid{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.dm-spiritual-theme-grid button{padding:9px 14px;border-radius:999px;border:1px solid var(--border,#d8dedb);background:var(--surface,#fff);font-weight:700}.dm-spiritual-theme-grid button.active{background:#2f7765;color:white;border-color:#2f7765}@media(max-width:520px){.dm-spiritual-theme-grid{display:grid;grid-template-columns:repeat(2,1fr)}.dm-spiritual-theme-grid button{width:100%}}`;document.head.appendChild(s)}
 box.addEventListener('click',e=>{const b=e.target.closest('[data-spiritual-theme]');if(!b)return;currentTheme=b.dataset.spiritualTheme;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));setLegacyTheme(currentTheme);syncEditors(true);schedule()});
}
function wrap(ctx,text,tx,ty,maxWidth,lineHeight,maxLines){const words=String(text).split(/\s+/);let line='',lines=[];for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;if(lines.length>=maxLines)break}else line=test}if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,tx,ty+i*lineHeight));}
function overlayLowerContent(){
 const c=$('#dmDesignerCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;if(!ctx||!w||!h)return;
 const prayerMode=type()==='prayer',y=Math.round(h*.59),x=Math.round(w*.075),contentW=Math.round(w*.85),boxH=Math.round(h*.18);
 const sample=ctx.getImageData(Math.max(0,Math.round(w*.03)),Math.max(0,Math.round(h*.5)),1,1).data;
 /* Clear the prototype lower boxes first. */
 ctx.fillStyle=`rgba(${sample[0]},${sample[1]},${sample[2]},.97)`;ctx.fillRect(0,y-24,w,Math.round(h*.32));
 if(!prayerMode){
  const gap=Math.round(w*.025),bw=Math.round((contentW-gap)/2);
  ctx.fillStyle='rgba(255,255,255,.62)';ctx.beginPath();ctx.roundRect(x,y,bw,boxH,24);ctx.fill();ctx.beginPath();ctx.roundRect(x+bw+gap,y,bw,boxH,24);ctx.fill();
  ctx.textAlign='left';ctx.fillStyle='rgba(70,55,40,.78)';ctx.font=`700 ${Math.max(20,Math.round(w*.02))}px Arial`;ctx.fillText('♡  REFLECTION',x+28,y+46);ctx.fillText('♧  PRAYER',x+bw+gap+28,y+46);
  ctx.fillStyle='rgba(45,38,32,.92)';ctx.font=`400 ${Math.max(20,Math.round(w*.018))}px Georgia,serif`;wrap(ctx,reflectionForVerse(),x+28,y+84,bw-56,Math.max(27,Math.round(w*.026)),4);wrap(ctx,prayerForVerse(),x+bw+gap+28,y+84,bw-56,Math.max(27,Math.round(w*.026)),4);
 }
 const tagY=Math.round(prayerMode?h*.80:h*.86);ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.68)';ctx.beginPath();ctx.roundRect(Math.round(w*.16),tagY,Math.round(w*.68),Math.round(h*.055),18);ctx.fill();ctx.fillStyle='rgba(45,38,32,.95)';ctx.font=`700 ${Math.max(16,Math.round(w*.018))}px Arial`;ctx.fillText(dynamicTagline(),w/2,tagY+Math.round(h*.035));
}
function syncEditors(force=false){
 const ref=$('#dmDesignerReflection'),prayer=$('#dmDesignerPrayer');
 if(type()==='prayer'){
  ref?.closest('label')?.style.setProperty('display','none','important');
  prayer?.closest('label')?.style.setProperty('display','none','important');
 }else{
  if(ref){ref.closest('label')?.style.removeProperty('display');if(force||ref.dataset.dmThemeManaged==='1'||!ref.value){ref.value=reflectionForVerse();ref.dataset.dmThemeManaged='1'}}
  if(prayer){prayer.closest('label')?.style.removeProperty('display');if(force||prayer.dataset.dmThemeManaged==='1'||!prayer.value){prayer.value=prayerForVerse();prayer.dataset.dmThemeManaged='1'}}
 }
}
function run(){if(location.hash!=='#socialstudio')return;ensureThemeSelector();syncEditors();setTimeout(overlayLowerContent,60);setTimeout(overlayLowerContent,220)}
function schedule(){clearTimeout(timer);timer=setTimeout(run,50)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('#dmSocialDesigner,#dmPremiumGenerateControls,[data-page="socialstudio"]'))setTimeout(()=>{syncEditors(true);schedule()},30)});
document.addEventListener('input',e=>{if(['socialVerse','socialPrayer','socialReference','socialType'].includes(e.target.id)){syncEditors(true);schedule()}});
document.addEventListener('change',e=>{if(e.target.id==='socialType'){syncEditors(true);schedule()}});
new MutationObserver(()=>{if(location.hash==='#socialstudio')schedule()}).observe(document.documentElement,{childList:true,subtree:true});
})();
