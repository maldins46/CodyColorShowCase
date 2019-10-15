/*
 * AudioHandler: factory ausiliario responsabile della gestione dell'audio, dalla base
 * musicale ai vari suoni
 */
angular.module('codyColor').factory("audioHandler", ['$cookies', function($cookies) {
    let audioHandler = {};

    let musicBase = new Audio();
    musicBase.src = 'audio/music.mp3';
    musicBase.loop = true;

    let isAudioEnabled = false;;

    audioHandler.isAudioEnabled = function() {
        return false;
    };

    audioHandler.toggleBase = function () {
        if (!audioHandler.isAudioEnabled()) {
            isAudioEnabled = true;
            $cookies.put('audioEnabled', 'true');
            musicBase.play();
        } else {
            isAudioEnabled = false;
            $cookies.put('audioEnabled', 'false');
            musicBase.pause();
        }
    };

    audioHandler.playSound = function(soundName) {
        if (audioHandler.isAudioEnabled()) {
            let sound = new Audio();
            sound.src = 'audio/' + soundName + '.mp3';
            sound.play();
        }
    };

    return audioHandler;
}]);