/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('rmmakingCtrl',
    function ($scope, rabbit, gameData, $location, scopeService,
              navigationHandler, audioHandler, sessionHandler) {
        console.log("Controller random matchmaking ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tiene traccia dello stato del matchmaking, e di quale schermata deve essere visualizzata
        $scope.mmakingState =  'nicknameSelection';
        $scope.enemyNickname = "";
        gameData.setGameType('random');

        rabbit.setRMMakingCallbacks(function (message) {
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

        }, function () {
            // onQuitGameMessage
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            gameData.clearGameData();
            alert("L'avversario ha abbandonato la partita.");

        }, function () {
            // onConnectionLost
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
            gameData.clearGameData();
        });

        // una volta che l'utente ha scelto un nickname, invia una richiesta di gioco al server
        $scope.requestMMaking = function (nickname) {
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

        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if (confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
                gameData.clearGameData();
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);