/*
 * Controller responsabile della schermata partita
 */

angular.module('codyColor').controller('matchCtrl', function($scope, rabbit, gameData, scopeService, robyAnimator, $location) {

    console.log("Controller match ready.");

    // si assume che arrivati a questo punto, la connessione al broker è già avvenuta con successo
    $scope.connected = rabbit.getConnectionState();

    // inizializzazione componenti generali interfaccia
    $scope.playerPoints = gameData.getPlayerPoints();
    $scope.enemyPoints = gameData.getEnemyPoints();
    $scope.playerNickname = gameData.getPlayerNickname();
    $scope.enemyNickname = gameData.getEnemyNickname();

    // inizializzazione elementi griglia
    robyAnimator.initializeElements();

    // array per la memorizzazioni di effetti sulle posizioni di partenza
    $scope.startPositionsOver = new Array(4);
    for (let side = 0; side < 4; side++) {
        $scope.startPositionsOver[side] = new Array(5);
        for (let distance = 0; distance < 5; distance++) {
            $scope.startPositionsOver[side][distance] = false;
        }
    }

    // inizializzazione timers
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
                    scopeService.safeApply($scope, function () {
                        $scope.playerMatchTimerText = getTimerText(playerMatchTimerValue);
                    });
                } else {
                    clearInterval(gameData.getPlayerMatchTimer());
                }
            }, 10));

            // avvia timer partita avversario
            gameData.setEnemyMatchTimer(setInterval(function () {
                enemyMatchTimerValue -= 10;

                if (enemyMatchTimerValue >= 0) {
                    scopeService.safeApply($scope, function () {
                        $scope.enemyMatchTimerText = getTimerText(enemyMatchTimerValue);
                    });
                } else {
                    clearInterval(gameData.getEnemyMatchTimer());
                }
            }, 10));
        }
    }, 1000);

    // funzione che restituisce il valore leggibile del timer memorizzato
    let getTimerText = function(timerValue) {
        let secondsInt = Math.floor(timerValue / 1000);
        let decimalsInt = Math.floor((timerValue - (secondsInt * 1000)) / 10).toString();
        let decimals = decimalsInt.toString();
        let seconds = secondsInt.toString();

        if (decimals.length === 1)
            decimals = '0' + decimals;

        return seconds + ':' + decimals;
    };

    // associa il colore ad ogni tile, a seconda di quanto memorizzato nei gameData
    $scope.getTileStyle = function (x, y) {
        switch (gameData.getCurrentMatchTiles()[x][y]) {
            case 'Y':
                return 'yellow-play-tile';
            case 'R':
                return 'red-play-tile';
            case 'G':
                return 'gray-play-tile';
        }
    };

    // inizializzazione Roby
    $scope.robyPositioned = false;
    $scope.enemyPositioned = false;
    $scope.showCompleteGrid = false;
    $scope.showArrows = false;
    $scope.endMatch = false;
    $scope.robyImage = 'roby-idle';

    // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
    // modificata l'immagine di roby
    $scope.startDragging = function () {
        console.log("Start dragging");
        scopeService.safeApply($scope, function () {
            $scope.robyPositioned = false;
            $scope.showCompleteGrid = true;
            $scope.robyImage = 'roby-dragging';
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
            $scope.showArrows = false;
            $scope.robyPositioned = false;
            $scope.showCompleteGrid = false;
            $scope.robyImage = 'roby-idle';
        });
    };

    //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata un secondo tag
    // img, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
    // l'avversario dell'avvenuta presa di posizione
    $scope.robyDropped = function(event, ui, side, distance) {
        // l'esecuzione avviene subito dopo endDragging(), e va quindi gestito in modo sicuro l'$apply
        console.log("Roby dropped");
        gameData.setPlayerStartPosition({'side': side, 'distance': distance});
        gameData.setPlayerMatchTime(playerMatchTimerValue);

        clearInterval(gameData.getPlayerMatchTimer());
        rabbit.sendPlayerPositionedMessage();
        scopeService.safeApply($scope, function () {
            $scope.robyPositioned = true;
            $scope.showCompleteGrid = true;
        });
        robyAnimator.positionRoby('player');

        if ($scope.enemyPositioned && $scope.robyPositioned) {
            endMatch();
        }
    };

    rabbit.setMatchCallbacks(function (response) {
        scopeService.safeApply($scope, function () {
            $scope.enemyPositioned = true;
        });

        gameData.setEnemyStartPosition({ side: response.side, distance: response.distance });
        gameData.setEnemyMatchTime(response.matchTime);
        clearInterval(gameData.getEnemyMatchTimer());

        if ($scope.enemyPositioned && $scope.robyPositioned) {
            endMatch();
        }
    });

    // routine di fine partita
    let endMatch = function() {
        scopeService.safeApply($scope, function () {
            $scope.endMatch = true;
        });
        robyAnimator.positionRoby('enemy');
        let results = robyAnimator.calculateResults();

        // calcola e aggiungi al punteggio
        gameData.addPlayerPoints(calculatePoints(results.playerResult));
        gameData.addEnemyPoints(calculatePoints(results.enemyResult));

        robyAnimator.animateAndFinish(function () {
            $location.path('/aftermatch');
        });
    };


    let calculatePoints = function (result) {
        let points = 0;
        points += result.length * 2;

        if (result.loop)
            points += 20;

        points += Math.floor(result.time / 1000);

        return points;
    }
});
