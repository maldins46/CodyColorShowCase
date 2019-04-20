/*
 * Controller responsabile della schermata post partita
 */

angular.module('codyColor').controller('aftermatchCtrl', function($scope, rabbit, gameData, scopeService, $location) {

    console.log("Controller aftermatch ready.");

    // si assume che arrivati a questo punto, la connessione al broker è già avvenuta con successo
    $scope.connected = rabbit.getConnectionState();

    console.log("Controller aftermatch ready.");
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
    $scope.formattedPlayerStart = gameData.formatStartPosition(gameData.getPlayerStartPosition());
    $scope.formattedEnemyStart = gameData.formatStartPosition(gameData.getEnemyStartPosition());

    $scope.newMatchClicked = false;
    $scope.enemyRequestNewMatch = false;

    gameData.setPlayerReady(false);
    gameData.setEnemyReady(false);

    rabbit.setAftermatchCallbacks(function (response) {
        gameData.setEnemyReady(true);

        scopeService.safeApply($scope, function () {
            $scope.enemyRequestNewMatch = true;
        });

        if (gameData.isPlayerReady() && gameData.isEnemyReady())
            rabbit.sendTilesRequest();

    }, function (response) {
        gameData.setCurrentMatchTiles(response.tiles);
        scopeService.safeApply($scope, function () {
            $location.path('/match');
        });
    });

    $scope.newMatch = function () {
        rabbit.sendReadyMessage();
        gameData.setPlayerReady(true);
        scopeService.safeApply($scope, function () {
            $scope.newMatchClicked = true;
        })
    };


    $scope.exitGame = function () {
        if(confirm("Sei sicuro di voler abbandonare la partita?")) {
            rabbit.sendQuitGameMessages();
            rabbit.unsubscribeGameRoom();
            $location.path('/home');
            $scope.$apply();
        }
    };

    rabbit.setQuitCallback(function () {
        rabbit.sendQuitGameMessages();
        rabbit.unsubscribeGameRoom();
        $location.path('/home');
        $scope.$apply();
        alert("L'avversario ha abbandonato la partita.");
    });
});