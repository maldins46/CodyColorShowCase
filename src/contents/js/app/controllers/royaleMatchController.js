/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('royaleMatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'chatHandler', 'navigationHandler', 'audioHandler', 'sessionHandler',
    'translationHandler', 'authHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate, chatHandler,
              navigationHandler, audioHandler, sessionHandler, translationHandler, authHandler) {
        console.log("Controller match ready.");

        let startCountdownTimer;
        let gameTimer;

        // metodo per terminare la partita in modo sicuro, disattivando i timer,
        // interrompendo animazioni e connessioni con il server
        let quitGame = function () {
            if (startCountdownTimer !== undefined) {
                clearInterval(startCountdownTimer);
                startCountdownTimer = undefined;
            }

            if (gameTimer !== undefined) {
                clearInterval(gameTimer);
                gameTimer = undefined;
            }

            rabbit.quitGame();
            pathHandler.quitGame();
            chatHandler.clearChat();
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        gameData.getAllPlayers().sort(function (a, b) {
            return b.points - a.points;
        });

        // inizializzazione componenti generali interfaccia
        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.players = gameData.getAllPlayers();
        $scope.userPlayer = gameData.getBotPlayer();
        $scope.timerFormatter = gameData.formatTimeDecimals;
        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();

        for (let i = 0; i < gameData.getAllPlayers().length; i++) {
            gameData.editPlayer({
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

        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
        // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
        // a tab inattivo
        let startMatchTimers = function () {
            let gameTimerValue = gameData.getGeneral().timerSetting;
            let interval = 10; // ms
            let expected = Date.now() + interval;
            gameTimer = setTimeout(step, interval);

            function step() {
                let drift = Date.now() - expected;
                if (drift > interval) {
                    console.log("Timer lagged!")
                }

                gameTimerValue -= (interval + drift);
                let finish = gameTimerValue <= 0 || allPositioned();

                scopeService.safeApply($scope, function () {
                    for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                        let currentPlayer = gameData.getAllPlayers()[i];
                        if (currentPlayer.match.time === -1) {
                            currentPlayer.match.timerValue = gameTimerValue;

                            if (finish) {
                                currentPlayer.match.positioned = true;
                                currentPlayer.match.timerValue = 0;
                                currentPlayer.match.time = 0;

                                if (currentPlayer.userPlayer) {
                                    $scope.showCompleteGrid = true;
                                    $scope.showArrows = false;
                                    $scope.showDraggableRoby = false;
                                    calculateAllStartPositionCss(false);
                                    rabbit.sendPlayerPositionedMessage();
                                }
                            }
                        }
                    }
                });

                if (!finish) {
                    expected = Date.now() + interval;
                    gameTimer = setTimeout(step, interval); // take into account drift
                }
            }
        };

        let allPositioned = function () {
            let allPositioned = true;
            for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                if (gameData.getAllPlayers()[i].match.positioned !== true) {
                    allPositioned = false;
                }
            }
            return allPositioned;
        };

        // inizializzazione draggable roby
        $scope.showCompleteGrid = false;
        $scope.showArrows = false;
        $scope.startAnimation = false;
        $scope.draggableRobyImage = 'roby-idle';

        // quando roby viene trascinato, viene mostrata la griglia completa (con le posizioni di partenza), e
        // modificata l'immagine di roby
        $scope.startDragging = function () {
            console.log("Start dragging");
            audioHandler.playSound('roby-drag');
            scopeService.safeApply($scope, function () {
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
            if (!$scope.startAnimation) {
                scopeService.safeApply($scope, function () {
                    $scope.showArrows = false;
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
            if (!$scope.startAnimation) {
                scopeService.safeApply($scope, function () {
                    gameData.editPlayer({
                        match: {
                            startPosition: {side: sideValue, distance: distanceValue},
                            time: gameData.getBotPlayer().match.timerValue,
                            positioned: true
                        }
                    });
                    $scope.showDraggableRoby = false;
                });
                pathHandler.positionRoby(true, gameData.getBotPlayer().match.startPosition);
                rabbit.sendPlayerPositionedMessage();
            }
        };

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositioned: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.getPlayerById(message.playerId).match.timerValue = message.matchTime;
                    gameData.getPlayerById(message.playerId).match.time = message.matchTime;
                    gameData.getPlayerById(message.playerId).match.positioned = true;
                });

            }, onPlayerRemoved: function (message) {
                if (message.removedPlayerId === gameData.getBotPlayer().playerId) {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });

                } else {
                    scopeService.safeApply($scope, function () {
                        gameData.syncGameData(message.gameData);
                    });
                }

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                    $scope.forceExitModal = true;
                });

            }, onStartAnimation: function (message) {
                gameData.syncGameData(message.gameData);
                startAnimation();

            }, onEndMatch: function (message) {
                gameData.syncGameData(message.gameData);
                pathHandler.quitGame();
                if ($scope.forceExitModal !== true) {
                    scopeService.safeApply($scope, function () {
                        navigationHandler.goToPage($location, '/royale-aftermatch');
                    });
                }
            }
        });

        // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
        let startAnimation = function () {
            if (!$scope.startAnimation) {
                for (let i = 0; i < gameData.getEnemyPlayers().length; i++){
                    pathHandler.positionRoby(false, gameData.getEnemyPlayers()[i].match.startPosition);
                }

                scopeService.safeApply($scope, function () {
                    $scope.startAnimation = true;
                });

                pathHandler.calculateAllPlayersPath();
                gameData.calculateRoyaleMatchPoints();

                pathHandler.animateActiveRobys(function () {
                     if ($scope.askedForSkip !== true) {
                         // ricalcola path (in caso di abbandono di avversari)
                         pathHandler.calculateAllPlayersPath();
                         gameData.calculateRoyaleMatchPoints();
                         rabbit.sendEndAnimationMessage();
                     }
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
            rabbit.sendPlayerQuitRequest();
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };

        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, '/home');
        };

        $scope.skip = function () {
            audioHandler.playSound('menu-click');
            rabbit.sendEndAnimationMessage();
            $scope.askedForSkip = true;
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

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);
