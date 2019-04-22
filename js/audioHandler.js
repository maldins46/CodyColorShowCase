/*
 * NavigationHandler: permette la navigazione tra le pagine, ed applica un blocco al tasto back
 */
angular.module('codyColor').factory("audioHandler", function($cookies) {
    let audioHandler = {};
    let musicBase = new Audio();
    musicBase.src = '/audio/music.wav';
    musicBase.loop = true;

    audioHandler.getBaseState = function() {
        let cookiesBaseValue = $cookies.get('baseState');
        return !(cookiesBaseValue === undefined || cookiesBaseValue === 'pause');
    };

    audioHandler.toggleBase = function () {
        let cookiesBaseValue = $cookies.get('baseState');
        if (cookiesBaseValue === undefined || cookiesBaseValue === 'pause') {
            musicBase.play();
            $cookies.put('baseState', 'play');
        } else {
            musicBase.pause();
            $cookies.put('baseState', 'pause');
        }
    };

    audioHandler.splashStartBase = function () {
        let cookiesBaseValue = $cookies.get('baseState');
        if (cookiesBaseValue === undefined || cookiesBaseValue === 'play') {
            musicBase.play();
            $cookies.put('baseState', 'play');
        }
    };

    return audioHandler;
});