/*
 * MatchData module: factory utilizzato per memorizzare durante l'esecuzione di una serie di partite tutti i  
 * dati relativi alla serie stessa: dati dei due giocatori, punteggio, ecc..
 */
angular.module('codyColor').factory('gameData', function () {

    var gameData = {};

    // dati di riconoscimento e matchmaking
    var playerNickname;
    var enemyNickname;
    var isPlayerReady;
    var isEnemyReady;

    // dati di riconoscimento utilizzati dal server 
    // per la partita corrente
    var gameRoomId;
    var playerId;

    // dati sulla partita
    var playerPoints;
    var enemyPoints;
    var currentMatchTiles;
    var currentMatchTimerPlayer;
    var currentMatchTimerEnemy;

    var matchCount;


    gameData.setPlayerNickname = function (name) {
        playerNickname = name;
    };


    gameData.getPlayerNickname = function () {
        if (playerNickname === undefined)
            playerNickname = "Anonimo";

        return playerNickname;
    };


    gameData.setEnemyNickname = function (name) {
        enemyNickname = name;
    };

    gameData.getEnemyNickname = function () {
        if (enemyNickname === undefined)
            enemyNickname = "Anonimo";

        return enemyNickname;
    };


    gameData.isPlayerReady = function () {
        if (isPlayerReady === undefined)
            isPlayerReady = false;

        return isPlayerReady;
    };

    gameData.setPlayerReady = function (state) {
        isPlayerReady = state;
    };


    gameData.isEnemyReady = function () {
        if (isEnemyReady === undefined)
            isEnemyReady = false;

        return isEnemyReady;
    };

    gameData.setEnemyReady = function (state) {
        isEnemyReady = state;
    };


    gameData.setGameRoomId = function (id) {
        gameRoomId = id;
    };

    gameData.getGameRoomId = function () {
        return gameRoomId;
    };


    gameData.setPlayerId = function (id) {
        playerId = id;
    };

    gameData.getPlayerId = function () {
        return playerId;
    };

    gameData.setCurrentMatchTiles = function (tilesString) {
        // si ipotizza al momento una matrice 5x5
        currentMatchTiles = new Array(5);
        var positionIndex = 0;

        for (var i = 0; i < 5; i++) {
            currentMatchTiles[i] = new Array(5);
            for (var j = 0; j < 5; j++) {
                currentMatchTiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }
    };

    gameData.getCurrentMatchTiles = function () {
        if(currentMatchTiles === undefined) {
            currentMatchTiles = new Array(5);
            var positionIndex = 0;

            for (var i = 0; i < 5; i++) {
                currentMatchTiles[i] = new Array(5);
                for (var j = 0; j < 5; j++) {
                    currentMatchTiles[i][j] = 'R';
                    positionIndex++;
                }
            }
        }

        return currentMatchTiles;
    };


    gameData.getPlayerPoints = function () {
        if (playerPoints === undefined)
            playerPoints = 0;

        return playerPoints;
    };

    gameData.setPlayerPoints = function (points) {
        playerPoints = points;
    };


    gameData.getEnemyPoints = function () {
        if (enemyPoints === undefined)
            enemyPoints = 0;

        return enemyPoints;
    };

    gameData.setEnemyPoints = function (points) {
        enemyPoints = points;
    };

    return gameData;
});
