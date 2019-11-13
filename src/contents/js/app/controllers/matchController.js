/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('matchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler) {

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
            navigationHandler.goToPage($location, '/mmaking');
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        pathHandler.initialize($scope);
        $scope.user = gameData.getUser();
        $scope.enemy  = gameData.getEnemy();
        $scope.match = gameData.getMatch();
        $scope.userGlobal = gameData.getUserGlobalResult();
        $scope.enemyGlobal = gameData.getEnemyGlobalResult();
        $scope.userTimerValue = gameData.getGeneral().timerSetting;
        $scope.enemyTimerValue = gameData.getGeneral().timerSetting;
        $scope.userTimerAnimation = '';
        $scope.enemyTimerAnimation = '';
        let nextGameTimerValue = gameData.getGeneral().timerSetting;

        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.timerFormatter = gameData.formatTimeDecimals;
        $scope.finalTimeFormatter = gameData.formatTimeDecimals;

        $scope.startAnimation = false;
        let endAnimationSent = false;

        let startCountdownValue = 3;
        audioHandler.playSound('countdown');
        $scope.startCountdownText = startCountdownValue.toString();
        $scope.countdownInProgress = true;

        // il tempo di gioco del bot
        let positionEnemyTrigger = gameData.getGeneral().timerSetting / 2;

        // il percorso del bot può essere calcolato subito
        let botPath = pathHandler.calculateBotPath(gameData.getGeneral().botSetting);
        gameData.editMatch({
            time: positionEnemyTrigger,
            startPosition: botPath.startPosition
        });

        // inizializzazione tiles
        $scope.tilesCss = new Array(5);
        for (let x = 0; x < 5; x++) {
            $scope.tilesCss[x] = new Array(5);
            for (let y = 0; y < 5; y++) {
                switch (gameData.getMatch().tiles[x][y]) {
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

        startCountdownTimer = setInterval(function () {
            scopeService.safeApply($scope, function () {
                startCountdownValue--;
                if (startCountdownValue > 0) {
                    audioHandler.playSound('countdown');
                    $scope.startCountdownText = startCountdownValue.toString();

                } else if (startCountdownValue === 0) {
                    audioHandler.playSound('start');
                    $scope.startCountdownText = "Let's Cody!";

                } else {
                    // interrompi countdown e mostra schermata di gioco
                    clearInterval(startCountdownTimer);
                    startCountdownTimer = undefined;
                    $scope.countdownInProgress = false;
                    startMatchTimers();
                }
            });
        }, 1000);


        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
        // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
        // a tab inattivo
        let startMatchTimers = function () {
            let interval = 10; // ms
            let expected = Date.now() + interval;
            gameTimer = setTimeout(step, interval);

            function step() {
                scopeService.safeApply($scope, function () {
                    let drift = Date.now() - expected;
                    if (drift > interval) {
                        console.log("Timer lagged!")
                    }
                    nextGameTimerValue -= (interval + drift);

                    if (nextGameTimerValue > 0) {
                        // condizione di decremento ordinario

                        // fai avanzare il timer visivo
                        if (!gameData.getMatch().positioned)
                            $scope.userTimerValue = nextGameTimerValue;

                        if (!gameData.getMatch().enemyPositioned)
                            $scope.enemyTimerValue = nextGameTimerValue;

                        // animazione degli ultimi 10 secondi
                        if ($scope.userTimerValue < 10000 && !gameData.getMatch().positioned)
                            $scope.userTimerAnimation = "clock-ending-animation";

                        if ($scope.enemyTimerValue < 10000 && !gameData.getMatch().enemyPositioned)
                            $scope.enemyTimerAnimation = "clock-ending-animation";

                        // piazza il bot user se si raggiunge il trigger
                        if ($scope.userTimerValue <= positionEnemyTrigger && !gameData.getMatch().enemyPositioned) {
                            gameData.editMatch({
                                positioned: true
                            });
                            $scope.userTimerValue = gameData.getMatch().time;
                            $scope.userTimerAnimation = "clock--end";
                            rabbit.sendPlayerPositionedMessage();
                        }

                        // schedula nuovo decremento se necessario
                        if (!$scope.startAnimation) {
                            expected = Date.now() + interval;
                            gameTimer = setTimeout(step, interval); // take into account drift
                        } else {
                            nextGameTimerValue = 0;
                        }

                    } else {
                        // animazione iniziata o fine del tempo

                        // se l'avversario non si è ancora posizionato, ferma il suo
                        // timer in attesa del messaggio positioned
                        if (!gameData.getMatch().enemyPositioned) {
                            $scope.enemyTimerAnimation = "clock--end";
                            $scope.enemyTimerValue = 0;
                        }

                        // non rinnovare il nextTimerValue e il trigger
                    }
                });
            }
        };

        // callback passati alla classe responsabile della comunicazione con il broker.
        // Invocati all'arrivo di nuovi messaggi
        rabbit.setPageCallbacks({
            onEnemyPositioned: function (message) {
                scopeService.safeApply($scope, function () {
                    // piazza l'enemy player
                    gameData.editMatch({
                        enemyTime: message.matchTime,
                        enemyPositioned: true
                    });
                    $scope.enemyTimerAnimation = "clock--end";
                    $scope.enemyTimerValue = message.matchTime;

                    // piazza il bot user se il il trigger non è ancora scattato
                    if (!gameData.getMatch().positioned) {
                        gameData.editMatch({
                            positioned: true
                        });
                        $scope.userTimerValue = gameData.getMatch().time;
                        $scope.userTimerAnimation = "clock--end";
                        rabbit.sendPlayerPositionedMessage();
                    }
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onStartAnimation: function (message) {
                scopeService.safeApply($scope, function () {
                    $scope.startAnimation = true;

                    // posiziona tutti i roby
                    pathHandler.positionRoby(true, gameData.getMatch().startPosition);
                    pathHandler.positionAllEnemies(message.startPositions);

                    // avvia le animazioni; al termine, invia il messaggio di endAnimation
                    pathHandler.animateActiveRobys(function () {
                        if (!endAnimationSent) {
                            endAnimationSent = true;
                            rabbit.sendEndAnimationMessage();
                        }
                    });
                });

            }, onEndAnimation: function (message) {
                scopeService.safeApply($scope, function () {
                    if (message.playerId !== gameData.getUser().playerId && !endAnimationSent) {
                        endAnimationSent = true;
                        rabbit.sendEndAnimationMessage();
                    }
                });

            }, onEndMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated(message.aggregated);
                    gameData.editMatch({ winnerId: message.winnerId });
                    gameData.editMatchRanking(message.matchRanking);
                    gameData.editGlobalRanking(message.globalRanking);

                    pathHandler.quitGame();
                    navigationHandler.goToPage($location, '/aftermatch');
                });
            }
        });
    }
]);
