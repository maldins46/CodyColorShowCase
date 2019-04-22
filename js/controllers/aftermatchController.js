/*
 * Controller responsabile della schermata post partita
 */
angular.module('codyColor').controller('aftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, navigationHandler, audioHandler, sessionHandler) {
        console.log("Controller aftermatch ready.");
        navigationHandler.initializeBackBlock($scope);
        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

        $scope.playerPoints = gameData.getPlayerPoints();
        $scope.enemyPoints = gameData.getEnemyPoints();
        $scope.playerNickname = gameData.getPlayerNickname();
        $scope.enemyNickname = gameData.getEnemyNickname();

        $scope.results = gameData.getCurrentMatchResult();
        if ($scope.results.playerResult.points > $scope.results.enemyResult.points) {
            $scope.winner = $scope.playerNickname;
        } else if ($scope.results.playerResult.points < $scope.results.enemyResult.points) {
            $scope.winner = $scope.enemyNickname;
        } else {
            $scope.winner = "lo sport";
        }

        $scope.formattedPlayerTime = gameData.getTimerText($scope.results.playerResult.time);
        $scope.formattedEnemyTime = gameData.getTimerText($scope.results.enemyResult.time);

        $scope.newMatchClicked = false;
        $scope.enemyRequestNewMatch = false;

        gameData.setPlayerReady(false);
        gameData.setEnemyReady(false);

        rabbit.setAftermatchCallbacks(function () {
            gameData.setEnemyReady(true);

            scopeService.safeApply($scope, function () {
                $scope.enemyRequestNewMatch = true;
            });

            if (gameData.isPlayerReady() && gameData.isEnemyReady())
                rabbit.sendTilesRequest();

        }, function (response) {
            gameData.setCurrentMatchTiles(response['tiles']);
            navigationHandler.goToPage($location, $scope, '/match',  true);

        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("L'avversario ha abbandonato la partita.");
        }, function () {
            rabbit.quitGame();
            navigationHandler.goToPage($location, $scope, '/home', true);
            alert("Si è verificato un errore nella connessione con il server. Partita terminata.");
        });

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            rabbit.sendReadyMessage();
            gameData.setPlayerReady(true);
            scopeService.safeApply($scope, function () {
                $scope.newMatchClicked = true;
            })
        };

        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if (confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    });