/*
 * NavigationHandler: permette la navigazione tra le pagine, ed applica un blocco al tasto back
 */
angular.module('codyColor').factory("navigationHandler", function () {
    let navigationHandler = {};
    let backBlock = true;

    navigationHandler.initializeBackBlock = function ($scope) {
        $scope.$on('$locationChangeStart', function (evnt, next, current) {
            if (backBlock) {
                alert("Utilizza i comandi interni alla pagina per navigare tra le schermate!");
                evnt.preventDefault();
            } else {
                backBlock = true;
            }
        });
    };

    navigationHandler.goToPage = function ($location, $scope, page, notFromClick) {
        backBlock = false;
        $location.search({});
        $location.path(page).replace();
        if (notFromClick !== undefined && notFromClick === true)
            $scope.$apply();
    };

    return navigationHandler;
});

angular.module('codyColor').config(function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: "pages/splash.html", controller: "splashCtrl"})
        .when("/home", {templateUrl: "pages/home.html", controller: "homeCtrl"})
        .when("/login", {templateUrl: "pages/login.html", controller: "loginCtrl"})
        .when("/rules", {templateUrl: "pages/rules.html", controller: "emptyCtrl"})
        .when("/register", {templateUrl: "pages/register.html", controller: "registerCtrl"})
        .when("/ranking", {templateUrl: "pages/ranking.html", controller: "rankingCtrl"})
        .when("/profile", {templateUrl: "pages/login.html", controller: "loginCtrl"})
        .when("/random-mmaking", {templateUrl: "pages/random-mmaking.html", controller: "randomMmakingCtrl"})
        .when("/custom-mmaking", {templateUrl: "pages/custom-mmaking.html", controller: "customMmakingCtrl"})
        .when("/royale-mmaking", {templateUrl: "pages/royale-mmaking.html", controller: "royaleMmakingCtrl"})
        .when("/custom-new-match", {templateUrl: "pages/custom-new-match.html", controller: "customNewMatchCtrl"})
        .when("/royale-new-match", {templateUrl: "pages/royale-new-match.html", controller: "royaleNewMatchCtrl"})
        .when("/arcade-match", {templateUrl: "pages/arcade-match.html", controller: "arcadeMatchCtrl"})
        .when("/arcade-aftermatch", {templateUrl: "pages/arcade-aftermatch.html", controller: "arcadeAftermatchCtrl"})
        .when("/royale-match", {templateUrl: "pages/royale-match.html", controller: "royaleMatchCtrl"})
        .when("/royale-aftermatch", {templateUrl: "pages/royale-aftermatch.html", controller: "royaleAftermatchCtrl"})
        .when("/bootmp-mmaking", {templateUrl: "pages/bootmp-mmaking.html", controller: "bootmpMmakingCtrl"})
        .when("/bootmp-match", {templateUrl: "pages/bootmp-match.html", controller: "bootmpMatchCtrl"})
        .when("/bootmp-aftermatch", {templateUrl: "pages/bootmp-aftermatch.html", controller: "bootmpAftermatchCtrl"})
        .otherwise({templateUrl: "pages/404.html", controller: "emptyCtrl"});
});