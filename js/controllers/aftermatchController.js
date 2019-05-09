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
            audioHandler.playSound('menu-click');
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
        });

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
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);