/*
 * RobyMoveHandler: servizio che permette di gestire i robot nella scacchiera, calcolando il percorso che
 * i robot devono fare, animandoli a comando, e calcolandone il percorso
 */
angular.module('codyColor').factory("robyAnimator", function(gameData) {
    let robyAnimator = {};

    let startPositionsTiles;
    let completeGridTiles;

    let isLastMovement;

    let playerRoby;
    let enemyRoby;
    let robyImageCallbacks = {};
    let robyWalkingTimers = {};

    // in caso di interruzione del gioco, sospendi i timers
    robyAnimator.quitGame = function() {
        if(robyWalkingTimers.player !== undefined)
            clearInterval((robyWalkingTimers.player));
        if(robyWalkingTimers.enemy !== undefined)
            clearInterval((robyWalkingTimers.enemy));

        robyImageCallbacks = {};
        robyWalkingTimers = {};
        isLastMovement = false;
    };

    robyAnimator.initializeElements = function (changePlayerImage, changeEnemyImage) {
        robyImageCallbacks.player = changePlayerImage;
        robyImageCallbacks.enemy = changeEnemyImage;

        // riferimenti jQuery ad alcuni elementi dell'interfaccia. Utilizzato per fornire l'animazione di
        // movimento di roby; Inizializzati qua per motivi prestazionali
        playerRoby = $("#player-roby");
        enemyRoby = $("#enemy-roby");

        // riferimenti alle posizioni di partenza nella griglia
        startPositionsTiles = new Array(4);
        for (let side = 0; side < 4; side++) {
            startPositionsTiles[side] = new Array(5);
            for (let distance = 0; distance < 5; distance++) {
                startPositionsTiles[side][distance] = $('#start-' + side.toString() + distance.toString());
            }
        }

        // riferimenti alle tile della griglia completa; utilizzate per animare il movimento di roby
        completeGridTiles = new Array(5);
        for (let x = 0; x < 5; x++) {
            completeGridTiles[x] = new Array(5);
            for (let y = 0; y < 5; y++) {
                completeGridTiles[x][y] = $('#tile-' + x.toString() + y.toString());
            }
        }
    };


    // pone l'immagine di roby del giocatore in posizione (senza animazione), sulla casella selezionata dall'utente
    robyAnimator.positionRoby = function (identity) {
        let coordinates = (identity === 'player' ?
            gameData.getPlayer().match.startPosition : gameData.getEnemy1vs1().match.startPosition);
        let roby = (identity === 'player' ? playerRoby : enemyRoby);

        if (coordinates.distance === -1 && coordinates.side === -1) {
            // robottino non posizionato dall'utente: mostralo nella posizione broken
            let startPosition = (identity === 'player' ? startPositionsTiles[2][1].position() : startPositionsTiles[2][3].position());
            let rotationValue =  'rotate(' + getAngle(2).toString() + 'deg)';
            roby.css({ left: startPosition.left, top: startPosition.top, transform: rotationValue });

        } else {
            let startPosition = startPositionsTiles[coordinates.side][coordinates.distance].position();
            let rotationValue =  'rotate(' + getAngle((coordinates.side + 2).mod(4)).toString() + 'deg)';
            roby.css({ left: startPosition.left, top: startPosition.top, transform: rotationValue });
        }
    };


    // calcola i percorsi fatti dai due robottini, e restituisce un oggetto che rappresenta i valori del risultato
    // della partita
    robyAnimator.calculateResults = function() {
        for (let i = 0; i < gameData.getAllPlayers().length; i++) {
            calculatePath(undefined, gameData.getAllPlayers()[i]);
        }
    };


    robyAnimator.calculateBootEnemyPath = function() {
        let allPaths = [];
        for (let sideValue = 0; sideValue < 4; sideValue++) {
            for (let distanceValue = 0; distanceValue < 5; distanceValue++) {
                allPaths.push(calculatePath({
                    side: sideValue,
                    distance: distanceValue
                }));
            }
        }
        allPaths.sort(function(a, b){
            return a.length - b.length;
        });

        switch (gameData.getGeneral().bootEnemySetting) {
            case 1:
                // facile: seleziona un percorso casuale tra i più corti
                gameData.editEnemy1vs1({
                    match: allPaths[Math.floor(Math.random() * 10)]
                });
                break;

            case 2:
                // medio: seleziona un percorso casuale tra i più lunghi
                gameData.editEnemy1vs1({
                    match: allPaths[Math.floor(Math.random() * 10) + 10]
                });
                break;

            case 3:
                // difficile: seleziona il percorso più lungo
                gameData.editEnemy1vs1({
                    match: allPaths[19]
                });
                break;
        }
    };


    // calcola il percorso di uno dei roby, salvandone un oggetto che lo descrive
    let calculatePath = function (customStart, player) {
        let newPathData = {
            startPosition: { side: -1, distance: -1 },
            endPosition: { side: -1, distance: -1 },
            tilesCoords: [],
            direction: [],
            pathLength: 0,
            points: 0,
        };

        // ottieni start position
        if (customStart !== undefined) {
            newPathData.startPosition = customStart;
        } else {
            newPathData.startPosition = player.match.startPosition;
        }

        // roby non posizionato entro il tempo limite
        if (newPathData.startPosition.distance === -1 && newPathData.startPosition.side === -1) {
            if (player !== undefined)
                gameData.editPlayerById(player.playerId, { match: newPathData });
            return newPathData;
        }

        // ottieni primo elemento
        switch (newPathData.startPosition.side) {
            case 0:
                newPathData.tilesCoords.push({ x: 0, y: newPathData.startPosition.distance });
                break;
            case 1:
                newPathData.tilesCoords.push({ x: newPathData.startPosition.distance, y: 4 });
                break;
            case 2:
                newPathData.tilesCoords.push({ x: 4, y: newPathData.startPosition.distance });
                break;
            case 3:
                newPathData.tilesCoords.push({ x: newPathData.startPosition.distance, y: 0 });
                break;
        }
        newPathData.direction.push((newPathData.startPosition.side + 2).mod(4));
        newPathData.pathLength++;

        // ottieni elementi successivi tramite while
        let endOfThePath = false;
        while (!endOfThePath) {
            let lastTileCoords = newPathData.tilesCoords[newPathData.pathLength - 1];
            let lastTileDirection = newPathData.direction[newPathData.pathLength - 1];
            let nextTileCoords = {x: -1, y: -1};
            let nextTileDirection = -1;

            // 1. trova la prossima direction
            switch(gameData.getGeneral().tiles[lastTileCoords.x][lastTileCoords.y]) {
                case 'Y':
                    // vai verso sinistra
                    nextTileDirection = (lastTileDirection - 1).mod( 4);
                    break;
                case 'R':
                    // vai verso destra
                    nextTileDirection = (lastTileDirection + 1).mod(4);
                    break;
                case 'G':
                   // vai dritto
                    nextTileDirection = lastTileDirection;
                    break;
            }

            // 2. trova la prossima tile
            switch(nextTileDirection) {
                case 0:
                    // verso l'alto
                    nextTileCoords.x = lastTileCoords.x - 1;
                    nextTileCoords.y = lastTileCoords.y;
                    break;
                case 1:
                    // verso destra
                    nextTileCoords.x = lastTileCoords.x;
                    nextTileCoords.y = lastTileCoords.y + 1;
                    break;
                case 2:
                    // verso il basso
                    nextTileCoords.x = lastTileCoords.x + 1;
                    nextTileCoords.y = lastTileCoords.y;
                    break;
                case 3:
                    // verso sinistra
                    nextTileCoords.x = lastTileCoords.x;
                    nextTileCoords.y = lastTileCoords.y - 1;
                    break;
            }

            // exit checks
            if (nextTileDirection === 0 && nextTileCoords.x < 0) {
                // uscita dal lato in alto
                newPathData.endPosition.side = 0;
                newPathData.endPosition.distance = nextTileCoords.y;
                endOfThePath = true;

            } else if (nextTileDirection === 1 && nextTileCoords.y > 4) {
                // uscita dal lato destro
                newPathData.endPosition.side = 1;
                newPathData.endPosition.distance = nextTileCoords.x;
                endOfThePath = true;

            } else if (nextTileDirection === 2 && nextTileCoords.x > 4) {
                // uscita dal lato in basso
                newPathData.endPosition.side = 2;
                newPathData.endPosition.distance = nextTileCoords.y;
                endOfThePath = true;

            } else if (nextTileDirection === 3 && nextTileCoords.y < 0) {
                // uscita dal lato sinistro
                newPathData.endPosition.side = 3;
                newPathData.endPosition.distance = nextTileCoords.x;
                endOfThePath = true;
            }

            // la prossima tile è valida: aggiungila alla struttura dati
            if (endOfThePath === false) {
                newPathData.pathLength++;
                newPathData.direction.push(nextTileDirection);
                newPathData.tilesCoords.push(nextTileCoords);
            }
        }


        // se il percorso è relativo a un giocatore, modificalo
        if (player !== undefined) {
            newPathData.points = calculatePoints(newPathData.pathLength, player.time);
            gameData.editPlayerById(player.playerId, { match: newPathData });
        }

        return newPathData;
    };

    robyAnimator.animateAndFinish = function(endMatchCallback) {
        animatePath('player', endMatchCallback);

        if (gameData.getGeneral().bootEnemySetting !== 0)
            animatePath('enemy', endMatchCallback);
    };

    // anima il movimento di roby
    let animatePath = function (identity, endCallback) {
        let roby = (identity === 'player' ? playerRoby : enemyRoby);
        let path = (identity === 'player' ? gameData.getPlayer().match : gameData.getEnemy1vs1().match);
        let imageCallback = (identity === 'player' ? robyImageCallbacks.player : robyImageCallbacks.enemy);
        let imageValues = (identity === 'player' ? ['roby-walking-1', 'roby-walking-2'] : ['enemy-walking-2', 'enemy-walking-1']);
        let startPosition = (identity === 'player' ? gameData.getPlayer().match.startPosition : gameData.getEnemy1vs1().match.startPosition);

        // roby non posizionato: mostra l'immagine corrispondente
        if (startPosition.distance === -1 && startPosition.side === -1) {
            imageCallback(identity === 'player' ? 'roby-broken' : 'enemy-broken');
            roby.delay(1000);
            roby.queue(function (next) {
                if (isLastMovement) {
                    isLastMovement = false;
                    endCallback();
                } else {
                    isLastMovement = true;
                }
                next();
            });
            return;
        }

        roby.delay(1000);

        // aggiunge un leggero ritardo al movimento dell'avversario, per non sovrapporre i robottini
        if (identity !== 'player')
            roby.delay(100);

        roby.queue(function (next) {
            let changeValue = 0;
            if (identity === 'player') {
                robyWalkingTimers.player = setInterval(function () {
                    imageCallback(changeValue === 0 ? imageValues[0] : imageValues[1]);
                    changeValue = (changeValue + 1).mod(2);
                }, 500);
            } else {
                robyWalkingTimers.enemy = setInterval(function () {
                    imageCallback(changeValue === 0 ? imageValues[0] : imageValues[1]);
                    changeValue = (changeValue + 1).mod(2);
                }, 500);
            }
            next();
        });
        for (let i = 0; i < path.pathLength; i++) {
            let currentTilePos = completeGridTiles[path.tilesCoords[i].x][path.tilesCoords[i].y].position();
            roby.animate({left: currentTilePos.left, top: currentTilePos.top}, { duration: 800 });
            roby.delay(200);
            roby.queue(function(next) {
                // rotation to the next direction
                if ((i + 1) < path.pathLength) {
                    //roby.rotateRobot(path.direction[i], path.direction[i + 1], next);
                    let rotationValue = 'rotate(' + getAngle(path.direction[i + 1]).toString() + 'deg)';
                    roby.css({transform: rotationValue});

                } else {
                    //roby.rotateRobot(path.direction[i], path.endCoords.distance, next);
                    let rotationValue = 'rotate(' + getAngle(path.endPosition.side).toString() + 'deg)';
                    roby.css({transform: rotationValue});
                }
                next();
            });
        }
        let endPos = startPositionsTiles[path.endPosition.side][path.endPosition.distance].position();
        roby.animate({left: endPos.left, top: endPos.top}, { duration: 800 });
        roby.queue(function (next) {
            if (identity === 'player') {
                if (robyWalkingTimers.player !== undefined)
                    clearInterval(robyWalkingTimers.player);

                robyWalkingTimers.player = undefined;
            } else {
                if(robyWalkingTimers.enemy !== undefined)
                    clearInterval(robyWalkingTimers.enemy);

                robyWalkingTimers.enemy = undefined;
            }

            imageCallback(identity === 'player'? 'roby-positioned' : 'enemy-positioned');
            next();
        });
        roby.delay(1000);
        roby.queue(function (next) {
            // fine animazione; esegui il callback se si è gli ultimi ad eseguire

        if (isLastMovement || gameData.getGeneral().bootEnemySetting === 0) {
                isLastMovement = false;
                endCallback();
            } else {
                isLastMovement = true;
            }
            next();
        });
    };



    /*
     * FUNZIONI HELPER
     */

    // calcola il punteggio della partita in base ai parametri risultato
    let calculatePoints = function (length, time) {
        let points = 0;

        // ogni passo vale 2 punti
        points += length * 2;

        // il tempo viene diviso in 4 parti. Ogni 'quarto' rimasto vale 2 punti
        let totalTime = gameData.getGeneral().timerSetting;
        let quarter = totalTime / 4;

        while (time > quarter) {
            points += 2;
            time -= quarter;
        }

        return points;
    };


    // risolve il bug della funzione modulo di JavaScript
    // (https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers)
    Number.prototype.mod = function(n) {
        return ((this % n) + n) % n;
    };


    // jQuery plugin che consente la rotazione del robottino, dando come argomenti le direzioni di partenza e arrivo
    $.fn.rotateRobot = function(startDirection, endDirection, complete) {
        let args = $.speed(200, 'swing', complete);
        let step = args.step;
        return this.each(function(i, e) {
            args.complete = $.proxy(args.complete, e);
            args.step = function(now) {
                $.style(e, 'transform', 'rotate(' + now + 'deg)');
                if (step) return step.apply(e, arguments);
            };
            $({ deg: getAngle(startDirection) }).animate({ deg: getAngle(endDirection) }, args);
        });
    };


    // ricava il valore in gradi dell'angolo descritto da roby in base alla direzione data
    let getAngle = function (direction) {
        switch(direction) {
            case 0:
                // direzione verso l'alto
                return 0;
            case 1:
                // direzione verso destra
                return 90;
            case 2:
                // direzione verso il basso
                return 180;
            case 3:
                // direzione verso sinistra
                return 270;
            default:
                return 0;
        }
    };


    return robyAnimator;
});