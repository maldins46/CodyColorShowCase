/*
 * Controller Empty, gestisce le schermate che non necessitano di funzioni specifiche.
 */
angular.module('codyColor').controller('emptyCtrl', ['$scope', 'rabbit', 'navigationHandler', '$translate',
    'audioHandler', '$location', 'sessionHandler', 'translationHandler',
    function ($scope, rabbit, navigationHandler, $translate,
              audioHandler, $location, sessionHandler, translationHandler) {
        console.log("Empty controller ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // inizializzazione tasto home
        $scope.goToHome = function () {
            navigationHandler.goToPage($location, '/');
            audioHandler.playSound('menu-click');
        };

        // tenta la connessione, se necessario
        rabbit.setPageCallbacks({});

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            $scope.languageModal = true;
            audioHandler.playSound('menu-click');
        };
        $scope.closeLanguageModal = function() {
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');
        };
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
            $scope.languageModal = false;
            audioHandler.playSound('menu-click');

            if (!authHandler.loginCompleted()) {
                translationHandler.setTranslation($scope, 'userNickname', 'NOT_LOGGED');
            }
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);