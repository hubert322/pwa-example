"use strict";

const CACHE_NAME = "static-cache-v1";

const FILES_TO_CACHE = [
    "/offline.html"
];

self.addEventListener ("install", event => {
    console.log ("Install");

    event.waitUntil (
        caches.open (CACHE_NAME)
            .then (cache => {
                console.log ("pre-caching offline page");
                return cache.addAll (FILES_TO_CACHE);
            })
    );

    self.skipWaiting ();
});

self.addEventListener ("activate", event => {
    console.log ("Activate");

    event.waitUntil (
        caches.keys ()
            .then (keyList => {
                return Promise.all (keyList.map (key => {
                    if (key !== CACHE_NAME) {
                        console.log ("Removing old cache", key);
                        return caches.delete (key);
                    }
                }));
            })
    );

    self.clients.claim ();
});

self.addEventListener ("fetch", event => {
    console.log ("Fetch", event.request.url);

    if (event.request.mode !== "navigate")
        return;

    event.respondWith (
        fetch (event.request)
            .catch (() => {
                return caches.open (CACHE_NAME)
                    .then (cache => {
                        return cache.match ("offline.html");
                    });
            })
    );
});