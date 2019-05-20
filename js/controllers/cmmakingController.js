/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('cmmakingCtrl',
    function ($scope, rabbit, navigationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService, chatHandler) {
        console.log("Cmmaking controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
            chatHandler.clearChat();
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
                rabbit.sendGameRequest(false, gameData.getGameCode());
            }
        }

        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, "/newcmatch");
        };

        rabbit.setCMMakingCallbacks(function() {
            console.log("connected in cmmaking; doing your shit");
            if (gameData.getGameCode() !== '0000') {
                scopeService.safeApply($scope, function () {
                    $scope.joinMessage = 'Cercando informazioni sulla partita…';
                });
                rabbit.sendGameRequest(false, gameData.getGameCode());
            }

        }, function (message) {
            // onGameRequestResponse
            if(message.code.toString() === '0000') {
                scopeService.safeApply($scope, function () {
                    $scope.joinMessage = 'Il codice inserito non è valido.'
                });
            } else {
                gameData.setGameCode(message.code.toString());
                gameData.setGameRoomId(message.gameRoomId);
                gameData.setPlayerId(message.playerId);
                rabbit.subscribeGameRoom();
                rabbit.sendHereMessage(true);
            }


        }, function (message) {
            // onHereMessage
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

        }, function () {
            // onReadyMessage
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
                $scope.forceExitText = "L'avversario ha abbandonato la partita.";
                $scope.forceExitModal = true;
            });

        }, function () {
            // onConnectionLost
            scopeService.safeApply($scope, function () {
                $scope.forceExitText = "Si è verificato un errore nella connessione con il server. Partita terminata.";
                $scope.forceExitModal = true;
            });

        }, function (response) {
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

        $scope.joinMessage = '';
        // click su 'unisciti'
        $scope.joinGame = function(code) {
            audioHandler.playSound('menu-click');
            $scope.joinMessage = 'Cercando informazioni sulla partita…';
            rabbit.sendGameRequest(false, code);
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

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);