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
                });
            });
        }

        // inizializzazione menù di navigazione
        $scope.goToRules = function () {
            navigationHandler.goToPage($location, $scope, "/rules");
        };
        $scope.goToRMMaking = function () {
            if ($scope.connected)
                navigationHandler.goToPage($location, $scope, "/rmmaking");
            else
                alert('Solo un momento, mi sto connettendo al server…');
        };
        $scope.goToPMMaking = function () {
            if ($scope.connected)
                navigationHandler.goToPage($location, $scope, "/404");
            else
                alert('Solo un momento, mi sto connettendo al server…');
        };
        $scope.goToRanking = function () {
            navigationHandler.goToPage($location, $scope, "/404");
        };
        $scope.goToProfile = function () {
            navigationHandler.goToPage($location, $scope, "/404");
        };
        $scope.goToLogin = function () {
            navigationHandler.goToPage($location, $scope, "/404");
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.getBaseState();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.getBaseState();
        };
    }
);