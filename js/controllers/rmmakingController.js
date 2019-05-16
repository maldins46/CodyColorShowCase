/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('rmmakingCtrl',
    function ($scope, rabbit, gameData, $location, scopeService,
              navigationHandler, audioHandler, sessionHandler, chatHandler) {
        console.log("Controller random matchmaking ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
            chatHandler.clearChat();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tiene traccia dello stato del matchmaking, e di quale schermata deve essere visualizzata
        $scope.mmakingState =  'nicknameSelection';
        $scope.enemyNickname = "";
        $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();
        gameData.setGameType('random');

        rabbit.setRMMakingCallbacks(function(response) {
            // onGeneralInfoMessage
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);

            scopeService.safeApply($scope, function () {
                $scope.randomWaitingPlayers = sessionHandler.getRandomWaitingPlayers().toString();
            });

            },function (message) {
            // onGameRequestResponse
            gameData.setGameRoomId(message.gameRoomId);
            gameData.setPlayerId(message.playerId);
            rabbit.subscribeGameRoom();
            rabbit.sendHereMessage(true);

        }, function (message) {
            // onHereMessage
            gameData.setEnemyNickname(message.nickname);
            gameData.setEnemyReady(message.readyState);

            if (message.needResponse) {
                rabbit.sendHereMessage(false);
            }

            audioHandler.playSound('enemy-found');
            scopeService.safeApply($scope, function () {
                $scope.enemyNickname = gameData.getEnemyNickname();
                $scope.mmakingState = 'enemyFound';
            });

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
                $scope.forceExitx = true;
            });

        }, function () {
            // onConnectionLost
            scopeService.safeApply($scope, function () {
                $scope.forceExitText = "Si è verificato un errore nella connessione con il server. Partita terminata.";
                $scope.forceExitModal = true;
            });
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

        // una volta che l'utente ha scelto un nickname, invia una richiesta di gioco al server
        $scope.requestMMaking = function (nickname) {
            audioHandler.playSound('menu-click');
            $scope.mmakingState = 'waitingEnemy';
            gameData.setPlayerNickname(nickname);
            rabbit.sendGameRequest();
        };

        // invocata una volta premuto il tasto 'iniziamo'
        $scope.playerReady = function () {
            $scope.mmakingState = 'waitingConfirm';
            gameData.setPlayerReady(true);
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