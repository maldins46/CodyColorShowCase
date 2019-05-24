module.exports = {
    "globDirectory": ".",
    "globIgnores": ['bower_components/**'],
    "globPatterns": [
        "audio/*.wav",                 /* Audio */
        "**/*.{png,ico}",              /* Images */
        "css/*.css",                    /* css */
        "**/*.html",                   /* html */
        "**/*.{json,webmanifest,xml}", /* auxiliary */
        "js/**/*.js"                   /* javascript */
    ],
    "swSrc": "src-service-worker.js",
    "maximumFileSizeToCacheInBytes": 12 * 1024 * 1024, // 12mb
    "swDest": "service-worker.js"
};
