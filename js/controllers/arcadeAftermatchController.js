/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('arcadeAftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, chatHandler, translationHandler) {
        console.log("Controller aftermatch ready.");

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

        gameData.editPlayer({
            points: gameData.getPlayer().points + gameData.getPlayer().match.points
        });


        gameData.editEnemy1vs1({
            points: gameData.getEnemy1vs1().points + gameData.getEnemy1vs1().match.points
        });


        $scope.timeFormatter = gameData.formatTimeSeconds;
        $scope.player = gameData.getPlayer();
        $scope.enemy = gameData.getEnemy1vs1();
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getPlayer().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemy1vs1().nickname) {
            audioHandler.playSound('lost');
        }

        gameData.editPlayer({ ready: false });
        gameData.editEnemy1vs1({ ready: false });

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            rabbit.sendReadyMessage();
            gameData.editPlayer({ ready: true });
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            })
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                gameData.editEnemy1vs1({ ready: true });
                scopeService.safeApply($scope, function () {
                    $scope.enemyRequestNewMatch = true;
                });

                if (gameData.getPlayer().ready && gameData.getEnemy1vs1().ready)
                    rabbit.sendTilesRequest();

            }, onTilesMessage: function (response) {
                gameData.initializeMatchData();
                gameData.editGeneral({
                    matchCount: gameData.getGeneral().matchCount + 1,
                    tiles: gameData.formatMatchTiles(response.tiles)
                });
                navigationHandler.goToPage($location, $scope, '/arcade-match', true);

            }, onQuitGameMessage: function () {
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

        // impostazioni chat
        $scope.chatBubbles = chatHandler.getChatMessages();
        $scope.getBubbleStyle = function(chatMessage) {
            if (chatMessage.playerId === gameData.getPlayer().playerId)
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