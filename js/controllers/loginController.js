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
            audioHandler.playSound('menu-click');
        };
        $scope.goToRegister = function () {
            navigationHandler.goToPage($location, $scope, '/register');
            audioHandler.playSound('menu-click');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            audioHandler.playSound('menu-click');
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);