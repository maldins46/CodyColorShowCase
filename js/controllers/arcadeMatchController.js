/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('arcadeMatchCtrl',
    function ($scope, rabbit, gameData, scopeService, robyAnimator, $location, $translate, chatHandler,
              navigationHandler, audioHandler, sessionHandler, translationHandler) {
        console.log("Controller match ready.");

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

            rabbit.quitGame();
            robyAnimator.quitGame();
            chatHandler.clearChat();
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
        $scope.enemy  = gameData.getEnemy1vs1();

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
        audioHandler.playSound('countdown');
        $scope.startCountdownText = startCountdownValue.toString();
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
                    rabbit.sendPlayerPositionedMessage();

                    if ($scope.enemyPositioned && $scope.playerPositioned) {
                        endMatch();
                    }
                }
            }, 10);

            // avvia timer partita avversario
            enemyMatchTimer = setInterval(function () {
                enemyMatchTimerValue -= 10;

                if (enemyMatchTimerValue > 0) {
                    scopeService.safeApply($scope, function () {
                        $scope.enemyMatchTimerText = gameData.formatTimeDecimals(enemyMatchTimerValue);
                    });

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
                gameData.editPlayer({ match: {
                    startPosition: { side: sideValue, distance: distanceValue },
                    time: playerMatchTimerValue
                }});

                clearInterval(playerMatchTimer);
                rabbit.sendPlayerPositionedMessage();

                // l'esecuzione avviene subito dopo endDragging(), e va quindi gestito in modo sicuro l'$apply
                scopeService.safeApply($scope, function () {
                    $scope.playerPositioned = true;
                    $scope.showCompleteGrid = true;
                });

                robyAnimator.positionRoby('player');

                if ($scope.enemyPositioned && $scope.playerPositioned) {
                    endMatch();
                }
            }
        };

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositionedMessage: function (response) {
                gameData.editEnemy1vs1({
                    match: {
                        startPosition: { side: response.side, distance: response.distance },
                        time: response.matchTime
                    }});
                clearInterval(enemyMatchTimer);
                enemyMatchTimer = undefined;
                scopeService.safeApply($scope, function () {
                    $scope.enemyPositioned = true;
                    $scope.enemyMatchTimerText = gameData.formatTimeDecimals(response.matchTime);
                });

                if ($scope.enemyPositioned && $scope.playerPositioned) {
                    endMatch();
                }
            }, onQuitGameMessage: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });

            }, onSkipMessage: function () {
                gameData.editEnemy1vs1({ match: { skip: true }});

                if (gameData.getPlayer().match.skip && gameData.getEnemy1vs1().match.skip) {
                    robyAnimator.quitGame();
                    navigationHandler.goToPage($location, $scope, '/arcade-aftermatch', true);
                }
            }
        });

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let endMatch = function () {
            if (!$scope.endMatch) {
                robyAnimator.positionRoby('player');
                robyAnimator.positionRoby('enemy');

                if (enemyMatchTimer !== undefined)
                    clearInterval(enemyMatchTimer);

                if (playerMatchTimer !== undefined)
                    clearInterval(playerMatchTimer);

                if (startCountdownTimer !== undefined)
                    clearInterval(startCountdownTimer);

                scopeService.safeApply($scope, function () {
                    $scope.endMatch = true;
                });

                robyAnimator.calculateResults();

                robyAnimator.animateAndFinish(function () {
                    robyAnimator.quitGame();
                    if ($scope.forceExitModal !== true)
                        navigationHandler.goToPage($location, $scope, '/arcade-aftermatch', true);
                });
            }
        };

        // termina la partita alla pressione sul tasto corrispondente
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

        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
        };

        $scope.skip = function() {
            audioHandler.playSound('menu-click');
            rabbit.sendSkipMessage();
            gameData.editPlayer({ match: { skip:true }});
            $scope.askedForSkip = true;

            if (gameData.getPlayer().match.skip && gameData.getEnemy1vs1().match.skip) {
                robyAnimator.quitGame();
                navigationHandler.goToPage($location, $scope, '/arcade-aftermatch');
            }
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
