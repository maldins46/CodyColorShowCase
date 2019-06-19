/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootmpMatchCtrl',
    function ($scope, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler) {
        console.log("Bootcamp match controller ready.");

        let startCountdownTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            if (startCountdownTimer !== undefined)
                clearInterval(startCountdownTimer);

            pathHandler.quitGame();
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // inizializzazione componenti generali interfaccia
        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.player = gameData.getUserPlayer();
        $scope.enemy = (gameData.getAllPlayers().length > 1) ? gameData.getEnemy1vs1() : undefined;
        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.timerFormatter = gameData.formatTimeDecimals;

        // inizializzazione componenti generali interfaccia
        gameData.editPlayer({
            match: {timerValue: gameData.getGeneral().timerSetting}
        });
        if ($scope.enemy !== undefined) {
            gameData.editEnemy1vs1({
                match: {timerValue: gameData.getGeneral().timerSetting}
            });
        }

        // inizializzazione start positions
        let setArrowCss = function (side, distance, over) {
            let finalResult = '';

            let arrowSide = '';
            switch (side) {
                case 0:
                    arrowSide = 'down';
                    break;
                case 1:
                    arrowSide = 'left';
                    break;
                case 2:
                    arrowSide = 'up';
                    break;
                case 3:
                    arrowSide = 'right';
                    break;
            }

            if (over) {
                finalResult += 'fas fa-chevron-circle-' + arrowSide + ' playground--arrow-over';
            } else {
                finalResult += 'fas fa-angle-' + arrowSide + ' playground--arrow';
            }

            if ($scope.showArrows) {
                finalResult += ' floating-' + arrowSide + '-animation';
            }

            $scope.startPositionsCss[side][distance] = finalResult;
        };

        let calculateAllStartPositionCss = function (over) {
            $scope.startPositionsCss = new Array(4);
            for (let side = 0; side < 4; side++) {
                $scope.startPositionsCss[side] = new Array(5);
                for (let distance = 0; distance < 5; distance++) {
                    setArrowCss(side, distance, over);
                }
            }
        };

        calculateAllStartPositionCss(false);

        // inizializzazione tiles
        $scope.tilesCss = new Array(5);
        for (let x = 0; x < 5; x++) {
            $scope.tilesCss[x] = new Array(5);
            for (let y = 0; y < 5; y++) {
                switch (gameData.getGeneral().tiles[x][y]) {
                    case 'Y':
                        $scope.tilesCss[x][y] = 'playground--tile-yellow';
                        break;
                    case 'R':
                        $scope.tilesCss[x][y] = 'playground--tile-red';
                        break;
                    case 'G':
                        $scope.tilesCss[x][y] = 'playground--tile-gray';
                        break;
                }
            }
        }

        let startCountdownValue = 3;
        $scope.startCountdownText = startCountdownValue.toString();
        audioHandler.playSound('countdown');
        $scope.countdownInProgress = true;
        startCountdownTimer = setInterval(function () {
            startCountdownValue--;
            if (startCountdownValue > 0) {
                audioHandler.playSound('countdown');
                scopeService.safeApply($scope, function () {
                    $scope.startCountdownText = startCountdownValue.toString();
                });

            } else if (startCountdownValue === 0) {
                audioHandler.playSound('start');
                scopeService.safeApply($scope, function () {
                    $scope.startCountdownText = "Let's Cody!";
                });

            } else {
                // interrompi countdown e mostra schermata di gioco
                clearInterval(startCountdownTimer);
                startCountdownTimer = undefined;

                scopeService.safeApply($scope, function () {
                    $scope.countdownInProgress = false;
                });

                startMatchTimers();
            }
        }, 1000);

        // il tempo di gioco dell'avversario, che viene fissato a seconda della difficoltà
        let positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;
        switch (gameData.getGeneral().bootEnemySetting) {
            case 1:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;
                break;

            case 2:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 3 * 2;
                break;

            case 3:
                positionEnemyTrigger = gameData.getGeneral().timerSetting / 4 * 3;
                break;
        }

        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario
        let startMatchTimers = function () {
            // avvia timer partita giocatore
            gameData.editPlayer({
                match: {
                    timer: setInterval(function () {
                        scopeService.safeApply($scope, function () {
                            gameData.getUserPlayer().match.timerValue -= 10;
                        });

                        if (gameData.getUserPlayer().match.timerValue <= 0) {
                            scopeService.safeApply($scope, function () {
                                clearInterval(gameData.getUserPlayer().match.timer);
                                gameData.editPlayer({
                                    match: {
                                        time: 0,
                                        positioned: true,
                                        timer: undefined
                                    }
                                });
                            });

                            $scope.showCompleteGrid = true;
                            $scope.showDraggableRoby = false;

                            if (allPlayersPositioned()) {
                                endMatch();
                            }
                        }
                    }, 10)
                }
            });

            // avvia timer partita avversario
            if ($scope.enemy !== undefined) {
                gameData.editEnemy1vs1({
                    match: {
                        timer: setInterval(function () {
                            scopeService.safeApply($scope, function () {
                                gameData.getEnemy1vs1().match.timerValue -= 10;
                            });

                            if (gameData.getEnemy1vs1().match.timerValue <= positionEnemyTrigger) {
                                // posiziona l'avversario se si supera il limite di tempo stabilito
                                scopeService.safeApply($scope, function () {
                                    clearInterval(gameData.getEnemy1vs1().match.timer);
                                    gameData.editEnemy1vs1({
                                        match: {
                                            positioned: true,
                                            time: positionEnemyTrigger,
                                            timerValue: positionEnemyTrigger,
                                            timer: undefined
                                        }
                                    });
                                });
                               pathHandler.calculateBootEnemyPath();

                                if(allPlayersPositioned()) {
                                    endMatch();
                                }
                            }
                        }, 10)
                    }
                });
            }
        };

        let allPlayersPositioned = function () {
            let allPositioned = true;
            for (let j = 0; j < gameData.getAllPlayers().length; j++) {
                if (gameData.getAllPlayers()[j].match.positioned !== true) {
                    allPositioned = false;
                    break;
                }
            }
            return allPositioned;
        };

        // inizializzazione draggable roby
        $scope.showCompleteGrid = false;
        $scope.showArrows = false;
        $scope.endMatch = false;
        $scope.draggableRobyImage = 'roby-idle';

        // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
        // modificata l'immagine di roby
        $scope.startDragging = function () {
            audioHandler.playSound('roby-drag');
            scopeService.safeApply($scope, function () {
                gameData.editPlayer({
                    match: {
                        positioned: false
                    }
                });
                $scope.showCompleteGrid = true;
                $scope.draggableRobyImage = 'roby-dragging-trasp';
                $scope.showArrows = true;
                calculateAllStartPositionCss(false);
            });
        };

        // invocato quando roby viene posizionato, ma non rilasciato, sopra una posizione di partenza valida
        $scope.robyOver = function (event, ui, side, distance) {
            audioHandler.playSound('roby-over');
            scopeService.safeApply($scope, function () {
                setArrowCss(side, distance, true);
            });
        };

        // invocato quando roby viene spostato da una posizione di partenza valida
        $scope.robyOut = function (event, ui, side, distance) {
            scopeService.safeApply($scope, function () {
                setArrowCss(side, distance, false);
            });
        };

        // quando roby viene rilasciato, ritorna nella posizione iniziale...
        $scope.endDragging = function () {
            console.log("End dragging");
            audioHandler.playSound('roby-drop');
            if (!$scope.endMatch) {
                scopeService.safeApply($scope, function () {
                    $scope.showArrows = false;
                    gameData.editPlayer({
                        match: {
                            positioned: false
                        }
                    });
                    $scope.showCompleteGrid = false;
                    $scope.draggableRobyImage = 'roby-idle';
                    calculateAllStartPositionCss(false);
                });
            }
        };

        //...a meno che, non venga rilasciato in una posizione valida. In quel caso, viene utilizzata un secondo tag
        // img, per mostrare roby nella sua posizione di partenza. Viene inoltre fermato il timer, e notificato
        // l'avversario dell'avvenuta presa di posizione
        $scope.robyDropped = function (event, ui, sideValue, distanceValue) {
            console.log("Roby dropped");
            audioHandler.playSound('roby-positioned');
            if (!$scope.endMatch) {
                clearInterval(gameData.getUserPlayer().match.timer);
                gameData.editPlayer({
                    match: {
                        startPosition: {side: sideValue, distance: distanceValue},
                        time: gameData.getUserPlayer().match.timerValue,
                        positioned: true,
                        timer: undefined
                    }
                });

                // posiziona l'avversario se si supera il limite di tempo stabilito
                clearInterval(gameData.getEnemy1vs1().match.timer);
                gameData.editEnemy1vs1({
                    match: {
                        positioned: true,
                        time: positionEnemyTrigger,
                        timerValue: positionEnemyTrigger,
                        timer: undefined
                    }
                });

                $scope.showCompleteGrid = true;
                $scope.showDraggableRoby = false;
                pathHandler.positionRoby(true, gameData.getUserPlayer().match.startPosition);
                pathHandler.calculatePlayerPath();
                pathHandler.calculateBootEnemyPath();

                if (allPlayersPositioned())
                    endMatch();
            }
        };

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let endMatch = function () {
            if (!$scope.endMatch) {
                if ($scope.enemy !== undefined)
                    pathHandler.positionRoby(false, gameData.getEnemy1vs1().match.startPosition);

                scopeService.safeApply($scope, function () {
                    $scope.endMatch = true;
                });
                gameData.calculateArcadeMatchPoints();

                pathHandler.animateActiveRobys(function () {
                    pathHandler.quitGame();
                    navigationHandler.goToPage($location, $scope, '/bootmp-aftermatch', true);
                }, gameData.getGeneral().bootEnemySetting);
            }
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function () {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.skip = function () {
            pathHandler.quitGame();
            if ($scope.forceExitModal !== true)
                navigationHandler.goToPage($location, $scope, '/bootmp-aftermatch', false);
            audioHandler.playSound('menu-click');
        };

        // impostazioni multi language
        $scope.openLanguageModal = function () {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function () {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);