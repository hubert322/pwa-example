"use strict";

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/app.js",
    "/styles.css",
    "/jquery-3.4.1.min.js",
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
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
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

    if (event.request.url.includes ("github")) {
        console.log ("Fetch github");
        event.respondWith (
            caches.open (DATA_CACHE_NAME)
                .then (cache => {
                    return fetch (event.request)
                        .then (response => {
                            console.log ("in", response);
                            if (response.status === 200)
                                cache.put (event.request.url, response.clone ());
                            return response;
                        })
                        .catch (error => cache.match (event.request));
                })
        );
        return;
    }

    event.respondWith (
        caches.open (CACHE_NAME)
            .then (cache => {
                return cache.match (event.request)
                    .then (response => response || fetch (event.request));
            })
    );
});