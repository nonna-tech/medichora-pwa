const CACHE = 'medichora-v2';
const ASSETS = [
  'index.html','cadastro.html','sobre.html',
  'css/estilo.css',
  'js/app.js','js/storage.js','js/pwa.js','js/cadastro.js',
  'manifest.json',
  'assets/sounds/som_alerta.wav'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
