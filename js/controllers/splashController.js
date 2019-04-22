/*
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
angular.module('codyColor').controller('splashCtrl', function($scope, rabbit, navigationHandler, audioHandler, $location, sessionHandler) {
    console.log("Controller splash ready.");
    navigationHandler.initializeBackBlock($scope);
    sessionHandler.validateSession();

    rabbit.connect();

    $scope.goToHome = function () {
        navigationHandler.goToPage($location, $scope, '/home');
        audioHandler.splashStartBase();
    }
});
