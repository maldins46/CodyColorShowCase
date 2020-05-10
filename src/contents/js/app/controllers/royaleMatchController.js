/*
 * Controller responsabile della schermata partita
 */
angular.module('codyColor').controller('royaleMatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    'pathHandler', '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler', 'authHandler',
    function ($scope, rabbit, gameData, scopeService, pathHandler, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, authHandler) {

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
            navigationHandler.goToPage($location, fullExit === true ? '/create' : '/royale-mmaking');
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().name;
        }

        $scope.showDraggableRoby = true;
        pathHandler.initialize($scope);
        $scope.general = gameData.getGeneral();
        $scope.aggregated = gameData.getAggregated();
        $scope.user = gameData.getUser();
        $scope.match = gameData.getMatch();
        $scope.timerFormatter = gameData.formatTimeMatchClock;
        $scope.finalTimeFormatter = gameData.formatTimeDecimals;
        $scope.gameTimerValue = gameData.getGeneral().timerSetting;
        let nextGameTimerValue = gameData.getGeneral().timerSetting;

        $scope.playerRoby = pathHandler.getPlayerRoby();
        $scope.enemiesRoby = pathHandler.getEnemiesRoby();
        $scope.clockAnimation = "";

        $scope.startAnimation = false;
        let endAnimationSent = false;


        // il tempo di gioco del bot
        let positionBotTrigger = gameData.getGeneral().timerSetting / 2;

        // il percorso del bot può essere calcolato subito
        let botPath = pathHandler.calculateBotPath(gameData.getGeneral().botSetting);
        gameData.editMatch({
            time: positionBotTrigger,
            startPosition: botPath.startPosition
        });

        gameData.editMatch({
            positioned: true
        });
        rabbit.sendPlayerPositionedMessage();

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

        let startCountdownValue = 3;
        audioHandler.playSound('countdown');
        $scope.startCountdownText = startCountdownValue.toString();
        $scope.countdownInProgress = true;
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
                    startMatchTimer();
                }
            });
        }, 1000);

        // avvia i timer per visualizzare tempo rimanente di giocatore e avversario; questo timer non utilizza
        // direttamente la funzione setInterval(), ma implementa un procedimento per evitare l'interruzione del tempo
        // a tab inattivo
        let startMatchTimer = function () {
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
                        $scope.gameTimerValue = nextGameTimerValue;

                        // animazione degli ultimi 10 secondi
                        if ($scope.gameTimerValue < 10000)
                            $scope.clockAnimation = "clock-ending-animation";

                        // piazza il bot user se si raggiunge il trigger
                        /*if ($scope.gameTimerValue <= positionBotTrigger && !gameData.getMatch().positioned) {
                            gameData.editMatch({
                                positioned: true
                            });
                            rabbit.sendPlayerPositionedMessage();
                        }*/

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
            onEnemyPositioned: function () {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated({
                        positionedPlayers: gameData.getAggregated().positionedPlayers + 1
                    });
                });

                // piazza il bot se il trigger non è ancora scattato, e se tutti gli utenti sono stati piazzati
                /*if (!gameData.getMatch().positioned
                    && gameData.getAggregated().positonedPlayers >= gameData.getAggregated().connectedPlayers - 1) {
                    gameData.editMatch({
                        positioned: true
                    });
                    rabbit.sendPlayerPositionedMessage();
                }*/

            }, onPlayerRemoved: function (message) {
                scopeService.safeApply($scope, function () {
                    if (message.removedPlayerId === gameData.getUser().playerId) {
                        quitGame();

                    } else {
                        gameData.editAggregated(message.aggregated);
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
                    $scope.clockAnimation = "clock--end";
                    gameData.editAggregated(message.aggregated);

                    // posiziona tutti gli enemy roby
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

                    // aggiorna i risultati dell'utente
                    if (gameData.getMatch().winnerId === gameData.getUser().playerId) {
                        gameData.editUserMatchResult( {
                            points: gameData.getUserMatchResult().points
                                + gameData.calculateWinnerBonusPoints(gameData.getUserMatchResult().time)
                        })
                    }

                    gameData.editUserGlobalResult({
                        nickname: gameData.getUser().nickname,
                        playerId: gameData.getUser().playerId,
                        points: gameData.getUserGlobalResult().points + gameData.getUserMatchResult().points
                    });

                    pathHandler.quitGame();
                    navigationHandler.goToPage($location, '/royale-aftermatch');
                });
            }
        });

        $scope.exitGame = function() {
            rabbit.sendPlayerQuitRequest();
            quitGame(true);
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };

        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };

        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);
