/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('matchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler) {
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
            scopeService.safeApply($scope, function () {
                navigationHandler.goToPage($location, '/mmaking');
            });
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
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
                        // ad ogni step, aggiorna il valore del timer visualizzato del bot
                        gameData.getBotPlayer().match.timerValue = gameTimerValue;

                        // se si supera il time trigger, posiziona il bot
                        if (gameData.getBotPlayer().match.timerValue <= positionEnemyTrigger) {
                            gameData.getBotPlayer().match.positioned = true;
                            gameData.getBotPlayer().match.time       = positionEnemyTrigger;
                            gameData.getBotPlayer().match.timerValue = positionEnemyTrigger;
                            pathHandler.calculateBotPlayerPath();
                            rabbit.sendPlayerPositionedMessage();
                        }
                    }

                    if (gameData.getEnemyPlayer1vs1().match.time === -1) {
                        // ad ogni step, aggiorna il valore del timer visualizzato dell'enemyPlayer
                        gameData.getEnemyPlayer1vs1().match.timerValue = gameTimerValue;

                        // se il valore del timer raggiunge lo zero, piazza il giocatore
                        if (finish) {
                            gameData.getEnemyPlayer1vs1().match.positioned = true;
                            gameData.getEnemyPlayer1vs1().match.time       = 0;
                            gameData.getEnemyPlayer1vs1().match.timerValue = 0;
                        }
                    }
                });

                // se non tutti i giocatori sono piazzati, o non si è raggiunto lo 0, prepara il possimo timer
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

        $scope.startAnimation = false;
        let endAnimationSent = false;

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositioned: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.getEnemyPlayer1vs1().match.timerValue = message.matchTime;
                    gameData.getEnemyPlayer1vs1().match.time       = message.matchTime;
                    gameData.getEnemyPlayer1vs1().match.positioned = true;

                    if (!gameData.getBotPlayer().match.positioned) {
                        gameData.getBotPlayer().match.time       = positionEnemyTrigger;
                        gameData.getBotPlayer().match.timerValue = positionEnemyTrigger;
                        gameData.getBotPlayer().match.positioned = true;
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
                            endAnimationSent = true;
                            rabbit.sendEndAnimationMessage();
                        }
                    });
                }

            }, onEndAnimation: function () {
                if (!endAnimationSent) {
                    endAnimationSent = true;
                    rabbit.sendEndAnimationMessage();
                }

            }, onEndMatch: function (message) {
                gameData.syncGameData(message.gameData);
                pathHandler.quitGame();

                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/aftermatch');
                });
            }
        });
    }
]);
