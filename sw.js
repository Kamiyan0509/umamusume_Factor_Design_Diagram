// オフライン用キャッシュ（ツールを更新すると版番号が変わり、次に開いたとき新しい版に入れ替わる）
const V='uma-c705ff2acc'; const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(u.origin!==location.origin) return; // 衣装画像などの外部はネットに任せる（オフライン用の画像はツールに内蔵）
  if(r.mode==='navigate'){ e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(V).then(c=>c.put('index.html',cp)); return res; }).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r))); });
