/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('bootmpAftermatchCtrl',
    function ($scope, rabbit, gameData, scopeService, $location, navigationHandler,
              audioHandler, sessionHandler, $translate) {
        console.log("Controller aftermatch ready.");

        // chiusura 'sicura' della partita
        let quitGame = function() {
            gameData.initializeGameData();
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            quitGame();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        gameData.editPlayer({
            points: gameData.getPlayer().points + gameData.getPlayer().match.points
        });

        if (gameData.getEnemy1vs1() !== undefined)
            gameData.editEnemy1vs1({
                points: gameData.getEnemy1vs1().points + gameData.getEnemy1vs1().match.points
            });

        // informazioni sul risultato della partita
        $scope.withEnemy = gameData.getEnemy1vs1() !== undefined;
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.player = gameData.getPlayer();
        $scope.enemy = gameData.getEnemy1vs1();
        $scope.winner = gameData.getMatchWinner();
        $scope.matchCount = gameData.getGeneral().matchCount;

        if ($scope.winner === gameData.getPlayer().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.withEnemy && $scope.winner === gameData.getEnemy1vs1().nickname) {
            audioHandler.playSound('lost');
        }

        // richiede all'avversario l'avvio di una nuova partita tra i due
        $scope.newMatch = function () {
            gameData.initializeMatchData();
            gameData.editGeneral({
                matchCount: gameData.getGeneral().matchCount + 1,
                tiles: gameData.generateNewMatchTiles()
            });
            navigationHandler.goToPage($location, $scope, '/bootmp-match');
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
            navigationHandler.goToPage($location, $scope, '/home');
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
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);