/*
 * Controller login
 */
angular.module('codyColor').controller('loginCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler) {
        console.log("Controller login ready.");

        navigationHandler.initializeBackBlock($scope);

        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
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