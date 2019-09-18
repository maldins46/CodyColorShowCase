/*
 * File di configurazione del service worker. Permette di effettuare la build di quest'ultimo tramite il comando
 * 'workbox injectManifest workbox-config.js'. Permette in particolare di impostare i path dei file da
 * pre-cachare, così da permettere l'utilizzo del gioco anche offline.
 */
module.exports = {
    "globDirectory": ".",
    "globPatterns": [
        "audio/*.mp3",              /* Audio */
        "img/*.png",                /* Images */
        "icons/*.png",              /* Icons */
        "favicon.ico",              /* Icons */
        "fonts/*.*",                /* Fonts */
        "locales/*.*",              /* locales */
        "css/*.*",                  /* css */
        "pages/*.html",             /* Pages */
        "index.html",               /* Website Index */
        "browserconfig.xml",        /* Auxiliary...*/
        "humans.txt",
        "manifest.json",
        "robots.txt",
        "site.webmanifest",
        "js/**/*.js",               /* javascript */
        "bower_components/jquery/dist/jquery.min.js",  /* bower minified libraries... */
        "bower_components/jquery-ui/jquery-ui.min.js",
        "bower_components/angular/angular.min.js",
        "bower_components/angular-dragdrop/src/angular-dragdrop.min.js",
        "bower_components/angular-route/angular-route.min.js",
        "bower_components/angular-animate/angular-animate.min.js",
        "bower_components/angular-cookies/angular-cookies.min.js",
        "bower_components/angular-translate/angular-translate.min.js",
        "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
        "bower_components/angular-sanitize/angular-sanitize.min.js",
        "bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
        "bower_components/firebase/firebase-app.js",
        "bower_components/firebase/firebase-auth.js",
        "bower_components/firebaseui/dist/firebaseui.js",
        "bower_components/components-font-awesome/css/all.min.css",
        "bower_components/components-font-awesome/webfonts/*.*"

    ],
    "swSrc": "src-service-worker.js",
    // "maximumFileSizeToCacheInBytes": 12 * 1024 * 1024, // 12mb
    "swDest": "service-worker.js"
};
