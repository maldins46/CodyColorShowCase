// codice da 'iniettare' in workbox, nel caso in cui si voglia andare a modificare il sistema di
// caching predefinito
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

/*
// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);*/

workbox.precaching.precacheAndRoute([
  {
    "url": "audio/countdown.wav",
    "revision": "fcdba471baf93cf317bd392e682a1261"
  },
  {
    "url": "audio/enemy-found.wav",
    "revision": "59eb4b84ab3931e9ba5da36f2de44f07"
  },
  {
    "url": "audio/lost.wav",
    "revision": "e7773435c8b62ad8a42a55d480b26f66"
  },
  {
    "url": "audio/menu-click.wav",
    "revision": "94339968dc4a1b931a9266c49242cc56"
  },
  {
    "url": "audio/music.wav",
    "revision": "9c41883e174fc4e878411d75a6e9f8fb"
  },
  {
    "url": "audio/roby-drag.wav",
    "revision": "6d30aacce3aa8e3d714ebf2a1d364475"
  },
  {
    "url": "audio/roby-drop.wav",
    "revision": "0fb8b4ba1b875e5c823a9a613c62e860"
  },
  {
    "url": "audio/roby-over.wav",
    "revision": "f9e65696135eb47780f50ef887ba1138"
  },
  {
    "url": "audio/roby-positioned.wav",
    "revision": "c2afbfff1b703215c9645567deffc4eb"
  },
  {
    "url": "audio/start.wav",
    "revision": "87d921a4f945c49659669d4149ac2cc4"
  },
  {
    "url": "audio/win.wav",
    "revision": "465d4ef50c7e6932fec9ac8ddd181e29"
  },
  {
    "url": "favicon.ico",
    "revision": "8a7fd8e460595bafc6f1a4b32efd1a28"
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
    "url": "css/main.css",
    "revision": "9b88a591aafe5126cc4a9fe04dc5222f"
  },
  {
    "url": "css/normalize.css",
    "revision": "112272e51c80ffe5bd01becd2ce7d656"
  },
  {
    "url": "index.html",
    "revision": "68dcea3d755be5fea176a44f561da4f6"
  },
  {
    "url": "pages/404.html",
    "revision": "64b6c0eb68781a03f7ae1ab4bc8468dd"
  },
  {
    "url": "pages/arcade-aftermatch.html",
    "revision": "5aec1bdbd8b6cb18e6d2b39aec68a4a3"
  },
  {
    "url": "pages/arcade-match.html",
    "revision": "24dbfd2e248b244a7dadae48485d3dfa"
  },
  {
    "url": "pages/bootmp-aftermatch.html",
    "revision": "5984b864529bbada5e431d0cf36b16d7"
  },
  {
    "url": "pages/bootmp-match.html",
    "revision": "5f14888a9939a95a6a92479c1668ff1f"
  },
  {
    "url": "pages/bootmp-mmaking.html",
    "revision": "45deddabcac81dedc29dede5faf8e738"
  },
  {
    "url": "pages/custom-mmaking.html",
    "revision": "b72dcc776968aca6acbb55b379147bb4"
  },
  {
    "url": "pages/custom-new-match.html",
    "revision": "336c85155b2e5fc49034cf3dc499a53d"
  },
  {
    "url": "pages/home.html",
    "revision": "d9b894a5b233e5c1e2ff5f709a58bdb6"
  },
  {
    "url": "pages/login.html",
    "revision": "ed244ec7b7c3992d1ba8766e889b5f28"
  },
  {
    "url": "pages/random-mmaking.html",
    "revision": "99c7118850dc958677bf70adcae65167"
  },
  {
    "url": "pages/ranking.html",
    "revision": "f88137f7b65f1a3c925fa37713c8fbae"
  },
  {
    "url": "pages/register.html",
    "revision": "4637b81ecb806084c19b6906a74aa133"
  },
  {
    "url": "pages/royale-aftermatch.html",
    "revision": "78a71b7bbf8a86e7d19aaa34c31a10ce"
  },
  {
    "url": "pages/royale-match.html",
    "revision": "3f3169a04f3326d2eaa131e02e49dd5a"
  },
  {
    "url": "pages/royale-mmaking.html",
    "revision": "7813248e18017f7b514893fca498df9f"
  },
  {
    "url": "pages/royale-new-match.html",
    "revision": "019b7a3eed1fc1f8bd6ca173de25d746"
  },
  {
    "url": "pages/rules.html",
    "revision": "37d5cb5efbc98ae6e6debc55557fab7c"
  },
  {
    "url": "pages/splash.html",
    "revision": "889b1030392f2bc0173b026bf305b502"
  },
  {
    "url": "browserconfig.xml",
    "revision": "905720e1544539f066d6e6c2017abe2c"
  },
  {
    "url": "locales/locale-en.json",
    "revision": "fd8030d3c8332c23ef4d23f62da218bb"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "1bee52fcea1b094bbc05954d6c346126"
  },
  {
    "url": "manifest.json",
    "revision": "a1c81b5cb1033a0be5130ab456c6436b"
  },
  {
    "url": "site.webmanifest",
    "revision": "a1c81b5cb1033a0be5130ab456c6436b"
  },
  {
    "url": "js/audioHandler.js",
    "revision": "7638a0e7c5f19f82aa0d24775300c8a3"
  },
  {
    "url": "js/chatHandler.js",
    "revision": "3a6749134dff089b1751be593eaa0e32"
  },
  {
    "url": "js/controllers/arcadeAftermatchController.js",
    "revision": "4675f0525e7187e555fedadc908660b6"
  },
  {
    "url": "js/controllers/arcadeMatchController.js",
    "revision": "9cd83d76b631631e2295510349816640"
  },
  {
    "url": "js/controllers/bootmpAftermatchController.js",
    "revision": "60a6d6a1bf0e524c35722e1fcdf2424a"
  },
  {
    "url": "js/controllers/bootmpMatchController.js",
    "revision": "97a7e63d1e3f944709a98d91989d1e97"
  },
  {
    "url": "js/controllers/bootmpMmakingController.js",
    "revision": "88fe95a7abe7ebc178831f675884437a"
  },
  {
    "url": "js/controllers/customMmakingController.js",
    "revision": "5615901e0851bf1de65d95e8f5de64cf"
  },
  {
    "url": "js/controllers/customNewMatchController.js",
    "revision": "7f83df48c8dcaa6c0c1ae2c8f75cf06b"
  },
  {
    "url": "js/controllers/emptyController.js",
    "revision": "3dd7d2fbe1b0cb271a923fb02459524f"
  },
  {
    "url": "js/controllers/homeController.js",
    "revision": "8a89d2091513950b9758e4aa8ba87857"
  },
  {
    "url": "js/controllers/loginController.js",
    "revision": "d3adbbf4d4d47bd46a24f5aaf70f2dc4"
  },
  {
    "url": "js/controllers/randomMmakingController.js",
    "revision": "4bc3a97c0e036eec625554c8f013a89d"
  },
  {
    "url": "js/controllers/rankingController.js",
    "revision": "a9079ceefc7249f905f1fa66e2bddfd5"
  },
  {
    "url": "js/controllers/registerController.js",
    "revision": "714cf16f7eeaf61d1649d5a6457e9c0a"
  },
  {
    "url": "js/controllers/royaleAftermatchController.js",
    "revision": "7cc2878d6b9f579471dc7c6956d44f50"
  },
  {
    "url": "js/controllers/royaleMatchController.js",
    "revision": "8feacc6beabd872ac43d61292175392b"
  },
  {
    "url": "js/controllers/royaleMmakingController.js",
    "revision": "00dc9f05a34e62f7f1c674be6e5c791d"
  },
  {
    "url": "js/controllers/royaleNewMatchController.js",
    "revision": "ef965b81c01d1db792a5810164953192"
  },
  {
    "url": "js/controllers/splashController.js",
    "revision": "3599cea323d70ad678140047caf8ff2a"
  },
  {
    "url": "js/gameData.js",
    "revision": "a9d7a86c938525aa6a4662f95bd44afe"
  },
  {
    "url": "js/main.js",
    "revision": "c6ff72b5ec893587ea7a34fda984824d"
  },
  {
    "url": "js/navigationHandler.js",
    "revision": "eb13aa87adc1d2960d4b1df01cdbd54e"
  },
  {
    "url": "js/pathHandler.js",
    "revision": "598ad0be67f2cba920d6ad3222d8b240"
  },
  {
    "url": "js/plugins.js",
    "revision": "048e67836eb558d0854f558a4f3a5663"
  },
  {
    "url": "js/rabbitCommunicator.js",
    "revision": "2d1b81f20a817580c6784db16c20ebb5"
  },
  {
    "url": "js/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/sessionHandler.js",
    "revision": "4131a831b6837fcf4631fd98cec66b88"
  },
  {
    "url": "js/translationHandler.js",
    "revision": "d3e1c13bf6967bacb9e32147aad203cf"
  },
  {
    "url": "js/vendor/jquery.ui.touch-punch.min.js",
    "revision": "700b877cd3ade98ce6cd4be349d81a5c"
  },
  {
    "url": "js/vendor/modernizr.min.js",
    "revision": "8b9e755b33e4961ac40ab6a7f3ddc3f9"
  },
  {
    "url": "js/vendor/stomp.min.js",
    "revision": "00e1237a0ae9934f2eb4506801a206ea"
  }
], { cleanupOutdatedCaches: true });