/* De Mayo Bible Studies — Premium Social Studio theme + lower-content polish */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const THEMES={
 hope:{label:'Hope',reflection:'God is still working even when you cannot see the whole picture. Hold on to His promises and keep moving forward in faith.',tagline:'KEEP HOPING. GOD IS STILL AT WORK.'},
 faith:{label:'Faith',reflection:'Faith chooses to trust God beyond what is visible. Keep believing His character, His Word, and His timing.',tagline:'WALK BY FAITH. TRUST GOD WITH THE NEXT STEP.'},
 peace:{label:'Peace',reflection:'God’s peace is not dependent on perfect circumstances. Bring your worries to Him and rest in His presence today.',tagline:'CHOOSE PEACE. GOD IS WITH YOU IN THIS MOMENT.'},
 guidance:{label:'Guidance',reflection:'You do not have to know every step before you move. Ask God for wisdom, stay close to His Word, and follow the direction He gives.',tagline:'SEEK GOD’S WISDOM. LET HIM LEAD THE WAY.'},
 strength:{label:'Strength',reflection:'God meets you in weakness with strength that is greater than your own. Keep leaning on Him when the journey feels heavy.',tagline:'KEEP GOING. GOD WILL GIVE YOU STRENGTH.'},
 healing:{label:'Healing',reflection:'Healing can be a process, but God remains present in every part of it. Bring Him your pain and trust Him with what you cannot repair yourself.',tagline:'GOD IS NEAR. KEEP BRINGING HIM YOUR HEART.'},
 gratitude:{label:'Gratitude',reflection:'Gratitude helps us notice God’s faithfulness in ordinary moments. Remember what He has done and thank Him for what He is still doing.',tagline:'REMEMBER HIS GOODNESS. GIVE THANKS TODAY.'}
};
let currentTheme='hope',timer=0;
function type(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function currentData(){return THEMES[currentTheme]||THEMES.hope}
function setLegacyTheme(value){
 const select=$('#socialSpiritualTheme')||$('#socialThemeSelect')||$('#socialTheme');
 if(select){
  const target=[...select.options].find(o=>String(o.value).toLowerCase()===value||String(o.textContent).trim().toLowerCase()===value);
  if(target){select.value=target.value;select.dispatchEvent(new Event('change',{bubbles:true}))}
 }
}
function ensureThemeSelector(){
 const designer=$('#dmSocialDesigner');if(!designer||$('#dmPremiumSpiritualThemes'))return;
 const head=$('.dm-premium-head',designer);if(!head)return;
 const box=document.createElement('section');box.id='dmPremiumSpiritualThemes';box.innerHTML=`<h3>SPIRITUAL THEME</h3><div class="dm-spiritual-theme-grid">${Object.entries(THEMES).map(([k,v])=>`<button type="button" data-spiritual-theme="${k}" class="${k===currentTheme?'active':''}">${v.label}</button>`).join('')}</div>`;
 head.insertAdjacentElement('afterend',box);
 if(!$('#dmPremiumSpiritualThemeStyles')){const s=document.createElement('style');s.id='dmPremiumSpiritualThemeStyles';s.textContent=`#dmPremiumSpiritualThemes{max-width:980px;margin:0 auto 18px;padding:14px;border:1px solid var(--border,#d8dedb);border-radius:14px;background:var(--surface,#fff)}#dmPremiumSpiritualThemes h3{text-align:center;margin:0 0 10px;color:#274c3c}.dm-spiritual-theme-grid{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.dm-spiritual-theme-grid button{padding:9px 14px;border-radius:999px;border:1px solid var(--border,#d8dedb);background:var(--surface,#fff);font-weight:700}.dm-spiritual-theme-grid button.active{background:#2f7765;color:white;border-color:#2f7765}@media(max-width:520px){.dm-spiritual-theme-grid{display:grid;grid-template-columns:repeat(2,1fr)}.dm-spiritual-theme-grid button{width:100%}}`;document.head.appendChild(s)}
 box.addEventListener('click',e=>{const b=e.target.closest('[data-spiritual-theme]');if(!b)return;currentTheme=b.dataset.spiritualTheme;box.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));setLegacyTheme(currentTheme);const ref=$('#dmDesignerReflection');if(ref){ref.value=currentData().reflection;ref.dataset.dmThemeManaged='1'}run()});
}
function generatedPrayer(){
 const d=currentData(),ref=$('#socialReference')?.value||'this Scripture';
 const map={
  hope:`Lord, fill me with hope through Your Word in ${ref}. Help me trust Your promises even when I cannot yet see what You are doing.`,
  faith:`Lord, strengthen my faith through ${ref}. Help me trust You beyond what I can see and obey You one step at a time.`,
  peace:`Lord, let the truth of ${ref} quiet my heart. Help me release my worries to You and receive Your peace today.`,
  guidance:`Lord, use ${ref} to guide me. Give me wisdom, clarity, and courage to follow the direction You provide.`,
  strength:`Lord, strengthen me through ${ref}. When I feel weak, remind me that Your strength is enough for me.`,
  healing:`Lord, bring Your comfort and healing through ${ref}. Help me trust You with every part of my pain and recovery.`,
  gratitude:`Lord, thank You for the truth of ${ref}. Help me notice Your goodness and respond with a grateful heart.`
 };
 return map[currentTheme]||map.hope;
}
function overlayLowerContent(){
 const c=$('#dmDesignerCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;if(!ctx||!w||!h)return;
 const d=currentData(),prayerMode=type()==='prayer';
 const y=Math.round(h*.53),x=Math.round(w*.075),contentW=Math.round(w*.85),boxH=Math.round(h*.19);
 const sample=ctx.getImageData(Math.max(0,Math.round(w*.03)),Math.max(0,Math.round(h*.46)),1,1).data;
 /* Clear the complete legacy lower-content zone before painting the final version. */
 ctx.fillStyle=`rgba(${sample[0]},${sample[1]},${sample[2]},.98)`;ctx.fillRect(0,Math.round(h*.45),w,Math.round(h*.48));
 const wrap=(text,tx,ty,maxWidth,lineHeight,maxLines)=>{const words=String(text).split(/\s+/);let line='',lines=[];for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;if(lines.length>=maxLines)break}else line=test}if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,tx,ty+i*lineHeight));};
 if(!prayerMode){
  const gap=Math.round(w*.025),bw=Math.round((contentW-gap)/2);ctx.fillStyle='rgba(255,255,255,.66)';ctx.beginPath();ctx.roundRect(x,y,bw,boxH,24);ctx.fill();ctx.beginPath();ctx.roundRect(x+bw+gap,y,bw,boxH,24);ctx.fill();ctx.textAlign='left';ctx.fillStyle='rgba(70,55,40,.78)';ctx.font=`700 ${Math.max(20,Math.round(w*.02))}px Arial`;ctx.fillText('♡  REFLECTION',x+28,y+46);ctx.fillText('♧  PRAYER',x+bw+gap+28,y+46);ctx.fillStyle='rgba(45,38,32,.92)';ctx.font=`400 ${Math.max(20,Math.round(w*.018))}px Georgia,serif`;wrap(d.reflection,x+28,y+84,bw-56,Math.max(27,Math.round(w*.026)),4);wrap(generatedPrayer(),x+bw+gap+28,y+84,bw-56,Math.max(27,Math.round(w*.026)),4);
 }
 const tagY=Math.round(h*.79);ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.72)';ctx.beginPath();ctx.roundRect(Math.round(w*.14),tagY,Math.round(w*.72),Math.round(h*.06),18);ctx.fill();ctx.fillStyle='rgba(45,38,32,.95)';ctx.font=`700 ${Math.max(16,Math.round(w*.018))}px Arial`;ctx.fillText(d.tagline,w/2,tagY+Math.round(h*.039));
 /* Repaint branding because the clear zone intentionally covers the old fixed tagline/footer area. */
 const brand=$('#dmDesignerBrand')?.value||'De Mayo Bible Studies';ctx.font=`600 ${Math.max(16,w*.018)}px Arial`;ctx.letterSpacing='5px';ctx.fillText(brand.toUpperCase(),w/2,h-h*.035);ctx.letterSpacing='0px';
}
function syncEditors(){
 const ref=$('#dmDesignerReflection');if(ref&&(!ref.value||ref.dataset.dmThemeManaged==='1')){ref.value=currentData().reflection;ref.dataset.dmThemeManaged='1'}
 const prayerLabel=$('#dmDesignerPrayer')?.closest('label');if(prayerLabel)prayerLabel.style.display=type()==='prayer'?'none':'';
 const refLabel=$('#dmDesignerReflection')?.closest('label');if(refLabel)refLabel.style.display=type()==='prayer'?'none':'';
}
function run(){if(location.hash!=='#socialstudio')return;ensureThemeSelector();syncEditors();overlayLowerContent()}
function schedule(){clearTimeout(timer);timer=setTimeout(run,0)}
window.addEventListener('load',schedule);window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('#dmSocialDesigner,#dmPremiumGenerateControls,[data-page="socialstudio"]'))schedule()});
document.addEventListener('input',e=>{if(['socialVerse','socialPrayer','socialReference','socialType','dmDesignerPrayer','dmDesignerReflection'].includes(e.target.id))run()});
document.addEventListener('change',e=>{if(e.target.id==='socialType')run()});
})();
