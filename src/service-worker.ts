/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `app-${version}`;

// All static assets to pre-cache on install
const ASSETS = [
  ...build,        // Vite-hashed JS/CSS bundles
  ...files,        // files in /static
  ...prerendered,  // pre-rendered pages (if any)
];

// ── Install: cache all assets and activate immediately ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())  // don't wait for old SW to become idle
  );
});

// ── Activate: purge old caches and take control of all clients ───────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())  // take control without waiting for reload
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        // Navigate every open window to its current URL, forcing a fresh load
        // from the newly activated cache. Silent — no user action needed.
        clients.forEach((client) => {
          if ('navigate' in client) {
            (client as WindowClient).navigate(client.url);
          }
        });
      })
  );
});

// ── Fetch: immutable assets from cache; everything else network-first ────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Vite immutable bundles: cache-first (they are content-addressed)
  if (url.pathname.startsWith('/_app/immutable/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    );
    return;
  }

  // Navigation and everything else: network-first so new deployments are
  // always reflected. Fall back to cache if offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Update the cache with the fresh response
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request) as Promise<Response>)
  );
});
