/*
 * Main AngularJS Web Application: crea il modulo applicazione
 */
angular.module('codyColor', ['ngRoute', 'ngAnimate', 'ngDragDrop',
    'ngCookies', 'pascalprecht.translate', 'ngSanitize']);

// global module configuration
angular.module('codyColor').config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json'
    });

    $translateProvider.registerAvailableLanguageKeys(['en', 'it'], {
        'it*': 'it',
        '*': 'en'
    });

    /*
    // l'autorilevazione del linguaggio utente restituisce sempre l'inglese; utilizzato l'italiano come
    // lingua di default
    $translateProvider.determinePreferredLanguage();
    */
    $translateProvider.preferredLanguage('it');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useCookieStorage();
});