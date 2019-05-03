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
            rabbit.connect(function () {
                // onConnected
                scopeService.safeApply($scope, function () {
                    $scope.connected = true;
                });
            }, function () {
                // onErrorConnection
                scopeService.safeApply($scope, function () {
                    $scope.connected = false;
                    $scope.generalInfoReady = false;
                });

            });

        } else {
            let totalMatches = sessionHandler.getTotalMatches();
            let connectedPlayers = sessionHandler.getConnectedPlayers();
            scopeService.safeApply($scope, function () {
                $scope.totalMatches = (totalMatches).toString();
                $scope.connectedPlayers = connectedPlayers.toString();
            });
        }

        rabbit.setHomeCallbacks(function (response) {
            // onTotalMatchMessage
            sessionHandler.setTotalMatches(response.totalMatches);
            sessionHandler.setConnectedPlayers(response.connectedPlayers);

            scopeService.safeApply($scope, function () {
                $scope.totalMatches = (sessionHandler.getTotalMatches()).toString();
                $scope.connectedPlayers = sessionHandler.getConnectedPlayers().toString();
            });
        });



        // inizializzazione menù di navigazione
        $scope.goToRules = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/rules");
        };
        $scope.goToRMMaking = function () {
            if ($scope.connected) {
                rabbit.cleanCallbacks();
                navigationHandler.goToPage($location, $scope, "/rmmaking");
            } else
                alert('Solo un momento, mi sto connettendo al server…');
        };
        $scope.goToPMMaking = function () {
            if ($scope.connected) {
                rabbit.cleanCallbacks();
                navigationHandler.goToPage($location, $scope, "/cmmaking");
            }
            else
                alert('Solo un momento, mi sto connettendo al server…');
        };
        $scope.goToRanking = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/ranking");
        };
        $scope.goToProfile = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/profile");
        };
        $scope.goToLogin = function () {
            rabbit.cleanCallbacks();
            navigationHandler.goToPage($location, $scope, "/login");
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);