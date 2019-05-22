/*
 * Controller Home, il menù principale, dal quale è possibile accedere alle varie sezioni del gioco
 */
angular.module('codyColor').controller('homeCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler,
              $location, sessionHandler, scopeService) {
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
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected) {
            rabbit.connect();

        } else {
            scopeService.safeApply($scope, function () {
                $scope.totalMatches = (sessionHandler.getTotalMatches()).toString();
                $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
            });
        }

        rabbit.setHomeCallbacks(function() {
            // onConnected
            scopeService.safeApply($scope, function () {
                $scope.connected = true;
            });

        }, function() {
            // onConnectionLost
            scopeService.safeApply($scope, function () {
                $scope.connected = false;
            });

        } ,function (response) {
            // onGeneralInfoMessage
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);
            sessionHandler.setRandomWaitingPlayers(response.randomWaitingPlayers);

            scopeService.safeApply($scope, function () {
                $scope.totalMatches = (sessionHandler.getTotalMatches()).toString();
                $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
            });
        });

        // inizializzazione menù di navigazione
        $scope.goToRules = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/rules");
            audioHandler.playSound('menu-click');
        };
        $scope.goToRMMaking = function () {
            if ($scope.connected) {
                rabbit.cleanCallbacks();
                navigationHandler.goToPage($location, $scope, "/rmmaking");
                audioHandler.playSound('menu-click');
            } else {
                scopeService.safeApply($scope, function () {
                    $scope.noConnectionModal = true;
                });
            }

        };
        $scope.goToPMMaking = function () {
            if ($scope.connected) {
                rabbit.cleanCallbacks();
                navigationHandler.goToPage($location, $scope, "/cmmaking");
                audioHandler.playSound('menu-click');
            }
            else {
                scopeService.safeApply($scope, function () {
                    $scope.noConnectionModal = true;
                });
            }
        };
        $scope.goToBootcamp = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/bcampmaking");
            audioHandler.playSound('menu-click');
        };
        $scope.goToRanking = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/ranking");
            audioHandler.playSound('menu-click');
        };
        $scope.goToProfile = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/profile");
            audioHandler.playSound('menu-click');
        };
        $scope.goToLogin = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/login");
            audioHandler.playSound('menu-click');
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
);