// codice da 'iniettare' in workbox, nel caso in cui si voglia andare a modificare il sistema di
// caching predefinito
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([], {
});