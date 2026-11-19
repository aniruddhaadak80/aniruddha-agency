const CACHE = "aa-agency-v2";
const CORE = [
  "/", "/index.html", "/about.html", "/projects.html", "/agency.html",
  "/future.html", "/writing.html", "/contact.html",
  "/styles.css", "/script.js", "/favicon.svg", "/manifest.json",
  "/assets/aniruddha-photo.jpg", "/assets/icon-192.png", "/assets/icon-512.png"
];

const ASSET = /\.(png|jpg|jpeg|svg|css|js|json|webp|ico)$/;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Only successful responses are worth keeping: caching a 404 made a missing
// file stick around exactly like a stale one did.
const cacheIfOk = (request, response) => {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
  }
  return response;
};

const offline = (request) =>
  caches.match(request).then((hit) =>
    hit || new Response("", { status: 504, statusText: "Offline" })
  );

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  if (ASSET.test(url.pathname)) {
    // Revalidate on every request. The cache is the offline fallback, not the
    // answer: cache-first with a fixed cache name meant a returning visitor
    // never saw a new script.js or styles.css until the cache was renamed.
    e.respondWith(fetch(e.request).then((res) => cacheIfOk(e.request, res)).catch(() => offline(e.request)));
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => cacheIfOk(e.request, res))
      .catch(() =>
        caches.match(e.request).then((hit) =>
          hit || caches.match("/index.html").then((shell) =>
            shell || new Response("", { status: 504, statusText: "Offline" })
          )
        )
      )
  );
});
