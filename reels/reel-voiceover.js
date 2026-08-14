/* De Mayo Bible Studies - optional recorded Reel narration */
(function(){
'use strict';
const $=s=>document.querySelector(s);
let recorder=null,stream=null,chunks=[],startedAt=0,timer=null,previewUrl='',scrollFrame=0,scrollLast=0,scrollDelayUntil=0,scrollPaused=false;
window.DM_REEL_VOICEOVER_BLOB=null;
window.DM_REEL_VOICEOVER_DURATION=0;
function status(message,type='info'){const box=$('#dmVoiceoverStatus');if(box){box.hidden=false;box.dataset.type=type;box.textContent=message}window.toast?.(message)}
function script(){const c=window.DM_REEL_CREATOR?.getContent?.()||{};return [c.title,c.verse,c.reference,c.reflection,'Let us pray.',c.prayer].filter(Boolean).join('\n\n')}
function refreshScript(){const area=$('#dmVoiceoverScript');if(area){area.value=script();area.scrollTop=0}}
function scrollSpeed(){return Number($('#dmVoiceoverSpeed')?.value||18)}
function stopPrompter(){if(scrollFrame)cancelAnimationFrame(scrollFrame);scrollFrame=0;scrollLast=0}
function updatePrompterButton(){const button=$('#dmTogglePrompter');if(button){button.textContent=scrollPaused?'▶ Resume Scrolling':'⏸ Pause Scrolling';button.disabled=!recorder||recorder.state==='inactive'}}
function scrollPrompter(time){
 const area=$('#dmVoiceoverScript');if(!area||!recorder||recorder.state==='inactive'){stopPrompter();return}
 if(!scrollPaused&&time>=scrollDelayUntil){
  if(!scrollLast)scrollLast=time;
  const max=Math.max(0,area.scrollHeight-area.clientHeight);area.scrollTop=Math.min(max,area.scrollTop+scrollSpeed()*(time-scrollLast)/1000);
 }else scrollLast=time;
 scrollLast=time;scrollFrame=requestAnimationFrame(scrollPrompter);
}
function startPrompter(){const area=$('#dmVoiceoverScript');if(!area)return;stopPrompter();area.scrollTop=0;scrollPaused=false;scrollDelayUntil=performance.now()+1800;updatePrompterButton();scrollFrame=requestAnimationFrame(scrollPrompter)}
function togglePrompter(){scrollPaused=!scrollPaused;scrollLast=0;updatePrompterButton()}
function setPrompterFont(){const area=$('#dmVoiceoverScript');const value=Number($('#dmVoiceoverFont')?.value||24);if(area)area.style.fontSize=`${value}px`;const output=$('#dmVoiceoverFontValue');if(output)output.textContent=`${value}px`}
function setSpeedLabel(){const output=$('#dmVoiceoverSpeedValue');if(output)output.textContent=`${scrollSpeed()} px/sec`}
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
  recorder.start(500);startedAt=Date.now();timer=setInterval(updateTimer,250);updateTimer();startPrompter();
  $('#dmStartVoiceover').hidden=true;$('#dmStopVoiceover').hidden=false;$('#dmDeleteVoiceover').disabled=true;
  status('Recording… Read the script naturally, then tap Stop.','loading');
 }catch(error){console.error(error);cleanupStream();status(error?.name==='NotAllowedError'?'Microphone permission was not allowed. Enable microphone access for Safari and try again.':'The microphone could not start.','error')}
}
function stop(){stopPrompter();if(recorder&&recorder.state!=='inactive')recorder.stop()}
function finish(){
 const recordedSeconds=Math.max(1,(Date.now()-startedAt)/1000);clearInterval(timer);timer=null;stopPrompter();cleanupStream();$('#dmStartVoiceover').hidden=false;$('#dmStopVoiceover').hidden=true;updatePrompterButton();
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
 card.innerHTML='<div class="dm-voice-head"><div><span class="pill">OPTIONAL ORIGINAL NARRATION</span><h3>🎙 Record Voice-over</h3><p>Read the prepared script in your own voice. The teleprompter scrolls automatically while you record.</p></div><b id="dmVoiceoverTimer">0:00</b></div><label>Prepared script<textarea id="dmVoiceoverScript" class="dm-voice-prompter" rows="9" readonly></textarea></label><div class="dm-prompter-controls"><label>Text size <input id="dmVoiceoverFont" type="range" min="20" max="34" value="24"><output id="dmVoiceoverFontValue">24px</output></label><label>Scroll speed <input id="dmVoiceoverSpeed" type="range" min="8" max="36" value="18"><output id="dmVoiceoverSpeedValue">18 px/sec</output></label></div><div class="dm-reel-actions"><button id="dmStartVoiceover" class="primary">🎙 Start Recording</button><button id="dmStopVoiceover" hidden>⏹ Stop Recording</button><button id="dmTogglePrompter" disabled>⏸ Pause Scrolling</button><button id="dmRefreshVoiceoverScript">↻ Refresh Script</button><button id="dmDeleteVoiceover" disabled>Remove Voice-over</button></div><audio id="dmVoiceoverPreview" controls hidden></audio><div id="dmVoiceoverStatus" class="dm-export-status" hidden></div><p class="small-note">The script begins scrolling about two seconds after recording starts. Adjust the speed before or during recording. Your microphone recording stays on this device and is only mixed into the MP4 you create.</p>';
 actions.insertAdjacentElement('beforebegin',card);refreshScript();
 const checklist=document.createElement('section');checklist.id='dmFacebookReelChecklist';checklist.className='card';checklist.innerHTML='<h3>✅ Before posting this Reel to Facebook</h3><ol><li>Create the MP4 and preview it.</li><li>Share MP4 to Facebook.</li><li>Set the audience to <b>Public</b>.</li><li>Select an available topic such as <b>Christianity, Faith, Bible, Prayer</b> or <b>Inspiration</b>.</li><li>Turn on <b>Captions</b> so Facebook can caption your recorded narration.</li><li>Paste the link-free caption and five hashtags.</li></ol><p class="small-note">Facebook topics and its Captions switch must be selected inside Facebook; the iPhone Share menu cannot set them automatically.</p>';card.insertAdjacentElement('afterend',checklist);
 if(!$('#dmVoiceoverPrompterStyles')){const style=document.createElement('style');style.id='dmVoiceoverPrompterStyles';style.textContent='.dm-voice-prompter{min-height:300px;line-height:1.55;scroll-behavior:auto;padding:20px;background:#101d19;color:#fff;border:3px solid #2b715e;border-radius:16px;font-weight:650;letter-spacing:.01em}.dm-prompter-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.dm-prompter-controls label{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;font-weight:700}.dm-prompter-controls input{width:100%}.dm-prompter-controls output{min-width:70px;text-align:right}.dm-voice-head{display:flex;justify-content:space-between;gap:12px}.dm-voice-head #dmVoiceoverTimer{font-size:1.35rem;white-space:nowrap}@media(max-width:640px){.dm-voice-prompter{min-height:46vh;max-height:46vh}.dm-prompter-controls{grid-template-columns:1fr}.dm-voice-head{align-items:flex-start}}';document.head.appendChild(style)}
 $('#dmStartVoiceover').onclick=start;$('#dmStopVoiceover').onclick=stop;$('#dmTogglePrompter').onclick=togglePrompter;$('#dmRefreshVoiceoverScript').onclick=refreshScript;$('#dmDeleteVoiceover').onclick=remove;$('#dmVoiceoverFont').oninput=setPrompterFont;$('#dmVoiceoverSpeed').oninput=setSpeedLabel;setPrompterFont();setSpeedLabel();updatePrompterButton();
}
document.addEventListener('dm-reel-content-change',refreshScript);document.addEventListener('dm-reel-studio-ready',install);window.addEventListener('hashchange',()=>setTimeout(install,0));window.addEventListener('load',install);window.addEventListener('pagehide',()=>{stopPrompter();cleanupStream();if(previewUrl)URL.revokeObjectURL(previewUrl)});
})();
