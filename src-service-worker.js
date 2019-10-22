/* File per personalizzare ulteriormente il service worker generato con workbox. E' qua possibile aggiungere del
 * codice da 'iniettare' nel service worker, nel caso in cui si vogliano aggiungere delle funzioni allo stesso, oltre
 * alla funzionalita' di caching predefinita.
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

// Place code to inject here

// pulisci la cache quando giunta a scadenza
workbox.precaching.precacheAndRoute([], { cleanupOutdatedCaches: true });