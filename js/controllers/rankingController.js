/*
 * Controller Ranking
 */
angular.module('codyColor').controller('rankingCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler) {
        console.log("Controller ranking ready.");

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

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            audioHandler.playSound('menu-click');
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);
