/*
 * RobyMoveHandler: servizio che permette di gestire i robot nella scacchiera, calcolando il percorso che
 * i robot devono fare, animandoli a comando, e calcolandone il percorso
 */
angular.module('codyColor').factory("robyAnimator", function(gameData) {
    let robyAnimator = {};

    let playerRoby;
    let enemyRoby;

    let startPositions;
    let completeGridTiles;

    let playerPath;
    let enemyPath;

    let lastMovement = false;


    robyAnimator.initializeElements = function () {
        // riferimenti jQuery ad alcuni elementi dell'interfaccia. Utilizzato per fornire l'animazione di
        // movimento di roby; Inizializzati qua per motivi prestazionali
        playerRoby = $("#player-roby");
        enemyRoby = $("#enemy-roby");

        // riferimenti alle posizioni di partenza nella griglia
        startPositions = new Array(4);
        for (let side = 0; side < 4; side++) {
            startPositions[side] = new Array(5);
            for (let distance = 0; distance < 5; distance++) {
                startPositions[side][distance] = $('#start-' + side.toString() + distance.toString());
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
        let coordinates = (identity === 'player' ? gameData.getPlayerStartPosition() : gameData.getEnemyStartPosition());
        let roby = (identity === 'player' ? playerRoby : enemyRoby);

        if (coordinates.distance === -1 && coordinates.side === -1)
            return;

        let startPosition = startPositions[coordinates.side][coordinates.distance].position();
        let rotationValue;
        switch (coordinates.side) {
            case 0:
                rotationValue = 'rotate(180deg)';
                break;
            case 1:
                rotationValue = 'rotate(270deg)';
                break;
            case 2:
                rotationValue = 'rotate(0deg)';
                break;
            case 3:
                rotationValue = 'rotate(90deg)';
                break;
        }
        roby.css({left: startPosition.left, top: startPosition.top, transform: rotationValue});
    };


    // calcola il percorso di uno dei roby, salvandone un oggetto che lo descrive
    let calculatePath = function (identity) {
        let startPosition = (identity === 'player' ? gameData.getPlayerStartPosition() : gameData.getEnemyStartPosition());

        if (startPosition.distance === -1 && startPosition.side === -1)
            return;

        let path = {tilesCoords: [],
            direction: [],
            startCoords: {},
            endCoords: {},
            length: 0,
            loop: false};

        // start position
        path.startCoords = startPosition;

        // elemento 0
        switch (path.startCoords.side) {
            case 0:
                path.tilesCoords.push({ x: 0, y: path.startCoords.distance });
                break;
            case 1:
                path.tilesCoords.push({ x: path.startCoords.distance, y: 4 });
                break;
            case 2:
                path.tilesCoords.push({ x: 4, y: path.startCoords.distance });
                break;
            case 3:
                path.tilesCoords.push({ x: path.startCoords.distance, y: 0 });
                break;
        }
        path.direction.push((path.startCoords.side + 2).mod(4));
        path.length++;

        // trova le tile successive
        let endPath = false;
        while (!endPath) {
            let lastTileCoords = path.tilesCoords[path.length - 1];
            let lastTileDirection = path.direction[path.length - 1];
            let nextTileCoords = {x: -1, y: -1};
            let nextTileDirection = -1;

            // 1. trova la prossima direction
            switch(gameData.getCurrentMatchTiles()[lastTileCoords.x][lastTileCoords.y]) {
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
                    // versi sinistra
                    nextTileCoords.x = lastTileCoords.x;
                    nextTileCoords.y = lastTileCoords.y - 1;
                    break;
            }

            // loop check
            for (let i = 0; i < path.length; i++) {
                if (path.tilesCoords[i].x === nextTileCoords.x &&
                    path.tilesCoords[i].y === nextTileCoords.y &&
                    path.direction[i] === nextTileDirection) {
                    path.loop = true;
                    endPath = true;
                }
            }

            // exit checks
            if (nextTileDirection === 0 && nextTileCoords.x < 0) {
                // uscita dal lato in alto
                path.endCoords.side = 0;
                path.endCoords.distance = nextTileCoords.y;
                endPath = true;

            } else if (nextTileDirection === 1 && nextTileCoords.y > 4) {
                // uscita dal lato destro
                path.endCoords.side = 1;
                path.endCoords.distance = nextTileCoords.x;
                endPath = true;

            } else if (nextTileDirection === 2 && nextTileCoords.x > 4) {
                // uscita dal lato in basso
                path.endCoords.side = 2;
                path.endCoords.distance = nextTileCoords.y;
                endPath = true;

            } else if (nextTileDirection === 3 && nextTileCoords.y < 0) {
                // uscita dal lato sinistro
                path.endCoords.side = 3;
                path.endCoords.distance = nextTileCoords.x;
                endPath = true;
            }

            if (endPath === false) {
                // la prossima tile è valida: aggiungila alla struttura dati
                path.length++;
                path.direction.push(nextTileDirection);
                path.tilesCoords.push(nextTileCoords);
            }
        }

        if (identity === 'player') {
            playerPath = path;
        } else {
            enemyPath = path;
        }

        let timeValue = (identity === 'player' ? gameData.getPlayerMatchTime() : gameData.getEnemyMatchTime());

        return { length: path.length, loop: path.loop, time: timeValue };
    };

    robyAnimator.calculateResults = function() {
        let playerResultValue = calculatePath('player');
        let enemyResultValue = calculatePath('enemy');
        return { playerResult: playerResultValue, enemyResult: enemyResultValue };
    };


    // anima il movimento di roby
    let animatePath = function (identity, endCallback) {
        /*let roby = (identity === 'player' ? playerRoby : enemyRoby);
        let path = (identity === 'player' ? playerPath : enemyPath);
        let startPosition = (identity === 'player' ? gameData.getPlayerStartPosition()
            : gameData.getEnemyStartPosition());

        if (startPosition.distance === -1 && startPosition.side === -1)
            return;

        roby.delay(1000);
        for (let i = 0; i < path.length; i++) {
            let currentTilePos = completeGridTiles[path.tilesCoords[i].x][path.tilesCoords[i].y].position();

            roby.animate({left: currentTilePos.left, top: currentTilePos.top}, { duration: 800 });
            roby.delay(200);
            roby.queue(function (next) {
                // rotation to the next direction
                if (i > 0 && i > path.length) {
                    roby.rotateRobot(path.direction[i], path.direction[i + 1]);

                } else if (i > 0) {
                    roby.rotateRobot(path.direction[i], path.endCoords.direction);
                }
                next();
            });
        }
        let endPos = startPositions[path.endCoords.side][path.endCoords.distance].position();
        roby.animate({left: endPos.left, top: endPos.top}, { duration: 800 });
        roby.delay(1000);
        roby.queue(function (next) {
            // fine animazione; esegui il callback se si è gli ultimi ad eseguire
            if (lastMovement) endCallback(); else lastMovement = true;
            next();
        });*/
        if (lastMovement) endCallback(); else lastMovement = true;

    };

    // IL MODULO IN JAVASCRIPT E' BUGGATO: va risolto con questa funzione
    Number.prototype.mod = function(n) {
        return ((this % n) + n) % n;
    };

    // jQuery plugin che consente la rotazione di roby
    $.fn.rotateRobot = function(startDirection, endDirection) {
        let args = $.speed(200, 'swing');
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


    // ricava il valore in gradi dell'angolo descritto da roby in base alla direzione
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
        }
    };


    robyAnimator.animateAndFinish = function(endMatchCallback) {
        animatePath('player', endMatchCallback);
        animatePath('enemy', endMatchCallback);
    };

    return robyAnimator;
});