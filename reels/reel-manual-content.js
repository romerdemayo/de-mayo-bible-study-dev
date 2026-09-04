/* De Mayo Bible Studies — manual Reel content option v1
   Lets the user paste their own verse, reference, reflection and prayer while keeping Gemini/offline generation available. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let installed=false;
function clean(v=''){return String(v||'').replace(/\s+/g,' ').trim();}
function status(message,type='info'){const box=$('#dmManualReelStatus');if(box){box.hidden=false;box.dataset.type=type;box.textContent=message;}window.toast?.(message);}
function apply(){
 const api=window.DM_REEL_CREATOR;if(!api?.setGeneratedContent)return status('Reel Creator is not ready yet.','error');
 const reference=clean($('#dmManualReference')?.value),verse=clean($('#dmManualVerse')?.value),reflection=clean($('#dmManualReflection')?.value),prayer=clean($('#dmManualPrayer')?.value),title=clean($('#dmManualTitle')?.value)||'My Bible Encouragement';
 if(!reference||!verse||!reflection||!prayer)return status('Please add the verse reference, verse, reflection and prayer first.','error');
 const current=api.getContent?.()||{};
 api.setGeneratedContent({title,label:'My Content',contentType:current.contentType||'devotional',reference,verse,reflection,prayer,caption:`${reflection} What part of this message speaks to you today?`,hashtags:'#BibleVerse #ChristianEncouragement #Faith #DeMayoBibleStudies',language:$('#dmReelLanguage')?.value||'English',source:'Manual'});
 setTimeout(()=>window.DM_REEL_VOICEOVER_DURATION_FIX?.apply?.(),80);
 status('✅ Your own content is now loaded into the Reel. You can preview, record your voice-over and create the MP4.','success');
 window.scrollTo({top:0,behavior:'smooth'});
}
function useCurrent(){const c=window.DM_REEL_CREATOR?.getContent?.()||{};if($('#dmManualTitle'))$('#dmManualTitle').value=c.title||'';if($('#dmManualReference'))$('#dmManualReference').value=c.reference||'';if($('#dmManualVerse'))$('#dmManualVerse').value=c.verse||'';if($('#dmManualReflection'))$('#dmManualReflection').value=c.reflection||'';if($('#dmManualPrayer'))$('#dmManualPrayer').value=c.prayer||'';status('Current Reel content copied into the manual editor.','info');}
function clear(){['dmManualTitle','dmManualReference','dmManualVerse','dmManualReflection','dmManualPrayer'].forEach(id=>{const el=$('#'+id);if(el)el.value='';});const box=$('#dmManualReelStatus');if(box)box.hidden=true;}
function install(){
 if(installed||location.hash!=='#reelcreator')return;
 const anchor=$('#dmReelGeminiPanel')||$('.dm-reel-controls');if(!anchor){setTimeout(install,120);return;}
 installed=true;
 const card=document.createElement('section');card.id='dmManualReelCard';card.className='card';card.innerHTML=`<span class="pill">YOUR OWN CONTENT</span><h3>✍️ Paste My Verse, Reflection & Prayer</h3><p>Use your own prepared Bible content without replacing Gemini or offline generation. After loading it, all the normal Reel, voice-over, timing and MP4 tools stay available.</p><div class="dm-form-grid"><label>Title (optional)<input id="dmManualTitle" type="text" placeholder="My Bible Encouragement"></label><label>Verse reference<input id="dmManualReference" type="text" placeholder="e.g. Psalm 46:10"></label></div><label>Verse<textarea id="dmManualVerse" rows="4" placeholder="Paste the full Bible verse here"></textarea></label><label>Reflection<textarea id="dmManualReflection" rows="6" placeholder="Paste your reflection or encouragement here"></textarea></label><label>Prayer<textarea id="dmManualPrayer" rows="5" placeholder="Paste your prayer here"></textarea></label><div class="dm-reel-actions"><button type="button" id="dmManualUseCurrent">↙ Use Current Reel</button><button type="button" id="dmManualApply" class="primary">✨ Create Reel From My Content</button><button type="button" id="dmManualClear">Clear</button></div><p id="dmManualReelStatus" class="small-note" hidden></p>`;
 anchor.insertAdjacentElement('afterend',card);
 $('#dmManualApply').onclick=apply;$('#dmManualUseCurrent').onclick=useCurrent;$('#dmManualClear').onclick=clear;
}
function boot(){install();document.addEventListener('dm-reel-studio-ready',install);window.addEventListener('hashchange',()=>setTimeout(install,80));}
window.DM_REEL_MANUAL_CONTENT={install,apply,useCurrent,clear};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
