/*
 * Controller Home, il menù principale, dal quale è possibile accedere alle varie sezioni del gioco
 */
angular.module('codyColor').controller('homeCtrl',
    function ($scope, rabbit, navigationHandler, audioHandler, $location, sessionHandler, scopeService) {
        console.log("Controller home ready.");

        // impostazioni navigazione
        navigationHandler.initializeBackBlock($scope);

        if (!sessionHandler.isSessionValid()) {
            navigationHandler.goToPage($location, $scope, '/');
        }

        // impostazioni connessione server
        $scope.connected = rabbit.getConnectionState();
        if (!$scope.connected)
            rabbit.connect(function () {
                // onConnected
                scopeService.safeApply($scope, function () {
                    $scope.connected = rabbit.getConnectionState();
                });
            }, function () {
                // onErrorConnection
                scopeService.safeApply($scope, function () {
                    $scope.connected = rabbit.getConnectionState();
                });
            });


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
                navigationHandler.goToPage($location, $scope, "/pmmaking");
            else
                alert('Solo un momento, mi sto connettendo al server…');
        };
        $scope.goToRanking = function () {
            navigationHandler.goToPage($location, $scope, "/ranking");
        };
        $scope.goToProfile = function () {
            navigationHandler.goToPage($location, $scope, "/profile");
        };
        $scope.goToLogin = function () {
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