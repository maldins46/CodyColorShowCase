/*
 * AudioHandler: factory ausiliario responsabile della gestione dell'audio, dalla base
 * musicale ai vari suoni
 */
angular.module('codyColor').factory("audioHandler", [function() {
    let audioHandler = {};

    let musicBase = new Audio();
    musicBase.src = 'audio/music.mp3';
    musicBase.loop = true;

    let isAudioEnabled = false;

    audioHandler.initializeAudio = function(enabled) {
        if (enabled) {
            isAudioEnabled = true;
            musicBase.play();
        }
    };

    audioHandler.playSound = function(soundName) {
        if (isAudioEnabled) {
            let sound = new Audio();
            sound.src = 'audio/' + soundName + '.mp3';
            sound.play();
        }
    };

    return audioHandler;
}]);