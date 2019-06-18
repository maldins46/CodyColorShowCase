/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('royaleMatchCtrl',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate, chatHandler,
              navigationHandler, audioHandler, sessionHandler, translationHandler) {
        console.log("Controller match ready.");

        let startCountdownTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            rabbit.quitGame();
            pathHandler.quitGame();
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

        gameData.getAllPlayers().sort(function (a, b) {
            return a.points - b.points;
        });

        // inizializzazione componenti generali interfaccia
        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.players = gameData.getAllPlayers();
        $scope.userPlayer = gameData.getUserPlayer();
        $scope.timerFormatter = gameData.formatTimeDecimals;
        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();

        for (let i = 0; i < gameData.getAllPlayers().length; i++) {
            gameData.editPlayer({
                ranking: (i + 1).toString() + ".",
                match: { timerValue: gameData.getGeneral().timerSetting  }
            }, gameData.getAllPlayers()[i].playerId);
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
        let startMatchTimers = function () {
            for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                let currentPlayer = gameData.getAllPlayers()[i];
                currentPlayer.match.timer = setInterval(function () {
                    scopeService.safeApply($scope, function () {
                        currentPlayer.match.timerValue -= 10;
                    });

                    if (currentPlayer.match.timerValue <= 0) {
                        scopeService.safeApply($scope, function () {
                            clearInterval(currentPlayer.match.timer);
                            gameData.editPlayer({
                                match: {
                                    positioned: true,
                                    time: 0,
                                    timerValue: 0,
                                    timer: undefined
                                }
                            }, currentPlayer.playerId);
                        });

                        if (currentPlayer.playerId === gameData.getUserPlayer().playerId) {
                            scopeService.safeApply($scope, function () {
                                $scope.showCompleteGrid = true;
                                $scope.showArrows = false;
                                $scope.showDraggableRoby = false;
                                calculateAllStartPositionCss(false);
                            });
                            rabbit.sendPlayerPositionedMessage();
                            // pathHandler.positionRoby(true, gameData.getUserPlayer().match.startPosition);

                            if (allPlayersPositioned())
                                endMatch();
                        }
                    }
                }, 10);
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
            console.log("Start dragging");
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
            $scope.showCompleteGrid = true;
            if (!$scope.endMatch) {
                clearInterval(gameData.getUserPlayer().match.timer);
                scopeService.safeApply($scope, function () {
                    gameData.editPlayer({
                        match: {
                            startPosition: {side: sideValue, distance: distanceValue},
                            time: gameData.getUserPlayer().match.timerValue,
                            positioned: true,
                            timer: undefined
                        }
                    });
                    $scope.showDraggableRoby = false;
                });
                pathHandler.positionRoby(true, gameData.getUserPlayer().match.startPosition);
                rabbit.sendPlayerPositionedMessage();

                if (allPlayersPositioned())
                    endMatch();
            }
        };

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositionedMessage: function (message) {
                clearInterval(gameData.getPlayerById(message.playerId).match.timer);
                scopeService.safeApply($scope, function () {
                    gameData.editPlayer({
                        match: {
                            startPosition: {side: message.side, distance: message.distance},
                            timerValue: message.matchTime,
                            time: message.matchTime,
                            positioned: true,
                            timer: undefined
                        }
                    }, message.playerId);
                });

                if (allPlayersPositioned())
                    endMatch();

            }, onQuitGameMessage: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.removeEnemy(message.playerId)
                });

                if (gameData.getAllPlayers().length <= 1 ) {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });
                    quitGame();
                }

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });
                quitGame();

            }, onSkipMessage: function (message) {
                gameData.editPlayer({match: {skip: true}}, message.playerId);

                let allSkip = true;
                for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                    if (gameData.getAllPlayers()[i].match.skip === false) {
                        allSkip = false;
                        break;
                    }
                }
                if (allSkip) {
                    pathHandler.quitGame();
                    navigationHandler.goToPage($location, $scope, '/royale-aftermatch', true);
                }
            }
        });

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let endMatch = function () {
            if (!$scope.endMatch) {
                for (let i = 0; i < gameData.getEnemies().length; i++) {
                    pathHandler.positionRoby(false, gameData.getEnemies()[i].match.startPosition);
                }

                scopeService.safeApply($scope, function () {
                    $scope.endMatch = true;
                });

                pathHandler.calculatePaths();
                gameData.calculateMatchPoints();
                pathHandler.animateActiveRobys(function () {
                    pathHandler.quitGame();
                    if ($scope.forceExitModal !== true)
                        navigationHandler.goToPage($location, $scope, '/royale-aftermatch', true);
                });
            }
        };

        // termina la partita alla pressione sul tasto corrispondente
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

        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
        };

        $scope.skip = function () {
            audioHandler.playSound('menu-click');
            rabbit.sendSkipMessage();
            gameData.editPlayer({match: {skip: true}});
            $scope.askedForSkip = true;

            let allSkip = true;
            for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                if (gameData.getAllPlayers()[i].match.skip === false) {
                    allSkip = false;
                    break;
                }
            }
            if (allSkip) {
                pathHandler.quitGame();
                navigationHandler.goToPage($location, $scope, '/royale-aftermatch', false);
            }
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
