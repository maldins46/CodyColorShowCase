/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('customMmakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService, chatHandler) {
        console.log("New match custom controller ready.");
        gameData.editGeneral({ gameType: gameData.getGameTypes().custom });

        let quitGame = function() {
            rabbit.quitGame();
            gameData.initializeGameData();
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
        changeScreen('joinMatch');

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        } else {
            console.log("connected in cmmaking");
            if (gameData.getGeneral().code !== '0000') {
                translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
                rabbit.sendGameRequest();
            }
        }

        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, "/custom-new-match");
        };

        rabbit.setPageCallbacks({
            onConnected: function () {
                if (gameData.getGeneral().code !== '0000') {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
                    });
                    rabbit.sendGameRequest();
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'joinMessage', 'CODE_NOT_VALID');
                    });
                } else {
                    gameData.editGeneral({
                        code:         message.code.toString(),
                        gameRoomId:   message.gameRoomId,
                        timerSetting: message.timerSetting
                    });
                    gameData.editPlayer({
                        playerId: message.playerId
                    });

                    rabbit.subscribeGameRoom();
                    rabbit.sendHereMessage(true);
                }

            }, onHereMessage: function (message) {
                gameData.addEnemy(message.playerId);
                gameData.editEnemy1vs1({
                    nickname: message.nickname,
                    ready:    message.readyState
                });

                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

                audioHandler.playSound('enemy-found');
                scopeService.safeApply($scope, function () {
                    $scope.enemyNickname = gameData.getEnemy1vs1().nickname;
                    translationHandler.setTranslation($scope, 'totTime',
                        gameData.formatTimeStatic(gameData.getGeneral().timerSetting));
                });
                changeScreen('enemyFound');

            }, onReadyMessage: function () {
                gameData.editEnemy1vs1({ ready: true });
                if (gameData.getEnemy1vs1().ready && gameData.getPlayer().ready)
                    rabbit.sendTilesRequest();

            }, onTilesMessage: function (message) {
                gameData.editGeneral({
                    tiles: gameData.formatMatchTiles(message.tiles)
                });
                navigationHandler.goToPage($location, $scope, '/arcade-match', true);

            }, onQuitGameMessage: function (message) {
                if (message.state !== 'playing') {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });
                }

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
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
        $scope.chatVisible = false;
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getPlayer().playerId)
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

        // click su 'unisciti'
        $scope.joinGame = function(codeValue) {
            audioHandler.playSound('menu-click');
            $translate('SEARCH_MATCH_INFO').then(function (text) {
                $scope.joinMessage = text;
            }, function (translationId) {
                $scope.joinMessage = translationId;
            });
            gameData.editGeneral({code: codeValue});
            rabbit.sendGameRequest();
        };

        // click su 'iniziamo' dall'inserimento nickname
        $scope.playerReady = function(nicknameValue) {
           gameData.editPlayer({
               nickname: nicknameValue,
               ready: true
           });

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