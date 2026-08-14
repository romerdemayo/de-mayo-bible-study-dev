/* De Mayo Bible Studies - optional recorded Reel narration */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const MAX_RECORDING_SECONDS=90,MAX_SCRIPT_WORDS=150;
let recorder=null,stream=null,chunks=[],startedAt=0,timer=null,previewUrl='',scrollFrame=0,scrollLast=0,scrollDelayUntil=0,scrollPaused=false,scrollPosition=0;
window.DM_REEL_VOICEOVER_BLOB=null;
window.DM_REEL_VOICEOVER_DURATION=0;
function status(message,type='info'){const box=$('#dmVoiceoverStatus');if(box){box.hidden=false;box.dataset.type=type;box.textContent=message}window.toast?.(message)}
function words(value){return String(value||'').trim().split(/\s+/).filter(Boolean)}
function shorten(value,limit){
 const text=String(value||'').trim(),all=words(text);if(all.length<=limit)return text;
 const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[];let chosen=[],used=0;
 for(const sentence of sentences){const count=words(sentence).length;if(used+count>limit)break;chosen.push(sentence.trim());used+=count}
 return chosen.length?chosen.join(' '):all.slice(0,limit).join(' ')+'…';
}
function script(){
 const c=window.DM_REEL_CREATOR?.getContent?.()||{},verse=String(c.verse||'').trim(),reference=String(c.reference||'').trim();
 const fixed=words(`${verse} ${reference} Let us pray.`).length,reservedPrayer=40;
 const reflection=shorten(c.reflection,Math.max(24,Math.min(55,MAX_SCRIPT_WORDS-fixed-reservedPrayer)));
 const prayerLimit=Math.max(28,MAX_SCRIPT_WORDS-words(`${verse} ${reference} ${reflection} Let us pray.`).length);
 return [verse,reference,reflection,'Let us pray.',shorten(c.prayer,prayerLimit)].filter(Boolean).join('\n\n');
}
function activeScript(){const overlay=$('#dmPrompterOverlay');return overlay&&!overlay.hidden?$('#dmVoiceoverFullscreenScript'):$('#dmVoiceoverScript')}
function refreshScript(){const text=script(),area=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript');if(area){area.textContent=text;area.scrollTop=0}if(full){full.textContent=text;full.scrollTop=0}const count=words(text).length,estimate=Math.ceil(count/105*60),info=$('#dmVoiceoverWordCount');if(info)info.textContent=`${count} words • about ${Math.min(90,estimate)} seconds at a calm reading pace`}
function scrollSpeed(){return Number($('#dmVoiceoverSpeed')?.value||10)}
function stopPrompter(){if(scrollFrame)cancelAnimationFrame(scrollFrame);scrollFrame=0;scrollLast=0}
function updatePrompterButton(){document.querySelectorAll('#dmTogglePrompter,#dmFullscreenPause').forEach(button=>{button.textContent=scrollPaused?'▶ Resume Scrolling':'⏸ Pause Scrolling';button.disabled=!recorder||recorder.state==='inactive'})}
function scrollPrompter(time){
 const area=activeScript();if(!area||!recorder||recorder.state==='inactive'){stopPrompter();return}
 if(!scrollPaused&&time>=scrollDelayUntil){
  if(!scrollLast)scrollLast=time;
  const max=Math.max(0,area.scrollHeight-area.clientHeight);scrollPosition=Math.min(max,scrollPosition+scrollSpeed()*(time-scrollLast)/1000);area.scrollTop=Math.round(scrollPosition);
 }else scrollLast=time;
 scrollLast=time;scrollFrame=requestAnimationFrame(scrollPrompter);
}
function startPrompter(){const area=activeScript();if(!area)return;stopPrompter();area.scrollTop=0;scrollPosition=0;scrollPaused=false;scrollDelayUntil=performance.now()+1200;updatePrompterButton();scrollFrame=requestAnimationFrame(scrollPrompter)}
function togglePrompter(){const resuming=scrollPaused;scrollPaused=!scrollPaused;if(resuming)scrollPosition=activeScript()?.scrollTop||scrollPosition;scrollLast=0;updatePrompterButton()}
function setPrompterFont(){const value=Number($('#dmVoiceoverFont')?.value||24);document.querySelectorAll('#dmVoiceoverScript,#dmVoiceoverFullscreenScript').forEach(area=>area.style.fontSize=`${value}px`);const output=$('#dmVoiceoverFontValue');if(output)output.textContent=`${value}px`}
function setSpeedLabel(){const output=$('#dmVoiceoverSpeedValue');if(output)output.textContent=`${scrollSpeed()} px/sec`}
function openPrompter(){const overlay=$('#dmPrompterOverlay'),source=$('#dmVoiceoverScript'),full=$('#dmVoiceoverFullscreenScript'),button=$('#dmOpenPrompter');if(!overlay||!full)return;full.textContent=source?.textContent||script();full.scrollTop=source?.scrollTop||0;scrollPosition=full.scrollTop;overlay.hidden=false;document.body.classList.add('dm-prompter-open');if(button)button.textContent='↙ Exit Full Screen';setPrompterFont()}
function closePrompter(){const overlay=$('#dmPrompterOverlay'),full=$('#dmVoiceoverFullscreenScript'),source=$('#dmVoiceoverScript'),button=$('#dmOpenPrompter');if(source&&full){source.scrollTop=full.scrollTop;scrollPosition=source.scrollTop}if(overlay)overlay.hidden=true;document.body.classList.remove('dm-prompter-open');if(button)button.textContent='⛶ Full Screen'}
function toggleFullPrompter(){const overlay=$('#dmPrompterOverlay');if(overlay&&!overlay.hidden)closePrompter();else openPrompter()}
function supportedType(){return['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported(type))||''}
function cleanupStream(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null}}
function updateTimer(){const elapsed=(Date.now()-startedAt)/1000,value=`${Math.floor(elapsed/60)}:${String(Math.floor(elapsed)%60).padStart(2,'0')} / 1:30`;document.querySelectorAll('#dmVoiceoverTimer,#dmFullscreenTimer').forEach(el=>el.textContent=value);if(elapsed>=MAX_RECORDING_SECONDS&&recorder?.state!=='inactive'){status('90-second recording complete. Finishing your voice-over…','loading');stop()}}
async function start(){
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)return status('Voice recording is not supported in this browser.','error');
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  chunks=[];const mime=supportedType();recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
  recorder.ondataavailable=event=>event.data.size&&chunks.push(event.data);
  recorder.onstop=finish;
  recorder.start(500);startedAt=Date.now();timer=setInterval(updateTimer,250);updateTimer();openPrompter();startPrompter();
  $('#dmStartVoiceover').hidden=true;$('#dmStopVoiceover').hidden=false;$('#dmDeleteVoiceover').disabled=true;
  status('Recording… Read the script naturally, then tap Stop.','loading');
 }catch(error){console.error(error);cleanupStream();status(error?.name==='NotAllowedError'?'Microphone permission was not allowed. Enable microphone access for Safari and try again.':'The microphone could not start.','error')}
}
function stop(){stopPrompter();if(recorder&&recorder.state!=='inactive')recorder.stop()}
function finish(){
 const recordedSeconds=Math.max(1,(Date.now()-startedAt)/1000);clearInterval(timer);timer=null;stopPrompter();closePrompter();cleanupStream();$('#dmStartVoiceover').hidden=false;$('#dmStopVoiceover').hidden=true;updatePrompterButton();
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
 card.innerHTML='<div class="dm-voice-head"><div><span class="pill">OPTIONAL ORIGINAL NARRATION</span><h3>🎙 Record Voice-over</h3><p>Read the complete verse, short message and prayer. The script is prepared to fit within 90 seconds and scrolls automatically.</p></div><b id="dmVoiceoverTimer">0:00 / 1:30</b></div><div class="dm-prompter-field"><b>Prepared 90-second script</b><div id="dmVoiceoverScript" class="dm-voice-prompter" role="document" aria-label="Prepared 90-second voice-over script" tabindex="0" title="Tap to open full-screen teleprompter"></div></div><p id="dmVoiceoverWordCount" class="small-note"></p><div class="dm-prompter-controls"><label>Text size <input id="dmVoiceoverFont" type="range" min="20" max="34" value="24"><output id="dmVoiceoverFontValue">24px</output></label><label>Scroll speed <input id="dmVoiceoverSpeed" type="range" min="4" max="28" value="10"><output id="dmVoiceoverSpeedValue">10 px/sec</output></label></div><div class="dm-reel-actions"><button id="dmStartVoiceover" class="primary">🎙 Start Recording</button><button id="dmStopVoiceover" hidden>⏹ Stop Recording</button><button id="dmTogglePrompter" disabled>⏸ Pause Scrolling</button><button id="dmOpenPrompter">⛶ Full Screen</button><button id="dmRefreshVoiceoverScript">↻ Refresh Script</button><button id="dmDeleteVoiceover" disabled>Remove Voice-over</button></div><audio id="dmVoiceoverPreview" controls hidden></audio><div id="dmVoiceoverStatus" class="dm-export-status" hidden></div><p class="small-note">Recording opens the full-screen reading view automatically and stops at 1:30. You can also tap the script to open it before recording.</p>';
 actions.insertAdjacentElement('beforebegin',card);refreshScript();
 const checklist=document.createElement('section');checklist.id='dmFacebookReelChecklist';checklist.className='card';checklist.innerHTML='<h3>✅ Before posting this Reel to Facebook</h3><ol><li>Create the MP4 and preview it.</li><li>Share MP4 to Facebook.</li><li>Set the audience to <b>Public</b>.</li><li>Select an available topic such as <b>Christianity, Faith, Bible, Prayer</b> or <b>Inspiration</b>.</li><li>Turn on <b>Captions</b> so Facebook can caption your recorded narration.</li><li>Paste the link-free caption and five hashtags.</li></ol><p class="small-note">Facebook topics and its Captions switch must be selected inside Facebook; the iPhone Share menu cannot set them automatically.</p>';card.insertAdjacentElement('afterend',checklist);
 if(!$('#dmVoiceoverPrompterStyles')){const style=document.createElement('style');style.id='dmVoiceoverPrompterStyles';style.textContent='.dm-prompter-field{display:grid;gap:8px}.dm-voice-prompter{display:block;width:100%;box-sizing:border-box;min-height:300px;max-height:46vh;overflow-y:auto;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55;scroll-behavior:auto;padding:20px;background:#101d19;color:#fff;-webkit-text-fill-color:#fff;border:3px solid #2b715e;border-radius:16px;font-weight:650;letter-spacing:.01em}.dm-prompter-controls{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.dm-prompter-controls label{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;font-weight:700}.dm-prompter-controls input{width:100%}.dm-prompter-controls output{min-width:70px;text-align:right}.dm-voice-head{display:flex;justify-content:space-between;gap:12px}.dm-voice-head #dmVoiceoverTimer{font-size:1.35rem;white-space:nowrap}body.dm-prompter-open{overflow:hidden!important}.dm-prompter-fullscreen{position:fixed!important;inset:0!important;z-index:2147483646!important;margin:0!important;border:0!important;border-radius:0!important;overflow:auto!important;padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 16px)!important;background:#f7f4eb!important}.dm-prompter-fullscreen .dm-voice-prompter{height:calc(100dvh - 340px)!important;min-height:44vh!important;max-height:none!important}.dm-prompter-fullscreen .dm-reel-actions{position:sticky;bottom:0;z-index:2;padding:10px 0;background:#f7f4eb}@media(prefers-color-scheme:dark){.dm-prompter-fullscreen,.dm-prompter-fullscreen .dm-reel-actions{background:#13231e!important}}@media(max-width:640px){.dm-voice-prompter{min-height:46vh;max-height:46vh}.dm-prompter-controls{grid-template-columns:1fr}.dm-voice-head{align-items:flex-start}.dm-prompter-fullscreen .dm-voice-head p,.dm-prompter-fullscreen>p.small-note:last-child{display:none}.dm-prompter-fullscreen .dm-voice-head h3{margin:.2rem 0}.dm-prompter-fullscreen .dm-voice-prompter{height:calc(100dvh - 300px)!important}}';document.head.appendChild(style)}
 if(!$('#dmPrompterOverlay')){const overlay=document.createElement('section');overlay.id='dmPrompterOverlay';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Full-screen voice-over teleprompter');overlay.innerHTML='<header><strong>🎙 Voice-over Teleprompter</strong><b id="dmFullscreenTimer">0:00 / 1:30</b></header><div id="dmVoiceoverFullscreenScript" class="dm-voice-prompter" role="document" aria-label="Voice-over script"></div><footer><button type="button" id="dmFullscreenPause" disabled>⏸ Pause Scrolling</button><button type="button" id="dmFullscreenStop" class="primary">⏹ Stop Recording</button><button type="button" id="dmFullscreenExit">↙ Exit Full Screen</button></footer>';document.body.appendChild(overlay);const portalStyle=document.createElement('style');portalStyle.id='dmPrompterPortalStyles';portalStyle.textContent='#dmPrompterOverlay[hidden]{display:none!important}#dmPrompterOverlay{position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:12px!important;box-sizing:border-box!important;padding:calc(env(safe-area-inset-top) + 12px) 14px calc(env(safe-area-inset-bottom) + 12px)!important;background:#08130f!important;color:#fff!important}#dmPrompterOverlay header{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:1.05rem}#dmPrompterOverlay #dmFullscreenTimer{font-size:1.25rem;white-space:nowrap;color:#fff}#dmPrompterOverlay .dm-voice-prompter{height:100%!important;min-height:0!important;max-height:none!important;border-color:#63b89f!important;background:#020806!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font-size:24px}#dmPrompterOverlay footer{display:grid;grid-template-columns:1fr 1fr;gap:10px}#dmPrompterOverlay footer button{min-height:48px;font-size:1rem}#dmPrompterOverlay #dmFullscreenExit{grid-column:1/-1}@media(min-width:700px){#dmPrompterOverlay{padding:24px max(24px,calc((100vw - 760px)/2))}#dmPrompterOverlay footer{grid-template-columns:1fr 1fr 1fr}#dmPrompterOverlay #dmFullscreenExit{grid-column:auto}}';document.head.appendChild(portalStyle);$('#dmFullscreenPause').onclick=togglePrompter;$('#dmFullscreenStop').onclick=stop;$('#dmFullscreenExit').onclick=closePrompter}
 $('#dmStartVoiceover').onclick=start;$('#dmStopVoiceover').onclick=stop;$('#dmTogglePrompter').onclick=togglePrompter;$('#dmOpenPrompter').onclick=toggleFullPrompter;$('#dmVoiceoverScript').onclick=()=>{if($('#dmPrompterOverlay')?.hidden)openPrompter()};$('#dmRefreshVoiceoverScript').onclick=refreshScript;$('#dmDeleteVoiceover').onclick=remove;$('#dmVoiceoverFont').oninput=setPrompterFont;$('#dmVoiceoverSpeed').oninput=setSpeedLabel;refreshScript();setPrompterFont();setSpeedLabel();updatePrompterButton();
}
document.addEventListener('dm-reel-content-change',refreshScript);document.addEventListener('dm-reel-studio-ready',install);document.addEventListener('keydown',event=>{if(event.key==='Escape')closePrompter()});window.addEventListener('hashchange',()=>{closePrompter();setTimeout(install,0)});window.addEventListener('load',install);window.addEventListener('pagehide',()=>{closePrompter();stopPrompter();cleanupStream();if(previewUrl)URL.revokeObjectURL(previewUrl)});
})();
