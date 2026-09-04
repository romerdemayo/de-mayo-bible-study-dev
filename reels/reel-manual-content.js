/* De Mayo Bible Studies — manual Reel content option v3
   One-paste mode: paste verse/reference/reflection/prayer in one box; app parses it, creates a title, and loads it into normal Reel/voice-over flow. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let installed=false,lastManual=null;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function words(v=''){return clean(v).split(' ').filter(Boolean);}
function status(message,type='info'){const box=$('#dmManualReelStatus');if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}window.toast?.(message);}
function titleFrom(reference,reflection){
 const text=clean(reflection).toLowerCase();
 const rules=[[/peace|anxious|worry|fear/,'Peace for Today'],[/hope|waiting|discourag/,'Hope for Today'],[/trust|faith|believ/,'Faith for Today'],[/strength|weak|tired/,'Strength for Today'],[/forgiv|grace|mercy/,'Grace for Today'],[/thank|gratitude|grateful/,'A Grateful Heart'],[/courage|brave|afraid/,'Courage for Today'],[/love|loving/,'Walking in Love'],[/pray|prayer/,'A Prayerful Heart']];
 for(const [re,title] of rules)if(re.test(text))return title;
 return reference?`${reference} — Encouragement for Today`:'Bible Encouragement for Today';
}
function extractReference(text){
 const patterns=[/(?:reference|scripture|verse reference)\s*[:\-]\s*([^\n]+)/i,/\b((?:[1-3]\s*)?[A-Za-z][A-Za-z ]{1,20}\s+\d{1,3}:\d{1,3}(?:-\d{1,3})?)\b/];
 for(const re of patterns){const m=text.match(re);if(m)return clean(m[1]);}
 return '';
}
function section(text,label,nextLabels){
 const next=nextLabels.join('|');
 const re=new RegExp(`(?:^|\\n)\\s*${label}\\s*[:\\-]?\\s*([\\s\\S]*?)(?=\\n\\s*(?:${next})\\s*[:\\-]?|$)`,'i');
 const m=text.match(re);return m?clean(m[1]):'';
}
function parseOnePaste(raw){
 const text=String(raw||'').replace(/\r/g,'').trim();if(!text)return null;
 let reference=extractReference(text);
 let verse=section(text,'(?:verse|scripture)', ['reflection','message','prayer']);
 let reflection=section(text,'(?:reflection|message|encouragement)', ['prayer']);
 let prayer=section(text,'prayer', ['$a']);
 if(verse&&reference)verse=clean(verse.replace(reference,''));
 if(!verse||!reflection||!prayer){
   const blocks=text.split(/\n\s*\n+/).map(clean).filter(Boolean);
   if(reference){
     const refIndex=blocks.findIndex(b=>b.includes(reference));
     if(!verse){const candidate=refIndex>=0?blocks[refIndex].replace(reference,'').replace(/^(?:verse|scripture)\s*[:\-]?\s*/i,''):blocks[0];verse=clean(candidate);}
     const remaining=blocks.filter((_,i)=>i!==refIndex).filter(b=>!/^\s*(?:reference|scripture reference)\s*[:\-]/i.test(b));
     if(!reflection&&remaining.length>=2)reflection=clean(remaining[remaining.length-2].replace(/^(?:reflection|message|encouragement)\s*[:\-]?\s*/i,''));
     if(!prayer&&remaining.length>=1)prayer=clean(remaining[remaining.length-1].replace(/^prayer\s*[:\-]?\s*/i,''));
   }
 }
 return {reference:clean(reference),verse:clean(verse),reflection:clean(reflection),prayer:clean(prayer)};
}
function syncReading(content=lastManual){
 if(!content)return false;
 const text=[content.verse,content.reference,'Let us reflect.',content.reflection,'Let us pray.',content.prayer].filter(Boolean).join('\n\n');
 const area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');
 if(area){area.textContent=text;area.scrollTop=0;}
 if(full){full.textContent=text;full.scrollTop=0;}
 const info=$('#dmVoiceoverWordCount');if(info){const count=words(text).length,estimate=Math.ceil(count/96*60);info.textContent=`${count} words • about ${estimate} seconds • your pasted reading script`;}
 return !!(area||full);
}
function scheduleReadingSync(){[40,160,400,900].forEach(delay=>setTimeout(()=>{syncReading();window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.();setTimeout(()=>syncReading(),25);},delay));}
function loadContent({reference,verse,reflection,prayer,title}){
 const api=window.DM_REEL_CREATOR;if(!api?.setGeneratedContent)return status('Reel Creator is not ready yet.','error');
 if(!reference||!verse||!reflection||!prayer)return status('I could not clearly separate the reference, verse, reflection and prayer. Add simple labels such as Verse:, Reflection:, Prayer:, then try again.','error');
 const current=api.getContent?.()||{};const finalTitle=clean(title)||titleFrom(reference,reflection);
 lastManual={title:finalTitle,label:'My Content',contentType:current.contentType||'devotional',reference,verse,reflection,prayer,caption:`${reflection} What part of this message speaks to you today?`,hashtags:'#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies',language:$('#dmReelLanguage')?.value||'English',source:'Manual'};
 api.setGeneratedContent(lastManual);
 document.dispatchEvent(new CustomEvent('dm-reel-manual-content-ready',{detail:{content:lastManual}}));
 scheduleReadingSync();
 status(`✅ Your content is in the Reel as “${finalTitle}”. The reading script has also been updated for your voice-over.`,'success');
 window.scrollTo({top:0,behavior:'smooth'});
}
function applyOnePaste(){const parsed=parseOnePaste($('#dmManualAllInOne')?.value);if(!parsed)return status('Paste your verse, reflection and prayer first.','error');loadContent(parsed);}
function applySeparate(){loadContent({reference:clean($('#dmManualReference')?.value),verse:clean($('#dmManualVerse')?.value),reflection:clean($('#dmManualReflection')?.value),prayer:clean($('#dmManualPrayer')?.value),title:clean($('#dmManualTitle')?.value)});}
function useCurrent(){const c=window.DM_REEL_CREATOR?.getContent?.()||{};if($('#dmManualAllInOne'))$('#dmManualAllInOne').value=`Reference: ${c.reference||''}\n\nVerse: ${c.verse||''}\n\nReflection: ${c.reflection||''}\n\nPrayer: ${c.prayer||''}`;if($('#dmManualTitle'))$('#dmManualTitle').value=c.title||'';if($('#dmManualReference'))$('#dmManualReference').value=c.reference||'';if($('#dmManualVerse'))$('#dmManualVerse').value=c.verse||'';if($('#dmManualReflection'))$('#dmManualReflection').value=c.reflection||'';if($('#dmManualPrayer'))$('#dmManualPrayer').value=c.prayer||'';status('Current Reel content copied into the manual editor.','info');}
function clear(){lastManual=null;['dmManualAllInOne','dmManualTitle','dmManualReference','dmManualVerse','dmManualReflection','dmManualPrayer'].forEach(id=>{const el=$('#'+id);if(el)el.value='';});const box=$('#dmManualReelStatus');if(box)box.hidden=true;}
function install(){
 if(installed||location.hash!=='#reelcreator')return;
 const anchor=$('#dmReelGeminiPanel')||$('.dm-reel-controls');if(!anchor){setTimeout(install,120);return;}
 installed=true;
 const card=document.createElement('section');card.id='dmManualReelCard';card.className='card';card.innerHTML=`<span class="pill">YOUR OWN CONTENT</span><h3>✍️ Paste My Verse, Reflection & Prayer</h3><p><b>Quickest option:</b> paste everything in one box. I will pick out the Bible reference, verse, reflection and prayer, then create a Reel title automatically. Your normal design, voice-over, timing and MP4 tools stay available.</p><label>Paste everything here<textarea id="dmManualAllInOne" rows="12" placeholder="Reference: Psalm 46:10\n\nVerse: Be still, and know that I am God...\n\nReflection: Sometimes we need to stop trying to control everything...\n\nPrayer: Father, help me be still and trust You..."></textarea></label><div class="dm-reel-actions"><button type="button" id="dmManualOnePaste" class="primary">✨ Create Reel From One Paste</button><button type="button" id="dmManualUseCurrent">↙ Use Current Reel</button><button type="button" id="dmManualClear">Clear</button></div><details><summary><b>Or enter each part separately</b></summary><div class="dm-form-grid"><label>Title (optional)<input id="dmManualTitle" type="text" placeholder="Leave blank for automatic title"></label><label>Verse reference<input id="dmManualReference" type="text" placeholder="e.g. Psalm 46:10"></label></div><label>Verse<textarea id="dmManualVerse" rows="4"></textarea></label><label>Reflection<textarea id="dmManualReflection" rows="6"></textarea></label><label>Prayer<textarea id="dmManualPrayer" rows="5"></textarea></label><button type="button" id="dmManualApply">Create Reel From These Fields</button></details><p id="dmManualReelStatus" class="small-note" hidden></p>`;
 anchor.insertAdjacentElement('afterend',card);
 $('#dmManualOnePaste').onclick=applyOnePaste;$('#dmManualApply').onclick=applySeparate;$('#dmManualUseCurrent').onclick=useCurrent;$('#dmManualClear').onclick=clear;
 document.addEventListener('click',e=>{if(e.target?.id==='dmRefreshVoiceoverScript'&&lastManual)setTimeout(()=>syncReading(),70);});
}
function boot(){install();document.addEventListener('dm-reel-studio-ready',install);window.addEventListener('hashchange',()=>setTimeout(install,80));}
window.DM_REEL_MANUAL_CONTENT={install,applyOnePaste,applySeparate,useCurrent,clear,parseOnePaste,titleFrom,syncReading};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();