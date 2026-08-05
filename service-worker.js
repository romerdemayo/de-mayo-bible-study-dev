/* De Mayo Bible Studies | Project Phoenix performance cache */
const VERSION='1.22.1b-dev-language-scripture';
const SHELL_CACHE=`de-mayo-shell-${VERSION}`;
const RUNTIME_CACHE=`de-mayo-runtime-${VERSION}`;
const OFFLINE_URL='./index.html';
const SHELL=[
 './','./index.html','./styles.css','./app.js','./analytics-config.js','./analytics-loader.js','./social-studio-engine-v2.js','./social-studio-share-confirmation.js','./social-studio-branding.js','./sprint1-library.css','./sprint1-library.js','./sprint1-bible-workspace.css','./sprint1-bible-workspace.js','./unified-ai-creator.css','./unified-ai-creator.js','./ai-generator-intelligence.js','./ai-topic-scripture.js','./ai-scripture-intelligence.css','./ai-scripture-intelligence-fast.js','./ai-language-scripture-integration.js','./ai-writing-assistant.css','./ai-writing-assistant.js','./ministry-pack-engine.css','./ministry-pack-engine.js',
 './reels/reel-creator-v2.css','./reels/reel-creator-v2.js','./reels/reel-entry.js','./reels/mp4-result-panel.js','./reels/desktop-mp4-download-fix.js','./reels/native-mp4-recorder.js','./reels/browser-mp4.js',
 './manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png',
 './apple-touch-icon.png','./social-preview.png'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>![SHELL_CACHE,RUNTIME_CACHE].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
async function networkFirst(request){const cache=await caches.open(RUNTIME_CACHE);try{const response=await fetch(request,{cache:'no-store'});if(response&&response.ok&&response.type!=='opaque')cache.put(request,response.clone());return response;}catch{const cached=await cache.match(request);if(cached)return cached;throw new Error('offline');}}
async function staleWhileRevalidate(request){const cache=await caches.open(RUNTIME_CACHE),cached=await cache.match(request);const fresh=fetch(request).then(r=>{if(r&&r.ok&&r.type!=='opaque')cache.put(request,r.clone());return r;}).catch(()=>null);return cached||fresh;}
self.addEventListener('fetch',event=>{const {request}=event;if(request.method!=='GET')return;const url=new URL(request.url);if(request.mode==='navigate'){event.respondWith(networkFirst(request).catch(()=>caches.match(OFFLINE_URL)));return;}if(url.origin===self.location.origin&&(/bible-data\.js$/.test(url.pathname)||url.pathname.includes('/data/'))){event.respondWith(staleWhileRevalidate(request));return;}event.respondWith(networkFirst(request).catch(()=>caches.match(request)));});