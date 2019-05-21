module.exports = {
  "globDirectory": "src/",
  "globPatterns": [
      "audio/*.wav",
      "img/*.png",
      "js/**/*.js",
      "css/*.css",
      "partials/*.html",
      "index.html"
  ],
  "maximumFileSizeToCacheInBytes": 20 * 1024 * 1024, // 20mb
  "swDest": "src/service-worker.js"
};