/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('customMmakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler, authHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService,
              chatHandler, settings) {
        console.log("New match custom controller ready.");
        gameData.getGeneral().gameType = gameData.getGameTypes().custom;

        let quitGame = function() {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
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
        authHandler.setCookieNickCallback(function () {
            scopeService.safeApply($scope, function () {
                $scope.userLogged = authHandler.loginCompleted();
                if (authHandler.loginCompleted()) {
                    $scope.userNickname = authHandler.getServerUserData().nickname;
                    $scope.nickname = authHandler.getServerUserData().nickname;
                } else {
                    translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
                }
            });
        });

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
            loadingScreen:     'loadingScreen',     // schermata di transizione
            joinMatch:         'joinMatch',         // schermata iniziale, opzioni ins. code e newMatch
            nicknameSelection: 'nicknameSelection', // inserimento nickname
            waitingEnemy:      'waitingEnemy',      // entrato nella gameRoom, mostra codici e attende un avvers.
            waitingReady:      'waitingReady',       // ready clicked, spettando il segnale di ready dell'avversario
        };
        $scope.screens = screens;

        changeScreen(screens.joinMatch);

        $scope.generalData = gameData.getGeneral();
        $scope.userPlayer = gameData.getUserPlayer();
        $scope.baseUrl = settings.webBaseUrl;

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        let requiredDelayedGameRequest = false;
        if (!$scope.connected) {
            rabbit.connect();
            requiredDelayedGameRequest = true;
        } else {
            // connessione già pronta: richiedi i dati della battle al server
            if (gameData.getGeneral().code !== '0000' || gameData.getUserPlayer().organizer) {
                rabbit.sendGameRequest();
                translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
            }
        }

        rabbit.setPageCallbacks({
            onConnected: function () {
                if (requiredDelayedGameRequest) {
                    if (gameData.getGeneral().code !== '0000' || gameData.getUserPlayer().organizer) {
                        rabbit.sendGameRequest();
                        scopeService.safeApply($scope, function () {
                            translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
                        });
                    }
                    requiredDelayedGameRequest = false;
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'joinMessage', 'CODE_NOT_VALID');

                    });
                } else {
                    gameData.getGeneral().gameRoomId = message.gameRoomId;
                    gameData.getUserPlayer().playerId = message.playerId;
                    gameData.syncGameData(message.gameData);
                    rabbit.subscribeGameRoom();

                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'totTime',
                            gameData.formatTimeStatic(gameData.getGeneral().timerSetting));
                    });

                    if (gameData.getUserPlayer().organizer)
                        changeScreen(screens.waitingEnemy);
                    else {
                        changeScreen(screens.nicknameSelection);
                        $scope.enemyPlayer = gameData.getEnemy1vs1();
                    }
                }


            }, onPlayerAdded: function(message) {
                audioHandler.playSound('enemy-found');
                scopeService.safeApply($scope, function () {
                    gameData.syncGameData(message.gameData);
                    $scope.enemyPlayer = gameData.getEnemy1vs1();
                });
                changeScreen(screens.enemyFound);

            }, onReadyMessage: function () {
                gameData.getEnemy1vs1().ready = true;

            }, onStartMatch: function (message) {
                gameData.syncGameData(message.gameData);
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            },onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

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
            if (chatMessage.playerId === gameData.getUserPlayer().playerId)
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

        // click per schermata newmatch
        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, "/custom-new-match");
        };

        // click su 'unisciti', invio code
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
        $scope.playerReady = function() {
            gameData.getUserPlayer().ready = true;

            if (gameData.getEnemy1vs1().ready === false)
                changeScreen(screens.waitingReady);

            rabbit.sendReadyMessage();
        };


        $scope.validPlayer = function() {
            gameData.getUserPlayer().nickname = $scope.nickname;
            changeScreen(screens.enemyFound);
            rabbit.sendValidationMessage();
            sessionHandler.enableNoSleep();
        };

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function () {
            audioHandler.playSound('menu-click');
            copyStringToClipboard(settings.webBaseUrl + '/#!?custom=' + gameData.getGeneral().code);
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
            rabbit.sendPlayerQuitRequest();
            quitGame();
            navigationHandler.goToPage($location, '/home');
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
            navigationHandler.goToPage($location, '/home');
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