/*
 * Controller partita con avversario custom
 */
angular.module('codyColor').controller('pmmakingCtrl', function (navigationHandler, audioHandler, $scope, $location, sessionHandler) {
    console.log("Controller custom matchmaking ready.");

    // impostazioni navigazione
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
});
