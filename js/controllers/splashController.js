/*
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
angular.module('codyColor').controller('splashCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler) {
        console.log("Controller splash ready.");


        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        // tenta subito la connessione al broker
        rabbit.connect();

        rabbit.setSplashCallbacks(function (response) {
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
        });

        // vai alla schermata home al click e avvia la base musicale
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
            audioHandler.splashStartBase();
        }
    }
);
