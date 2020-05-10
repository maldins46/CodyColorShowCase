/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('royaleAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', '$translate', 'authHandler', 'navigationHandler', 'audioHandler', 'sessionHandler',
    function ($scope, rabbit, gameData, scopeService, $location, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler) {
        let autoCloseTimer = undefined;

        // esci dalla partita in modo sicuro, chiudendo la connessione e effettuando il
        // clean dei dati di gioco
        let quitGame = function (fullExit) {
            if (autoCloseTimer !== undefined) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = undefined;
            }
            rabbit.quitGame();
            navigationHandler.goToPage($location, fullExit === true ? '/create' : '/royale-mmaking');
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().name;
        }

        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.timeFormatterCountdown = gameData.formatTimeSeconds;
        $scope.draw = gameData.getMatch().winnerId === -1;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchRanking = gameData.getMatchRanking();
        $scope.globalRanking = gameData.getGlobalRanking();
        $scope.userMatchResult = gameData.getUserMatchResult();
        $scope.userGlobalResult = gameData.getUserGlobalResult();
        $scope.general = gameData.getGeneral();
        $scope.aggregated = gameData.getAggregated();
        $scope.user = gameData.getUser();
        let readySent = false;

        if ($scope.winner === gameData.getUser().nickname) {
            audioHandler.playSound('win');
        }

        autoCloseTimer = setTimeout(function () {
            scopeService.safeApply($scope, function () {
                rabbit.sendPlayerQuitRequest();
                quitGame();
            });
        }, 60000);

        $scope.userInGlobalPodium = function() {
            let inPodium = false;
            for(let i = 0; i < gameData.getGlobalRanking().length; i++) {
                if (gameData.getGlobalRanking()[i].playerId === gameData.getUser().playerId)
                    inPodium = true;
            }
            return inPodium;
        };

        $scope.userInMatchPodium = function() {
            let inPodium = false;
            for(let i = 0; i < gameData.getMatchRanking().length; i++) {
                if (gameData.getMatchRanking()[i].playerId === gameData.getUser().playerId)
                    inPodium = true;
            }
            return inPodium;
        };

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    gameData.editAggregated({
                        readyPlayers: gameData.getAggregated().readyPlayers + 1
                    });

                    if(readySent === false) {
                        readySent = true;
                        rabbit.sendReadyMessage();
                    }
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.initializeMatchData();
                    gameData.editAggregated(message.aggregated);
                    gameData.editMatch({ tiles: gameData.formatMatchTiles(message.tiles) });

                    if (autoCloseTimer !== undefined) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = undefined;
                    }

                    navigationHandler.goToPage($location, '/royale-match');
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onPlayerRemoved: function (message) {
                if (message.removedPlayerId === gameData.getUser().playerId) {
                    quitGame();
                } else {
                    scopeService.safeApply($scope, function () {
                        gameData.editAggregated(message.aggregated);
                    });
                }

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });
            }
        });

        $scope.exitGame = function() {
            rabbit.sendPlayerQuitRequest();
            quitGame(true);
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };

        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };

        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);