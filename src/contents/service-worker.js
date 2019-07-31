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
    "url": "img/user-avatar.png",
    "revision": "33a9e23901d5f05b300bcf4b1270b8ae"
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
    "url": "favicon.ico",
    "revision": "8a7fd8e460595bafc6f1a4b32efd1a28"
  },
  {
    "url": "css/firebase-ui-custom.css",
    "revision": "f616cb3698398300bb729a3b34765ff8"
  },
  {
    "url": "css/main.css",
    "revision": "03556e132a25876025f127ff4cb01bb8"
  },
  {
    "url": "css/normalize.css",
    "revision": "112272e51c80ffe5bd01becd2ce7d656"
  },
  {
    "url": "locales/locale-en.json",
    "revision": "2c332874509120124f3560d2e11f0e9b"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "4ec095dcee2abbe50162d793f8c9604f"
  },
  {
    "url": "bower_components/firebaseui/buildtools/all_tests.html",
    "revision": "a804685d6a54412445269458d21cf813"
  },
  {
    "url": "bower_components/firebaseui/buildtools/test_template.html",
    "revision": "4bfc458a724432ad9a3a59f64217c485"
  },
  {
    "url": "bower_components/firebaseui/demo/public/index.html",
    "revision": "f525a41290c5c506cdb728a35604b618"
  },
  {
    "url": "bower_components/firebaseui/demo/public/widget.html",
    "revision": "505e21921f09bf6df39fce67c0d59cb2"
  },
  {
    "url": "bower_components/firebaseui/javascript/ui/mdl_test_dom.html",
    "revision": "5b631f895bac9e9e49a38971e9a803fa"
  },
  {
    "url": "bower_components/firebaseui/soy/elements_test_dom.html",
    "revision": "009952fe4c6199a56e5f6f2db8e20002"
  },
  {
    "url": "bower_components/firebaseui/soy/pages_test_dom.html",
    "revision": "2d5659f736def12b16c843cfd105fb9b"
  },
  {
    "url": "index.html",
    "revision": "b5e8608b83cf8e7f42c231f90ebe24fd"
  },
  {
    "url": "pages/404.html",
    "revision": "e83ad3cd1bc3d85e789543f4635a3dd3"
  },
  {
    "url": "pages/arcade-aftermatch.html",
    "revision": "684639b5c84dca1a429568eb923be75a"
  },
  {
    "url": "pages/arcade-match.html",
    "revision": "97c44fc85496cb43eaee7c23ec6baf1e"
  },
  {
    "url": "pages/bootmp-aftermatch.html",
    "revision": "fe3008ec5f85d29da383239bb3321e1a"
  },
  {
    "url": "pages/bootmp-match.html",
    "revision": "5cbd48ba408947c9c31a079d78bcd183"
  },
  {
    "url": "pages/bootmp-mmaking.html",
    "revision": "ac3cce03173ae0541be9117d2cc78b24"
  },
  {
    "url": "pages/custom-mmaking.html",
    "revision": "9a2630160542f10425b35480a30f067c"
  },
  {
    "url": "pages/custom-new-match.html",
    "revision": "5579b9da9f2b5604b79d35a3f401e1de"
  },
  {
    "url": "pages/home.html",
    "revision": "f0e6896f03e9bb6d9bf96110d4e64561"
  },
  {
    "url": "pages/login.html",
    "revision": "1020f26526de85876097b66a9c4de845"
  },
  {
    "url": "pages/privacy.html",
    "revision": "1d456b68b1394ed4fc4ca8c718759d73"
  },
  {
    "url": "pages/random-mmaking.html",
    "revision": "de13bbb792e50abedb66b3d610c78b3e"
  },
  {
    "url": "pages/rankings.html",
    "revision": "b708199fc928e2415a98b4466ca5ee93"
  },
  {
    "url": "pages/royale-aftermatch.html",
    "revision": "ca9f4a5608079b13699325759b82a9ee"
  },
  {
    "url": "pages/royale-match.html",
    "revision": "7d3ccc27263741a62e575c7e5e6aae94"
  },
  {
    "url": "pages/royale-mmaking.html",
    "revision": "016610a0e9a7d5bd26747dc890df5b45"
  },
  {
    "url": "pages/royale-new-match.html",
    "revision": "33e4cc66dc51332f1f427a2e6ae4b346"
  },
  {
    "url": "pages/rules.html",
    "revision": "cdc96d5fca10a8ce3d5ac84e57a1fdd6"
  },
  {
    "url": "pages/splash.html",
    "revision": "2a19a3e995e43efd1c4edc834ecf1866"
  },
  {
    "url": "pages/terms.html",
    "revision": "43337ad2159f4ba3d30ccc1ebff3d8ed"
  },
  {
    "url": "static/privacy-policy/index.html",
    "revision": "ef2992b14cbc08c8f2d3948dda84b8b6"
  },
  {
    "url": "static/terms-of-service/index.html",
    "revision": "3fa28e680a5209544ddb0c8bc9ed4eea"
  },
  {
    "url": "browserconfig.xml",
    "revision": "905720e1544539f066d6e6c2017abe2c"
  },
  {
    "url": "manifest.json",
    "revision": "319f0ce547818d0a541a1abe4f818400"
  },
  {
    "url": "site.webmanifest",
    "revision": "a1c81b5cb1033a0be5130ab456c6436b"
  },
  {
    "url": "js/audioHandler.js",
    "revision": "0ee5ece4a490a913619dd0da4a91dbc7"
  },
  {
    "url": "js/authHandler.js",
    "revision": "8a130998f3dc7c0b151e9129d439f495"
  },
  {
    "url": "js/chatHandler.js",
    "revision": "3a6749134dff089b1751be593eaa0e32"
  },
  {
    "url": "js/controllers/arcadeAftermatchController.js",
    "revision": "85d36c75dfa752664708a1bf5d591d5c"
  },
  {
    "url": "js/controllers/arcadeMatchController.js",
    "revision": "07fadaf58a09b5d492f908e642ea4998"
  },
  {
    "url": "js/controllers/bootmpAftermatchController.js",
    "revision": "5b5014fca55d4c457bc07eb416ce3ec9"
  },
  {
    "url": "js/controllers/bootmpMatchController.js",
    "revision": "63229306b0ec8f296d79683a7661ef79"
  },
  {
    "url": "js/controllers/bootmpMmakingController.js",
    "revision": "5dfa3d7257bee35549205df77d947e44"
  },
  {
    "url": "js/controllers/customMmakingController.js",
    "revision": "cd6f2cecc96c83deb60c3eb8c600ca4f"
  },
  {
    "url": "js/controllers/customNewMatchController.js",
    "revision": "2639aea26ef05e9834f4ce57030be065"
  },
  {
    "url": "js/controllers/emptyController.js",
    "revision": "6be32d71c103c91b7abdc7008da4e917"
  },
  {
    "url": "js/controllers/homeController.js",
    "revision": "9604807449aced2a43d0860122379c9c"
  },
  {
    "url": "js/controllers/loginController.js",
    "revision": "70d0d023cd7ca91c0571ec9eadcffafc"
  },
  {
    "url": "js/controllers/randomMmakingController.js",
    "revision": "0db491c4786d23c499d0dff9de7faf4d"
  },
  {
    "url": "js/controllers/rankingsController.js",
    "revision": "bad29496dd5eeb44d08c15df3d405f17"
  },
  {
    "url": "js/controllers/royaleAftermatchController.js",
    "revision": "b66822e8f0fd2e3960219b37c5c9ba34"
  },
  {
    "url": "js/controllers/royaleMatchController.js",
    "revision": "8c7f7d4be5af9431ea4be16326f1a3c2"
  },
  {
    "url": "js/controllers/royaleMmakingController.js",
    "revision": "c432279f8efdc54c3581af5b5e1b6465"
  },
  {
    "url": "js/controllers/royaleNewMatchController.js",
    "revision": "5ddd040267b2ff357dcd2f7cc18830bf"
  },
  {
    "url": "js/controllers/splashController.js",
    "revision": "55c2d66c65e9bc6d03f52cc53ca19158"
  },
  {
    "url": "js/gameData.js",
    "revision": "0d0cafd5a0fb30afb4580cede286e3bb"
  },
  {
    "url": "js/main.js",
    "revision": "5bc736b46c178e5eeab55c2ec45122d9"
  },
  {
    "url": "js/navigationHandler.js",
    "revision": "6605dd60e50882e4aee830a3b781d991"
  },
  {
    "url": "js/pathHandler.js",
    "revision": "ee750c13ba5175ea4f82223407531a00"
  },
  {
    "url": "js/plugins.js",
    "revision": "048e67836eb558d0854f558a4f3a5663"
  },
  {
    "url": "js/rabbitCommunicator.js",
    "revision": "8b02a723aec159c475547bc28a9fb78c"
  },
  {
    "url": "js/rankingsHandler.js",
    "revision": "f5d0981b934d518b9a631dde7733367d"
  },
  {
    "url": "js/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/sessionHandler.js",
    "revision": "5720215c85def0e5d8b0064e87c23690"
  },
  {
    "url": "js/translationHandler.js",
    "revision": "d22cf03c3d2ca68e1840474778c4e854"
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
    "url": "js/vendor/stomp.js",
    "revision": "c48c7e12cb990717d1c7e4b23b0da12a"
  },
  {
    "url": "bower_components/jquery/dist/jquery.min.js",
    "revision": "220afd743d9e9643852e31a135a9f3ae"
  },
  {
    "url": "bower_components/jquery-ui/jquery-ui.min.js",
    "revision": "c15b1008dec3c8967ea657a7bb4baaec"
  },
  {
    "url": "bower_components/angular/angular.min.js",
    "revision": "0f146391dfc57e3e0506c4c0f72d51d1"
  },
  {
    "url": "bower_components/angular-dragdrop/src/angular-dragdrop.min.js",
    "revision": "68c7c58943631b2c73eda382ff50a732"
  },
  {
    "url": "bower_components/angular-route/angular-route.min.js",
    "revision": "c429fba7f57cd2306843295bc29aa571"
  },
  {
    "url": "bower_components/angular-animate/angular-animate.min.js",
    "revision": "72c2f5ab2972d75161f2e1447dcc2758"
  },
  {
    "url": "bower_components/angular-cookies/angular-cookies.min.js",
    "revision": "bf11427c55c465560b91a34c22cc0498"
  },
  {
    "url": "bower_components/angular-translate/angular-translate.min.js",
    "revision": "043ca33cd1a9b97ffbbb33671c3d38c8"
  },
  {
    "url": "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
    "revision": "0d0f49ccc75db0eed91d792227e3cab4"
  },
  {
    "url": "bower_components/angular-sanitize/angular-sanitize.min.js",
    "revision": "337cb810793e337cff921a292de44935"
  },
  {
    "url": "bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
    "revision": "5491ea6a28c1355d344df7afaf2fd7e0"
  },
  {
    "url": "bower_components/firebase/firebase-app.js",
    "revision": "ea4f80e43d1ffb922cafef20f5cefdd8"
  },
  {
    "url": "bower_components/firebase/firebase-auth.js",
    "revision": "d531146426b5bdb6ad68d90d73200c01"
  },
  {
    "url": "bower_components/firebaseui/dist/firebaseui.js",
    "revision": "d74e7980688d4eb01a893a35435aced6"
  },
  {
    "url": "bower_components/components-font-awesome/css/all.min.css",
    "revision": "dbf9d822cefe851ba6f66e1ad57e8987"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-brands-400.eot",
    "revision": "03783c5172ee1ad128c576bf88fac168"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-brands-400.svg",
    "revision": "073c2f3ce60eaf69cc2767ef3d989078"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-brands-400.ttf",
    "revision": "ed2b8bf117160466ba6220a8f1da54a4"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-brands-400.woff",
    "revision": "fe9d62e0d16a333a20e63c3e7595f82e"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-brands-400.woff2",
    "revision": "7559b3774a0625e8ca6c0160f8f6cfd8"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-regular-400.eot",
    "revision": "fc9c63c8224fb341fc933641cbdd12ef"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-regular-400.svg",
    "revision": "8fdea4e89ac405d9f8db327adb331d8d"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-regular-400.ttf",
    "revision": "59215032a4397507b80e5625dc323de3"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-regular-400.woff",
    "revision": "e5770f9863963fb576942e25214a226d"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-regular-400.woff2",
    "revision": "e07d9e40b26048d9abe2ef966cd6e263"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-solid-900.eot",
    "revision": "ef3df98419d143d9617fe163bf4edc0b"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-solid-900.svg",
    "revision": "b557f56e367e59344ca95f9d1fb44352"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-solid-900.ttf",
    "revision": "acf50f59802f20d8b45220eaae532a1c"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-solid-900.woff",
    "revision": "4bced7c4c0d61d4f988629bb8ae80b8b"
  },
  {
    "url": "bower_components/components-font-awesome/webfonts/fa-solid-900.woff2",
    "revision": "b5cf8ae26748570d8fb95a47f46b69e1"
  }
], { cleanupOutdatedCaches: true });