// Define the cache name and the list of assets to cache
const cacheName = 'justice-bible-app-cache-v1';
const cacheAssets = [
    "./bible.js",
    "./bible_search.js",
    "./bookmark.js",
    "./history.js",
    "./htmmanip.js",
    "./manifest.json",
    "./nav.js",
    "./notes.js",
    "./search.js",
    "./service-worker.js",
    "./showfuncs.js",
    "./style.css",
    "./wordsmatches.js",
    "../../images/My_Bible_glow_256.png",
    "../../images/My_Bible_glow_192.png",
    //'/css/styles.css', // Add paths to your CSS files
    //'/js/main.js',     // Add paths to your JavaScript files
    // Add paths to other assets like images, icons, etc.
];

// Install event - Cache the app's assets
self.addEventListener('beforeinstallprompt', (e) => {
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(cacheAssets);
            })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache => cache !== cacheName)
                    .map((cache) => {
                        return caches.delete(cache);
                    })
                )
            );
        })
    );
});

// Fetch event - Serve cached assets if available, otherwise fetch from the network
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
