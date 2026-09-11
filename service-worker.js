const CACHE='north-terrace-v2-beta';
const ASSETS=[
  './','./index.html','./login.html','./staff.html','./manager.html','./css/style.css',
  './js/firebase-config.js','./js/firebase.js','./js/auth.js','./js/store.js','./js/ui.js',
  './js/general.js','./js/staff.js','./js/manager.js','./js/reports.js','./js/seed.js',
  './js/login.js','./manifest.json'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
