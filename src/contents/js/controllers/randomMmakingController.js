/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('randomMmakingCtrl',
    function ($scope, rabbit, gameData, $location, scopeService, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller random matchmaking ready.");
        gameData.getGeneral().gameType = gameData.getGameTypes().random;

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
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
            $scope.nickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
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
            loadingScreen:     'loadingScreen',     // schermata di transizione
            nicknameSelection: 'nicknameSelection', // inserimento nickname, schermata iniziale
            waitingEnemy:      'waitingEnemy',      // entrato nella gameRoom, mostra codici e attende un avvers.
            enemyFound:        'enemyFound',        // players accoppiati, in attesa di ready
            waitingReady:      'waitingReady'       // ready clicked, spettando il segnale di ready dell'avversario
        };
        $scope.screens = screens;

        // tiene traccia dello stato del matchmaking, e di quale schermata deve essere visualizzata
        changeScreen(screens.nicknameSelection);
        $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();

        rabbit.setPageCallbacks({
            onGeneralInfoMessage: function () {
                scopeService.safeApply($scope, function () {
                    $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();
                });

            }, onGameRequestResponse: function (message) {
                gameData.getGeneral().gameRoomId = message.gameRoomId;
                gameData.getUserPlayer().playerId = message.playerId;
                gameData.syncGameData(message.gameData);
                rabbit.subscribeGameRoom();

                if (gameData.getEnemy1vs1() !== undefined) {
                    clearInterval(mmakingTimer);
                    mmakingTimer = undefined;

                    changeScreen(screens.enemyFound);
                    scopeService.safeApply($scope, function () {
                        $scope.enemyNickname = gameData.getEnemy1vs1().nickname;
                    });
                }

            }, onPlayerAdded: function (message) {
                gameData.syncGameData(message.gameData);

                clearInterval(mmakingTimer);
                mmakingTimer = undefined;

                changeScreen(screens.enemyFound);
                scopeService.safeApply($scope, function () {
                    $scope.enemyNickname = gameData.getEnemy1vs1().nickname;
                });

            }, onReadyMessage: function () {
                gameData.getEnemy1vs1().ready = true;

            }, onStartMatch: function (message) {
                gameData.syncGameData(message.gameData);
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

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
        $scope.requestMMaking = function () {
            $scope.mmakingRequested = true;
            audioHandler.playSound('menu-click');
            changeScreen(screens.waitingEnemy);
            gameData.getUserPlayer().nickname = $scope.nickname;
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
            $scope.readyClicked = true;
            gameData.getUserPlayer().ready = true;

            if(gameData.getEnemy1vs1().ready === false)
                changeScreen(screens.waitingReady);
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
            rabbit.sendPlayerQuitRequest();
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };
        $scope.stopExitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        $scope.forceExitModal = false;
        $scope.forceExitText = '';
        $scope.continueForceExit = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, '/home');
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

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);