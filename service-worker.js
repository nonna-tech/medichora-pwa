const CACHE = 'medichora-v3'; // mude a versão!
const ASSETS = [
  'index.html','cadastro.html','sobre.html',
  'estilo.css',
  'app.js','storage.js','pwa.js','cadastro.js',
  'manifest.json',
  'icon-192.png','icon-512.png',
  'som_alerta.wav' // ajuste para o seu caminho real
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
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
