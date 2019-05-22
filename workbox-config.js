module.exports = {
    "globDirectory": ".",
    "globPatterns": [
        "audio/*.wav",                 /* Audio */
        "**/*.{png,ico}",              /* Images */
        "**/*.css",                    /* css */
        "**/*.html",                   /* html */
        "**/*.{json,webmanifest,xml}", /* auxiliary */
        "js/**/*.js"                   /* javascript */
    ],
    "swSrc": "src-service-worker.js",
    "maximumFileSizeToCacheInBytes": 12 * 1024 * 1024, // 12mb
    "swDest": "service-worker.js"
};
