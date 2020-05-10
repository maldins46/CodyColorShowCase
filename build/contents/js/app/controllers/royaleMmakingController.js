/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('royaleMmakingCtrl',
    ['$scope', 'rabbit', 'navigationHandler', '$translate', 'translationHandler', 'audioHandler', '$location',
     'sessionHandler', 'gameData', 'scopeService', 'settings', 'authHandler',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler, audioHandler, $location,
              sessionHandler, gameData, scopeService, settings, authHandler) {

        let restartTimer = undefined;

        let quitGame = function (fullExit) {
            rabbit.quitGame();
            if (fullExit === true) {
                navigationHandler.goToPage($location, '/create');
            } else {
                rabbit.setPageCallbacks(rabbitCallbacks);
                initializeMatch();
            }
        };

        let initializeMatch = function() {
            changeScreen(screens.waiting);
            if (restartTimer !== undefined) {
                clearTimeout(restartTimer);
            }
            restartTimer = undefined;
            gameData.initializeGameData();
            gameData.editGeneral({
                gameType: gameData.getFixedSetting().gameType,
                timerSetting: gameData.getFixedSetting().timerSetting,
                botSetting: gameData.getFixedSetting().botSetting
            });
            gameData.editUser({
                nickname: gameData.getFixedSetting().nickname,
                organizer: true
            });
            $scope.general = gameData.getGeneral();
            $scope.enemy = gameData.getEnemy();
            $scope.aggregated = gameData.getAggregated();

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

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().name;
        }

        initializeMatch();
        $scope.requestRefused = false;

        let rabbitCallbacks = {
            onConnected: function () {
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                    rabbit.sendGameRequest();
                });

            }, onGameRequestResponse: function (message) {
                scopeService.safeApply($scope, function () {
                    if (message.code.toString() !== '0000') {
                        gameData.editGeneral(message.general);
                        gameData.editUser(message.user);
                        gameData.editAggregated(message.aggregated);
                        $scope.aggregated = gameData.getAggregated();
                        $scope.requestRefused = false;
                        $scope.matchUrl = settings.webBaseUrl + '/#!?royale=' + message.general.code;
                        rabbit.subscribeGameRoom();
                        changeScreen(screens.matchReady);

                    } else {
                        // richiesta non accettata dal server; rinviala dopo 10 secondi
                        $scope.requestRefused = true;
                        restartTimer = setTimeout(function () {
                            scopeService.safeApply($scope, function () {
                                initializeMatch();
                            });
                        }, 5000);
                    }
                });

            }, onPlayerAdded: function(message) {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated(message.aggregated);
                    $scope.aggregated = gameData.getAggregated();

                    if (message.addedPlayerId !== gameData.getUser().playerId
                        && gameData.getAggregated().connectedPlayers === 2) {

                        gameData.editEnemy(message.addedPlayer);
                        audioHandler.playSound('enemy-found');
                        changeScreen(screens.enemyReady);
                    }
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated(message.aggregated);
                    gameData.editMatch({ tiles: gameData.formatMatchTiles(message.tiles) });
                    navigationHandler.goToPage($location, '/royale-match');
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