/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('aftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', '$translate', 'navigationHandler', 'audioHandler', 'sessionHandler',
    function ($scope, rabbit, gameData, scopeService, $location, $translate,
              navigationHandler, audioHandler, sessionHandler) {

        let autoCloseTimer = undefined;

        // esci dalla partita in modo sicuro, chiudendo la connessione e effettuando il
        // clean dei dati di gioco
        let quitGame = function () {
            if (autoCloseTimer !== undefined) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = undefined;
            }
            rabbit.quitGame();
            navigationHandler.goToPage($location, '/mmaking');
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // imposta dati e stats dell'ultima partita, da mostrare all'utente
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.timeFormatterCountdown = gameData.formatTimeSeconds;
        $scope.user = gameData.getUser();
        $scope.enemy = gameData.getEnemy();
        $scope.draw = gameData.getMatch().winnerId === -1;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getAggregated().matchCount;
        $scope.userMatch = gameData.getUserMatchResult();
        $scope.userGlobal = gameData.getUserGlobalResult();
        $scope.enemyMatch = gameData.getEnemyMatchResult();
        $scope.enemyGlobal = gameData.getEnemyGlobalResult();

        if ($scope.winner === gameData.getUser().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemy().nickname) {
            audioHandler.playSound('lost');
        }

        autoCloseTimer = setTimeout(function () {
            scopeService.safeApply($scope, function () {
                rabbit.sendPlayerQuitRequest();
                quitGame();
            });
        }, 60000);

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    rabbit.sendReadyMessage();
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.initializeMatchData();
                    gameData.editMatch({ tiles: gameData.formatMatchTiles(message.tiles) });

                    if (autoCloseTimer !== undefined) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = undefined;
                    }

                    navigationHandler.goToPage($location, '/match');
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });
            }
        });
    }
]);