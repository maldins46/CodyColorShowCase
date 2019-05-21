/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
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
    "url": "js/audioHandler.js",
    "revision": "7638a0e7c5f19f82aa0d24775300c8a3"
  },
  {
    "url": "js/chatHandler.js",
    "revision": "3a6749134dff089b1751be593eaa0e32"
  },
  {
    "url": "js/controllers/aftermatchController.js",
    "revision": "546be632cc0f04655b910ff58ad20537"
  },
  {
    "url": "js/controllers/bootAftermatchController.js",
    "revision": "8ad3079f1c41700b7bef0f93df2252b0"
  },
  {
    "url": "js/controllers/bootCampController.js",
    "revision": "5b8a5d284370a6581d49d332547e67ad"
  },
  {
    "url": "js/controllers/bootCampMakingController.js",
    "revision": "ca6d260f4962aec922d876c3d83c6524"
  },
  {
    "url": "js/controllers/cmmakingController.js",
    "revision": "2c0f3d41ce884c0761fcf0143a39469e"
  },
  {
    "url": "js/controllers/emptyController.js",
    "revision": "3d3a66859c997120893e3f0a86e10064"
  },
  {
    "url": "js/controllers/homeController.js",
    "revision": "310fcc32f642289314625a3237fd2327"
  },
  {
    "url": "js/controllers/loginController.js",
    "revision": "0e10bcacfc0fb1d8daf1c9f3171eaccb"
  },
  {
    "url": "js/controllers/matchController.js",
    "revision": "1af3960b491fca58a1f43558c4f1e357"
  },
  {
    "url": "js/controllers/newcmatchController.js",
    "revision": "da7526fdd22bd64677b330c988e84f7e"
  },
  {
    "url": "js/controllers/rankingController.js",
    "revision": "117cc5928d39eb78ac264e478df4d9ef"
  },
  {
    "url": "js/controllers/registerController.js",
    "revision": "f634889ebc427c0773ab6e990be8b504"
  },
  {
    "url": "js/controllers/rmmakingController.js",
    "revision": "1b2485aa31073a511adf9fcfc872994f"
  },
  {
    "url": "js/controllers/splashController.js",
    "revision": "e464f27c2858bde4d0312a2373b311ab"
  },
  {
    "url": "js/gameData.js",
    "revision": "658b19010854dfb5adef6bd7d6902632"
  },
  {
    "url": "js/main.js",
    "revision": "3ddb0a3a06824d3c41568d07715500f6"
  },
  {
    "url": "js/navigationHandler.js",
    "revision": "d63966e449af83a8f22ac0b9adee496f"
  },
  {
    "url": "js/plugins.js",
    "revision": "9baec86da49af9bae5ba6b3b5b6f5eca"
  },
  {
    "url": "js/rabbitCommunicator.js",
    "revision": "72152a9c35997815352ee7c05e7512a8"
  },
  {
    "url": "js/robyAnimator.js",
    "revision": "8395e79f89bf14c80d16ae4f4cf70308"
  },
  {
    "url": "js/scopeService.js",
    "revision": "18e8e96b233ee84a1e9cf283188e5339"
  },
  {
    "url": "js/sessionHandler.js",
    "revision": "5732db23edd7e47ec03bb92541b7c5c6"
  },
  {
    "url": "js/vendor/angular-animate.min.js",
    "revision": "72c2f5ab2972d75161f2e1447dcc2758"
  },
  {
    "url": "js/vendor/angular-cookies.min.js",
    "revision": "bf11427c55c465560b91a34c22cc0498"
  },
  {
    "url": "js/vendor/angular-dragdrop.min.js",
    "revision": "68c7c58943631b2c73eda382ff50a732"
  },
  {
    "url": "js/vendor/angular-route.min.js",
    "revision": "c429fba7f57cd2306843295bc29aa571"
  },
  {
    "url": "js/vendor/angular.min.js",
    "revision": "0f146391dfc57e3e0506c4c0f72d51d1"
  },
  {
    "url": "js/vendor/jquery-ui.min.js",
    "revision": "c15b1008dec3c8967ea657a7bb4baaec"
  },
  {
    "url": "js/vendor/jquery.min.js",
    "revision": "bbcf3bf05fa6cb58a67cfd0498f00d23"
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
  },
  {
    "url": "css/main.css",
    "revision": "1f7c5469881700276d690585f0c4ce2d"
  },
  {
    "url": "css/normalize.css",
    "revision": "112272e51c80ffe5bd01becd2ce7d656"
  },
  {
    "url": "partials/404.html",
    "revision": "58fac728759a09577f5e170130df5948"
  },
  {
    "url": "partials/aftermatch.html",
    "revision": "87826fabacec8409212cea2e64a4473a"
  },
  {
    "url": "partials/bootaftermatch.html",
    "revision": "e902d02d9d0f3544d6d23bb2f5c1c896"
  },
  {
    "url": "partials/bootcamp.html",
    "revision": "47f13fc5ea7ea9ec6415710ce42e9825"
  },
  {
    "url": "partials/bootcampmaking.html",
    "revision": "3fd112485eb99236bbbabea24705d998"
  },
  {
    "url": "partials/cmmaking.html",
    "revision": "3d53007926fba88be03f69639472f6e2"
  },
  {
    "url": "partials/home.html",
    "revision": "541da9c343cd75015ad75bfc3cf10fa7"
  },
  {
    "url": "partials/login.html",
    "revision": "18fadffc19d569b555d03730e70fb4f6"
  },
  {
    "url": "partials/match.html",
    "revision": "d74987e2a9ea12e24d7d05dddd15aa80"
  },
  {
    "url": "partials/newcmatch.html",
    "revision": "3e4831ed93b0d3382569add2bc3ee9da"
  },
  {
    "url": "partials/ranking.html",
    "revision": "f11442dbf2d91ec76d5b704f6fcae98b"
  },
  {
    "url": "partials/register.html",
    "revision": "a7c38a717b64275765e9c30658a77885"
  },
  {
    "url": "partials/rmmaking.html",
    "revision": "1355f17d3a2724c95c4bb783c346a849"
  },
  {
    "url": "partials/rules.html",
    "revision": "1c415a2b31109d976ea9c71770741006"
  },
  {
    "url": "partials/splash.html",
    "revision": "589113a1e429626a77cad7136b7a35c5"
  },
  {
    "url": "index.html",
    "revision": "9f64c39b9ddac302fca611efbe8dfd5f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
