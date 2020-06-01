/*
 * SessionHandler: sfrutta una variabile per stabilire se la sessione corrente
 * è valida; eventualmente rimanda alla splash page. Memorizza inoltre alcuni dati di sessione
 */
angular.module('codyColor').factory("sessionHandler", function() {
    let sessionHandler = {};
    let isSessionValid;

    const wallVersion = '3.3.1';

    // informazioni sul sistema, aggiornate automaticamente dal server non appena connessi
    let generalInfo = {
        totalMatches: 0,
        connectedEnemies: 0,
        randomWaitingPlayers: 0,
        requiredClientVersion: undefined,
        requiredWallVersion: undefined
    };

    // numero univoco associato a questa sessione
    const sessionId = (Math.floor(Math.random() * 100000)).toString();

    // oggetto che permette di
    const noSleep = new NoSleep();

    sessionHandler.enableNoSleep = function () {
        noSleep.enable();
    };

    sessionHandler.validateSession = function() {
        isSessionValid = true;
    };

    sessionHandler.isSessionInvalid = function () {
        return isSessionValid === undefined || isSessionValid === false;
    };


    sessionHandler.setGeneralInfo = function (newInfo) {
        generalInfo = newInfo;
    };


    sessionHandler.getTotalMatches = function () {
        return generalInfo.totalMatches;
    };


    sessionHandler.getConnectedPlayers = function () {
        return generalInfo.connectedPlayers;
    };


    sessionHandler.getRandomWaitingPlayers = function () {
        return generalInfo.randomWaitingPlayers;
    };


    sessionHandler.getRequiredWallVersion = function () {
        return generalInfo.requiredWallVersion;
    };


    sessionHandler.isWallVersionValid = function () {
        if (generalInfo.requiredWallVersion === undefined)
            return true;
        else
            return wallVersion === generalInfo.requiredWallVersion;
    };


    sessionHandler.getWallVersion = function () {
        return wallVersion;
    };


    sessionHandler.getSessionId = function () {
        return sessionId;
    };


    return sessionHandler;
});