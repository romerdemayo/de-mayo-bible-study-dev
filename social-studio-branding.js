/* De Mayo Bible Studies - Social Studio ministry branding */
(function(){
'use strict';
const SETTINGS_KEY='dm_social_branding_settings';
const MAIN_URL='https://romerdemayo.github.io/de-mayo-bible-study/';
const MARKER='--- De Mayo Bible Studies ---';
const $=s=>document.querySelector(s);
let applying=false,timer=0;

const defaults={enabled:true,style:'invitation'};
function readSettings(){try{return {...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch{return {...defaults}}}
function saveSettings(next){localStorage.setItem(SETTINGS_KEY,JSON.stringify(next))}
function notify(message){if(typeof window.toast==='function')window.toast(message)}
function currentType(){return $('#socialType')?.value==='prayer'?'prayer':'verse'}
function footerText(type,style){
 if(style==='minimal')return `Free Bible App\n${MAIN_URL}`;
 if(style==='simple')return `📖 De Mayo Bible Studies\n${MAIN_URL}`;
 if(type==='prayer')return `🙏 Continue your walk with God through free prayers, Bible studies, devotionals, and ministry tools in De Mayo Bible Studies.\n${MAIN_URL}`;
 return `📖 Continue studying God’s Word for free with De Mayo Bible Studies. Explore Bible studies, devotionals, prayers, kids lessons, and ministry tools.\n${MAIN_URL}`;
}
function stripFooter(text=''){
 const value=String(text);
 const markerIndex=value.indexOf(`\n\n${MARKER}`);
 return (markerIndex>=0?value.slice(0,markerIndex):value).trim();
}
function brandedCaption(text){
 const settings=readSettings(),base=stripFooter(text);
 if(!settings.enabled||!base)return base;
 return `${base}\n\n${MARKER}\n${footerText(currentType(),settings.style)}`;
}
function updateCaption(force=false){
 const field=$('#socialCaption');if(!field||applying)return;
 const next=brandedCaption(field.value);
 if(!force&&next===field.value){decoratePreview();return}
 applying=true;field.value=next;field.dispatchEvent(new Event('input',{bubbles:true}));applying=false;
 decoratePreview();
}
function ensureLabel(id,text,target){
 let label=$('#'+id);
 if(!label){
  label=document.createElement('span');
  label.id=id;
  label.className='eyebrow';
  label.style.display='block';
  label.style.margin='14px 0 6px';
  target.parentNode.insertBefore(label,target);
 }
 label.textContent=text;
}
function decoratePreview(){
 const preview=$('.social-post-preview');
 if(!preview)return;
 const duplicate=$('#dmSocialMainAppLink');
 if(duplicate)duplicate.remove();
 const caption=$('#socialPreviewCaption');
 const hashtags=$('#socialPreviewHashtags');
 if(caption)ensureLabel('dmSocialCaptionLabel','CAPTION',caption);
 if(hashtags)ensureLabel('dmSocialHashtagLabel','HASHTAGS',hashtags);
}
function renderSettings(){
 const controls=$('.social-controls');if(!controls)return;
 let card=$('#dmSocialBrandingSettings');
 if(!card){card=document.createElement('article');card.id='dmSocialBrandingSettings';card.className='card';const anchor=$('#dmSocialV2Panel')||controls;anchor.insertAdjacentElement('afterend',card)}
 const settings=readSettings();
 card.innerHTML=`<div class="section-heading compact"><div><span class="eyebrow">MINISTRY BRANDING</span><h3>📖 Bring readers back to the Bible app</h3></div></div>
 <label class="check-row"><input type="checkbox" id="dmBrandingEnabled" ${settings.enabled?'checked':''}> Include the De Mayo Bible Studies link in captions</label>
 <label>Caption footer style<select id="dmBrandingStyle"><option value="invitation" ${settings.style==='invitation'?'selected':''}>Invitation</option><option value="simple" ${settings.style==='simple'?'selected':''}>Simple</option><option value="minimal" ${settings.style==='minimal'?'selected':''}>Minimal</option></select></label>
 <p class="small-note">The production link appears once inside the caption. Facebook will make the full URL clickable after posting.</p>
 <p><a href="${MAIN_URL}" target="_blank" rel="noopener noreferrer" class="text-link">${MAIN_URL}</a></p>
 <div class="social-auto-actions"><button class="ghost" id="dmApplyBranding">Apply to current caption</button></div>`;
 $('#dmBrandingEnabled').onchange=e=>{const next={...readSettings(),enabled:e.target.checked};saveSettings(next);updateCaption(true);notify(e.target.checked?'Website link enabled':'Website link removed')};
 $('#dmBrandingStyle').onchange=e=>{const next={...readSettings(),style:e.target.value};saveSettings(next);updateCaption(true);notify('Caption footer updated')};
 $('#dmApplyBranding').onclick=e=>{e.preventDefault();updateCaption(true);notify('Production website link added to caption')};
 decoratePreview();
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{renderSettings();updateCaption();decoratePreview()},80)}

document.addEventListener('input',e=>{if((e.target?.id==='socialCaption'||e.target?.id==='socialHashtags')&&!applying)schedule()});
document.addEventListener('change',e=>{if(e.target?.id==='socialType')schedule()});
document.addEventListener('click',e=>{if(e.target.closest('[data-page="socialstudio"]'))schedule()});
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
schedule();
})();
