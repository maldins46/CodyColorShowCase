/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('aftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location,
              navigationHandler, audioHandler, sessionHandler, chatHandler) {
        console.log("Controller aftermatch ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
            chatHandler.clearChat();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // oggetto contenente informazioni sul risultato della partita
        $scope.results = gameData.getCurrentMatchResult();

        // inizializzazione schermata informativa
        $scope.playerPoints = gameData.getPlayerPoints();
        $scope.enemyPoints = gameData.getEnemyPoints();
        $scope.playerNickname = gameData.getPlayerNickname();
        $scope.enemyNickname = gameData.getEnemyNickname();
        $scope.winner = gameData.getMatchWinner();
        $scope.formattedPlayerTime = gameData.formatTimerText($scope.results.playerResult.time);
        $scope.formattedEnemyTime  = gameData.formatTimerText($scope.results.enemyResult.time);
        $scope.matchCount = gameData.getMatchCount();

        if ($scope.winner === gameData.getPlayerNickname()) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemyNickname()) {
            audioHandler.playSound('lost');
        }

        // inizializzazione componenti per iniziare un nuovo match
        $scope.newMatchClicked = false;
        $scope.enemyRequestNewMatch = false;

        gameData.setPlayerReady(false);
        gameData.setEnemyReady(false);

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            rabbit.sendReadyMessage();
            gameData.setPlayerReady(true);
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            })
        };

        rabbit.setAftermatchCallbacks(function () {
            // onReadyMessage
            gameData.setEnemyReady(true);
            scopeService.safeApply($scope, function () {
                $scope.enemyRequestNewMatch = true;
            });

            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (response) {
            // onTilesMessage
            gameData.clearMatchData();
            gameData.addMatch();
            gameData.setCurrentMatchTiles(response['tiles']);
            navigationHandler.goToPage($location, $scope, '/match',  true);

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
        }, function (message) {
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
                return 'chat-bubble-player';
            else
                return 'chat-bubble-enemy';
        };
        $scope.chatHints = chatHandler.getChatHintsAfterMatch();
        $scope.sendChatMessage = function(messageBody) {
            audioHandler.playSound('menu-click');
            let chatMessage = rabbit.sendChatMessage(messageBody);
            chatHandler.enqueueChatMessage(chatMessage);
            $scope.chatBubbles = chatHandler.getChatMessages();
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