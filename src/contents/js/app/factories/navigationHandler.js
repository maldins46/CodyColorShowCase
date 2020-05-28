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
        .when("/", {templateUrl: "pages/splash.html", controller: "splashCtrl"})
        .when("/create", {templateUrl: "pages/create-match.html", controller: "createMatchCtrl"})
        .when("/custom-mmaking", {templateUrl: "pages/custom-mmaking.html", controller: "customMmakingCtrl"})
        .when("/arcade-match", {templateUrl: "pages/arcade-match.html", controller: "arcadeMatchCtrl"})
        .when("/arcade-aftermatch", {templateUrl: "pages/arcade-aftermatch.html", controller: "arcadeAftermatchCtrl"})
        .when("/royale-mmaking", {templateUrl: "pages/royale-mmaking.html", controller: "royaleMmakingCtrl"})
        .when("/royale-match", {templateUrl: "pages/royale-match.html", controller: "royaleMatchCtrl"})
        .when("/royale-aftermatch", {templateUrl: "pages/royale-aftermatch.html", controller: "royaleAftermatchCtrl"})
        .when("/terms", {templateUrl: "pages/terms.html", controller: "emptyCtrl"})
        .when("/privacy", {templateUrl: "pages/privacy.html", controller: "emptyCtrl"})
        .otherwise({templateUrl: "pages/404.html", controller: "emptyCtrl"});
}]);