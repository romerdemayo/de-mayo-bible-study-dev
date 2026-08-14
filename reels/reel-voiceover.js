/* De Mayo Bible Studies - optional recorded Reel narration */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let recorder=null,stream=null,chunks=[],startedAt=0,timer=null,previewUrl='';
window.DM_REEL_VOICEOVER_BLOB=null;
window.DM_REEL_VOICEOVER_DURATION=0;
function status(message,type='info'){const box=$('#dmVoiceoverStatus');if(box){box.hidden=false;box.dataset.type=type;box.textContent=message}window.toast?.(message)}
function script(){const c=window.DM_REEL_CREATOR?.getContent?.()||{};return [c.title,c.verse,c.reference,c.reflection,'Let us pray.',c.prayer].filter(Boolean).join('\n\n')}
function refreshScript(){const area=$('#dmVoiceoverScript');if(area)area.value=script()}
function supportedType(){return['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported(type))||''}
function cleanupStream(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null}}
function updateTimer(){const el=$('#dmVoiceoverTimer');if(el)el.textContent=`${Math.floor((Date.now()-startedAt)/60000)}:${String(Math.floor((Date.now()-startedAt)/1000)%60).padStart(2,'0')}`}
async function start(){
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)return status('Voice recording is not supported in this browser.','error');
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  chunks=[];const mime=supportedType();recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
  recorder.ondataavailable=event=>event.data.size&&chunks.push(event.data);
  recorder.onstop=finish;
  recorder.start(500);startedAt=Date.now();timer=setInterval(updateTimer,250);updateTimer();
  $('#dmStartVoiceover').hidden=true;$('#dmStopVoiceover').hidden=false;$('#dmDeleteVoiceover').disabled=true;
  status('Recording… Read the script naturally, then tap Stop.','loading');
 }catch(error){console.error(error);cleanupStream();status(error?.name==='NotAllowedError'?'Microphone permission was not allowed. Enable microphone access for Safari and try again.':'The microphone could not start.','error')}
}
function stop(){if(recorder&&recorder.state!=='inactive')recorder.stop()}
function finish(){
 const recordedSeconds=Math.max(1,(Date.now()-startedAt)/1000);clearInterval(timer);timer=null;cleanupStream();$('#dmStartVoiceover').hidden=false;$('#dmStopVoiceover').hidden=true;
 const type=recorder?.mimeType||chunks[0]?.type||'audio/mp4',blob=new Blob(chunks,{type});recorder=null;
 if(!blob.size)return status('No voice recording was captured. Please try again.','error');
 window.DM_REEL_VOICEOVER_BLOB=blob;window.DM_REEL_VOICEOVER_DURATION=recordedSeconds;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(blob);
 const audio=$('#dmVoiceoverPreview');audio.src=previewUrl;audio.hidden=false;$('#dmDeleteVoiceover').disabled=false;
 status(`Voice-over ready (${Math.max(1,Math.round(blob.size/1024))} KB). It will be mixed into the next MP4.`,'success');
 document.dispatchEvent(new CustomEvent('dm-reel-voiceover-ready',{detail:{blob}}));
}
function remove(){window.DM_REEL_VOICEOVER_BLOB=null;window.DM_REEL_VOICEOVER_DURATION=0;if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=''}const audio=$('#dmVoiceoverPreview');if(audio){audio.removeAttribute('src');audio.hidden=true}$('#dmDeleteVoiceover').disabled=true;status('Voice-over removed. The Reel will use music only.','info')}
function install(){
 if(location.hash!=='#reelcreator'||!window.DM_REEL_CREATOR||$('#dmVoiceoverCard'))return;
 const actions=$('.dm-reel-actions');if(!actions)return;const card=document.createElement('section');card.id='dmVoiceoverCard';card.className='card';
 card.innerHTML='<div class="dm-voice-head"><div><span class="pill">OPTIONAL ORIGINAL NARRATION</span><h3>🎙 Record Voice-over</h3><p>Read the prepared script in your own voice. Facebook can use spoken narration to create closed captions.</p></div><b id="dmVoiceoverTimer">0:00</b></div><label>Prepared script<textarea id="dmVoiceoverScript" rows="9" readonly></textarea></label><div class="dm-reel-actions"><button id="dmStartVoiceover" class="primary">🎙 Start Recording</button><button id="dmStopVoiceover" hidden>⏹ Stop Recording</button><button id="dmRefreshVoiceoverScript">↻ Refresh Script</button><button id="dmDeleteVoiceover" disabled>Remove Voice-over</button></div><audio id="dmVoiceoverPreview" controls hidden></audio><div id="dmVoiceoverStatus" class="dm-export-status" hidden></div><p class="small-note">Your microphone recording stays on this device and is only mixed into the MP4 you create. Use headphones while recording if background music or preview audio is playing.</p>';
 actions.insertAdjacentElement('beforebegin',card);refreshScript();
 const checklist=document.createElement('section');checklist.id='dmFacebookReelChecklist';checklist.className='card';checklist.innerHTML='<h3>✅ Before posting this Reel to Facebook</h3><ol><li>Create the MP4 and preview it.</li><li>Share MP4 to Facebook.</li><li>Set the audience to <b>Public</b>.</li><li>Select an available topic such as <b>Christianity, Faith, Bible, Prayer</b> or <b>Inspiration</b>.</li><li>Turn on <b>Captions</b> so Facebook can caption your recorded narration.</li><li>Paste the link-free caption and five hashtags.</li></ol><p class="small-note">Facebook topics and its Captions switch must be selected inside Facebook; the iPhone Share menu cannot set them automatically.</p>';card.insertAdjacentElement('afterend',checklist);
 $('#dmStartVoiceover').onclick=start;$('#dmStopVoiceover').onclick=stop;$('#dmRefreshVoiceoverScript').onclick=refreshScript;$('#dmDeleteVoiceover').onclick=remove;
}
document.addEventListener('dm-reel-content-change',refreshScript);document.addEventListener('dm-reel-studio-ready',install);window.addEventListener('hashchange',()=>setTimeout(install,0));window.addEventListener('load',install);window.addEventListener('pagehide',()=>{cleanupStream();if(previewUrl)URL.revokeObjectURL(previewUrl)});
})();
