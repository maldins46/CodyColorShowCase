/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('emptyCtrl', ['$scope', 'rabbit', 'navigationHandler', '$translate',
    'audioHandler', '$location', 'sessionHandler',
    function ($scope, rabbit, navigationHandler, $translate,
              audioHandler, $location, sessionHandler) {

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        visibilityHandler.setDeadlineCallback();
        rabbit.setPageCallbacks({});
    }
]);