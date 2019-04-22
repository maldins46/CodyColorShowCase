/*
 * Controller responsabile della schermata partita
 */

angular.module('codyColor').controller('matchCtrl',
    function ($scope, rabbit, gameData, scopeService, robyAnimator, $location, navigationHandler, audioHandler, sessionHandler) {
        console.log("Controller match ready.");
        navigationHandler.initializeBackBlock($scope);
        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

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
                clearInterval(startCountdownTimer);

                // interrompi countdown e mostra schermata di gioco
                scopeService.safeApply($scope, function () {
                    $scope.countdownInProgress = false;
                });

                // avvia timer partita giocatore
                gameData.setPlayerMatchTimer(setInterval(function () {
                    playerMatchTimerValue -= 10;

                    if (playerMatchTimerValue >= 0) {
                        scopeService.safeApply($scope, function () {
                            $scope.playerMatchTimerText = gameData.getTimerText(playerMatchTimerValue);
                        });
                    } else {
                        clearInterval(gameData.getPlayerMatchTimer());
                        scopeService.safeApply($scope, function () {
                            $scope.showCompleteGrid = true;
                            $scope.robyPositioned = true;
                        });
                        clearInterval(gameData.getPlayerMatchTimer());

                        if ($scope.enemyPositioned && $scope.robyPositioned) {
                            endMatch();
                        }
                    }
                }, 10));

                // avvia timer partita avversario
                gameData.setEnemyMatchTimer(setInterval(function () {
                    enemyMatchTimerValue -= 10;

                    if (enemyMatchTimerValue >= 0) {
                        scopeService.safeApply($scope, function () {
                            $scope.enemyMatchTimerText = gameData.getTimerText(enemyMatchTimerValue);
                        });
                    } else {
                        scopeService.safeApply($scope, function () {
                            $scope.enemyPositioned = true;
                        });

                        clearInterval(gameData.getEnemyMatchTimer());
                        scopeService.safeApply($scope, function () {
                            $scope.enemyMatchTimerText = 0;
                        });

                        if ($scope.enemyPositioned && $scope.robyPositioned) {
                            endMatch();
                        }
                    }
                }, 10));
            }
        }, 1000);

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
        $scope.robyOver = function (event, ui, side, distance) {
            scopeService.safeApply($scope, function () {
                $scope.startPositionsOver[side][distance] = true;
            });
        };

        // invocato quando roby viene spostato da una posizione di partenza valida
        $scope.robyOut = function (event, ui, side, distance) {
            scopeService.safeApply($scope, function () {
                $scope.startPositionsOver[side][distance] = false;
            });
        };

        // quando roby viene rilasciato, ritorna nella posizione iniziale...
        $scope.endDragging = function () {
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
        $scope.robyDropped = function (event, ui, side, distance) {
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

            gameData.setEnemyStartPosition({side: response.side, distance: response.distance});
            gameData.setEnemyMatchTime(response.matchTime);
            clearInterval(gameData.getEnemyMatchTimer());
            scopeService.safeApply($scope, function () {
                $scope.enemyMatchTimerText = gameData.getTimerText(response.matchTime);
            });

            if ($scope.enemyPositioned && $scope.robyPositioned) {
                endMatch();
            }
        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("L'avversario ha abbandonato la partita.");
        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
        });

        // routine di fine partita
        let endMatch = function () {
            scopeService.safeApply($scope, function () {
                $scope.endMatch = true;
            });
            robyAnimator.positionRoby('enemy');

            let results = robyAnimator.calculateResults();
            gameData.setCurrentMatchResult(results);
            gameData.addPlayerPoints(results.playerResult.points);
            gameData.addEnemyPoints(results.enemyResult.points);

            robyAnimator.animateAndFinish(function () {
                navigationHandler.goToPage($location, $scope, '/aftermatch', true);
            });
        };


        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if (confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    });
