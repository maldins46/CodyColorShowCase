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
        .when("/", {templateUrl: "partials/splash.html", controller: "splashCtrl"})
        .when("/home", {templateUrl: "partials/home.html", controller: "homeCtrl"})
        .when("/login", {templateUrl: "partials/login.html", controller: "loginCtrl"})
        .when("/rules", {templateUrl: "partials/rules.html", controller: "emptyCtrl"})
        .when("/register", {templateUrl: "partials/register.html", controller: "registerCtrl"})
        .when("/rmmaking", {templateUrl: "partials/rmmaking.html", controller: "rmmakingCtrl"})
        .when("/cmmaking", {templateUrl: "partials/cmmaking.html", controller: "cmmakingCtrl"})
        .when("/newcmatch", {templateUrl: "partials/newcmatch.html", controller: "newcmatchCtrl"})
        .when("/match", {templateUrl: "partials/match.html", controller: "matchCtrl"})
        .when("/aftermatch", {templateUrl: "partials/aftermatch.html", controller: "aftermatchCtrl"})
        .when("/ranking", {templateUrl: "partials/ranking.html", controller: "rankingCtrl"})
        .when("/profile", {templateUrl: "partials/login.html", controller: "loginCtrl"})
        .when("/bcampmaking", {templateUrl: "partials/bootcampmaking.html", controller: "bootCampMakingCtrl"})
        .when("/bootcamp", {templateUrl: "partials/bootcamp.html", controller: "bootCampCtrl"})
        .when("/bootaftermatch", {templateUrl: "partials/bootaftermatch.html", controller: "bootAftermatchCtrl"})
        .otherwise({templateUrl: "partials/404.html", controller: "emptyCtrl"});
});