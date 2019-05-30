/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('cmmakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate,
              audioHandler, $location, sessionHandler, gameData, scopeService, chatHandler) {
        console.log("Cmmaking controller ready.");

        let quitGame = function() {
            rabbit.quitGame();
            gameData.clearGameData();
            chatHandler.clearChat();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // cambia schermata in modo 'sicuro', evitando flickering durante le animazioni
        let changeScreen = function(newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.mmakingState = 'loadingScreen';
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.mmakingState = newScreen;
                });
            }, 200);
        };

        gameData.setGameType('custom');
        $scope.chatVisible = false;
        changeScreen('joinMatch');

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        } else {
            console.log("connected in cmmaking");
            if (gameData.getGameCode() !== '0000') {
                $scope.joinMessage = 'Cercando informazioni sulla partita…';
                rabbit.sendGameRequest();
            }
        }

        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, "/newcmatch");
        };

        rabbit.setPageCallbacks({
            onConnected: function () {
                if (gameData.getGameCode() !== '0000') {
                    scopeService.safeApply($scope, function () {
                        $translate('SEARCH_MATCH_INFO').then(function (text) {
                            $scope.joinMessage = text;
                        }, function (translationId) {
                            $scope.joinMessage = translationId;
                        });
                    });
                    rabbit.sendGameRequest();
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    scopeService.safeApply($scope, function () {
                        $translate('CODE_NOT_VALID').then(function (text) {
                            $scope.joinMessage = text;
                        }, function (translationId) {
                            $scope.joinMessage = translationId;
                        });
                    });
                } else {
                    gameData.setGameCode(message.code.toString());
                    gameData.setGameRoomId(message.gameRoomId);
                    gameData.setPlayerId(message.playerId);
                    rabbit.subscribeGameRoom();
                    rabbit.sendHereMessage(true);
                }

            }, onHereMessage: function (message) {
                gameData.setEnemyNickname(message.nickname);
                gameData.setEnemyReady(message.readyState);
                gameData.setTimerSetting(message.timerSetting);

                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

                audioHandler.playSound('enemy-found');
                scopeService.safeApply($scope, function () {
                    $scope.enemyNickname = gameData.getEnemyNickname();
                    $scope.totTime = gameData.formatTimeEnemyFoundText(gameData.getTimerSetting());
                });
                changeScreen('enemyFound');

            }, onReadyMessage: function () {
                gameData.setEnemyReady(true);
                if (gameData.isPlayerReady() && gameData.isEnemyReady())
                    rabbit.sendTilesRequest();

            }, onTilesMessage: function (message) {
                gameData.setCurrentMatchTiles(message['tiles']);
                navigationHandler.goToPage($location, $scope, '/match', true);

            }, onQuitGameMessage: function (message) {
                if (message.state !== 'playing') {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        $translate('ENEMY_LEFT').then(function (enemyLeft) {
                            $scope.forceExitText = enemyLeft;
                        }, function (translationId) {
                            $scope.forceExitText = translationId;
                        });
                        $scope.forceExitModal = true;
                    });
                }

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    $translate('FORCE_EXIT').then(function (forceExit) {
                        $scope.forceExitText = forceExit;
                    }, function (translationId) {
                        $scope.forceExitText = translationId;
                    });
                    $scope.forceExitModal = true;
                });

            }, onChatMessage: function (message) {
                audioHandler.playSound('roby-over');
                chatHandler.enqueueChatMessage(message);
                scopeService.safeApply($scope, function () {
                    $scope.chatBubbles = chatHandler.getChatMessages();
                });
            }
        });

        // chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getPlayerId())
                return 'chat--bubble-player';
            else
                return 'chat--bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsPreMatch();
        $scope.sendChatMessage = function(messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
        };

        $scope.joinMessage = '';
        // click su 'unisciti'
        $scope.joinGame = function(code) {
            audioHandler.playSound('menu-click');
            $translate('SEARCH_MATCH_INFO').then(function (text) {
                $scope.joinMessage = text;
            }, function (translationId) {
                $scope.joinMessage = translationId;
            });
            gameData.setGameCode(code);
            rabbit.sendGameRequest();
        };

        // click su 'iniziamo'
        $scope.playerReady = function(nickname) {
            gameData.setPlayerNickname(nickname);
            gameData.setPlayerReady(true);
            if(!gameData.isEnemyReady())
                changeScreen('waitingConfirm');
            rabbit.sendReadyMessage();
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };

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
);