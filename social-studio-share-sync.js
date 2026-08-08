/* De Mayo Bible Studies — Social Studio share sync hotfix */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function toast(m){window.toast?.(m)}
function current(){
 const type=$('#socialType')?.value==='prayer'?'prayer':'verse';
 return {
  type,
  body:String(type==='prayer'?($('#socialPrayer')?.value||''):($('#socialVerse')?.value||'')).trim(),
  reference:type==='verse'?String($('#socialReference')?.value||'').trim():'Prayer',
  caption:String($('#socialCaption')?.value||'').trim(),
  hashtags:String($('#socialHashtags')?.value||'').trim()
 };
}
function shareText(item){
 const parts=[];
 if(item.type==='verse'&&item.reference)parts.push(item.reference);
 if(item.body)parts.push(item.body);
 if(item.caption&&!item.caption.includes(item.body))parts.push(item.caption);
 if(item.hashtags)parts.push(item.hashtags);
 return parts.filter(Boolean).join('\n\n');
}
async function shareCurrent(event){
 event?.preventDefault();event?.stopImmediatePropagation();
 const item=current();if(!item.body)return toast('Generate a prayer or Bible verse first.');
 const canvas=$('#dmDesignerCanvas');
 if(!canvas)return toast('Preview is not ready yet.');
 const text=shareText(item);
 canvas.toBlob(async blob=>{
  if(!blob)return toast('Could not prepare the image.');
  try{
   const file=new File([blob],item.type==='prayer'?'de-mayo-prayer.png':'de-mayo-bible-verse.png',{type:'image/png'});
   if(navigator.canShare?.({files:[file]})){
    await navigator.share({files:[file],title:item.type==='prayer'?'De Mayo Bible Studies Prayer':item.reference||'De Mayo Bible Studies',text});
   }else if(navigator.share){
    await navigator.share({title:'De Mayo Bible Studies',text});
   }else toast('Sharing is not supported here. Use Save PNG and Copy Caption.');
  }catch(e){if(e?.name!=='AbortError')toast('Could not share this post. Please try again.');}
 },'image/png');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('#dmDesignerShare');
 if(b)shareCurrent(e);
},true);
})();
