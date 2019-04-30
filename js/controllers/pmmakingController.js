/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('pmmakingCtrl',
    function ($scope, rabbit, navigationHandler,
              audioHandler, $location, sessionHandler) {
        console.log("Empty controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        // inizializzazione tasto home
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
        };

        // tenta la connessione, se necessario
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();
        }

        $scope.mmakingState = 'initializeMatch';

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);