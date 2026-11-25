/* StrictAI Mobile Offline Service Worker */
'use strict';

var CACHE_VERSION = 'strictai-mobile-v2.0.0';
var CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/mobile-app.css',
  './js/react-runtime.js',
  './js/icons.js',
  './js/strictpass-3d.js',
  './js/firebase-auth-core.js',
  './js/app-curriculum.js',
  './js/app-anticheat.js',
  './js/app-state.js',
  './js/app-views-study.js',
  './js/app-views-control.js',
  './js/app-main.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(CORE_ASSETS).catch(function () {
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) {
            return k !== CACHE_VERSION;
          })
          .map(function (k) {
            return caches.delete(k);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = event.request.url;
  if (url.indexOf('http') !== 0) return;
  if (url.indexOf('gstatic.com') !== -1 || url.indexOf('googleapis.com') !== -1) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) {
        fetch(event.request)
          .then(function (fresh) {
            if (fresh && fresh.status === 200) {
              caches.open(CACHE_VERSION).then(function (c) {
                c.put(event.request, fresh.clone());
              });
            }
          })
          .catch(function () {});
        return cached;
      }

      return fetch(event.request)
        .then(function (resp) {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            var copy = resp.clone();
            caches.open(CACHE_VERSION).then(function (c) {
              c.put(event.request, copy);
            });
          }
          return resp;
        })
        .catch(function () {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});
