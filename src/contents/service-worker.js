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
    "url": "locales/locale-en.json",
    "revision": "6c141608a5d8c4786bcbd5cff4e9b5f8"
  },
  {
    "url": "locales/locale-it.json",
    "revision": "c528563cf7d15734d252c9cb73b248af"
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
    "revision": "2974dfef9ee10f3c548046708004663d"
  },
  {
    "url": "pages/404.html",
    "revision": "e83ad3cd1bc3d85e789543f4635a3dd3"
  },
  {
    "url": "pages/arcade-aftermatch.html",
    "revision": "a8673940ede69c97454411c04a7d5dad"
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
    "revision": "b7ca45d83f3ef2e725e98d4630d2b216"
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
    "revision": "ec8b07086dae3f5b4b178fdad27c9594"
  },
  {
    "url": "pages/rankings.html",
    "revision": "b708199fc928e2415a98b4466ca5ee93"
  },
  {
    "url": "pages/royale-aftermatch.html",
    "revision": "1990366b306bab800b012a5276a111e9"
  },
  {
    "url": "pages/royale-match.html",
    "revision": "2884b0e77c35db86bca7424640d4aec7"
  },
  {
    "url": "pages/royale-mmaking.html",
    "revision": "8fc50babeab1e1f5b534e41299488cf1"
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
    "revision": "56245dd599ac30a6047cb7234f42d81f"
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
    "url": "package-lock.json",
    "revision": "986ce2cb101a1c8e137b9fdb5274458e"
  },
  {
    "url": "package.json",
    "revision": "ad64d3f81186b47c66130a0139eb873e"
  },
  {
    "url": "site.webmanifest",
    "revision": "a1c81b5cb1033a0be5130ab456c6436b"
  },
  {
    "url": "build/app.min.css",
    "revision": "c2039b54b7bb3bd91ce0de15c2eade3d"
  },
  {
    "url": "build/app.min.js",
    "revision": "64736351ffcc8f2af7faf4dbb16a2261"
  }
], { cleanupOutdatedCaches: true });