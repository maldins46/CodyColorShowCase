/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('royaleAftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller aftermatch ready.");
        let newMatchTimer;

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
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        $scope.newMatchTimerValue = 60000;
        newMatchTimer = setInterval(function () {
            if ($scope.newMatchTimerValue <= 0) {
                rabbit.sendTilesRequest();
                if (newMatchTimer !== undefined) {
                    clearInterval(newMatchTimer);
                    newMatchTimer = undefined;
                }
                scopeService.safeApply($scope, function () {
                    $scope.newMatchTimerValue = 0;
                });
            } else {
                scopeService.safeApply($scope, function () {
                    $scope.newMatchTimerValue -= 1000;
                });
            }
        }, 1000);


        $scope.players = gameData.getAllPlayers();
        for (let i = 0; i < gameData.getAllPlayers().length; i++) {
            let player = gameData.getAllPlayers()[i];
            gameData.editPlayer({
                points: player.points + player.match.points,
                ready: false
            },  player.playerId);
        }
        gameData.getAllPlayers().sort(function (a, b) {
            return b.points - a.points;
        });
        for (let i = 0; i < gameData.getAllPlayers().length; i++) {
            let player = gameData.getAllPlayers()[i];
            gameData.editPlayer({
                ranking: (i + 1).toString() + "."
            },  player.playerId);
        }

        $scope.matchPlayers = gameData.duplicateAllPlayers();
        $scope.matchPlayers.sort(function (a, b) {
            return b.match.points - a.match.points;
        });
        for (let i = 0; i < $scope.matchPlayers.length; i++) {
            $scope.matchPlayers[i].match.ranking = (i + 1).toString() + ".";
        }

        $scope.timeFormatter = gameData.formatTimeSeconds;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getUserPlayer().nickname) {
            audioHandler.playSound('win');
        }


        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            rabbit.sendReadyMessage();
            gameData.editPlayer({ ready: true });
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            });

            if (allPlayersReady() && isLowerPlayerId()) {
                rabbit.sendTilesRequest();
            }
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function (message) {
                gameData.editPlayer({ ready: true }, message.playerId);

                if (allPlayersReady() && isLowerPlayerId()) {
                    rabbit.sendTilesRequest();
                }

            }, onTilesMessage: function (response) {
                if (newMatchTimer !== undefined) {
                    clearInterval(newMatchTimer);
                }
                gameData.initializeMatchData();
                gameData.editGeneral({
                    matchCount: gameData.getGeneral().matchCount + 1,
                    tiles: gameData.formatMatchTiles(response.tiles)
                });
                navigationHandler.goToPage($location, $scope, '/royale-match', true);

            }, onQuitGameMessage: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.removeEnemy(message.playerId)
                });

                if (gameData.getAllPlayers().length <= 1) {
                    scopeService.safeApply($scope, function () {
                        translationHandler.setTranslation($scope, 'forceExitText', 'ENEMY_LEFT');
                        $scope.forceExitModal = true;
                    });
                    quitGame();
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

        let allPlayersReady = function() {
            let allReady = true;
            for (let j = 0; j < gameData.getAllPlayers().length; j++) {
                if (gameData.getAllPlayers()[j].ready !== true) {
                    allReady = false;
                    break;
                }
            }
            return allReady;
        };

        let isLowerPlayerId = function() {
            let lowerId = 100;
            for (let i = 0; i < gameData.getAllPlayers().length; i++) {
                if(gameData.getAllPlayers()[i].playerId < lowerId)
                    lowerId = gameData.getAllPlayers()[i].playerId;
            }
            return lowerId === gameData.getUserPlayer().playerId;
        };

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
            quitGame();
            navigationHandler.goToPage($location, $scope, '/home', false);
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };
        $scope.continueForceExit = function() {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home', false);
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
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);