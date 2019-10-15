/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('arcadeMatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler',
    'translationHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, translationHandler) {
        console.log("Controller arcade match ready.");

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
            gameData.initializeGameData();
            scopeService.safeApply($scope, function () {
                navigationHandler.goToPage($location, '/');
            });
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            return;
        }

        pathHandler.initialize($scope);
        $scope.player = gameData.getBotPlayer();
        $scope.enemy  = gameData.getEnemyPlayer1vs1();
        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.timerFormatter = gameData.formatTimeDecimals;

        // inizializzazione componenti generali interfaccia
        gameData.getBotPlayer().match.timerValue = gameData.getGeneral().timerSetting;
        gameData.getEnemyPlayer1vs1().match.timerValue = gameData.getGeneral().timerSetting;

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

        // il tempo di gioco del bot, che viene fissato a seconda della difficoltà
        let positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;

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
                    if (gameData.getBotPlayer().match.time === -1) {
                        gameData.getBotPlayer().match.timerValue = gameTimerValue;

                        if (gameData.getBotPlayer().match.timerValue <= positionEnemyTrigger) {
                            // posiziona l'avversario se si supera il limite di tempo stabilito
                            gameData.getBotPlayer().match.positioned = true;
                            gameData.getBotPlayer().match.time = positionEnemyTrigger;
                            gameData.getBotPlayer().match.timerValue = positionEnemyTrigger;
                            pathHandler.calculateBotPlayerPath();
                            rabbit.sendPlayerPositionedMessage();
                        }
                    }

                    if (gameData.getEnemyPlayer1vs1().match.time === -1) {
                        gameData.getEnemyPlayer1vs1().match.timerValue = gameTimerValue;

                        if (finish) {
                            gameData.getEnemyPlayer1vs1().match.positioned = true;
                            gameData.getEnemyPlayer1vs1().match.timerValue = 0;
                            gameData.getEnemyPlayer1vs1().match.time = 0;

                            $scope.showCompleteGrid = true;
                            $scope.showArrows = false;
                            calculateAllStartPositionCss(false);
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


        let endAnimationSent = false;

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositioned: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.getEnemyPlayer1vs1().match.timerValue = message.matchTime;
                    gameData.getEnemyPlayer1vs1().match.time = message.matchTime;
                    gameData.getEnemyPlayer1vs1().match.positioned = true;

                    if (!gameData.getBotPlayer().match.positioned) {
                        gameData.getBotPlayer().match.positioned = true;
                        gameData.getBotPlayer().match.time = positionEnemyTrigger;
                        gameData.getBotPlayer().match.timerValue = positionEnemyTrigger;
                        pathHandler.calculateBotPlayerPath();
                        rabbit.sendPlayerPositionedMessage();
                    }
                });

            }, onGameQuit: function () {
                quitGame();

            }, onConnectionLost: function () {
                quitGame();

            }, onStartAnimation: function (message) {
                gameData.syncGameData(message.gameData);
                if (!$scope.startAnimation) {
                    scopeService.safeApply($scope, function () {
                        $scope.showCompleteGrid = true;
                        $scope.startAnimation = true;
                    });

                    pathHandler.positionRoby(true, gameData.getBotPlayer().match.startPosition);
                    pathHandler.positionRoby(false, gameData.getEnemyPlayer1vs1().match.startPosition);

                    pathHandler.calculateAllPlayersPath();
                    gameData.calculateArcadeMatchPoints();
                    if (gameData.getMatchWinner().userPlayer === true)
                        gameData.getBotPlayer().wonMatches++;

                    pathHandler.animateActiveRobys(function () {
                        if (!endAnimationSent) {
                            rabbit.sendEndAnimationMessage();
                            endAnimationSent = true;
                        }

                    });
                }
            }, onEndAnimation: function (message) {
                if (!endAnimationSent) {
                    rabbit.sendEndAnimationMessage();
                    endAnimationSent = true;
                }

            }, onEndMatch: function (message) {
                gameData.syncGameData(message.gameData);
                pathHandler.quitGame();
                if ($scope.forceExitModal !== true) {
                    scopeService.safeApply($scope, function () {
                        navigationHandler.goToPage($location, '/arcade-aftermatch');
                    });
                }
            }
        });
    }
]);
