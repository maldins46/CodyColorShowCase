/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('bootCampMakingCtrl',
    function ($scope, rabbit, navigationHandler,
              audioHandler, $location, sessionHandler, gameData) {
        console.log("Bootcamp making controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            gameData.clearGameData();
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        rabbit.setBaseCallbacks(function (response) {
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);
        });

        gameData.setGameType('bootcamp');


        // timer set
        $scope.timerSettings = [ { text: '15 secondi', value: 15000 }, { text: '30 secondi', value: 30000 },
            { text: '1 minuto', value: 60000 }, { text: '2 minuti', value: 120000 } ];
        $scope.currentTimerIndex = 1;
        gameData.setTimerSetting($scope.timerSettings[$scope.currentTimerIndex].value);
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

        $scope.enemySettings = [ { text: 'Nessun avversario', value: 0 }, { text: 'IA facile', value: 1 },
            { text: 'IA medio', value: 2 }, { text: 'IA difficile', value: 3 } ];
        $scope.currentEnemyIndex = 0;
        gameData.setBootEnemySetting($scope.enemySettings[$scope.currentEnemyIndex].value);
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

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected)
            rabbit.connect();

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);