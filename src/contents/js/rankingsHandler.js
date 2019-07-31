/*
 * RankingsHandler: gestisce la memorizzazione dei dati sulle classifiche,
 * limitando il rate delle richieste di download
 */
angular.module('codyColor').factory("rankingsHandler", function() {
    let rankingsHandler = {};

    let rankingsData = {};
    let lastUpdate = undefined;

    rankingsHandler.updateNeeded = function() {
        return (lastUpdate === undefined || timeToUpdate());
    };

    rankingsHandler.updateRankings = function (newRankings) {
        if (lastUpdate === undefined || timeToUpdate()) {
            rankingsData = newRankings;
            lastUpdate = new Date();
        }
    };

    rankingsHandler.getRankings = function() {
        return rankingsData;
    };

    // return true se è passato più di 1 minuto dall'ultimo update dei rankings
    let timeToUpdate = function() {
        return (lastUpdate.getTime() + 60000) <= (new Date()).getTime();
    };

    return rankingsHandler;
});