/*
 * Controller login
 */
angular.module('codyColor').controller('loginCtrl',
    function (navigationHandler, $scope, audioHandler, $location, sessionHandler,
              $translate, scopeService, authHandler) {
        console.log("Controller login ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);

        // cambia schermata (senza lasciare la pagina) evitando flickering durante le animazioni
        let changeScreen = function (newScreen) {
            scopeService.safeApply($scope, function () {
                $scope.loginState = screens.loadingScreen;
            });
            setTimeout(function () {
                scopeService.safeApply($scope, function () {
                    $scope.loginState = newScreen;
                });
            }, 200);
        };

        const screens = {
            loadingScreen: 'loadingScreen', // schermata di transizione
            login:         'login',
            profile:       'profile'
        };
        $scope.screens = screens;

        authHandler.initializeAuth();
        authHandler.initializeUi();

        if (sessionHandler.isSessionInvalid() && authHandler.isPendingRedirect()) {
            // flusso di autenticazione a metà: avvia l'interfaccia utente
            sessionHandler.validateSession();
            changeScreen(screens.login);
            authHandler.startUi();

        } else if (sessionHandler.isSessionInvalid()) {
            // sessione semplicemente non valida: reindirizza alla schermata iniziale
            navigationHandler.goToPage($location, $scope, '/');
            return;

        } else if (authHandler.userLogged()) {
           // user già loggato: mostra profile screen
            scopeService.safeApply($scope, function () {
                $scope.username = (authHandler.getUser().displayName !== null ?
                    authHandler.getUser().displayName : authHandler.getUser().email);
                $scope.userDataString = JSON.stringify(authHandler.getUser());
            });
            changeScreen(screens.profile);

        } else {
            // login semplice: avvia il login flow
            changeScreen(screens.login);
            authHandler.startUi();
        }

        authHandler.setAuthCallbacks({
            onSignIn(user) {
                scopeService.safeApply($scope, function () {
                    $scope.username = (user.displayName !== null ? user.displayName : user.email);
                    $scope.userDataString = JSON.stringify(user);
                });
                changeScreen(screens.profile);
            }
        });

        $scope.logout = function() {
            authHandler.logout();
            authHandler.initializeUi();
            authHandler.startUi();
            changeScreen(screens.login);
        };

        $scope.deleteAccount = function() {
            authHandler.deleteAccount();
            authHandler.initializeUi();
            authHandler.startUi();
            changeScreen(screens.login);
        };


        $scope.goToHome = function () {
            audioHandler.playSound('menu-click');
            authHandler.clearCallbacks();
            navigationHandler.goToPage($location, $scope, '/home');
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