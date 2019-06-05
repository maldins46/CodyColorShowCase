/*
 * Controller partita royale
 */
angular.module('codyColor').controller('royaleMmakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate, translationHandler,
              audioHandler, $location, sessionHandler, gameData, scopeService, chatHandler) {
        console.log("Ammaking controller ready.");
        gameData.editGeneral({ gameType: gameData.getGameTypes().royale });

        let startMatchTimer;

        // funzione per chiudere il gioco in modo sicuro
        let quitGame = function() {
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

        $scope.chatVisible = false;
        $scope.countdownFormatter = gameData.formatTimeSeconds;

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        } else {
            // l'if identifica il caso in cui si sia ricevuto un invito (gameCode !== '0000') o il caso
            // in cui si sia pronti a inviare una richiesta di gioco
            if (gameData.getGeneral().code !== '0000' || gameData.getGeneral().gameName !== undefined) {
                rabbit.sendGameRequest();
                translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
            }
        }

        // click su 'crea nuova partita'
        $scope.goToCreateMatch = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, "/royale-new-match");
        };

        rabbit.setPageCallbacks({
            onConnected: function () {
                // l'if identifica il caso in cui si sia ricevuto un invito (gameCode !== '0000') o il caso
                // in cui si sia pronti a inviare una richiesta di gioco
                if (gameData.getGeneral().code !== '0000' || gameData.getGeneral().gameName !== undefined) {
                    scopeService.safeApply($scope, function () {
                        rabbit.sendGameRequest();
                        translationHandler.setTranslation($scope, 'joinMessage', 'SEARCH_MATCH_INFO');
                    });
                }

            }, onGameRequestResponse: function (message) {
                if (message.code.toString() === '0000') {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'joinMessage', 'CODE_NOT_VALID');
                    });
                } else {
                    audioHandler.playSound('enemy-found');
                    gameData.editGeneral({
                        code: message.code.toString(),
                        gameRoomId: message.gameRoomId,
                        startDate: message.date,
                        timerSetting: message.timerSetting
                    });
                    gameData.editPlayer({
                        playerId: message.playerId
                    });
                    rabbit.subscribeGameRoom();

                    scopeService.safeApply($scope, function () {
                        $scope.gameCode = gameData.getGeneral().code;
                        $scope.instantMatch = gameData.getGeneral().startDate === undefined;
                        if (gameData.getPlayer().nickname !== 'Anonymous')
                            $scope.organizer = true;
                    });

                    if (gameData.getPlayer().nickname !== 'Anonymous') {
                        changeScreen('waitingEnemies');
                        rabbit.sendHereMessage(true);
                    } else {
                        changeScreen('matchFound');
                    }

                    if (message.date !== undefined) {
                        scopeService.safeApply($scope, function () {
                            $scope.startMatchTimerValue = gameData.getGeneral().startDate - (new Date()).getTime();
                        });

                        startMatchTimer = setInterval(function () {
                            if ($scope.startMatchTimerValue > 1000) {
                                scopeService.safeApply($scope, function () {
                                    $scope.startMatchTimerValue = gameData.getGeneral().startDate - (new Date()).getTime();
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

                    scopeService.safeApply($scope, function () {
                        $scope.battleName = gameData.getGeneral().gameName;
                        translationHandler.setTranslation($scope, 'battleTime',
                            gameData.formatTimeStatic(gameData.getGeneral().timerSetting));
                    })
                }

            }, onHereMessage: function (message) {
                if (gameData.getPlayer().nickname !== 'Anonymous' && gameData.getPlayerById(message.playerId) === undefined) {
                    gameData.addEnemy(message.playerId);
                    gameData.editEnemy(message.playerId, {
                        nickname: message.nickname
                    });
                }

                scopeService.safeApply($scope, function () {
                    $scope.connectedEnemies = gameData.getEnemies();
                });

                if (message.needResponse) {
                    rabbit.sendHereMessage(false);
                }

            }, onTilesMessage: function (message) {
                gameData.editGeneral({
                    tiles: gameData.formatMatchTiles(message.tiles)
                });
                if (startMatchTimer !== undefined)
                    clearInterval(startMatchTimer);

                if (gameData.getEnemies().length > 1) {
                    navigationHandler.goToPage($location, $scope, '/royale-match', true);

                } else if (gameData.getEnemies().length === 1) {
                    navigationHandler.goToPage($location, $scope, '/arcade-match', true);

                } else {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                        $scope.forceExitModal = true;
                    });
                }

            }, onQuitGameMessage: function (message) {
                if (gameData.getPlayer().nickname !== 'Anonymous') {
                    if (gameData.getPlayerById(message.playerId) !== undefined) {
                        gameData.removeEnemy(message.playerId);
                        scopeService.safeApply($scope, function () {
                            $scope.connectedEnemies = gameData.getEnemies();
                        });

                    } else if (message.playerId === 'server') {
                        quitGame();
                        scopeService.safeApply($scope, function () {
                            translationHandler.setTranslation($scope, 'forceExitText', 'FORCE_EXIT');
                            $scope.forceExitModal = true;
                        });
                    }
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

        // click sul tasto 'iniziamo' da schermata di selezione nickname
        $scope.playerReady = function(nicknameValue) {
            gameData.editPlayer({ nickname: nicknameValue });
            rabbit.sendHereMessage(true);
            changeScreen('waitingEnemies');
        };

        // click sul tasto 'inizia partita' dell'organizzatore.
        $scope.startMatch = function() {
            rabbit.sendTilesRequest();
        };

        // chat
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

        $scope.joinMessage = '';
        // click su 'unisciti'
        $scope.joinGame = function(codeValue) {
            audioHandler.playSound('menu-click');
            $translate('SEARCH_MATCH_INFO').then(function (text) {
                $scope.joinMessage = text;
            }, function (translationId) {
                $scope.joinMessage = translationId;
            });
            gameData.editGeneral({ code: codeValue });
            rabbit.sendGameRequest();
        };

        $scope.linkCopied = false;
        $scope.codeCopied = false;
        $scope.copyLink = function () {
            audioHandler.playSound('menu-click');
            copyStringToClipboard('https://codycolor.codemooc.net/#!?aga=' + gameData.getGeneral().code);
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