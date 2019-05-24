/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('newcmatchCtrl',
    function ($scope, rabbit, navigationHandler, scopeService, $translate,
              audioHandler, $location, sessionHandler, gameData, chatHandler) {
        console.log("Empty controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
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

        changeScreen('createMatch');
        $scope.gameCode = '0000';
        // timer set
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                { text: translations['15_SECONDS'], value: 15000 },
                { text: translations['30_SECONDS'], value: 30000 },
                { text: translations['1_MINUTE'], value: 60000 },
                { text: translations['2_MINUTES'], value: 120000 } ];
        });
        $scope.currentIndex = 1;

        $scope.incrementTime = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentIndex < 3)
                $scope.currentIndex++;
            else
                $scope.currentIndex = 3;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentIndex].value);
        };

        $scope.decrementTime = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentIndex > 0)
                $scope.currentIndex--;
            else
                $scope.currentIndex = 0;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentIndex].value);
        };

        rabbit.setNewCMatchCallbacks(function (message) {
            // onGameRequestResponse
            gameData.setGameRoomId(message.gameRoomId);
            gameData.setPlayerId(message.playerId);
            gameData.setGameCode(message.code.toString());
            rabbit.subscribeGameRoom();

            scopeService.safeApply($scope, function () {
                $scope.gameCode = message.code.toString();
            });
            changeScreen('enemyInvitation')

        }, function (message) {
            // onHereMessage
            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

        }, function (message) {
            // onReadyMessage
            gameData.setEnemyNickname(message.nickname);
            gameData.setEnemyReady(message.readyState);

            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

            audioHandler.playSound('enemy-found');
            scopeService.safeApply($scope, function () {
                $scope.enemyNickname = gameData.getEnemyNickname();
            });
            changeScreen('enemyFound');

            gameData.setEnemyReady(true);
            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (message) {
            // onTilesMessage
            gameData.setCurrentMatchTiles(message['tiles']);
            navigationHandler.goToPage($location, $scope, '/match', true);

        },  function () {
            // onQuitGameMessage
            scopeService.safeApply($scope, function () {
                $translate('ENEMY_LEFT').then(function (enemyLeft) {
                    $scope.forceExitText = enemyLeft;
                }, function (translationId) {
                    $scope.forceExitText = translationId;
                });
                $scope.forceExitModal = true;
            });

        }, function () {
            // onConnectionLost
            scopeService.safeApply($scope, function () {
                $translate('FORCE_EXIT').then(function (forceExit) {
                    $scope.forceExitText = forceExit;
                }, function (translationId) {
                    $scope.forceExitText = translationId;
                });
                $scope.forceExitModal = true;
            });

        },  function (response) {
            // onGeneralInfoMessage
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);
        },function (message) {
            // onChatMessage
            audioHandler.playSound('roby-over');
            chatHandler.enqueueChatMessage(message);
            scopeService.safeApply($scope, function () {
                $scope.chatBubbles = chatHandler.getChatMessages();
            });
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

        // tasto iniziamo
        $scope.playerReady = function() {
            gameData.setPlayerReady(true);
            if(!gameData.isEnemyReady())
                changeScreen('waitingConfirm');
            rabbit.sendReadyMessage();
        };

        $scope.creatingMatch = false;
        $scope.requestMMaking = function(nickname) {
            audioHandler.playSound('menu-click');
            gameData.setPlayerNickname(nickname);
            rabbit.sendGameRequest(true);
            $scope.creatingMatch = true;
        };

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function() {
            audioHandler.playSound('menu-click');
            copyStringToClipboard('https://codycolor.codemooc.net/#!?match=' + gameData.getGameCode());
            $scope.linkCopied = true;
            $scope.codeCopied = false;
        };
        $scope.copyCode = function() {
            audioHandler.playSound('menu-click');
            copyStringToClipboard(gameData.getGameCode());
            $scope.linkCopied = false;
            $scope.codeCopied = true;
        };

        let copyStringToClipboard  = function(text) {
            // Create new element
            let el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = text;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = { position: 'absolute', left: '-9999px' };
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
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
            gameData.clearGameData();
            chatHandler.clearChat();
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
            gameData.clearGameData();
            chatHandler.clearChat();
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

            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000 },
                    { text: translations['30_SECONDS'], value: 30000 },
                    { text: translations['1_MINUTE'], value: 60000 },
                    { text: translations['2_MINUTES'], value: 120000 } ];
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