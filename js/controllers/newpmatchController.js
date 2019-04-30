/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('newpmatchCtrl',
    function ($scope, rabbit, navigationHandler,
              audioHandler, $location, sessionHandler, gameData) {
        console.log("Empty controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        }

        $scope.mmakingState = 'createMatch';

        // termina la partita in modo sicuro, alla pressione sul tasto corrispondente
        $scope.exitGame = function () {
            if (confirm("Sei sicuro di voler abbandonare la partita?")) {
                rabbit.quitGame();
                navigationHandler.goToPage($location, $scope, '/home');
                gameData.clearGameData();
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);