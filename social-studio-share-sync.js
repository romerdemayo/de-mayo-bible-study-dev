/* De Mayo Bible Studies — Social Studio reliable native image sharing */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function toast(m){window.toast?.(m)}
function current(){const type=$('#socialType')?.value==='prayer'?'prayer':'verse';return{type,body:String(type==='prayer'?($('#socialPrayer')?.value||''):($('#socialVerse')?.value||'')).trim(),reference:type==='verse'?String($('#socialReference')?.value||'').trim():'Prayer',caption:String($('#socialCaption')?.value||'').trim(),hashtags:String($('#socialHashtags')?.value||'').trim()}}
function shareText(x){return [x.caption,x.hashtags].filter(Boolean).join('\n\n')}
function blobFromCanvas(canvas){return new Promise((resolve,reject)=>{try{canvas.toBlob(b=>b?resolve(b):reject(new Error('blob')),'image/png')}catch(e){reject(e)}})}
async function shareCurrent(event){event?.preventDefault();event?.stopImmediatePropagation();const item=current();if(!item.body)return toast('Generate a prayer or Bible verse first.');const canvas=$('#dmDesignerCanvas');if(!canvas)return toast('Preview is not ready yet.');try{
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const blob=await blobFromCanvas(canvas);
 const file=new File([blob],item.type==='prayer'?'de-mayo-prayer.png':'de-mayo-bible-verse.png',{type:'image/png',lastModified:Date.now()});
 /* Important for iOS Facebook: share the FILE by itself. Facebook can discard the image when Web Share sends files + text together. */
 if(navigator.share&&navigator.canShare?.({files:[file]})){
   try{await navigator.share({files:[file]});return}catch(e){if(e?.name==='AbortError')return;console.warn('File-only share failed',e)}
 }
 const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 /* Put caption on clipboard separately because Facebook's iOS composer does not reliably accept both a Web Share image and supplied text. */
 const text=shareText(item);if(text&&navigator.clipboard){try{await navigator.clipboard.writeText(text);toast('PNG saved. Caption copied — attach the image in Facebook and paste the caption.');return}catch(_){}}
 toast('PNG saved. Attach the saved image in Facebook.');
 }catch(e){if(e?.name!=='AbortError'){console.error('Social share failed',e);toast('Could not attach the image. Please use Save PNG and share the saved image.')}}}
document.addEventListener('click',e=>{const b=e.target.closest('#dmDesignerShare');if(b)shareCurrent(e)},true);
})();