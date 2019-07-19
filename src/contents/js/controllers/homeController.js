/*
 * Controller Home, il menù principale, dal quale è possibile accedere alle varie sezioni del gioco
 */
angular.module('codyColor').controller('homeCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler, scopeService, $translate, authHandler) {
        console.log("Controller home ready.");

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, $scope, '/');
            return;
        }

        $scope.totalMatches = 0;
        $scope.connectedPlayers = 0;

        // impostazioni connessione server; implementa dei callback che permettono di mostrare se necessario
        // un messaggio per notificare all'utente che la connessione al server è in corso
        $scope.connected = rabbit.getServerConnectionState();
        if (!$scope.connected) {
            rabbit.connect();

        } else {
            scopeService.safeApply($scope, function () {
                $scope.totalMatches = sessionHandler.getTotalMatches().toString();
                $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
            });
        }

        if (authHandler.userLogged()) {
            // user già loggato: mostra profile screen
            scopeService.safeApply($scope, function () {
                $scope.username = (authHandler.getUser().displayName !== null ?
                    authHandler.getUser().displayName : authHandler.getUser().email);
                $scope.userDataString = JSON.stringify(authHandler.getUser());
            });
        }


        rabbit.setPageCallbacks({
            onConnectionLost: function() {
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                });

            }, onGeneralInfoMessage: function() {
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                    $scope.totalMatches = (sessionHandler.getTotalMatches()).toString();
                    $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
                });
            }
        });


        // inizializzazione menù di navigazione
        $scope.goToRules = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/rules");
        };
        $scope.goToRMMaking = function () {
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                audioHandler.playSound('menu-click');
                rabbit.setPageCallbacks({});
                navigationHandler.goToPage($location, $scope, "/random-mmaking");
            }

        };
        $scope.goToCMMaking = function () {
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                audioHandler.playSound('menu-click');
                rabbit.setPageCallbacks({});
                navigationHandler.goToPage($location, $scope, "/custom-mmaking");
            }
        };
        $scope.goToAMMaking = function () {
            if (!$scope.connected) {
                $scope.noOnlineModal = true;
                $translate('NO_CONNECT_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else if (!sessionHandler.isClientVersionValid()) {
                $scope.noOnlineModal = true;
                $translate('OUTDATED_VERSION_DESC').then(function (enemyLeft) {
                    $scope.noOnlineModalText = enemyLeft;
                }, function (translationId) {
                    $scope.noOnlineModalText = translationId;
                });

            } else {
                audioHandler.playSound('menu-click');
                rabbit.setPageCallbacks({});
                navigationHandler.goToPage($location, $scope, "/royale-mmaking");
            }
        };
        $scope.goToLoginProfile = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/login");
        };
        $scope.goToBootcamp = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/bootmp-mmaking");
        };
        $scope.goToRanking = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/ranking");
        };
        $scope.goToProfile = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/profile");
        };
        $scope.goToLogin = function () {
            audioHandler.playSound('menu-click');
            rabbit.setPageCallbacks({});
            navigationHandler.goToPage($location, $scope, "/login");
        };

        $scope.closeNoConnectionModal = function() {
            audioHandler.playSound('menu-click');
            $scope.noOnlineModal = false;
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