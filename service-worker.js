const CACHE='north-terrace-general-v4-1-1-sound-labels-20261009';
const CACHE_PREFIX='north-terrace-general-';
const ASSETS=[
  '/NorthTerraceDailyTask/',
  '/NorthTerraceDailyTask/index.html',
  '/NorthTerraceDailyTask/login.html',
  '/NorthTerraceDailyTask/staff.html',
  '/NorthTerraceDailyTask/manager.html',
  '/NorthTerraceDailyTask/css/style.css',
  '/NorthTerraceDailyTask/js/firebase-config.js',
  '/NorthTerraceDailyTask/js/firebase.js',
  '/NorthTerraceDailyTask/js/auth.js',
  '/NorthTerraceDailyTask/js/store.js',
  '/NorthTerraceDailyTask/js/ui.js',
  '/NorthTerraceDailyTask/js/general.js',
  '/NorthTerraceDailyTask/js/task-category.js',
  '/NorthTerraceDailyTask/js/staff.js',
  '/NorthTerraceDailyTask/js/manager.js',
  '/NorthTerraceDailyTask/js/reports.js',
  '/NorthTerraceDailyTask/js/hot-food-store.js',
  '/NorthTerraceDailyTask/js/hot-food-manager.js',
  '/NorthTerraceDailyTask/js/hot-food-engine.js',
  '/NorthTerraceDailyTask/js/hot-food-ui.js',
  '/NorthTerraceDailyTask/js/seed.js',
  '/NorthTerraceDailyTask/js/login.js',
  '/NorthTerraceDailyTask/js/final-config.js',
  '/NorthTerraceDailyTask/js/special-tasks.js',
  '/NorthTerraceDailyTask/js/special-manager.js',
  '/NorthTerraceDailyTask/js/compliance-ui.js',
  '/NorthTerraceDailyTask/manifest.json',
  '/NorthTerraceDailyTask/icons/general-192.png',
  '/NorthTerraceDailyTask/icons/general-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const fresh=/\.(?:js|html)$/.test(url.pathname)||url.pathname.endsWith('/NorthTerraceDailyTask/');
  if(fresh){event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(event.request,c));return r;}).catch(()=>caches.match(event.request)));return;}
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(windowClients=>{
      for(const client of windowClients){
        if(client.url.includes('/NorthTerraceDailyTask/') && 'focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow('/NorthTerraceDailyTask/');
    })
  );
});
