/*
 * Controller login
 */
angular.module('codyColor').controller('loginCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler) {
        console.log("Controller login ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
        };
        $scope.goToRegister = function () {
            navigationHandler.goToPage($location, $scope, '/register');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);