/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('mmakingCtrl',
    ['$scope', 'rabbit', 'navigationHandler', '$translate', 'translationHandler', 'audioHandler', '$location',
     'sessionHandler', 'gameData', 'scopeService', 'settings',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler, audioHandler, $location,
              sessionHandler, gameData, scopeService, settings) {
        console.log("Matchmaking controller ready.");

        let restartTimer = undefined;

        let quitGame = function() {
            rabbit.quitGame();
            rabbit.setPageCallbacks(rabbitCallbacks);
            initializeMatch();
        };

        let initializeMatch = function() {
            changeScreen(screens.waiting);
            if (restartTimer !== undefined) {
                clearTimeout(restartTimer);
            }
            restartTimer = undefined;
            gameData.initializeGameData();
            gameData.getGeneral().gameType = gameData.getGameTypes().custom;
            gameData.getGeneral().timerSetting = gameData.getFixedSetting().timerSetting;
            gameData.getBotPlayer().nickname = gameData.getFixedSetting().botName;
            gameData.getBotPlayer().organizer = true;
            $scope.generalData = gameData.getGeneral();
            $scope.userPlayer = gameData.getBotPlayer();

            $scope.connected = rabbit.getServerConnectionState();
            if ($scope.connected)
                rabbit.sendGameRequest();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // cambia schermata in modo 'sicuro', evitando flickering durante le animazioni
        let changeScreen = function(newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.mmakingState = screens.loadingScreen;
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.mmakingState = newScreen;
                });
            }, 200);
        };

        const screens = {
            loadingScreen: 'loadingScreen',
            waiting:       'waiting',
            matchReady:    'matchReady',
            enemyReady:    'enemyReady'
        };
        $scope.screens = screens;

        initializeMatch();
        $scope.requestRefused = false;

        let rabbitCallbacks = {
            onConnected: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                    rabbit.sendGameRequest();
                });

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() !== '0000') {
                    scopeService.safeApply($scope, function () {
                        gameData.getGeneral().gameRoomId = message.gameRoomId;
                        gameData.getBotPlayer().playerId = message.playerId;
                        gameData.syncGameData(message.gameData);
                        $scope.requestRefused = false;
                        $scope.matchUrl = settings.webBaseUrl + '/#!?custom=' + gameData.getGeneral().code;
                        rabbit.subscribeGameRoom();
                        changeScreen(screens.matchReady);
                    });
                } else {
                    // richiesta non accettata dal server; rinviala dopo 10 secondi
                    scopeService.safeApply($scope, function () {
                        $scope.requestRefused = true;
                        restartTimer = setTimeout(function () {
                            scopeService.safeApply($scope, function () {
                                initializeMatch();
                            });
                        }, 5000);
                    });
                }

            }, onPlayerAdded: function(message) {
                scopeService.safeApply($scope, function () {
                    audioHandler.playSound('enemy-found');
                    gameData.syncGameData(message.gameData);
                    $scope.enemyPlayer = gameData.getEnemyPlayer1vs1();
                    rabbit.sendReadyMessage();
                    changeScreen(screens.enemyReady);
                });

            }, onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    gameData.getEnemyPlayer1vs1().ready = true;
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.syncGameData(message.gameData);
                    navigationHandler.goToPage($location, '/match');
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                    quitGame();
                });
            }
        };
        rabbit.setPageCallbacks(rabbitCallbacks);
    }
]);