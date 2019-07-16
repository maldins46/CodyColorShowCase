/*
 * Controller login
 */
angular.module('codyColor').controller('loginCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler, $translate) {
        console.log("Controller login ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        $scope.goToHome = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/home');
        };
        $scope.goToRegister = function () {
            audioHandler.playSound('menu-click');
            navigationHandler.goToPage($location, $scope, '/register');
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };
        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };
        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);