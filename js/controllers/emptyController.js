/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('emptyCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler, $location, sessionHandler) {
        console.log("Empty controller ready.");

        navigationHandler.initializeBackBlock($scope);

        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
        };

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