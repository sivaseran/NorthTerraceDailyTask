const CACHE='north-terrace-staff-v3-9-1-hotfood-state-20261005';
const PREFIX='north-terrace-staff-';
const ASSETS=[
'/NorthTerraceDailyTask/staff-app/','/NorthTerraceDailyTask/staff-app/index.html','/NorthTerraceDailyTask/staff-app/tasks.html','/NorthTerraceDailyTask/staff-app/manifest.json','/NorthTerraceDailyTask/staff-app/app.js','/NorthTerraceDailyTask/staff-app/tasks.js','/NorthTerraceDailyTask/staff-app/icons/icon-192.png','/NorthTerraceDailyTask/staff-app/icons/icon-512.png','/NorthTerraceDailyTask/css/style.css',
'/NorthTerraceDailyTask/js/hot-food-store.js','/NorthTerraceDailyTask/js/hot-food-engine.js','/NorthTerraceDailyTask/js/hot-food-ui.js','/NorthTerraceDailyTask/js/firebase-config.js','/NorthTerraceDailyTask/js/firebase.js','/NorthTerraceDailyTask/js/auth.js','/NorthTerraceDailyTask/js/store.js','/NorthTerraceDailyTask/js/ui.js','/NorthTerraceDailyTask/js/final-config.js'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('/NorthTerraceDailyTask/staff-app/'));});
