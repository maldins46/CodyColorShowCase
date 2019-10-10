/*
 * NavigationHandler: permette la navigazione tra le pagine, ed applica un blocco al tasto back
 */
angular.module('codyColor').factory("navigationHandler", function () {
    let navigationHandler = {};
    let backBlock = true;

    navigationHandler.initializeBackBlock = function ($scope) {
        $scope.$on('$locationChangeStart', function (event) {
            if (backBlock) {
                alert("Utilizza i comandi interni alla pagina per navigare tra le schermate!");
                event.preventDefault();
            } else {
                backBlock = true;
            }
        });
    };

    navigationHandler.goToPage = function ($location, page) {
        backBlock = false;
        $location.search({});
        $location.path(page).replace();
    };

    return navigationHandler;
});

angular.module('codyColor').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: "pages/custom-mmaking.html", controller: "customMmakingCtrl"})
        .when("/arcade-match", {templateUrl: "pages/arcade-match.html", controller: "arcadeMatchCtrl"})
        .when("/arcade-aftermatch", {templateUrl: "pages/arcade-aftermatch.html", controller: "arcadeAftermatchCtrl"})
        .otherwise({templateUrl: "pages/404.html", controller: "emptyCtrl"});
}]);