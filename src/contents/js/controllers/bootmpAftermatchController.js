/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('bootmpAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', 'navigationHandler', 'audioHandler', 'sessionHandler', '$translate', 'authHandler', 'translationHandler',
    function ($scope, rabbit, gameData, scopeService, $location, navigationHandler,
              audioHandler, sessionHandler, $translate, authHandler, translationHandler) {
        console.log("Controller aftermatch ready.");

        // chiusura 'sicura' della partita
        let quitGame = function() {
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, '/');
            return;
        }

        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().nickname;
        } else {
            translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
        }

        gameData.editPlayer({
            points: gameData.getUserPlayer().points + gameData.getUserPlayer().match.points
        });

        if (gameData.getEnemy1vs1() !== undefined)
            gameData.editEnemy1vs1({
                points: gameData.getEnemy1vs1().points + gameData.getEnemy1vs1().match.points
            });

        // informazioni sul risultato della partita
        $scope.withEnemy = gameData.getEnemy1vs1() !== undefined;
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.player = gameData.getUserPlayer();
        $scope.enemy = gameData.getEnemy1vs1();
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getUserPlayer().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.withEnemy && $scope.winner === gameData.getEnemy1vs1().nickname) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            gameData.initializeMatchData();
            gameData.getGeneral().tiles = gameData.generateNewMatchTiles();
            navigationHandler.goToPage($location, '/bootmp-match');
        };

        // termina la partita alla pressione sul tasto corrispondente
        $scope.exitGameModal = false;
        $scope.exitGame = function () {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = true;
        };

        $scope.continueExitGame = function() {
            audioHandler.playSound('menu-click');
            quitGame();
            navigationHandler.goToPage($location, '/home');
        };

        $scope.stopExitGame = function() {
            audioHandler.playSound('menu-click');
            $scope.exitGameModal = false;
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function() {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);