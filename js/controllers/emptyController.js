/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('emptyCtrl',
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
        if (!$scope.connected)
            rabbit.connect();

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);