/*
 * GameData: memorizza e condivide tra i vari controller informazioni sulla partita corrente
 */
angular.module('codyColor').factory('gameData', function () {

    let gameData = {};

    // dati serie corrente
    let playerNickname;
    let enemyNickname;
    let gameRoomId;
    let playerId;
    let playerPoints;
    let enemyPoints;
    let matchCount;

    // dati partita corrente
    let isPlayerReady;
    let isEnemyReady;
    let matchTiles;
    let matchPlayerStartPosition;
    let matchEnemyStartPosition;
    let matchPlayerTime;
    let matchEnemyTime;
    let matchResult;
    let playerWantSkip;
    let enemyWantSkip;


    // --- getter-setter dati serie corrente --- //

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


    // --- getter-setter dati match corrente --- //

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




    gameData.setCurrentMatchTiles = function (tilesString) {
        // si ipotizza al momento una matrice 5x5
        matchTiles = new Array(5);
        let positionIndex = 0;

        for (let i = 0; i < 5; i++) {
            matchTiles[i] = new Array(5);
            for (let j = 0; j < 5; j++) {
                matchTiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }
    };

    gameData.getCurrentMatchTiles = function () {
        if(matchTiles === undefined) {
            matchTiles = new Array(5);

            for (let i = 0; i < 5; i++) {
                matchTiles[i] = new Array(5);
                for (let j = 0; j < 5; j++) {
                    matchTiles[i][j] = 'R';
                }
            }
        }

        return matchTiles;
    };



    gameData.getPlayerStartPosition = function () {
        if (matchPlayerStartPosition === undefined) {
            matchPlayerStartPosition = { side: -1, distance: -1 };
        }

        return matchPlayerStartPosition;
    };

    gameData.setPlayerStartPosition = function (position) {
        matchPlayerStartPosition = position;
    };


    gameData.getEnemyStartPosition = function () {
        if (matchEnemyStartPosition === undefined) {
            matchEnemyStartPosition = { side: -1, distance: -1 };
        }

        return matchEnemyStartPosition;
    };


    gameData.setEnemyStartPosition = function (position) {
        matchEnemyStartPosition = position;
    };


    gameData.formatStartPosition = function(position) {
      return position.side.toString() + ' ' + position.distance.toString();
    };


    gameData.getPlayerMatchTime = function () {
        if (matchPlayerTime === undefined) {
            matchPlayerTime = 30000;
        }

        return matchPlayerTime;
    };


    gameData.setPlayerMatchTime = function (time) {
        matchPlayerTime = time;
    };


    gameData.getEnemyMatchTime = function () {
        if (matchEnemyTime === undefined) {
            matchEnemyTime = 30000;
        }

        return matchEnemyTime;
    };


    gameData.setEnemyMatchTime = function (time) {
        matchEnemyTime = time;
    };


    gameData.setPlayerWantSkip = function(skip) {
        return playerWantSkip = skip;
    };


    gameData.getPlayerWantSkip = function () {
        if (playerWantSkip === undefined) {
            playerWantSkip = false;
        }

        return playerWantSkip;
    };

    gameData.setEnemyWantSkip = function(skip) {
        return enemyWantSkip = skip;
    };


    gameData.getEnemyWantSkip = function () {
        if (enemyWantSkip === undefined) {
            enemyWantSkip = false;
        }

        return enemyWantSkip;
    };


    gameData.setCurrentMatchResult = function (result) {
        matchResult = result;
    };


    gameData.getCurrentMatchResult = function () {
        if (matchResult === undefined)
            matchResult = { playerResult: { points: 0, length: 0, loop: false, time: 0 },
                            enemyResult: { points: 0, length: 0, loop: false, time: 0 }};

        return matchResult;
    };


    // --- data clear methods ---

    gameData.clearMatchData = function() {
        isPlayerReady = undefined;
        isEnemyReady  = undefined;
        matchTiles = undefined;
        matchPlayerStartPosition = undefined;
        matchEnemyStartPosition = undefined;
        matchPlayerTime = undefined;
        matchEnemyTime = undefined;
        matchResult = undefined;
        playerWantSkip = undefined;
        enemyWantSkip = undefined;
    };

    gameData.clearGameData = function() {
        gameData.clearMatchData();
        playerNickname = undefined;
        enemyNickname = undefined;
        gameRoomId = undefined;
        playerId = undefined;
        playerPoints = undefined;
        enemyPoints = undefined;
        matchCount = undefined;
    };


    // --- helper methods ---

    // funzione che restituisce una stringa leggibile dato il valore di un timer
    gameData.formatTimerText = function(timerValue) {
        let secondsInt = Math.floor(timerValue / 1000);
        let decimalsInt = Math.floor((timerValue - (secondsInt * 1000)) / 10).toString();
        let decimals = decimalsInt.toString();
        let seconds = secondsInt.toString();

        if (decimals.length === 1)
            decimals = '0' + decimals;

        return seconds + ':' + decimals;
    };


    // restituisce il vincitore della partita corrente in base ai dati memorizzati
    gameData.getMatchWinner = function () {
        if (matchResult.playerResult.points > matchResult.enemyResult.points) {
            return playerNickname;
        } else if (matchResult.playerResult.points < matchResult.enemyResult.points) {
            return enemyNickname;
        } else if (matchPlayerTime > matchEnemyTime) {
            return playerNickname;
        } else if (matchPlayerTime < matchEnemyTime) {
            return enemyNickname;
        } else {
            return "lo sport";
        }
    };

    return gameData;
});
