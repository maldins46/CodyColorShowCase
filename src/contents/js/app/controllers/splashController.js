/*
 * Controller Splash Screen, la schermata mostrata non appena si accede al sito
 */
angular.module('codyColor').controller('splashCtrl', ['$scope', 'rabbit', 'navigationHandler', 'audioHandler',
    '$location', 'sessionHandler', '$routeParams', 'gameData', 'authHandler',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler, $routeParams, gameData, authHandler) {

        // validazione sessione
        navigationHandler.initializeBackBlock($scope);
        sessionHandler.validateSession();

        // inizializza il flusso di autenticazione (automatico, se rilevati cookies)
        authHandler.initializeAuth();
        authHandler.enableCookieSignIn();

        // tenta subito la connessione al broker
        if (!rabbit.getServerConnectionState())
            rabbit.connect();

        $scope.wallVersion = sessionHandler.getWallVersion();

        // todo blocca se outdated o offline

        // vai alla schermata home al click e avvia la base musicale
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, '/create');
            audioHandler.splashStartBase();
            sessionHandler.enableNoSleep();
        }
    }
]);
