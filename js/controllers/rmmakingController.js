/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('rmmakingCtrl',
    function ($scope, rabbit, gameData, $location) {
        console.log("Controller random matchmaking ready.");

        // si assume che arrivati a questo punto, la connessione al broker è già avvenuta con successo
        $scope.connected = rabbit.getConnectionState();

        // utilizzato per mostrare eventualmente la schermata di selezione nickname
        // provvisoriamente settato incondizionatamente a true
        $scope.nicknameRequired = true;

        // mostra quando opportuno la schermata di caricamento. Provvisoriamente
        // inizializzato incondizionatamente a false
        $scope.mmInProgress = false;

        // mostra il tasto start non appena l'accoppiamento viene completato
        $scope.mmCompleted = false;

        // mostra ila schermata di caricamento non appena viene premuto il tasto ready
        $scope.mmReady = false;

        $scope.enemyNickname = "";

        rabbit.setMMakingCallbacks(function (response) {
            // onGameRequestResponse

            gameData.setGameRoomId(response.gameRoomId);
            gameData.setPlayerId(response.playerId);

            rabbit.subscribeGameRoom();
            rabbit.sendHereMessage(true);

        }, function (response) {
            // onHereMessage

            gameData.setEnemyNickname(response.nickname);
            gameData.setEnemyReady(response.readyState);

            $scope.mmInProgress = false;
            $scope.mmCompleted = true;
            $scope.enemyNickname = gameData.getEnemyNickname();
            $scope.$apply();

            if (response.needResponse) {
                rabbit.sendHereMessage(false);
            }


        }, function (response) {
            // onReadyMessage

            gameData.setEnemyReady(true);

            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (response) {
            // onTilesMessage
            gameData.setCurrentMatchTiles(response.tiles);
            $location.path('/match');
            $scope.$apply();
            // avvia partita
        });

        // invocata una volta selezionato il nickname dell'utente
        $scope.requestMMaking = function (nickname) {
            $scope.mmInProgress = true;
            $scope.nicknameRequired = false;
            gameData.setPlayerNickname(nickname);
            rabbit.sendGameRequest();
        };

        // invocata una volta premuto il tasto ready
        $scope.playerReady = function () {
            $scope.mmCompleted = false;
            $scope.mmReady = true;
            gameData.setPlayerReady(true);
            rabbit.sendReadyMessage();
        }
    }
);