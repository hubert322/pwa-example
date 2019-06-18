"use strict";

const CACHE_NAME = "static-cache-v1";

const FILES_TO_CACHE = [
    "offline.html"
];

self.addEventListener ("install", event => {
    console.log ("Install");

    self.skipWaiting ();
});

self.addEventListener ("activate", event => {
    console.log ("Activate");

    self.clients.claim ();
});

self.addEventListener ("fetch", event => {
    console.log ("Fetch", event.request.url);
});