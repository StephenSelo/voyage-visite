// 20261102-034048
const V="tamcoc-20261102-034048";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(["./","manifest.webmanifest","apple-touch-icon.png"]).catch(()=>{})));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  // page + version: always network first, never the HTTP cache → a reload always shows the latest version
  if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html")||u.pathname.endsWith("version.json")){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res.ok&&!u.pathname.endsWith("version.json")){const c=res.clone();caches.open(V).then(x=>x.put("./",c));}return res;}).catch(()=>caches.match("./")));return;}
  // photos & icons: cache first (filenames change when content changes)
  e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;}))));
});
