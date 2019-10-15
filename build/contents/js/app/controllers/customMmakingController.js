/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('customMmakingCtrl',
    ['$scope', 'rabbit', 'navigationHandler', '$translate', 'translationHandler', 'audioHandler', '$location',
     'sessionHandler', 'gameData', 'scopeService', 'settings',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler, audioHandler, $location,
              sessionHandler, gameData, scopeService, settings) {
        console.log("New match custom controller ready.");

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

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

        let restartInterval = undefined;
        let quitGame = function() {
            if(restartInterval !== undefined) {
                clearInterval(restartInterval);
            }
            restartInterval = undefined;
            rabbit.quitGame();
            gameData.initializeGameData();
            initializeMatch();
        };

        let requiredDelayedGameRequest = false;
        let initializeMatch = function() {
            changeScreen(screens.waiting);
            gameData.getGeneral().gameType = gameData.getGameTypes().custom;
            gameData.getBotPlayer().nickname = "CodyColor";
            gameData.getBotPlayer().organizer = true;
            $scope.generalData = gameData.getGeneral();
            $scope.userPlayer = gameData.getBotPlayer();
            $scope.baseUrl = settings.webBaseUrl;
            $scope.matchUrl = '';

            $scope.connected = rabbit.getBrokerConnectionState();
            if (!$scope.connected) {
                rabbit.connect();
                requiredDelayedGameRequest = true;
            } else {
                // connessione già pronta: richiedi i dati della battle al server
                rabbit.sendGameRequest();
            }
        };

        initializeMatch();

        rabbit.setPageCallbacks({
            onConnected: function () {
                if (requiredDelayedGameRequest) {
                    rabbit.sendGameRequest();
                    requiredDelayedGameRequest = false;
                }

            }, onGeneralInfoMessage: function() {
                if (!sessionHandler.isClientVersionValid()) {
                    // azione in caso di outdated version
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    // richiesta non accettata dal server; rinviala dopo 10 secondi
                    restartInterval = setInterval(function () {
                        initializeMatch();
                    }, 5000);

                } else {
                    gameData.getGeneral().gameRoomId = message.gameRoomId;
                    gameData.getBotPlayer().playerId = message.playerId;
                    gameData.syncGameData(message.gameData);
                    rabbit.subscribeGameRoom();
                    $scope.matchUrl = settings.webBaseUrl + '/#!?custom=' + gameData.getGeneral().code;
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
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                quitGame();

            }, onConnectionLost: function () {
                quitGame();
            }
        });

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
]);