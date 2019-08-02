/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('royaleAftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller aftermatch ready.");
        let newMatchTimer;

        // chiude la partita in modo sicuro
        let quitGame = function () {
            rabbit.quitGame();
            gameData.initializeGameData();
            chatHandler.clearChat();
            if (newMatchTimer !== undefined) {
                clearInterval(newMatchTimer);
                newMatchTimer = undefined;
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
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        $scope.newMatchTimerValue = 60000;
        newMatchTimer = setInterval(function () {
            if ($scope.newMatchTimerValue <= 0) {
                if (newMatchTimer !== undefined) {
                    clearInterval(newMatchTimer);
                    newMatchTimer = undefined;
                }
                scopeService.safeApply($scope, function () {
                    $scope.newMatchTimerValue = 0;
                });

                if (!gameData.getUserPlayer().ready) {
                    gameData.getUserPlayer().ready = true;
                    rabbit.sendReadyMessage();
                }

            } else {
                scopeService.safeApply($scope, function () {
                    $scope.newMatchTimerValue -= 1000;
                });
            }
        }, 1000);

        let updateRanking = function() {
           // riordina classifica generale
            $scope.players = gameData.getAllPlayers();
            gameData.getAllPlayers().sort(function (a, b) {
                if (b.points - a.points !== 0) {
                    return b.points - a.points;
                } else if (b.wonMatches - a.wonMatches !== 0) {
                    return b.wonMatches - a.wonMatches;

                } else if (b.match.points - a.match.points !== 0) {
                    return b.match.points - a.match.points;

                } else if (b.match.pathLength - a.match.pathLength !== 0) {
                    return b.match.pathLength - a.match.pathLength;

                } else {
                    return b.match.time - a.match.time;
                }
            });

            // riordina classifica match
            $scope.matchPlayers = gameData.duplicateAllPlayers();
            $scope.matchPlayers.sort(function (a, b) {

                if (b.match.points - a.match.points !== 0) {
                    return b.match.points - a.match.points;

                } else if (b.match.pathLength - a.match.pathLength !== 0) {
                    return b.match.pathLength - a.match.pathLength;

                } else {
                    return b.match.time - a.match.time;
                }
            });
        };

        // aggiorna punteggio players
        updateRanking();
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.timeFormatterCountdown = gameData.formatTimeSeconds;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getUserPlayer().nickname) {
            audioHandler.playSound('win');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            if (!gameData.getUserPlayer().ready) {
                gameData.getUserPlayer().ready = true;
                rabbit.sendReadyMessage();
            }
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            });
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function (message) {
                gameData.getPlayerById(message.playerId).ready = true;

            }, onStartMatch: function (message) {
                if (newMatchTimer !== undefined) {
                    clearInterval(newMatchTimer);
                    newMatchTimer = undefined;
                }

                gameData.initializeMatchData();
                gameData.syncGameData(message.gameData);
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/royale-match');
                });

            }, onGameQuit: function () {
                quitGame();
                scopeService.safeApply($scope, function () {
                    translationHandler.setTranslation($scope,'forceExitText', 'ENEMY_LEFT');
                    $scope.forceExitModal = true;
                });

            }, onPlayerRemoved: function (message) {
                if (message.removedPlayerId === gameData.getUserPlayer().playerId) {
                    quitGame();
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });

                } else {
                    scopeService.safeApply($scope, function () {
                        gameData.syncGameData(message.gameData);
                        updateRanking();
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

        // impostazioni chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getUserPlayer().playerId)
                return 'chat--bubble-player';
            else
                return 'chat--bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsAfterMatch();
        $scope.sendChatMessage = function(messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
        };

        // impostazioni exit game
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
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, '/home');
        };

        // impostazioni multi-language
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