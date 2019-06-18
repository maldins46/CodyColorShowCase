/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('customNewMatchCtrl',
    function ($scope, rabbit, navigationHandler, scopeService, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, chatHandler) {
        console.log("Empty controller ready.");

        let quitGame = function () {
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

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        }

        // cambia schermata in modo 'sicuro', evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.mmakingState = 'loadingScreen';
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.mmakingState = newScreen;
                });
            }, 200);
        };

        changeScreen('createMatch');
        $scope.gameCode = '0000';
        // timer set
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                { text: translations['15_SECONDS'], value: 15000 },
                { text: translations['30_SECONDS'], value: 30000 },
                { text: translations['1_MINUTE'], value: 60000 },
                { text: translations['2_MINUTES'], value: 120000 }];
        });
        $scope.currentTimerIndex = 1;

        $scope.editTimer = function (increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);
            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({
                timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value
            });
        };


        rabbit.setPageCallbacks({
            onGameRequestResponse: function (message) {
                gameData.editGeneral({
                    gameRoomId: message.gameRoomId,
                    code: message.code.toString()
                });
                gameData.editPlayer({ playerId: message.playerId });

                rabbit.subscribeGameRoom();

                scopeService.safeApply($scope, function () {
                    $scope.gameCode = message.code.toString();
                });
                changeScreen('enemyInvitation');

            }, onHereMessage: function (message) {
                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

            }, onReadyMessage: function (message) {
                gameData.addEnemy(message.playerId);
                gameData.editEnemy1vs1({
                    nickname: message.nickname,
                    ready: message.readyState
                });

                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

                audioHandler.playSound('enemy-found');
                scopeService.safeApply($scope, function () {
                    $scope.enemyNickname = gameData.getEnemy1vs1().nickname;
                });
                changeScreen('enemyFound');

                gameData.editEnemy1vs1({ready: true });
                if (gameData.getUserPlayer().ready && gameData.getEnemy1vs1().ready)
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
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function (chatMessage) {
            if (chatMessage.playerId === gameData.getUserPlayer().playerId)
                return 'chat--bubble-player';
            else
                return 'chat--bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsPreMatch();
        $scope.sendChatMessage = function (messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
        };

        // tasto iniziamo
        $scope.playerReady = function () {
            gameData.editPlayer({ready: true});
            if (!gameData.getEnemy1vs1().ready)
                changeScreen('waitingConfirm');
            rabbit.sendReadyMessage();
        };

        $scope.creatingMatch = false;
        $scope.requestMMaking = function (nicknameValue) {
            audioHandler.playSound('menu-click');
            gameData.editPlayer({nickname: nicknameValue});
            rabbit.sendGameRequest();
            $scope.creatingMatch = true;
        };

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function () {
            audioHandler.playSound('menu-click');
            copyStringToClipboard('https://codycolor.codemooc.net/#!?match=' + gameData.getGeneral().code);
            $scope.linkCopied = true;
            $scope.codeCopied = false;
        };
        $scope.copyCode = function () {
            audioHandler.playSound('menu-click');
            copyStringToClipboard(gameData.getGeneral().code);
            $scope.linkCopied = false;
            $scope.codeCopied = true;
        };

        let copyStringToClipboard = function (text) {
            // Create new element
            let el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = text;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function () {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
        };

        // impostazioni multi language
        $scope.openLanguageModal = function () {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function () {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;

            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    {text: translations['15_SECONDS'], value: 15000},
                    {text: translations['30_SECONDS'], value: 30000},
                    {text: translations['1_MINUTE'], value: 60000},
                    {text: translations['2_MINUTES'], value: 120000}
                ];
            });

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