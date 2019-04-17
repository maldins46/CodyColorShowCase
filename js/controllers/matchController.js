/*
 * Controller responsabile della schermata partita
 */

angular.module('codyColor').controller('matchCtrl', function($scope, rabbit, gameData, scopeService) {

    console.log("Controller match ready.");

    // si assume che arrivati a questo punto, la connessione al broker è già avvenuta con successo
    $scope.connected = rabbit.getConnectionState();

    // inizializzazione interfaccia
    $scope.playerPoints = gameData.getPlayerPoints();
    $scope.enemyPoints = gameData.getEnemyPoints();
    $scope.playerNickname = gameData.getPlayerNickname();
    $scope.enemyNickname = gameData.getEnemyNickname();

    // riferimenti jQuery ad alcuni elementi dell'interfaccia. Utilizzato per fornire l'animazione di
    // movimento di roby
    let playerRoby = $("#player-roby");
    let enemyRoby = $("#enemy-roby");

    // riferimenti alle posizioni di partenza nella griglia
    let startPositions = new Array(4);
    for (let side = 0; side < 4; side++) {
        startPositions[side] = new Array(5);
        for (let distance = 0; distance < 5; distance++) {
            startPositions[side][distance] = $('#start-' + side.toString() + distance.toString());
        }
    }
    $scope.startPositionsOver = new Array(4);
    for (let side = 0; side < 4; side++) {
        $scope.startPositionsOver[side] = new Array(5);
        for (let distance = 0; distance < 5; distance++) {
            $scope.startPositionsOver[side][distance] = false;
        }
    }

    // riferimenti alle tile della griglia completa; utilizzate per animare il movimento di roby
    let completeGridTiles = new Array(5);
    for (let i = 0; i < 5; i++) {
        completeGridTiles[i] = new Array(5);
        for (let j = 0; j < 5; j++) {
            completeGridTiles[i][j] = $('#tile-' + i.toString() + j.toString());
        }
    }

    // inizializzazione timer
    let startCountdown = 3;
    $scope.startCountdownText = startCountdown.toString();
    let playerMatchTimerValue = 30000;
    $scope.playerMatchTimerText = '30:00';
    let enemyMatchTimerValue = 30000;
    $scope.enemyMatchTimerText = '30:00';
    $scope.countdownInProgress = true;

    let startCountdownTimer = setInterval(function () {
        startCountdown--;
        if (startCountdown > 0) {
            scopeService.safeApply($scope, function () {
                $scope.startCountdownText = startCountdown.toString();
            });

        } else if (startCountdown === 0) {
            scopeService.safeApply($scope, function () {
                $scope.startCountdownText = "Let's Cody!";
            });

        } else {
            // interrompi countdown e mostra schermata di gioco
            scopeService.safeApply($scope, function () {
                $scope.countdownInProgress = false;
            });
            clearInterval(startCountdownTimer);

            // avvia timer partita giocatore
            gameData.setPlayerMatchTimer(setInterval(function () {
                playerMatchTimerValue -= 10;

                if (playerMatchTimerValue >= 0) {
                    let secondsInt = Math.floor(playerMatchTimerValue / 1000);
                    let decimalsInt = Math.floor((playerMatchTimerValue - (secondsInt * 1000)) / 10).toString();
                    let decimals = decimalsInt.toString();
                    let seconds = secondsInt.toString();

                    if (decimals.length === 1)
                        decimals = '0' + decimals;

                    scopeService.safeApply($scope, function () {
                        $scope.playerMatchTimerText = seconds + ':' + decimals;
                    });
                } else {
                    clearInterval(gameData.getPlayerMatchTimer());
                }
            }, 10));

            // avvia timer partita avversario
            gameData.setEnemyMatchTimer(setInterval(function () {
                enemyMatchTimerValue -= 10;

                if (enemyMatchTimerValue >= 0) {
                    let secondsInt = Math.floor(enemyMatchTimerValue / 1000);
                    let decimalsInt = Math.floor((enemyMatchTimerValue - (secondsInt * 1000)) / 10).toString();
                    let decimals = decimalsInt.toString();
                    let seconds = secondsInt.toString();

                    if (decimals.length === 1)
                        decimals = '0' + decimals;

                    scopeService.safeApply($scope, function () {
                        $scope.enemyMatchTimerText = seconds + ':' + decimals;
                    });
                } else {
                    clearInterval(gameData.getEnemyMatchTimer());
                }
            }, 10));
        }
    }, 1000);

    // associa il colore ad ogni tile, a seconda di quanto memorizzato nei gameData
    $scope.getTileStyle = function (i, j) {
        switch (gameData.getCurrentMatchTiles()[i][j]) {
            case 'Y':
                return 'yellow-play-tile';
            case 'R':
                return 'red-play-tile';
            case 'G':
                return 'gray-play-tile';
        }
    };

    /*
     * Variabile che identifica lo stato di roby e della partita:
     * - idle: roby non è stato ancora posizionato
     * - dragging: l'utente sta trascinando roby in posizione
     * - positioned: roby è posizionato
     * - showingMove: roby si muove nella scacchiera per mostrare il percorso
     */
    $scope.robyState = 'idle';
    $scope.robyPositioned = false;
    $scope.showCompleteGrid = false;
    $scope.showArrows = false;
    $scope.robyImage = 'roby-idle';
    $scope.robyStyle = 'roby-image-start';

    // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
    // modificata l'immagine di roby
    $scope.startDragging = function () {
        console.log("Start dragging");
        scopeService.safeApply($scope, function () {
            $scope.robyState = 'dragging';
            $scope.robyPositioned = false;
            $scope.showCompleteGrid = true;
            $scope.robyImage = 'roby-dragging';
            $scope.robyStyle = 'roby-image-start';
            $scope.showArrows = true;
        });
    };

    // invocato quando roby viene posizionato, ma non rilasciato, sopra una posizione di partenza valida
    $scope.robyOver = function(event, ui, side, distance) {
        scopeService.safeApply($scope, function () {
            $scope.startPositionsOver[side][distance] = true;
        });
    };

    // invocato quando roby viene spostato da una posizione di partenza valida
    $scope.robyOut = function(event, ui, side, distance) {
        scopeService.safeApply($scope, function () {
            $scope.startPositionsOver[side][distance] = false;
        });
    };

    // quando roby viene rilasciato, ritorna nella posizione iniziale...
    $scope.endDragging = function() {
        console.log("End dragging");
        scopeService.safeApply($scope, function () {
            $scope.robyState = 'idle';
            $scope.showArrows = false;
            $scope.robyPositioned = false;
            $scope.showCompleteGrid = false;
            $scope.robyImage = 'roby-idle';
            $scope.robyStyle = 'roby-image-start';
        });
    };

    //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata una seconda
    // immagine, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
    // l'avversario
    $scope.robyDropped = function(event, ui, side, distance) {
        // l'esecuzione avviene subito dopo endDragging(), e va quindi gestito in modo sicuro l'$apply
        console.log("Roby dropped");
        gameData.setPlayerStartPosition({'side': side, 'distance': distance});
        clearInterval(gameData.getPlayerMatchTimer());
        gameData.setPlayerMatchTime(playerMatchTimerValue);
        rabbit.sendPlayerPositionedMessage();
        scopeService.safeApply($scope, function () {
            $scope.robyState = 'positioned';
            $scope.robyPositioned = true;
            $scope.showCompleteGrid = true;
        });

        // poni la seconda immagine di roby in posizione (senza animazione), sulla casella selezionata dall'utente
        let startPosition = startPositions[side][distance].position();
        let rotationValue = 'rotate(0deg)';
        switch (side) {
            case 0:
                rotationValue = 'rotate(180deg)';
                break;
            case 1:
                rotationValue = 'rotate(90deg)';
                break;
            case 2:
                rotationValue = 'rotate(0deg)';
                break;
            case 3:
                rotationValue = 'rotate(270deg)';
                break;
        }
        playerRoby.css({left: startPosition.left, top: startPosition.top, transform: rotationValue});
        //playerRoby.animate({left: startPosition.left, top: startPosition.top, transform: rotationValue}, 0);

        if($scope.enemyPositioned && $scope.robyPositioned) {
            positionEnemy();
            console.log('Create and start animation');
        }
    };

    $scope.enemyPositioned = false;
    rabbit.setMatchCallbacks(function (response) {
        scopeService.safeApply($scope, function () {
            $scope.enemyPositioned = true;
        });

        gameData.setEnemyMatchTime(response.matchTime);
        gameData.setEnemyStartPosition({ side: response.side, distance: response.distance });
        clearInterval(gameData.getEnemyMatchTimer());

        positionEnemy = function() {
            let startPosition = startPositions[response.side][response.distance].position();
            let rotationValue = 'rotate(0deg)';
            switch (response.side) {
                case 0:
                    rotationValue = 'rotate(180deg)';
                    break;
                case 1:
                    rotationValue = 'rotate(90deg)';
                    break;
                case 2:
                    rotationValue = 'rotate(0deg)';
                    break;
                case 3:
                    rotationValue = 'rotate(270deg)';
                    break;
            }
            enemyRoby.css({left: startPosition.left, top: startPosition.top, transform: rotationValue});
        };

        if ($scope.enemyPositioned && $scope.robyPositioned) {
            console.log('Create and start animation');
            positionEnemy();
        }
    });

    let positionEnemy;

});
