/*
 * MatchData module: factory utilizzato per memorizzare durante l'esecuzione di una serie di partite tutti i  
 * dati relativi alla serie stessa: dati dei due giocatori, punteggio, ecc..
 */
angular.module('codyColor').factory('gameData', function () {

    let gameData = {};

    // dati di riconoscimento e matchmaking
    let playerNickname;
    let enemyNickname;
    let isPlayerReady;
    let isEnemyReady;

    // dati di riconoscimento utilizzati dal server 
    // per la partita corrente
    let gameRoomId;
    let playerId;

    // dati sulla partita
    let playerPoints;
    let enemyPoints;
    let currentMatchTiles;
    let playerStartPosition;
    let enemyStartPosition;
    let playerMatchTimer;
    let enemyMatchTimer;
    let playerMatchTime;
    let enemyMatchTime;

    let matchCount;


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
        if(gameRoomId === undefined)
            gameRoomId = -1;

        return gameRoomId;
    };


    gameData.setPlayerId = function (id) {
        playerId = id;
    };

    gameData.getPlayerId = function () {
        if(playerId === undefined)
            playerId = -1;

        return playerId;
    };

    gameData.setCurrentMatchTiles = function (tilesString) {
        // si ipotizza al momento una matrice 5x5
        currentMatchTiles = new Array(5);
        let positionIndex = 0;

        for (let i = 0; i < 5; i++) {
            currentMatchTiles[i] = new Array(5);
            for (let j = 0; j < 5; j++) {
                currentMatchTiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }
    };

    gameData.getCurrentMatchTiles = function () {
        if(currentMatchTiles === undefined) {
            currentMatchTiles = new Array(5);

            for (let i = 0; i < 5; i++) {
                currentMatchTiles[i] = new Array(5);
                for (let j = 0; j < 5; j++) {
                    currentMatchTiles[i][j] = 'R';
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

    gameData.addPlayerPoints = function (points) {
        playerPoints += points;
    };


    gameData.getEnemyPoints = function () {
        if (enemyPoints === undefined)
            enemyPoints = 0;

        return enemyPoints;
    };

    gameData.addEnemyPoints = function (points) {
        enemyPoints += points;
    };


    gameData.getPlayerStartPosition = function () {
        if (playerStartPosition === undefined) {
            playerStartPosition = { side: -1, distance: -1 };
        }

        return playerStartPosition;
    };

    gameData.setPlayerStartPosition = function (position) {
        playerStartPosition = position;
    };


    gameData.getEnemyStartPosition = function () {
        if (enemyStartPosition === undefined) {
            enemyStartPosition = { side: -1, distance: -1 };
        }

        return enemyStartPosition;
    };

    gameData.setEnemyStartPosition = function (position) {
        enemyStartPosition = position;
    };


    gameData.getPlayerMatchTimer = function () {
        return playerMatchTimer;
    };

    gameData.setPlayerMatchTimer = function (timer) {
        playerMatchTimer = timer;
    };

    gameData.getEnemyMatchTimer = function () {
        return enemyMatchTimer;
    };

    gameData.setEnemyMatchTimer = function (timer) {
        enemyMatchTimer = timer;
    };


    gameData.getPlayerMatchTime = function () {
        if (playerMatchTime === undefined) {
            playerMatchTime = 30000;
        }

        return playerMatchTime;
    };

    gameData.setPlayerMatchTime = function (time) {
        playerMatchTime = time;
    };

    gameData.getEnemyMatchTime = function () {
        if (enemyMatchTime === undefined) {
            enemyMatchTime = 30000;
        }

        return enemyMatchTime;
    };

    gameData.setEnemyMatchTime = function (time) {
        enemyMatchTime = time;
    };


    gameData.getMatchCount = function () {
        if(matchCount === undefined) {
            matchCount = 1;
        }
        return matchCount;
    };

    gameData.addMatch = function() {
        if(matchCount === undefined) {
            matchCount = 2;
        } else {
            matchCount++;
        }
    };

    return gameData;
});
