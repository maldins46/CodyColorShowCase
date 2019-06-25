/*
 * GameData: factory utilizzato come struttura per memorizzare variabili della partita corrente,
 * oltre a restituire funzioni utili alla formattazione di tali dati
 */
angular.module('codyColor').factory('gameData', function () {

    let gameData = {};

    let data = {};

    const gameTypes = {
        bootmp: 'bootmp',
        random: 'random',
        custom: 'custom',
        royale: 'royale'
    };


    let generateEmptyPlayerMatch = function() {
        return {
            time: 0,
            skip: false,
            points: 0,
            pathLength: 0,
            startPosition: {
                side: -1,
                distance: -1
            },
            endPosition: {
                side: -1,
                distance: -1
            },
            timer: undefined,
            timerValue: 0,
            positioned: false,
        };
    };


    let generateEmptyPlayer = function() {
        return {
            nickname: "Anonymous",
            points: 0,
            playerId: -1,
            ready: false,
            organizer: false,
            ranking: undefined,
            userPlayer: false,
            match: generateEmptyPlayerMatch()
        }
    };


    let generateEmptyGeneral = function() {
        return {
            gameName: undefined,
            startDate: undefined,
            gameRoomId: -1,
            matchCount: 1,
            timerSetting: 30000,
            bootEnemySetting: -1,
            maxPlayersSetting: 20,
            code: '0000',
            tiles: undefined,
            gameType: undefined
        }
    };


    let generateEmptyGameData = function() {
        return {
            general: generateEmptyGeneral(),
            players: [generateEmptyPlayer()]
        }
    };

    /* -------------------------------------------------------------------- *
     * Initializators: metodi per 'pulire' la struttura dati, nel momento
     * in cui vada resettata
     * -------------------------------------------------------------------- */

    // pone i dati di gioco al loro valore di default
    gameData.initializeMatchData = function () {
        if(data.general !== undefined && data.players !== undefined) {
            data.general.tiles = undefined;

            for (let i = 0; i < data.players.length; i++) {
                if (data.players[i].match.timer !== undefined)
                    clearInterval(data.players[i].match.timer);

                data.players[i].match = generateEmptyPlayerMatch();
            }
        }
    };

    gameData.initializeGameData = function () {
        gameData.initializeMatchData();
        data = generateEmptyGameData();
        data.players[0].userPlayer = true;
    };

    gameData.initializeGameData();

    /* -------------------------------------------------------------------- *
     * Getter-setter:funzioni ausiliarie per accedere ai dati
     * -------------------------------------------------------------------- */

    gameData.addEnemy = function (playerId) {
        data.players.push(generateEmptyPlayer());
        data.players[data.players.length - 1].playerId = playerId;
    };


    gameData.removeEnemy = function(playerId) {
        let index = getPlayerIndexById(playerId);
        if(index !== undefined && !data.players[index].userPlayer) {
            if (data.players[index].match.timer !== undefined)
                clearInterval(data.players[index].match.timer);
            data.players.splice(getPlayerIndexById(playerId), 1);
        }
    };


    gameData.editEnemy1vs1 = function(modifiedProperties) {
        let enemyIndex = getEnemy1vs1Index();
        if (enemyIndex !== undefined && data.players[enemyIndex] !== undefined)
            $.extend(true, data.players[enemyIndex], modifiedProperties);
    };


    gameData.editPlayer = function(modifiedProperties, playerId) {
        if (playerId !== undefined) {
            $.extend(true, data.players[getPlayerIndexById(playerId)], modifiedProperties);
        } else {
            $.extend(true, data.players[getUserPlayerIndex()], modifiedProperties);
        }
    };


    gameData.editGeneral = function(modifiedProperties) {
        $.extend(true, data.general, modifiedProperties);
    };


    gameData.getEnemies = function () {
        let enemies = JSON.parse(JSON.stringify(data.players));
        enemies.splice(getUserPlayerIndex(), 1);
        return enemies;
    };


    gameData.getPlayerById = function(playerId) {
        return data.players[getPlayerIndexById(playerId)];
    };


    gameData.getUserPlayer = function () {
        return data.players[getUserPlayerIndex()];
    };

    gameData.getEnemy1vs1 = function () {
        return data.players[getEnemy1vs1Index()];
    };


    gameData.getAllPlayers = function () {
        return data.players;
    };

    gameData.duplicateAllPlayers = function () {
        return JSON.parse(JSON.stringify(data.players));
    };


    gameData.getGeneral = function () {
        return data.general;
    };


    /* -------------------------------------------------------------------- *
     * Helpers: metodi ausiliari alla formattazione dei dati e alla verifica
     * di determinate proprieta'
     * -------------------------------------------------------------------- */

    let getPlayerIndexById = function(playerId) {
        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].playerId === playerId) {
                return i;
            }
        }
    };

    let getEnemy1vs1Index = function() {
        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].userPlayer !== true) {
                return i;
            }
        }
    };

    let getUserPlayerIndex = function() {
        for (let i = 0; i < data.players.length; i++)
            if (data.players[i].userPlayer === true)
                return i;
    };


    gameData.getGameTypes = function() {
        return gameTypes;
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
        return gameData.formatMatchTiles(bootTiles);
    };


    // converte la stringa 'GRY' in una matrice 5x5
    gameData.formatMatchTiles = function (tilesString) {
        let tiles = new Array(5);
        let positionIndex = 0;

        for (let i = 0; i < 5; i++) {
            tiles[i] = new Array(5);
            for (let j = 0; j < 5; j++) {
                tiles[i][j] = tilesString.charAt(positionIndex);
                positionIndex++;
            }
        }

        return tiles;
    };

    // ottiene la notazione 'secondi' : 'centesimi'
    gameData.formatTimeDecimals = function(timerValue) {
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


    // ottiene la notazione 'minuti' : 'secondi'
    gameData.formatTimeSeconds = function(timerValue) {
        let seconds = Math.floor((timerValue % (1000 * 60)) / 1000).toString();
        let minutes = Math.floor((timerValue % (1000 * 60 * 60)) / (1000 * 60)).toString();
        let hours   = Math.floor((timerValue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();

        hours = (hours === '0') ? '' : hours + ':';
        seconds = (seconds.length < 2) ? "0" + seconds : seconds;
        return  hours + minutes + ':' + seconds;
    };


    // funzione che restituisce una stringa leggibile dato il valore di un timer
    gameData.formatTimeStatic = function(timerValue) {
        switch(timerValue) {
            case 15000:
                return '15_SECONDS';
            case 30000:
                return '30_SECONDS';
            case 60000:
                return '1_MINUTE';
            case 120000:
                return '2_MINUTES';
        }
    };


    gameData.formatChatDate = function(millis) {
        let date = new Date(millis);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes;
    };


    // assegna il punteggio al vincitore
    gameData.calculateArcadeMatchPoints = function () {
        let winner = gameData.getMatchWinner();

        if (winner !== undefined) {

            // ogni passo vale 2 punti
            winner.match.points += winner.match.pathLength * 2;

            // il tempo viene scalato su un massimo di 15 punti
            let totalTime = gameData.getGeneral().timerSetting;
            winner.match.points += Math.floor(15 * winner.match.time / totalTime);
        }
    };

    gameData.calculateRoyaleMatchPoints = function() {
        for(let i = 0; i < data.players.length; i++) {
            // ogni passo vale 2 punti
            data.players[i].match.points += data.players[i].match.pathLength * 2;

            // il tempo viene scalato su un massimo di 15 punti
            let totalTime = gameData.getGeneral().timerSetting;
            data.players[i].match.points += Math.floor(15 * data.players[i].match.time / totalTime);
        }
    };


    gameData.getPlayersOrderedByMatchResult = function() {
        let players = gameData.duplicateAllPlayers();
        players.sort(function (a, b) {
            if (b.match.pathLength - a.match.pathLength !== 0) {
                return b.match.pathLength - a.match.pathLength;
            } else {
                return b.match.time - a.match.time;
            }
        });
        return players;
    };


    // restituisce il vincitore della partita corrente in base
    // nell'ordine a: passi effettuati e tempo impiegato
    gameData.getMatchWinner = function () {
        let basePlayer = generateEmptyPlayer();
        basePlayer.match.points = -1;
        basePlayer.match.time = -1;
        basePlayer.match.pathLength = -1;

        let bestPathPlayers = [ basePlayer ];
        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].match.pathLength > bestPathPlayers[0].match.pathLength) {
                bestPathPlayers = [ data.players[i] ];
            } else if (data.players[i].match.pathLength === bestPathPlayers[0].match.pathLength) {
                bestPathPlayers.push(data.players[i]);
            }
        }

        if (bestPathPlayers.length === 1)
            return bestPathPlayers[0];

        let bestTimePlayers = [ basePlayer ];
        for (let i = 0; i < bestPathPlayers.length; i++) {
            if (bestPathPlayers[i].match.time > bestTimePlayers[0].match.time) {
                bestTimePlayers = [ bestPathPlayers[i] ];
            } else if (bestPathPlayers[i].match.time === bestTimePlayers[0].match.time) {
                bestTimePlayers.push(bestPathPlayers[i]);
            }
        }

        if (bestTimePlayers.length === 1)
            return bestTimePlayers[0];

        return data.players[0];
    };

    return gameData;
});
