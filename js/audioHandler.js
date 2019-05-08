/*
 * AudioHandler: factory ausiliario responsabile della gestione dell'audio, dalla base
 * musicale ai vari suoni
 */
angular.module('codyColor').factory("audioHandler", function($cookies) {
    let audioHandler = {};

    let musicBase = new Audio();
    musicBase.src = 'audio/music.wav';
    musicBase.loop = true;

    audioHandler.isAudioEnabled = function() {
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

    audioHandler.playSound = function(soundName) {
        if (audioHandler.isAudioEnabled()) {
            let sound = new Audio();
            sound.src = 'audio/' + soundName + '.wav';
            sound.play();
        }
    };

    return audioHandler;
});