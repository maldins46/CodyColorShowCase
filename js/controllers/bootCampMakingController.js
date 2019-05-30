/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootCampMakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate,
              audioHandler, $location, sessionHandler, gameData, scopeService) {
        console.log("Bootcamp making controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            gameData.clearGameData();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // carica la pagina con un leggero delay per evitare problemi di flickering
        $scope.pageReady = false;
        setTimeout(function () {
            scopeService.safeApply($scope, function () {
                $scope.pageReady = true;
            });
        }, 200);

        gameData.setGameType('bootcamp');

        // timer set
        $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
            $scope.timerSettings = [
                { text: translations['15_SECONDS'], value: 15000 },
                { text: translations['30_SECONDS'], value: 30000 },
                { text: translations['1_MINUTE'], value: 60000 },
                { text: translations['2_MINUTES'], value: 120000 } ];
        });

        $scope.currentTimerIndex = 1;
        gameData.setTimerSetting(30000);

        $scope.incrementTime = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentTimerIndex < 3)
                $scope.currentTimerIndex++;
            else
                $scope.currentTimerIndex = 3;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentTimerIndex].value);
        };

        $scope.decrementTime = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentTimerIndex > 0)
                $scope.currentTimerIndex--;
            else
                $scope.currentTimerIndex = 0;

            gameData.setTimerSetting($scope.timerSettings[$scope.currentTimerIndex].value);
        };

        $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
            $scope.enemySettings = [
                { text: translations['NO_ENEMY'], value: 0 },
                { text: translations['AI_EASY'], value: 1 },
                { text: translations['AI_MEDIUM'], value: 2 },
                { text: translations['AI_HARD'], value: 3 } ];
        });

        $scope.currentEnemyIndex = 0;
        gameData.setBootEnemySetting(0);
        $scope.enemyRight = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentEnemyIndex < 3)
                $scope.currentEnemyIndex++;
            else
                $scope.currentEnemyIndex = 3;

            gameData.setBootEnemySetting($scope.enemySettings[$scope.currentEnemyIndex].value);
        };
        $scope.enemyLeft = function() {
            audioHandler.playSound('menu-click');
            if ($scope.currentEnemyIndex > 0)
                $scope.currentEnemyIndex--;
            else
                $scope.currentEnemyIndex = 0;

            gameData.setBootEnemySetting($scope.enemySettings[$scope.currentEnemyIndex].value);
        };

        $scope.createBootcamp = function(nickname) {
            gameData.setPlayerNickname(nickname);
            gameData.setEnemyNickname('CodyColor');
            gameData.generateNewMatchTiles();
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

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected)
            rabbit.connect();

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

            // timer set
            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000 },
                    { text: translations['30_SECONDS'], value: 30000 },
                    { text: translations['1_MINUTE'], value: 60000 },
                    { text: translations['2_MINUTES'], value: 120000 } ];
            });

            $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
                $scope.enemySettings = [
                    { text: translations['NO_ENEMY'], value: 0 },
                    { text: translations['AI_EASY'], value: 1 },
                    { text: translations['AI_MEDIUM'], value: 2 },
                    { text: translations['AI_HARD'], value: 3 } ];
            });

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