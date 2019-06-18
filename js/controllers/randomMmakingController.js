/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('randomMmakingCtrl',
    function ($scope, rabbit, gameData, $location, scopeService, $translate,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller random matchmaking ready.");
        gameData.editGeneral({ gameType: gameData.getGameTypes().random });

        // matchmakingTimer: interrompe la ricerca della partita nel caso in cui vada troppo per le lunghe
        $scope.mmakingTimerText = '2:00';
        let mmakingTimer = undefined;
        let mmakingTimerValue = 120000;

        // routine da eseguire per chiudere la schermata e uscire dal gioco in modo sicuro
        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
            if (mmakingTimer !== undefined) {
                clearInterval(mmakingTimer);
            }
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
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

        // tiene traccia dello stato del matchmaking, e di quale schermata deve essere visualizzata
        changeScreen('nicknameSelection');
        $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();

        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                scopeService.safeApply($scope, function () {
                    $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();
                });
            }, onGameRequestResponse: function (message) {
                gameData.editGeneral({gameRoomId: message.gameRoomId});
                gameData.editPlayer({playerId: message.playerId});
                rabbit.subscribeGameRoom();
                rabbit.sendHereMessage(true);

            }, onHereMessage: function (message) {
                audioHandler.playSound('enemy-found');
                if (gameData.getPlayerById(message.playerId) === undefined) {
                    gameData.addEnemy();
                    gameData.editEnemy1vs1({
                        nickname: message.nickname,
                        ready: message.readyState
                    });
                }

                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

                clearInterval(mmakingTimer);
                mmakingTimer = undefined;

                changeScreen('enemyFound');
                scopeService.safeApply($scope, function () {
                    $scope.enemyNickname = gameData.getEnemy1vs1().nickname;
                });

            }, onReadyMessage: function () {
                gameData.editEnemy1vs1({
                    ready: true
                });
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
                        translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });
                }

            }, onConnectionLost: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'FORCE_EXIT');
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

        // una volta che l'utente ha scelto un nickname, invia una richiesta di gioco al server
        $scope.requestMMaking = function (nicknameValue) {
            audioHandler.playSound('menu-click');
            changeScreen('waitingEnemy');
            gameData.editPlayer({ nickname: nicknameValue });
            rabbit.sendGameRequest();
            mmakingTimer = setInterval(function () {
                mmakingTimerValue -= 1000;
                if (mmakingTimerValue >= 0) {
                    scopeService.safeApply($scope, function () {
                        $scope.mmakingTimerText = gameData.formatTimeSeconds(mmakingTimerValue);
                    });
                } else {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        $translate('NO_NEW_ENEMY').then(function (forceExit) {
                            $scope.forceExitText = forceExit;
                        }, function (translationId) {
                            $scope.forceExitText = translationId;
                        });
                        $scope.forceExitModal = true;
                    });
                }
            }, 1000);
        };

        // invocata una volta premuto il tasto 'iniziamo'
        $scope.playerReady = function () {
            gameData.editPlayer({ready: true});
            if (!gameData.getEnemy1vs1().ready)
                changeScreen('waitingConfirm');
            rabbit.sendReadyMessage();
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