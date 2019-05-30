/*
 * GameData: memorizza e condivide tra i vari controller informazioni sulla partita corrente
 */
angular.module('codyColor').factory('gameData', function () {

    let gameData = {};

    const gameTypes = { random: 'random', custom: 'custom', aga: 'aga' };

    let seriesData = {};
    let matchData = {};


    gameData.getGameTypes = function() {
        return gameTypes;
    };


    // --- getter-setter dati serie corrente --- //

    gameData.setPlayerNickname = function (name) {
        seriesData.playerNickname = name;
    };


    gameData.getPlayerNickname = function () {
        if (seriesData.playerNickname === undefined)
            seriesData.playerNickname = "Anonimo";

        return seriesData.playerNickname;
    };


    gameData.setEnemyNickname = function (name) {
        seriesData.enemyNickname = name;
    };


    gameData.getEnemyNickname = function () {
        if (seriesData.enemyNickname === undefined)
            seriesData.enemyNickname = "Anonimo";

        return seriesData.enemyNickname;
    };

    gameData.setGameRoomId = function (id) {
        seriesData.gameRoomId = id;
    };


    gameData.getGameRoomId = function () {
        if(seriesData.gameRoomId === undefined)
            seriesData.gameRoomId = -1;

        return seriesData.gameRoomId;
    };


    gameData.setPlayerId = function (id) {
        seriesData.playerId = id;
    };


    gameData.getPlayerId = function () {
        if(seriesData.playerId === undefined)
            seriesData.playerId = -1;

        return seriesData.playerId;
    };


    gameData.getPlayerPoints = function () {
        if (seriesData.playerPoints === undefined)
            seriesData.playerPoints = 0;

        return seriesData.playerPoints;
    };


    gameData.addPlayerPoints = function (points) {
        seriesData.playerPoints += points;
    };


    gameData.getEnemyPoints = function () {
        if (seriesData.enemyPoints === undefined)
            seriesData.enemyPoints = 0;

        return seriesData.enemyPoints;
    };


    gameData.addEnemyPoints = function (points) {
        seriesData.enemyPoints += points;
    };



    gameData.getMatchCount = function () {
        if(seriesData.matchCount === undefined) {
            seriesData.matchCount = 1;
        }
        return seriesData.matchCount;
    };

    gameData.addMatch = function() {
        if(seriesData.matchCount === undefined) {
            seriesData.matchCount = 2;
        } else {
            seriesData.matchCount++;
        }
    };

    gameData.setTimerSetting = function(timer) {
        seriesData.timerSetting = timer;
    };

    gameData.getTimerSetting = function() {
        if (seriesData.timerSetting === undefined)
            seriesData.timerSetting = 30000;

        return seriesData.timerSetting;
    };

    gameData.setBootEnemySetting = function(setting) {
        seriesData.bootEnemySetting = setting;
    };

    gameData.getBootEnemySetting = function() {
        if (seriesData.bootEnemySetting === undefined)
            seriesData.bootEnemySetting = -1;

        return seriesData.bootEnemySetting;
    };

    gameData.setGameCode = function(code) {
        seriesData.gameCode = code;
    };

    gameData.getGameCode = function() {
        if (seriesData.gameCode === undefined)
            seriesData.gameCode = '0000';

        return seriesData.gameCode;
    };

    gameData.setGameType = function(type) {
        seriesData.gameType = type;
    };

    gameData.getGameType = function() {
        if (seriesData.gameType === undefined)
            seriesData.gameType = gameTypes.random;

        return seriesData.gameType;
    };


    // --- getter-setter dati match corrente --- //

    gameData.isPlayerReady = function () {
        if (matchData.isPlayerReady === undefined)
            matchData.isPlayerReady = false;

        return matchData.isPlayerReady;
    };

    gameData.setPlayerReady = function (state) {
        matchData.isPlayerReady = state;
    };


    gameData.isEnemyReady = function () {
        if (matchData.isEnemyReady === undefined)
            matchData.isEnemyReady = false;

        return matchData.isEnemyReady;
    };

    gameData.setEnemyReady = function (state) {
        matchData.isEnemyReady = state;
    };

    gameData.generateNewMatchTiles = function() {
        let bootTiles = '';
        for (let i = 0; i < 25; i++) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    bootTiles += 'R';
                    break;
                case 1:
                    bootTiles += 'Y';
                    break;
                case 2:
                    bootTiles += 'G';
                    break;
            }
        }
        gameData.setCurrentMatchTiles(bootTiles);
    };

    gameData.setCurrentMatchTiles = function (tilesString) {
        // si ipotizza al momento una matrice 5x5
        matchData.tiles = new Array(5);
        let positionIndex = 0;

        for (let i = 0; i < 5; i++) {
            matchData.tiles[i] = new Array(5);
            for (let j = 0; j < 5; j++) {
                matchData.tiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }
    };

    gameData.getCurrentMatchTiles = function () {
        if (matchData.tiles === undefined) {
            matchData.tiles = new Array(5);

            for (let i = 0; i < 5; i++) {
                matchData.tiles[i] = new Array(5);
                for (let j = 0; j < 5; j++) {
                    matchData.tiles[i][j] = 'G';
                }
            }
        }

        return matchData.tiles;
    };

    gameData.getPlayerStartPosition = function () {
        if (matchData.playerStartPosition === undefined)
            matchData.playerStartPosition = { side: -1, distance: -1 };

        return  matchData.playerStartPosition;
    };

    gameData.setPlayerStartPosition = function (position) {
        matchData.playerStartPosition = position;
    };


    gameData.getEnemyStartPosition = function () {
        if (matchData.enemyStartPosition === undefined)
            matchData.enemyStartPosition = { side: -1, distance: -1 };

        return matchData.enemyStartPosition;
    };


    gameData.setEnemyStartPosition = function (position) {
        matchData.enemyStartPosition = position;
    };


    gameData.setPlayerMatchTime = function (time) {
        matchData.playerTime = time;
    };

    gameData.getPlayerMatchTime = function () {
        if (matchData.playerTime === undefined)
            matchData.playerTime = 0;

        return matchData.playerTime;
    };


    gameData.setEnemyMatchTime = function (time) {
        matchData.enemyTime = time;
    };

    gameData.getEnemyMatchTime = function () {
        if (matchData.enemyTime === undefined)
            matchData.enemyTime = 0;

        return matchData.enemyTime;
    };


    gameData.setPlayerWantSkip = function(skip) {
        matchData.playerWantSkip = skip;
    };


    gameData.getPlayerWantSkip = function () {
        if (matchData.playerWantSkip === undefined)
            matchData.playerWantSkip = false;

        return matchData.playerWantSkip;
    };

    gameData.setEnemyWantSkip = function(skip) {
        matchData.enemyWantSkip = skip;
    };


    gameData.getEnemyWantSkip = function () {
        if (matchData.enemyWantSkip === undefined)
            matchData.enemyWantSkip = false;

        return matchData.enemyWantSkip;
    };


    gameData.setCurrentMatchResult = function (result) {
        matchData.result = result;
    };


    gameData.getCurrentMatchResult = function () {
        if (matchData.result === undefined)
            matchData.result = {
                playerResult: { points: 0, length: 0, loop: false, time: 0 },
                enemyResult: { points: 0, length: 0, loop: false, time: 0 }
            };

        return matchData.result;
    };


    // --- data clear methods ---

    gameData.clearMatchData = function() {
        matchData = {};
    };


    gameData.clearGameData = function() {
        seriesData = {};
        matchData = {};
    };


    // --- helper methods ---

    // funzione che restituisce una stringa leggibile dato il valore di un timer
    gameData.formatTimerTextDecPrecision = function(timerValue) {
        let decimals = Math.floor((timerValue / 10) % 100).toString();
        let seconds = Math.floor((timerValue / 1000) % 60).toString();
        let minutes = Math.floor((timerValue / (1000 * 60)) % 60).toString();

        decimals = (decimals.length < 2) ? "0" + decimals : decimals;

        if (minutes !== '0') {
            return minutes + ':' + seconds + ':' + decimals;
        } else {
            return seconds + ':' + decimals;
        }
    };

    // funzione che restituisce una stringa leggibile dato il valore di un timer, omettendo le cifre decimali
    gameData.formatTimerTextSecPrecision = function(timerValue) {
        let seconds = Math.floor((timerValue / 1000) % 60).toString();
        let minutes = Math.floor((timerValue / (1000 * 60)) % 60).toString();

        seconds = (seconds.length < 2) ? "0" + seconds : seconds;
        return minutes + ':' + seconds;
    };

    // funzione che restituisce una stringa leggibile dato il valore di un timer
    gameData.formatTimeEnemyFoundText = function(timerValue) {
        switch(timerValue) {
            case 15000:
                return '15 secondi';
            case 30000:
                return '30 secondi';
            case 60000:
                return '1 minuto';
            case 120000:
                return '2 minuti';
        }
    };


    gameData.formatStartPosition = function(position) {
        return position.side.toString() + ' ' + position.distance.toString();
    };


    gameData.formatChatDate = function(millis) {
        let date = new Date(millis);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return hours + ':' + minutes;
    };


    // restituisce il vincitore della partita corrente in base ai dati memorizzati
    gameData.getMatchWinner = function () {
        if (matchData.result.playerResult.points > matchData.result.enemyResult.points) {
            return seriesData.playerNickname;
        } else if (matchData.result.playerResult.points < matchData.result.enemyResult.points) {
            return seriesData.enemyNickname;
        } else if (matchData.playerTime > matchData.enemyTime) {
            return seriesData.playerNickname;
        } else if (matchData.playerTime < matchData.enemyTime) {
            return seriesData.enemyNickname;
        } else {
            return "lo sport";
        }
    };

    return gameData;
});
