/* File per personalizzare ulteriormente il service worker generato con workbox. E' qua possibile aggiungere del
 * codice da 'iniettare' nel service worker, nel caso in cui si vogliano aggiungere delle funzioni allo stesso, oltre
 * alla funzionalita' di caching predefinita.
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

// Place code to inject here

// pulisci la cache quando giunta a scadenza
workbox.precaching.precacheAndRoute([
  {
    "url": "audio/countdown.mp3",
    "revision": "c70e5b039371b033378509d7f3a87d4b"
  },
  {
    "url": "audio/enemy-found.mp3",
    "revision": "75ba38576de28f3418910c49643d4d03"
  },
  {
    "url": "audio/lost.mp3",
    "revision": "38d342d60cb61725a8a1cdbd4287d446"
  },
  {
    "url": "audio/menu-click.mp3",
    "revision": "910fd40f18057b42713177074e9f716d"
  },
  {
    "url": "audio/music.mp3",
    "revision": "21d1ec68ac1c488a3b27948823d46c50"
  },
  {
    "url": "audio/roby-drag.mp3",
    "revision": "2b2da610c3c860d39463696a34ffd585"
  },
  {
    "url": "audio/roby-drop.mp3",
    "revision": "6252cdd7361c22621a8de53f2a15b4d3"
  },
  {
    "url": "audio/roby-over.mp3",
    "revision": "1276b2a2c9a5e20e2b889233639a9add"
  },
  {
    "url": "audio/roby-positioned.mp3",
    "revision": "eb135194c92486ac831fb640fd03b4fd"
  },
  {
    "url": "audio/start.mp3",
    "revision": "2ea9a9bb1e903f2addf4b56e4811f2eb"
  },
  {
    "url": "audio/win.mp3",
    "revision": "5b0bed32b967e627ef0afbe8c826f697"
  },
  {
    "url": "browserconfig.xml",
    "revision": "905720e1544539f066d6e6c2017abe2c"
  },
  {
    "url": "css/app.min.css",
    "revision": "a5b3d6ba5c3454e11feabb633d059c68"
  },
  {
    "url": "favicon.ico",
    "revision": "8a7fd8e460595bafc6f1a4b32efd1a28"
  },
  {
    "url": "fonts/baloo-chettan.ttf",
    "revision": "6be69c2d657a1d53bae098fa68432d33"
  },
  {
    "url": "fonts/fa-brands-400.woff",
    "revision": "fe9d62e0d16a333a20e63c3e7595f82e"
  },
  {
    "url": "fonts/fa-regular-400.woff",
    "revision": "e5770f9863963fb576942e25214a226d"
  },
  {
    "url": "fonts/fa-solid-900.woff",
    "revision": "4bced7c4c0d61d4f988629bb8ae80b8b"
  },
  {
    "url": "fonts/play.ttf",
    "revision": "85a4800fa5e9aa1053184e29f77f30a0"
  },
  {
    "url": "humans.txt",
    "revision": "a5ca446552514c2815a6f4524211bb8f"
  },
  {
    "url": "icons/android-icon-144x144.png",
    "revision": "be40492838a3dc582f1ca0bcabfeb3cf"
  },
  {
    "url": "icons/android-icon-192x192.png",
    "revision": "bb1c2173f4ca8f27154d25617c0ad43c"
  },
  {
    "url": "icons/android-icon-36x36.png",
    "revision": "d08e47d0158d74336de9c4e074082569"
  },
  {
    "url": "icons/android-icon-48x48.png",
    "revision": "addac0b88571315a14c1539d075e942c"
  },
  {
    "url": "icons/android-icon-72x72.png",
    "revision": "fe08510ab3f84d3c7cfd831b0afa5d96"
  },
  {
    "url": "icons/android-icon-96x96.png",
    "revision": "dea8e428c244dabb334dc9f63ba45ddc"
  },
  {
    "url": "icons/apple-icon-114x114.png",
    "revision": "fe073833607dc55b81c1c4b2bf2f2e4f"
  },
  {
    "url": "icons/apple-icon-120x120.png",
    "revision": "9901cf70bf0cffe616aba35204e36d7c"
  },
  {
    "url": "icons/apple-icon-144x144.png",
    "revision": "be40492838a3dc582f1ca0bcabfeb3cf"
  },
  {
    "url": "icons/apple-icon-152x152.png",
    "revision": "c7870cf6e2f52bd9201e623e90451336"
  },
  {
    "url": "icons/apple-icon-180x180.png",
    "revision": "66dcca3d94ab76e08d127e790e038268"
  },
  {
    "url": "icons/apple-icon-57x57.png",
    "revision": "3febf580c1d82a77954b9f16a4747c2c"
  },
  {
    "url": "icons/apple-icon-60x60.png",
    "revision": "53a267c4fbae5e89a819d11b7b37fc32"
  },
  {
    "url": "icons/apple-icon-72x72.png",
    "revision": "fe08510ab3f84d3c7cfd831b0afa5d96"
  },
  {
    "url": "icons/apple-icon-76x76.png",
    "revision": "566bbfe9457e41e237d527b7fdc8b5b8"
  },
  {
    "url": "icons/apple-icon-precomposed.png",
    "revision": "0a3a846e28cf6bb9aefe99c90df682e0"
  },
  {
    "url": "icons/apple-icon.png",
    "revision": "0a3a846e28cf6bb9aefe99c90df682e0"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "a1c7834edd2fdf1da796aba87587a9c7"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "d8a60f32e86f17bead5dced2f66300da"
  },
  {
    "url": "icons/favicon-96x96.png",
    "revision": "dea8e428c244dabb334dc9f63ba45ddc"
  },
  {
    "url": "icons/ms-icon-144x144.png",
    "revision": "be40492838a3dc582f1ca0bcabfeb3cf"
  },
  {
    "url": "icons/ms-icon-150x150.png",
    "revision": "d96f0433aaf44b7242f886cc74a5fd83"
  },
  {
    "url": "icons/ms-icon-310x310.png",
    "revision": "e04854629da5879dbbee238392208190"
  },
  {
    "url": "icons/ms-icon-70x70.png",
    "revision": "ce244be22b976f20be7d587f14372c39"
  },
  {
    "url": "img/enemy-broken.png",
    "revision": "c291eb43e8e01373dea38dc8c3ab2273"
  },
  {
    "url": "img/enemy-positioned.png",
    "revision": "5f18d784278bb55cc0830c0f41e071eb"
  },
  {
    "url": "img/enemy-walking-1.png",
    "revision": "05cb43fee3edb6acb0acd80fe7386162"
  },
  {
    "url": "img/enemy-walking-2.png",
    "revision": "4f0ca3c1459321c2587432ee83791a89"
  },
  {
    "url": "img/logo.png",
    "revision": "a3b5ed943fad358db813ab707e40f75a"
  },
  {
    "url": "img/roby-broken.png",
    "revision": "b63f884b982622be78634811ee96f9ad"
  },
  {
    "url": "img/roby-dragging-trasp.png",
    "revision": "3f37e37ce19fb4075e79513b07b66fd0"
  },
  {
    "url": "img/roby-idle.png",
    "revision": "b66ae37776e3e5db922f5ee533277892"
  },
  {
    "url": "img/roby-positioned.png",
    "revision": "92b8806dc0ade6ffac1215fe693a39f5"
  },
  {
    "url": "img/roby-walking-1.png",
    "revision": "872407728def30501e3774c2cb70d29c"
  },
  {
    "url": "img/roby-walking-2.png",
    "revision": "92c560f1efb7fa95b4113c0cf65bcdb6"
  },
  {
    "url": "img/title.png",
    "revision": "29e58f70a857b974f6f7312e84ee46b9"
  },
  {
    "url": "img/user-avatar.png",
    "revision": "33a9e23901d5f05b300bcf4b1270b8ae"
  },
  {
    "url": "index.html",
    "revision": "d532eb79050d298baa7c96de9793ac07"
  },
  {
    "url": "js/app/app.min.js",
    "revision": "9ca004b410a44d0f18793a81f9f8ee9b"
  },
  {
    "url": "locales/locale-en.json",
    "revision": "211596bc73ebbf2d25c0cfc01e2f0c03"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "30b4d67e64e3fd29ae5aebe777434661"
  },
  {
    "url": "manifest.json",
    "revision": "141b769ff249b2a739c44def394790bd"
  },
  {
    "url": "pages/404.html",
    "revision": "f7d0d4cb52b72b01ff2b0c3e010037ea"
  },
  {
    "url": "pages/arcade-aftermatch.html",
    "revision": "a4a667451c5c6a8f97828d12cf3eb0d0"
  },
  {
    "url": "pages/arcade-match.html",
    "revision": "9f751eb8da9c9513fdfdb8a57658c773"
  },
  {
    "url": "pages/create-match.html",
    "revision": "20876cc59b682341ac3f47beb36ebe9a"
  },
  {
    "url": "pages/custom-mmaking.html",
    "revision": "475684b842aab19aee18f4e7cc975d99"
  },
  {
    "url": "pages/privacy.html",
    "revision": "e6481ff454d08b52b5d326f798f768e5"
  },
  {
    "url": "pages/royale-aftermatch.html",
    "revision": "8e95769970bcced7134f129db70c5833"
  },
  {
    "url": "pages/royale-match.html",
    "revision": "36c0fe597e32e630465df75913509a0f"
  },
  {
    "url": "pages/royale-mmaking.html",
    "revision": "11c2e48b6bbc31ea15938c5d70690c14"
  },
  {
    "url": "pages/splash.html",
    "revision": "0f70970f71f017a55f7674ca1f991ea5"
  },
  {
    "url": "pages/terms.html",
    "revision": "c65b8e513a244a1d8c8a9a2f0d1935fd"
  },
  {
    "url": "robots.txt",
    "revision": "00733c197e59662cf705a2ec6d881d44"
  },
  {
    "url": "site.webmanifest",
    "revision": "8bfc64118a70662c474bceff72b1e681"
  },
  {
    "url": "static/privacy-policy/index.html",
    "revision": "ef2992b14cbc08c8f2d3948dda84b8b6"
  },
  {
    "url": "static/skeleton-2.0.4/normalize.css",
    "revision": "4555077d49642ee7558d9e12bc9660e5"
  },
  {
    "url": "static/skeleton-2.0.4/skeleton.css",
    "revision": "cd542f65c9e43abc5ea195c9ddae1bb9"
  },
  {
    "url": "static/style.css",
    "revision": "b5fef6dc6524b84f14a794a7e6f69e90"
  },
  {
    "url": "static/terms-of-service/index.html",
    "revision": "74c0f944191f8c8535aabfeca4c8b52c"
  }
], { cleanupOutdatedCaches: true });