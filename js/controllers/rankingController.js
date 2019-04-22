/*
 * Controller Ranking
 */
angular.module('codyColor').controller('rankingCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler) {
        console.log("Controller ranking ready.");

        navigationHandler.initializeBackBlock($scope);

        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);
