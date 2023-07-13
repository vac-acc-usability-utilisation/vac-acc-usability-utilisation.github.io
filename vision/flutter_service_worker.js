'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "846f20628259e61896da887b42a64a3e",
"assets/AssetManifest.json": "56798bf29da20ed0210d74f8384e43b5",
"assets/assets/avatar_1.png": "67340c8d37138d96fb713526c568abe1",
"assets/assets/avatar_2.png": "9cd82ac1eb4f0eb80c12f99bbbaca400",
"assets/assets/avatar_3.png": "9481b06c3baec70ad9476df652a313e1",
"assets/assets/avatar_4.png": "2dbfdad799c075179fa727f12e95bb8e",
"assets/assets/avatar_5.png": "1f15595441a3c0f4de0934ee68af2c41",
"assets/assets/avatar_6.png": "c9dd5329e98d9a2b85d5efefc932b572",
"assets/assets/avatar_7.png": "89dfb0b9532e06d51a60ed3968f57621",
"assets/assets/en-fip-blk.png": "015c6e1b9ceb9d2a0d79608879d13ee7",
"assets/assets/en-fip-wht.png": "174b2d47b13299a5e931f67efa108673",
"assets/assets/fonts/Lato/Lato-Bold.ttf": "24b516c266d7341c954cb2918f1c8f38",
"assets/assets/fonts/Lato/Lato-Regular.ttf": "122dd68d69fe9587e062d20d9ff5de2a",
"assets/assets/fonts/Noto_Sans/NotoSans-Bold.ttf": "b20e2d260790596b6f6624a42b9c7833",
"assets/assets/fonts/Noto_Sans/NotoSans-Italic.ttf": "d50ffd77a2f06bfbc2a3920791f514e3",
"assets/assets/fonts/Noto_Sans/NotoSans-Regular.ttf": "2a1861cd1ca7030ae9bb29f3192bb1e3",
"assets/avatar_1.png": "67340c8d37138d96fb713526c568abe1",
"assets/avatar_2.png": "9cd82ac1eb4f0eb80c12f99bbbaca400",
"assets/avatar_3.png": "9481b06c3baec70ad9476df652a313e1",
"assets/avatar_4.png": "2dbfdad799c075179fa727f12e95bb8e",
"assets/avatar_5.png": "1f15595441a3c0f4de0934ee68af2c41",
"assets/avatar_6.png": "c9dd5329e98d9a2b85d5efefc932b572",
"assets/avatar_7.png": "89dfb0b9532e06d51a60ed3968f57621",
"assets/en-fip-blk.png": "015c6e1b9ceb9d2a0d79608879d13ee7",
"assets/en-fip-blk@3x.png": "015c6e1b9ceb9d2a0d79608879d13ee7",
"assets/en-fip-wht.png": "174b2d47b13299a5e931f67efa108673",
"assets/en-fip-wht@3x.png": "174b2d47b13299a5e931f67efa108673",
"assets/FontManifest.json": "bc6870a0758d142aaf4da5822ac4d5aa",
"assets/fonts/MaterialIcons-Regular.otf": "047e2488f8371be8180388daea600a2a",
"assets/NOTICES": "14b1214a5ed207c4da1ae9f2bd2713cc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "f2163b9d4e6f1ea52063f498c8878bb9",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
"canvaskit/canvaskit.wasm": "4c9d551b2f568feeefa320e57a0d83fc",
"canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
"canvaskit/chromium/canvaskit.wasm": "da6a55f713a56c43ddbea232df4926a5",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "89e7a5192ac57cc4a99334142c80d546",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon-1.png": "d6df15c76c6829115af925847f60f6b6",
"favicon.ico": "58bd7822fbbd5642104beae2b25a1b5b",
"favicon.png": "5dcd52bf9b698d06c7142171db1dfb9b",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192-circle.png": "a249b47683c6be260865b590b87d8e99",
"icons/Icon-192.png": "c15fa549f24405b6fe321e29816427ee",
"icons/Icon-512-circle.png": "6770d16b52cfcf1e51095b47042a0bad",
"icons/Icon-512.png": "314ff3b98866f40b7bf20b4a4fbb74e6",
"icons/Icon-maskable-192.png": "c15fa549f24405b6fe321e29816427ee",
"icons/Icon-maskable-512.png": "314ff3b98866f40b7bf20b4a4fbb74e6",
"index.html": "5fba710a1003c3563e2df7513a7d1448",
"/": "5fba710a1003c3563e2df7513a7d1448",
"main.dart.js": "ee24f366562fa551e53d517e9f45da71",
"manifest.json": "1eb4610ecc1e00fd6d59145728904dcb",
"version.json": "f805ea89b856a750d514a15364fd5e67"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
