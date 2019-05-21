/*
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
angular.module('codyColor').controller('splashCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler, $routeParams, gameData) {
        console.log("Controller splash ready.");

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        // tenta subito la connessione al broker
        rabbit.connect();

        let customMatch = $routeParams.match;
        if (customMatch !== undefined && customMatch.length > 0) {
            gameData.setGameCode(customMatch.toString());
            console.log("Custom match! " + gameData.getGameCode());
            navigationHandler.goToPage($location, $scope, '/cmmaking');
        }

        rabbit.setBaseCallbacks(function (response) {
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);
        });

        // vai alla schermata home al click e avvia la base musicale
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, $scope, '/home');
            audioHandler.splashStartBase();
        }
    }
);
