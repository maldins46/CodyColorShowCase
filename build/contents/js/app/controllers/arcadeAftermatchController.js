/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('arcadeAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler',
    'translationHandler',
    function ($scope, rabbit, gameData, scopeService, $location, $translate,
              navigationHandler, audioHandler, sessionHandler, translationHandler) {
        console.log("Controller aftermatch ready.");

        let autoCloseTimer = undefined;

        // esci dalla partita in modo sicuro, chiudendo la connessione e effettuando il
        // clean dei dati di gioco
        let quitGame = function () {
            if (autoCloseTimer !== undefined) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = undefined;
            }
            rabbit.quitGame();
            gameData.initializeGameData();
            scopeService.safeApply($scope, function () {
                navigationHandler.goToPage($location, '/');
            });
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            return;
        }

        // imposta dati e stats dell'ultima partita, da mostrare all'utente
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.player = gameData.getBotPlayer();
        $scope.enemy = gameData.getEnemyPlayer1vs1();
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getBotPlayer().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemyPlayer1vs1().nickname) {
            audioHandler.playSound('lost');
        }

        autoCloseTimer = setTimeout(function () {
            quitGame();
        }, 60000);

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                gameData.getEnemyPlayer1vs1().ready = true;
                scopeService.safeApply($scope, function () {
                    $scope.enemyRequestNewMatch = true;
                });
                gameData.getBotPlayer().ready = true;
                rabbit.sendReadyMessage();

            }, onStartMatch: function (message) {
                gameData.initializeMatchData();
                gameData.syncGameData(message.gameData);
                scopeService.safeApply($scope, function () {
                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                quitGame();

            }, onConnectionLost: function () {
                quitGame();

            }
        });
    }
]);