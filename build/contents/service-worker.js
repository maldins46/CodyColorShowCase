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
    "url": "css/firebase-ui-custom.css",
    "revision": "f616cb3698398300bb729a3b34765ff8"
  },
  {
    "url": "css/fontawesome.css",
    "revision": "23556d040b26a98a7718ab9058bc4fa6"
  },
  {
    "url": "css/main.css",
    "revision": "93bf911ec48e1e1b5c70a031eebc3551"
  },
  {
    "url": "css/normalize.css",
    "revision": "112272e51c80ffe5bd01becd2ce7d656"
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
    "revision": "7e0c4beb5bec1ee9e5d22570d567abb8"
  },
  {
    "url": "js/app/controllers/arcadeAftermatchController.js",
    "revision": "163438a3119c164d8360c308bb6533a2"
  },
  {
    "url": "js/app/controllers/arcadeMatchController.js",
    "revision": "d9d5bc192364ce3c6fa63de11adfd11a"
  },
  {
    "url": "js/app/controllers/bootmpAftermatchController.js",
    "revision": "fdeee6c669c47d22e1f09ae64d0e8435"
  },
  {
    "url": "js/app/controllers/bootmpMatchController.js",
    "revision": "c4ca072e21a5dcfd51bf5e1e2fa5bf8e"
  },
  {
    "url": "js/app/controllers/bootmpMmakingController.js",
    "revision": "a33546aac50eb2455a68606ee7c838a0"
  },
  {
    "url": "js/app/controllers/customMmakingController.js",
    "revision": "d4db171a626008bbba9e27028f395163"
  },
  {
    "url": "js/app/controllers/customNewMatchController.js",
    "revision": "7f1275012455c220829bc08fde44e15b"
  },
  {
    "url": "js/app/controllers/emptyController.js",
    "revision": "13b87aabc910bcf666b9f9e50d9a6c78"
  },
  {
    "url": "js/app/controllers/royaleAftermatchController.js",
    "revision": "1bf064e7f76722df50b36bb862c78fc5"
  },
  {
    "url": "js/app/controllers/royaleMatchController.js",
    "revision": "09001efca99f02294acb851f54cc7835"
  },
  {
    "url": "js/app/controllers/royaleMmakingController.js",
    "revision": "ebaabf5975c6e6c084b5a9a439233f8e"
  },
  {
    "url": "js/app/controllers/royaleNewMatchController.js",
    "revision": "174e743dc9afd8ac26146bbd621aa321"
  },
  {
    "url": "js/app/factories/audioHandler.js",
    "revision": "6f520f254ed64e103efb82d1f2af56fc"
  },
  {
    "url": "js/app/factories/gameData.js",
    "revision": "665d8f253e7b88dd54e43113737245ce"
  },
  {
    "url": "js/app/factories/navigationHandler.js",
    "revision": "48e1d9899d781042786473bafc4d4b4c"
  },
  {
    "url": "js/app/factories/pathHandler.js",
    "revision": "d02f1f71b847349f6ed7f13d97b152e3"
  },
  {
    "url": "js/app/factories/rabbitCommunicator.js",
    "revision": "41bb5441f04201277ca18f9f8488c19a"
  },
  {
    "url": "js/app/factories/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/app/factories/sessionHandler.js",
    "revision": "de7a8582e1961a2c1219571e11564043"
  },
  {
    "url": "js/app/factories/translationHandler.js",
    "revision": "858c64697e3252a1d2956b332ae5d52c"
  },
  {
    "url": "js/app/main.js",
    "revision": "9348614588276e4f3ad9747492b325e3"
  },
  {
    "url": "js/bower/1-jquery.js",
    "revision": "11c05eb286ed576526bf4543760785b9"
  },
  {
    "url": "js/bower/2-angular.js",
    "revision": "1274df81cc705f2870ff98b32e130c3c"
  },
  {
    "url": "js/bower/3-angular-translate.js",
    "revision": "3a7e434fcbdae5194669e2b1b0bbb825"
  },
  {
    "url": "js/bower/4-qrcode.js",
    "revision": "c937fa27ccfdb4adcd0c99bcc938dc61"
  },
  {
    "url": "js/bower/angular-animate.js",
    "revision": "ceeb780edf941a09329131a295eab68d"
  },
  {
    "url": "js/bower/angular-cookies.js",
    "revision": "85a52efc9a3c2e16fb64cec18088321b"
  },
  {
    "url": "js/bower/angular-dragdrop.js",
    "revision": "5ce0a4e16d66cba2e900b617493cc62f"
  },
  {
    "url": "js/bower/angular-qr.js",
    "revision": "aa73288e627c31299b0b79b9a08dfc01"
  },
  {
    "url": "js/bower/angular-route.js",
    "revision": "09200d8c7ea5d9e8b3e1823ef3a317d1"
  },
  {
    "url": "js/bower/angular-sanitize.js",
    "revision": "a087d1bd4dd9000471fa74b38a2de059"
  },
  {
    "url": "js/bower/angular-translate-loader-static-files.js",
    "revision": "eee20da7c4b35621cef5bbb527186f28"
  },
  {
    "url": "js/bower/angular-translate-storage-cookie.js",
    "revision": "d4241584ff3c515d4d8ea46c0a7bc717"
  },
  {
    "url": "js/bower/jquery-ui.js",
    "revision": "ab5284de5e3d221e53647fd348e5644b"
  },
  {
    "url": "js/vendor/encoding.js",
    "revision": "773ce08c576fe346db1a8c0897b2cd5d"
  },
  {
    "url": "js/vendor/jquery.ui.touch-punch.js",
    "revision": "1ca526805a37c4a11c17a6a7923ec7a0"
  },
  {
    "url": "js/vendor/lzutf8.js",
    "revision": "5e032e39ef318f5e4734ef350c4d684e"
  },
  {
    "url": "js/vendor/modernizr.min.js",
    "revision": "8b9e755b33e4961ac40ab6a7f3ddc3f9"
  },
  {
    "url": "js/vendor/noSleep.js",
    "revision": "40207533c9f1dc5d7b2b5de6ffe9d2a8"
  },
  {
    "url": "js/vendor/object-assign-auto.js",
    "revision": "8ffc09eefa407d850eeb36d8d6faff5f"
  },
  {
    "url": "js/vendor/plugins.js",
    "revision": "048e67836eb558d0854f558a4f3a5663"
  },
  {
    "url": "js/vendor/stomp.js",
    "revision": "3e0c8f1d3eb00ae479ae96fddbccce99"
  },
  {
    "url": "locales/locale-en.json",
    "revision": "59be2def61ea50edb6fe09b8983fe653"
  },
  {
    "url": "locales/locale-hu.json",
    "revision": "8694a83c7c1b5ba4293b2dd6831e2d1d"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "f458fbef14eef3d48e3f2340208bf60a"
  },
  {
    "url": "manifest.json",
    "revision": "319f0ce547818d0a541a1abe4f818400"
  },
  {
    "url": "pages/404.html",
    "revision": "45008abd5a6dadcb780cae3946522269"
  },
  {
    "url": "pages/arcade-aftermatch.html",
    "revision": "493e0d5daae5cd529b1a8846538261a7"
  },
  {
    "url": "pages/arcade-match.html",
    "revision": "befc9beace4adba88e85887dc349b033"
  },
  {
    "url": "pages/bootmp-aftermatch.html",
    "revision": "4e1a713fe11c90454a417f0b9dbab8de"
  },
  {
    "url": "pages/bootmp-match.html",
    "revision": "3b4dee10c011600e1e62de92055db268"
  },
  {
    "url": "pages/bootmp-mmaking.html",
    "revision": "6f6a5645c8f566acf500bd10a841cd79"
  },
  {
    "url": "pages/custom-mmaking.html",
    "revision": "708cdda8283f3ad5c3f7b8f467270644"
  },
  {
    "url": "pages/royale-aftermatch.html",
    "revision": "fc769813b333d9bc8b64d776fea48705"
  },
  {
    "url": "pages/royale-match.html",
    "revision": "065850a265c663b4e32c02559ee1e9e0"
  },
  {
    "url": "pages/royale-mmaking.html",
    "revision": "eea61c603d5608ac6f8b9b6893664e81"
  },
  {
    "url": "pages/royale-new-match.html",
    "revision": "4fff980e40d2136481250bb6a466d22b"
  },
  {
    "url": "robots.txt",
    "revision": "00733c197e59662cf705a2ec6d881d44"
  },
  {
    "url": "site.webmanifest",
    "revision": "a1c81b5cb1033a0be5130ab456c6436b"
  }
], { cleanupOutdatedCaches: true });