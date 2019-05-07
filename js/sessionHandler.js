/*
 * SessionHandler: sfrutta una variabile per stabilire se la sessione corrente
 * è valida; eventualmente rimanda alla splash page. Memorizza inoltre alcuni dati di sessione
 */
angular.module('codyColor').factory("sessionHandler", function() {
    let sessionHandler = {};
    let isSessionValid;

    let totalMatches;
    let connectedPlayers;
    let randomWaitingPlayers;

    sessionHandler.validateSession = function() {
        isSessionValid = true;
    };

    sessionHandler.isSessionInvalid = function () {
        return isSessionValid === undefined || isSessionValid === false;
    };

    sessionHandler.setTotalMatches = function (matches) {
        totalMatches = matches;
    };

    sessionHandler.getTotalMatches = function () {
        if (totalMatches === undefined)
            totalMatches = 0;

        return totalMatches;
    };


    sessionHandler.setConnectedPlayers = function (players) {
        connectedPlayers = players;
    };

    sessionHandler.getConnectedPlayers = function () {
        if (connectedPlayers === undefined)
            connectedPlayers = 0;

        return connectedPlayers;
    };

    sessionHandler.setRandomWaitingPlayers = function (players) {
        randomWaitingPlayers = players;
    };

    sessionHandler.getRandomWaitingPlayers = function () {
        if (randomWaitingPlayers === undefined)
            randomWaitingPlayers = 0;

        return randomWaitingPlayers;
    };

    return sessionHandler;
});