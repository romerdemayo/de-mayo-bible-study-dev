/* De Mayo Bible Studies | non-blocking feature loader */
(function(){
'use strict';
const FEATURES=[
 'sprint1-library.js?v=12707','library-dashboard-links.js?v=12707','sprint1-bible-workspace.js?v=12707',
 'unified-ai-creator.js?v=12707','ai-generator-intelligence.js?v=12707','ai-topic-scripture.js?v=12707',
 'ai-scripture-intelligence-fast.js?v=12707','ai-language-scripture-integration.js?v=12707',
 'ai-editor-scripture-cleanup.js?v=12707','ai-writing-assistant.js?v=12707',
 'resource-output-studio.js?v=12707','resource-output-presentation-handout.js?v=12707','my-library-resource-actions.js?v=12707',
 'social-studio-gemini.js?v=12708','social-studio-engine-v2.js?v=12707','social-studio-share-confirmation.js?v=12707',
 'social-studio-branding.js?v=12707','social-studio-designer.js?v=12707','social-studio-premium-cleanup.js?v=12707',
 'social-studio-layout-coordinator.js?v=12707','social-studio-premium-behaviour.js?v=12707',
 'social-studio-premium-content-polish.js?v=12707','social-publishing-workflow.js?v=12707',
 'social-studio-facebook-publish.js?v=12709','social-publishing-calendar.js?v=12707','social-studio-share-sync.js?v=12707',
 'reels/reel-creator-v2.js?v=12715','reels/reel-gemini-weekly.js?v=12716','reels/reel-entry.js?v=12707',
 'social-reel-handoff.js?v=12707','reels/mp4-result-panel.js?v=12717',
 'reels/desktop-mp4-download-fix.js?v=12707','reels/native-mp4-recorder.js?v=12718'
];
let started=false;
function loadFeatures(){
 if(started)return;started=true;
 FEATURES.forEach((src,index)=>{const script=document.createElement('script');script.src=src;script.async=false;
  if(index===FEATURES.length-1)script.addEventListener('load',()=>{if(!window.DM_NATIVE_MP4_SUPPORTED){const fallback=document.createElement('script');fallback.src='reels/browser-mp4.js?v=12713';document.body.appendChild(fallback);}});
  document.body.appendChild(script);
 });
}
window.addEventListener('load',()=>setTimeout(loadFeatures,60),{once:true});
})();
