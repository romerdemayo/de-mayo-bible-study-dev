/* De Mayo Bible Studies — Social Studio reliable native image sharing */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function toast(m){window.toast?.(m)}
function current(){const type=$('#socialType')?.value==='prayer'?'prayer':'verse';return{type,body:String(type==='prayer'?($('#socialPrayer')?.value||''):($('#socialVerse')?.value||'')).trim(),reference:type==='verse'?String($('#socialReference')?.value||'').trim():'Prayer',caption:String($('#socialCaption')?.value||'').trim(),hashtags:String($('#socialHashtags')?.value||'').trim()}}
function shareText(x){return [x.type==='verse'?x.reference:'',x.body,x.caption&&!x.caption.includes(x.body)?x.caption:'',x.hashtags].filter(Boolean).join('\n\n')}
function blobFromCanvas(canvas){return new Promise((resolve,reject)=>{try{canvas.toBlob(b=>b?resolve(b):reject(new Error('blob')),'image/png')}catch(e){reject(e)}})}
async function shareCurrent(event){event?.preventDefault();event?.stopImmediatePropagation();const item=current();if(!item.body)return toast('Generate a prayer or Bible verse first.');const canvas=$('#dmDesignerCanvas');if(!canvas)return toast('Preview is not ready yet.');try{
 /* Force the latest designer state to finish painting before snapshotting. */
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const blob=await blobFromCanvas(canvas),file=new File([blob],item.type==='prayer'?'de-mayo-prayer.png':'de-mayo-bible-verse.png',{type:'image/png',lastModified:Date.now()}),payload={files:[file],title:item.type==='prayer'?'De Mayo Bible Studies Prayer':item.reference||'De Mayo Bible Studies',text:shareText(item)};
 /* iOS/Safari only attaches the image when file sharing itself is supported. Never silently fall back to text-only sharing. */
 if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share(payload);return}
 /* If file attachment sharing is unavailable, save the actual PNG instead of opening a misleading text-only share sheet. */
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);toast('Image sharing is not supported by this browser. The PNG was saved instead.');
 }catch(e){if(e?.name!=='AbortError'){console.error('Social share failed',e);toast('Could not attach the image. Please use Save PNG and share the saved image.')}}}
document.addEventListener('click',e=>{const b=e.target.closest('#dmDesignerShare');if(b)shareCurrent(e)},true);
})();