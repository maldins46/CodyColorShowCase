/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('aftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location,
              navigationHandler, audioHandler, sessionHandler) {
        console.log("Controller aftermatch ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            rabbit.quitGame();
            gameData.clearGameData();
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
            gameData.setCurrentMatchTiles(response['tiles']);
            navigationHandler.goToPage($location, $scope, '/match',  true);

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
            gameData.clearGameData();
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
        });

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