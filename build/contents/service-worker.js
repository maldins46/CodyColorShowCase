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
    "url": "css/firebase-ui-auth.css",
    "revision": "6706213b7e3e51d76c8e7dbdbdc005c2"
  },
  {
    "url": "css/firebase-ui-custom.css",
    "revision": "3f0b9d6bbecf6e0c10899fcb1296455b"
  },
  {
    "url": "css/fontawesome.css",
    "revision": "23556d040b26a98a7718ab9058bc4fa6"
  },
  {
    "url": "css/main.css",
    "revision": "fdd3e8e09e758ff4327c2d9f83425600"
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
    "revision": "aa1e1065a79d970978aead3e6e2e7426"
  },
  {
    "url": "js/app/controllers/arcadeAftermatchController.js",
    "revision": "efad6cadd5ed9e1659d5225d858737de"
  },
  {
    "url": "js/app/controllers/arcadeMatchController.js",
    "revision": "3b95fbe8db095bfd5a8419b6d738725e"
  },
  {
    "url": "js/app/controllers/createMatchController.js",
    "revision": "5284ad0cda549f5a43ebddce76a39127"
  },
  {
    "url": "js/app/controllers/customMmakingController.js",
    "revision": "89301350cdf053d358ec66e5042fabbd"
  },
  {
    "url": "js/app/controllers/emptyController.js",
    "revision": "2258ff045122a74202a43298a76fec2f"
  },
  {
    "url": "js/app/controllers/royaleAftermatchController.js",
    "revision": "e6160edea96d355fd9d615371cdbe0fc"
  },
  {
    "url": "js/app/controllers/royaleMatchController.js",
    "revision": "67c49f029e7675b1d101852736f19a9f"
  },
  {
    "url": "js/app/controllers/royaleMmakingController.js",
    "revision": "ec5f6c1ad189d52cc864f530d8b89277"
  },
  {
    "url": "js/app/controllers/splashController.js",
    "revision": "ac78b1e5987d4fedce567f76b8c0d604"
  },
  {
    "url": "js/app/factories/audioHandler.js",
    "revision": "adce23ef90a99ae03c78d324e2c3ef64"
  },
  {
    "url": "js/app/factories/authHandler.js",
    "revision": "5487dfa6f372801a06898b5869cb9618"
  },
  {
    "url": "js/app/factories/gameData.js",
    "revision": "9ae4853bd2524fc48b209997bbbc8d37"
  },
  {
    "url": "js/app/factories/navigationHandler.js",
    "revision": "68fb8cecc79cb6c0e700e2998237371a"
  },
  {
    "url": "js/app/factories/pathHandler.js",
    "revision": "f0698cd89c17f1b74825ac67cc3a6a00"
  },
  {
    "url": "js/app/factories/rabbitCommunicator.js",
    "revision": "ad6f0b6c9c37cbee6d7645372936b9b8"
  },
  {
    "url": "js/app/factories/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/app/factories/sessionHandler.js",
    "revision": "b4b015655f8cf61d9d5cba78dc1b4868"
  },
  {
    "url": "js/app/factories/translationHandler.js",
    "revision": "858c64697e3252a1d2956b332ae5d52c"
  },
  {
    "url": "js/app/main.js",
    "revision": "2cc9a13d898e9d61512809e979d24434"
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
    "revision": "e54777d17c839bd20dc8db8fd7652e72"
  },
  {
    "url": "js/bower/5-qrcode_UTF8.js",
    "revision": "1bcd8a94d72a5d809af7a26e21222b68"
  },
  {
    "url": "js/bower/6-firebase-app.js",
    "revision": "ae736387dd091682f0507a3840702d3d"
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
    "url": "js/bower/angular-qrcode.js",
    "revision": "361c0e64582aa86405f6a12fcae500b6"
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
    "url": "js/bower/firebase-analytics.js",
    "revision": "3ce2eddec61cb053987c1930550dc72e"
  },
  {
    "url": "js/bower/firebase-auth.js",
    "revision": "bac02ceaae3098311462d7b2234443e7"
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
    "url": "js/vendor/firebase-ui-auth.js",
    "revision": "7711015edfd993e86e4e895903955736"
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
    "revision": "211596bc73ebbf2d25c0cfc01e2f0c03"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "f07738c902d16e3c2ae7f6bcdfdd0020"
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
    "revision": "4696b5a0ac5ff655b231817f944e4cc1"
  },
  {
    "url": "pages/splash.html",
    "revision": "d41ef000f42f767d6024428552eeabf0"
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