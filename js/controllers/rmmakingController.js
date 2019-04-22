/*
 * Controller responsabile della funzione di matchmaking nelle partite a accoppiamento
 * casuale dei giocatori
 */
angular.module('codyColor').controller('rmmakingCtrl',
    function ($scope, rabbit, gameData, $location, scopeService, navigationHandler, audioHandler, sessionHandler) {
        console.log("Controller random matchmaking ready.");
        navigationHandler.initializeBackBlock($scope);

        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

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

        // memorizza il nickname dell'avversario, appena disponibile
        $scope.enemyNickname = "";

        rabbit.setMMakingCallbacks(function (response) {
            gameData.setGameRoomId(response.gameRoomId);
            gameData.setPlayerId(response.playerId);

            rabbit.subscribeGameRoom();
            rabbit.sendHereMessage(true);

        }, function (response) {
            gameData.setEnemyNickname(response.nickname);
            gameData.setEnemyReady(response.readyState);

            $scope.mmInProgress = false;
            $scope.mmCompleted = true;
            scopeService.safeApply($scope, function () {
                $scope.enemyNickname = gameData.getEnemyNickname();
            });

            if (response.needResponse) {
                rabbit.sendHereMessage(false);
            }

        }, function () {
            gameData.setEnemyReady(true);
            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (response) {
            gameData.setCurrentMatchTiles(response['tiles']);
            navigationHandler.goToPage($location, $scope, '/match', true);

        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("L'avversario ha abbandonato la partita.");
        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
        });

        // una volt che l'utente ha scelto un nickname, invia una richiesta di gioco al server
        $scope.requestMMaking = function (nickname) {
            $scope.mmInProgress = true;
            $scope.nicknameRequired = false;
            gameData.setPlayerNickname(nickname);
            rabbit.sendGameRequest();
        };

        // invocata una volta premuto il tasto 'iniziamo'
        $scope.playerReady = function () {
            $scope.mmCompleted = false;
            $scope.mmReady = true;
            gameData.setPlayerReady(true);
            rabbit.sendReadyMessage();
        };

        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if(confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
            }
        };

        $scope.basePlaying = audioHandler.basePlaying;
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);