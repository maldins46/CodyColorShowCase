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
    "revision": "243af11debeeac0e23aa7712052666dc"
  },
  {
    "url": "css/normalize.css",
    "revision": "112272e51c80ffe5bd01becd2ce7d656"
  },
  {
    "url": "index.html",
    "revision": "f17296fb15bd9ef5ef533bb495ea410e"
  },
  {
    "url": "partials/404.html",
    "revision": "64b6c0eb68781a03f7ae1ab4bc8468dd"
  },
  {
    "url": "partials/aftermatch.html",
    "revision": "09aec097bb4436643719aaa656757181"
  },
  {
    "url": "partials/bootaftermatch.html",
    "revision": "88aef941bda516d2760240577ef67e7c"
  },
  {
    "url": "partials/bootcamp.html",
    "revision": "a63beb37a7ba09eca4a816d3811ddefb"
  },
  {
    "url": "partials/bootcampmaking.html",
    "revision": "ad229e8e49be202e2b3d7e0845cb59e2"
  },
  {
    "url": "partials/cmmaking.html",
    "revision": "b934f7a9dcb7482a19c963d4510b3800"
  },
  {
    "url": "partials/home.html",
    "revision": "88bb0fd9b8574c114f3a63b3e616e2b5"
  },
  {
    "url": "partials/login.html",
    "revision": "ed244ec7b7c3992d1ba8766e889b5f28"
  },
  {
    "url": "partials/match.html",
    "revision": "2756c2735907a88b3e9b67b754f39e14"
  },
  {
    "url": "partials/newcmatch.html",
    "revision": "b27f295227e70a363d99cca6a8b60d7c"
  },
  {
    "url": "partials/ranking.html",
    "revision": "f88137f7b65f1a3c925fa37713c8fbae"
  },
  {
    "url": "partials/register.html",
    "revision": "4637b81ecb806084c19b6906a74aa133"
  },
  {
    "url": "partials/rmmaking.html",
    "revision": "ca8fa03c031436149f41442323acda8b"
  },
  {
    "url": "partials/rules.html",
    "revision": "37d5cb5efbc98ae6e6debc55557fab7c"
  },
  {
    "url": "partials/splash.html",
    "revision": "889b1030392f2bc0173b026bf305b502"
  },
  {
    "url": "browserconfig.xml",
    "revision": "905720e1544539f066d6e6c2017abe2c"
  },
  {
    "url": "locales/locale-en.json",
    "revision": "97a1373cbe22753a3215c8b02fda2ec3"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "811712986aa942c2fdd4d7559cf0931e"
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
    "url": "js/controllers/aftermatchController.js",
    "revision": "706c679514e652d2221db7c73065f81a"
  },
  {
    "url": "js/controllers/bootAftermatchController.js",
    "revision": "9d65c693266759ff2e3adad8f1a23489"
  },
  {
    "url": "js/controllers/bootCampController.js",
    "revision": "2fcc1c1a491b4b9c9e6dcdd496f3d357"
  },
  {
    "url": "js/controllers/bootCampMakingController.js",
    "revision": "140fed1eaadbf49f8b18202f5795696e"
  },
  {
    "url": "js/controllers/cmmakingController.js",
    "revision": "4ab53d5fd6007af990078b20ddc73442"
  },
  {
    "url": "js/controllers/emptyController.js",
    "revision": "5b269d942873cd2df2751c58e3b82d6b"
  },
  {
    "url": "js/controllers/homeController.js",
    "revision": "302ff90c00816200a1ecb7a9969d20f8"
  },
  {
    "url": "js/controllers/loginController.js",
    "revision": "d3adbbf4d4d47bd46a24f5aaf70f2dc4"
  },
  {
    "url": "js/controllers/matchController.js",
    "revision": "ee3abff6c655328558d3ca272440e7b2"
  },
  {
    "url": "js/controllers/newcmatchController.js",
    "revision": "f2dd09e1bff072d206e0a5bd6cc59a67"
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
    "url": "js/controllers/rmmakingController.js",
    "revision": "0e50f372c602d64f5a5380143cb033cf"
  },
  {
    "url": "js/controllers/splashController.js",
    "revision": "5ca944b508a71d4c6b6b98ad7ff52b63"
  },
  {
    "url": "js/gameData.js",
    "revision": "7e25961ad907f51eab5b1de4877aa358"
  },
  {
    "url": "js/main.js",
    "revision": "c6ff72b5ec893587ea7a34fda984824d"
  },
  {
    "url": "js/navigationHandler.js",
    "revision": "0b15af766704fd1122d03c130929c3db"
  },
  {
    "url": "js/plugins.js",
    "revision": "048e67836eb558d0854f558a4f3a5663"
  },
  {
    "url": "js/rabbitCommunicator.js",
    "revision": "d0aa336ef5e460457931145e356c0c5d"
  },
  {
    "url": "js/robyAnimator.js",
    "revision": "1bae92cb4bbb39ca39e020e47ca1af32"
  },
  {
    "url": "js/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/sessionHandler.js",
    "revision": "6ed2388ff990868ff14ad667cd362fb2"
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