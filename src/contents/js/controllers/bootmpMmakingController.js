/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootmpMmakingCtrl',
    function ($scope, rabbit, navigationHandler, $translate,
              audioHandler, $location, sessionHandler, gameData, scopeService) {
        console.log("Bootcamp making controller ready.");
        gameData.editGeneral({ gameType: gameData.getGameTypes().bootmp });

        // chiude la partita in modo sicuro
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

        // carica la pagina con un leggero delay per evitare problemi di flickering
        setTimeout(function () {
            scopeService.safeApply($scope, function () {
                $scope.pageReady = true;
            });
        }, 200);

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getBrokerConnectionState();
        if (!$scope.connected)
            rabbit.connect();

        // timer selector
        $translate([ '15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES'])
            .then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000  },
                    { text: translations['30_SECONDS'], value: 30000  },
                    { text: translations['1_MINUTE'],   value: 60000  },
                    { text: translations['2_MINUTES'],  value: 120000 }
                ];
            });
        $scope.currentTimerIndex = 1;
        $scope.editTimer = function(increment) {
            audioHandler.playSound('menu-click');
            if (increment)
                $scope.currentTimerIndex = ($scope.currentTimerIndex < 3 ? $scope.currentTimerIndex + 1 : 3);

            else
                $scope.currentTimerIndex = ($scope.currentTimerIndex > 0 ? $scope.currentTimerIndex - 1 : 0);

            gameData.editGeneral({
                timerSetting: $scope.timerSettings[$scope.currentTimerIndex].value
            });
        };

        // mode selector
        $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD'])
            .then(function (translations) {
                $scope.bootEnemySettings = [
                    { text: translations['NO_ENEMY'],  value: 0 },
                    { text: translations['AI_EASY'],   value: 1 },
                    { text: translations['AI_MEDIUM'], value: 2 },
                    { text: translations['AI_HARD'],   value: 3 }
                ];
        });
        $scope.currentBootEnemySettingIndex = 0;
        gameData.editGeneral({ bootEnemySetting: 0 });
        $scope.editBootEnemySetting = function(increment) {
            if (increment)
                $scope.currentBootEnemySettingIndex
                    = ($scope.currentBootEnemySettingIndex < 3 ? $scope.currentBootEnemySettingIndex + 1 : 3);

            else
                $scope.currentBootEnemySettingIndex
                    = ($scope.currentBootEnemySettingIndex > 0 ? $scope.currentBootEnemySettingIndex - 1 : 0);

            gameData.editGeneral({
                bootEnemySetting: $scope.bootEnemySettings[$scope.currentBootEnemySettingIndex].value
            });
        };

        // tasto 'inizia partita'
        $scope.createBootcamp = function(nicknameValue) {
            gameData.editPlayer({
                nickname: nicknameValue,
                playerId: 0
            });
            if (gameData.getGeneral().bootEnemySetting !== 0) {
                gameData.addEnemy(1);
                gameData.editEnemy1vs1({
                    nickname: 'CodyColor',
                    playerId: 1
                });
            }
            gameData.editGeneral({ tiles: gameData.generateNewMatchTiles() });
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

            // timer set
            $translate(['15_SECONDS', '30_SECONDS', '1_MINUTE', '2_MINUTES']).then(function (translations) {
                $scope.timerSettings = [
                    { text: translations['15_SECONDS'], value: 15000 },
                    { text: translations['30_SECONDS'], value: 30000 },
                    { text: translations['1_MINUTE'], value: 60000 },
                    { text: translations['2_MINUTES'], value: 120000 } ];
            });

            $translate(['NO_ENEMY', 'AI_EASY', 'AI_MEDIUM', 'AI_HARD']).then(function (translations) {
                $scope.bootEnemySettings = [
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