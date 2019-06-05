/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootmpMatchCtrl',
    function ($scope, gameData, scopeService, robyAnimator, $location, $translate,
              navigationHandler, audioHandler, sessionHandler) {
        console.log("Bootcamp match controller ready.");

        let enemyMatchTimer;
        let playerMatchTimer;
        let startCountdownTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            if (enemyMatchTimer !== undefined)
                clearInterval(enemyMatchTimer);

            if (playerMatchTimer !== undefined)
                clearInterval(playerMatchTimer);

            if (startCountdownTimer !== undefined)
                clearInterval(startCountdownTimer);

            robyAnimator.quitGame();
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
        $scope.player = gameData.getPlayer();
        $scope.enemy = gameData.getEnemy1vs1();
        $scope.withEnemy = gameData.getEnemy1vs1() !== undefined;
        
        // inizializzazione riferimenti agli elementi della griglia
        $scope.playerRobyImage = 'roby-positioned';
        $scope.enemyRobyImage  = 'enemy-positioned';
        robyAnimator.initializeElements(function (image) {
            scopeService.safeApply($scope, function () { $scope.playerRobyImage = image; });
        }, function (image) {
            scopeService.safeApply($scope, function () { $scope.enemyRobyImage = image; });
        });

        // inizializzazione start positions
        let setArrowCss = function(side, distance, over) {
            let finalResult = '';

            let arrowSide = '';
            switch(side) {
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

        let calculateAllStartPositionCss = function(over) {
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

        // inizializzazione timers
        let playerMatchTimerValue = gameData.getGeneral().timerSetting;
        $scope.playerMatchTimerText = gameData.formatTimeDecimals(playerMatchTimerValue);

        let enemyMatchTimerValue = gameData.getGeneral().timerSetting;
        $scope.enemyMatchTimerText =  gameData.formatTimeDecimals(enemyMatchTimerValue);

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
        switch(gameData.getGeneral().bootEnemySetting) {
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
        let startMatchTimers = function() {
            // avvia timer partita giocatore
            playerMatchTimer = setInterval(function () {
                playerMatchTimerValue -= 10;

                if (playerMatchTimerValue > 0) {
                    scopeService.safeApply($scope, function () {
                        $scope.playerMatchTimerText = gameData.formatTimeDecimals(playerMatchTimerValue);
                    });

                } else {
                    // timer esaurito: ferma tempo giocatore, avvia movimento giocatore-avversario
                    clearInterval(playerMatchTimer);
                    playerMatchTimer = undefined;

                    scopeService.safeApply($scope, function () {
                        $scope.showCompleteGrid = true;
                        $scope.showArrows = false;
                        $scope.playerPositioned = true;
                        $scope.playerMatchTimerText = gameData.formatTimeDecimals(0);
                        calculateAllStartPositionCss(false);
                    });

                    gameData.editPlayer({ match: { time: 0 } });

                    if ($scope.enemyPositioned && $scope.playerPositioned && gameData.getGeneral().bootEnemySetting !== 0) {
                        endMatch();
                    } else if ($scope.playerPositioned && gameData.getGeneral().bootEnemySetting === 0) {
                        endMatch();
                    }
                }
            }, 10);

            // avvia timer partita avversario
            if(gameData.getGeneral().bootEnemySetting !== 0) {
                enemyMatchTimer = setInterval(function () {
                    enemyMatchTimerValue -= 10;

                    if (enemyMatchTimerValue > 0 && enemyMatchTimerValue > positionEnemyTrigger) {
                        scopeService.safeApply($scope, function () {
                            $scope.enemyMatchTimerText = gameData.formatTimeDecimals(enemyMatchTimerValue);
                        });

                    } else if (enemyMatchTimerValue <= positionEnemyTrigger) {
                        // posiziona l'avversario se si supera il limite di tempo stabilito
                        if(gameData.getGeneral().bootEnemySetting !== 0 && !$scope.enemyPositioned) {
                            gameData.editEnemy1vs1({ match: { time: enemyMatchTimerValue } });
                            robyAnimator.calculateBootEnemyPath();

                            clearInterval(enemyMatchTimer);
                            enemyMatchTimer = undefined;
                            scopeService.safeApply($scope, function () {
                                $scope.enemyPositioned = true;
                                $scope.enemyMatchTimerText = gameData.formatTimeDecimals(enemyMatchTimerValue);
                            });
                        }
                    } else {
                        // timer esaurito: ferma tempo avversario
                        clearInterval(enemyMatchTimer);
                        enemyMatchTimer = undefined;

                        scopeService.safeApply($scope, function () {
                            $scope.enemyPositioned = true;
                            $scope.enemyMatchTimerText = gameData.formatTimeDecimals(0);
                        });

                        gameData.editEnemy1vs1({ match: { time: 0 } });
                    }
                }, 10);
            }
        };

        // inizializzazione draggable roby
        $scope.playerPositioned = false;
        $scope.enemyPositioned  = false;
        $scope.showCompleteGrid = false;
        $scope.showArrows = false;
        $scope.endMatch = false;
        $scope.dragging = false;
        $scope.draggableRobyImage = 'roby-idle';

        // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
        // modificata l'immagine di roby
        $scope.startDragging = function () {
            console.log("Start dragging");
            audioHandler.playSound('roby-drag');
            scopeService.safeApply($scope, function () {
                $scope.playerPositioned = false;
                $scope.showCompleteGrid = true;
                $scope.draggableRobyImage = 'roby-dragging-trasp';
                $scope.dragging = true;
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
                    $scope.playerPositioned = false;
                    $scope.showCompleteGrid = false;
                    $scope.dragging = false;
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
                gameData.editPlayer({
                    match: {
                        startPosition: { side: sideValue, distance: distanceValue },
                        time: playerMatchTimerValue
                    }
                });
                clearInterval(playerMatchTimer);

                // l'esecuzione avviene subito dopo endDragging(), e va quindi gestito in modo sicuro l'$apply
                scopeService.safeApply($scope, function () {
                    $scope.playerPositioned = true;
                    $scope.showCompleteGrid = true;
                });

                // posiziona l'avversario non appena viene posizionato roby
                if(gameData.getGeneral().bootEnemySetting !== 0 && !$scope.enemyPositioned) {
                    gameData.editEnemy1vs1({ match: { time: positionEnemyTrigger } });
                    robyAnimator.calculateBootEnemyPath();
                    clearInterval(enemyMatchTimer);
                    scopeService.safeApply($scope, function () {
                        $scope.enemyPositioned = true;
                        $scope.enemyMatchTimerText = gameData.formatTimeDecimals(positionEnemyTrigger);
                    });
                }

                robyAnimator.positionRoby('player');

                if ($scope.enemyPositioned && $scope.playerPositioned && gameData.getGeneral().bootEnemySetting !== 0) {
                    endMatch();
                } else if ($scope.playerPositioned && gameData.getGeneral().bootEnemySetting === 0) {
                    endMatch();
                }
            }
        };

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let endMatch = function () {
            if (!$scope.endMatch) {
                robyAnimator.positionRoby('player');

                if (enemyMatchTimer !== undefined)
                    clearInterval(enemyMatchTimer);

                if (playerMatchTimer !== undefined)
                    clearInterval(playerMatchTimer);

                if (startCountdownTimer !== undefined)
                    clearInterval(startCountdownTimer);

                if (gameData.getGeneral().bootEnemySetting !== 0)
                    robyAnimator.positionRoby('enemy');

                scopeService.safeApply($scope, function () {
                    $scope.endMatch = true;
                });

                robyAnimator.calculateResults();

                robyAnimator.animateAndFinish(function () {
                    robyAnimator.quitGame();
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
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.skip = function() {
            robyAnimator.quitGame();
            if ($scope.forceExitModal !== true)
                navigationHandler.goToPage($location, $scope, '/bootmp-aftermatch', false);
            audioHandler.playSound('menu-click');
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function() {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function(langKey) {
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