/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('bootAftermatchCtrl',
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

        rabbit.setBaseCallbacks(function (response) {
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);
        });


        // oggetto contenente informazioni sul risultato della partita
        $scope.results = gameData.getCurrentMatchResult();
        $scope.withEnemy = gameData.getBootEnemySetting() !== 0;

        // inizializzazione schermata informativa
        $scope.playerPoints = gameData.getPlayerPoints();
        $scope.playerNickname = gameData.getPlayerNickname();
        $scope.formattedPlayerTime = gameData.formatTimerText($scope.results.playerResult.time);

        $scope.enemyLength = '';
        if (gameData.getBootEnemySetting() !== 0) {
            $scope.enemyLength = ($scope.results.enemyResult.loop ? 'Loop!' :$scope.results.enemyResult.length )
        }
        $scope.enemyPoints = (gameData.getBootEnemySetting() !== 0 ? gameData.getEnemyPoints() : '');
        $scope.enemyMatchPoints = (gameData.getBootEnemySetting() !== 0 ? $scope.results.enemyResult.points : '');
        $scope.enemyNickname = gameData.getEnemyNickname();
        $scope.winner = gameData.getBootEnemySetting() !== 0 ? gameData.getMatchWinner() : '';
        $scope.formattedEnemyTime  = (gameData.getBootEnemySetting() !== 0 ?
                                      gameData.formatTimerText($scope.results.enemyResult.time) : '0.00');
        $scope.matchCount = gameData.getMatchCount();

        if ($scope.winner === gameData.getPlayerNickname()) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemyNickname()) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            audioHandler.playSound('menu-click');
            gameData.clearMatchData();
            gameData.addMatch();
            let bootTiles = '';
            for (let i = 0; i < 25; i++) {
                switch (Math.floor(Math.random() * 3)) {
                    case 0:
                        bootTiles += 'R';
                        break;
                    case 1:
                        bootTiles += 'Y';
                        break;
                    case 2:
                        bootTiles += 'G';
                        break;
                }
            }
            gameData.setCurrentMatchTiles(bootTiles);
            navigationHandler.goToPage($location, $scope, '/bootcamp');
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };
        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            gameData.clearGameData();
            navigationHandler.goToPage($location, $scope, '/home');
        };
        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);