/*
 * Controller royale mmaking: gestisce la creazione di partite e l'accoppiamento dei giocatori
 */
angular.module('codyColor').controller('royaleMmakingCtrl', ['$scope', 'rabbit', 'navigationHandler', '$translate',
    'translationHandler', 'audioHandler', '$location', 'sessionHandler', 'gameData', 'scopeService', 'chatHandler',
    'settings', 'authHandler',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService,
              chatHandler, settings, authHandler) {
        console.log("Royale mmaking controller ready.");
        gameData.getGeneral().gameType = gameData.getGameTypes().royale;

        let startMatchTimer;

        // chiudere il gioco in modo sicuro
        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();

            if (startMatchTimer !== undefined)
                clearInterval(startMatchTimer);
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

        // cambia schermata in modo 'sicuro', evitando flickering durante le animazioni
        const screens = {
            loadingScreen: 'loadingScreen',     // schermata di transizione
            joinMatch: 'joinMatch',         // schermata iniziale, opzioni ins. code e newMatch
            nicknameSelection: 'nicknameSelection', // inserimento nickname
            waitingEnemies: 'waitingEnemies',    // entrato nella gameRoom, mostra codici e attende un avvers.
        };
        $scope.screens = screens;
        changeScreen(screens.joinMatch);

        $scope.countdownFormatter = gameData.formatTimeSeconds;
        $scope.generalData = gameData.getGeneral();
        $scope.userPlayer = gameData.getBotPlayer();
        $scope.baseUrl = settings.webBaseUrl;

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        let requiredDelayedGameRequest = false;
        if (!$scope.connected) {
            rabbit.connect();
            requiredDelayedGameRequest = true;
        } else {
            // connessione già pronta: richiedi i dati della battle al server
            if (gameData.getGeneral().code !== '0000' || gameData.getBotPlayer().organizer) {
                rabbit.sendGameRequest();
                translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
            }
        }

        rabbit.setPageCallbacks({
            onConnected: function () {
                if (requiredDelayedGameRequest) {
                    if (gameData.getGeneral().code !== '0000' || gameData.getBotPlayer().organizer) {
                        rabbit.sendGameRequest();
                        scopeService.safeApply($scope, function () {
                            translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
                        });
                    }
                    requiredDelayedGameRequest = false;
                }

            }, onGeneralInfoMessage: function(message) {
                if (!sessionHandler.isClientVersionValid()) {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'OUTDATED_VERSION_DESC');
                        $scope.forceExitModal = true;
                    });
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'joinMessage', 'CODE_NOT_VALID');
                    });
                    return;
                }

                gameData.getGeneral().gameRoomId = message.gameRoomId;
                gameData.getBotPlayer().playerId = message.playerId;
                gameData.syncGameData(message.gameData);
                rabbit.subscribeGameRoom();

                // testo che mostra la durata di ogni match
                let formattedTranslateCode = gameData.formatTimeStatic(gameData.getGeneral().timerSetting);
                translationHandler.setTranslation($scope, 'battleTime', formattedTranslateCode);

                if (gameData.getGeneral().scheduledStart) {
                    scopeService.safeApply($scope, function () {
                        // calcola la data di avvio della partita in base al valore millisecondi mancanti comunicato dal server
                        $scope.relativeStartDate = (new Date()).getTime() + message.msToStart;
                        $scope.startMatchTimerValue = message.msToStart;
                    });

                    startMatchTimer = setInterval(function () {
                        if ($scope.startMatchTimerValue > 1000) {
                            scopeService.safeApply($scope, function () {
                                $scope.startMatchTimerValue = $scope.relativeStartDate - (new Date()).getTime();
                            });
                        } else {
                            scopeService.safeApply($scope, function () {
                                $scope.startMatchTimerValue = 0;
                            });
                            clearInterval(startMatchTimer);
                            startMatchTimer = undefined;
                        }
                    }, 1000)
                }

                if (gameData.getBotPlayer().organizer) {
                    changeScreen(screens.waitingEnemies);
                } else {
                    changeScreen(screens.nicknameSelection);
                }


            }, onPlayerAdded: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.syncGameData(message.gameData);
                    $scope.connectedEnemies = gameData.getEnemyPlayers();
                    translationHandler.setTranslation($scope, 'totTime',
                        gameData.formatTimeStatic(gameData.getGeneral().timerSetting));
                });


            }, onPlayerRemoved: function (message) {
                if (message.removedPlayerId === gameData.getBotPlayer().playerId) {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });

                } else {
                    scopeService.safeApply($scope, function () {
                        gameData.syncGameData(message.gameData);
                        $scope.connectedEnemies = gameData.getEnemyPlayers();
                        translationHandler.setTranslation($scope, 'totTime',
                            gameData.formatTimeStatic(gameData.getGeneral().timerSetting));
                    });
                }

            }, onStartMatch: function (message) {
                gameData.syncGameData(message.gameData);

                if (startMatchTimer !== undefined) {
                    clearInterval(startMatchTimer);
                    startMatchTimer = undefined;
                }

                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/royale-match');
                });

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
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


        // click per schermata newmatch
        $scope.goToCreateMatch = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, "/royale-new-match");
        };

        // click su 'unisciti', invio code
        $scope.joinGame = function (codeValue) {
            $scope.mmakingRequested = true;
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
        $scope.readyClicked = false;
        $scope.playerReady = function () {
            if (!$scope.readyClicked) {
                gameData.getBotPlayer().ready = true;
                rabbit.sendReadyMessage();
                $scope.readyClicked = true;
            }
        };

        // associa il nickname al giocatore e trasmettilo alla game room, convalidando la partecipazione alla partita
        $scope.validPlayer = function () {
            $scope.playerValidated = true;
            gameData.getBotPlayer().nickname = $scope.nickname;
            changeScreen(screens.waitingEnemies);
            rabbit.sendValidationMessage();
            sessionHandler.enableNoSleep();
        };

        // chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function (chatMessage) {
            if (chatMessage.playerId === gameData.getBotPlayer().playerId)
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

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function () {
            audioHandler.playSound('menu-click');
            copyStringToClipboard(settings.webBaseUrl + '/#!?royale=' + gameData.getGeneral().code);
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
]);