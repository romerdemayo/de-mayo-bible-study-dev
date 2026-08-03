/* De Mayo Bible Studies - choose one MP4 engine per device */
(function(){
'use strict';
const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const nativeTypes=['video/mp4;codecs=avc1.42E01E','video/mp4;codecs=avc1.424028','video/mp4'];
const nativeSupported=!mobile&&window.MediaRecorder&&HTMLCanvasElement.prototype.captureStream&&nativeTypes.some(type=>MediaRecorder.isTypeSupported(type));
const script=document.createElement('script');
script.defer=true;
script.src=nativeSupported?'reels/native-mp4-recorder.js?v=1177':'reels/browser-mp4.js?v=1177';
script.dataset.mp4Engine=nativeSupported?'native':'ffmpeg';
document.head.appendChild(script);
window.DM_MP4_ENGINE=nativeSupported?'native':'ffmpeg';
})();