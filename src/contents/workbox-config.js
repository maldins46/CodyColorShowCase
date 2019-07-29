module.exports = {
    "globDirectory": ".",
    /*"globIgnores": ['bower_components/**'],*/
    "globPatterns": [
        "audio/*.mp3",                 /* Audio */
        "img/*.png",              /* Images */
        "icons/*.png",              /* Icons */
        "favicon.ico",              /* Icons */
        "css/*.*",                    /* css */
        "**/*.html",                   /* html */
        "**/*.{json,webmanifest,xml}", /* auxiliary */
        "js/**/*.js",                   /* javascript */
        /* minified libraries */
        "bower_components/jquery/dist/jquery.min.js",
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
    "maximumFileSizeToCacheInBytes": 12 * 1024 * 1024, // 12mb
    "swDest": "service-worker.js"
};
