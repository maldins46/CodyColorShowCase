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
        $scope.matchUrl = '';

        let quitGame = function() {
            if (restartTimer !== undefined) {
                clearTimeout(restartTimer);
            }
            restartTimer = undefined;

            rabbit.quitGame();
            initializeMatch();
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

        let initializeMatch = function() {
            changeScreen(screens.waiting);
            restartTimer = undefined;
            gameData.initializeGameData();
            gameData.getGeneral().gameType = gameData.getGameTypes().custom;
            gameData.getGeneral().timerSetting = gameData.getFixedSetting().timerSetting;
            gameData.getBotPlayer().nickname = gameData.getFixedSetting().botName;
            gameData.getBotPlayer().organizer = true;
            $scope.generalData = gameData.getGeneral();
            $scope.userPlayer = gameData.getBotPlayer();
            $scope.matchUrl = settings.webBaseUrl;
            $scope.connected = rabbit.getBrokerConnectionState();

            if (!$scope.connected) {
                rabbit.connect();
            } else {
                rabbit.sendGameRequest();
            }
        };

        initializeMatch();

        $scope.requestRefused = false;
        rabbit.setPageCallbacks({
            onConnected: function () {
                rabbit.sendGameRequest();

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    // richiesta non accettata dal server; rinviala dopo 10 secondi
                    scopeService.safeApply($scope, function () {
                        $scope.requestRefused = true;
                    });

                    restartTimer = setTimeout(function () {
                        initializeMatch();
                    }, 5000);

                } else {
                    gameData.getGeneral().gameRoomId = message.gameRoomId;
                    gameData.getBotPlayer().playerId = message.playerId;
                    gameData.syncGameData(message.gameData);
                    rabbit.subscribeGameRoom();
                    scopeService.safeApply($scope, function () {
                        $scope.requestRefused = false;
                        $scope.matchUrl = settings.webBaseUrl + '/#!?custom=' + gameData.getGeneral().code;
                    });

                    changeScreen(screens.matchReady);
                }

            }, onPlayerAdded: function(message) {
                audioHandler.playSound('enemy-found');
                scopeService.safeApply($scope, function () {
                    gameData.syncGameData(message.gameData);
                    $scope.enemyPlayer = gameData.getEnemyPlayer1vs1();
                });
                rabbit.sendReadyMessage();
                changeScreen(screens.enemyReady);

            }, onReadyMessage: function () {
                gameData.getEnemyPlayer1vs1().ready = true;

            }, onStartMatch: function (message) {
                gameData.syncGameData(message.gameData);
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/match');
                });

            }, onGameQuit: function () {
                quitGame();

            }, onConnectionLost: function () {
                quitGame();
            }
        });
    }
]);