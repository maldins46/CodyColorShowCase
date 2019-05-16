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
        .when("/", {templateUrl: "partials/splash.html?v=1.0.6", controller: "splashCtrl"})
        .when("/home", {templateUrl: "partials/home.html?v=1.0.6", controller: "homeCtrl"})
        .when("/login", {templateUrl: "partials/login.html?v=1.0.6", controller: "loginCtrl"})
        .when("/rules", {templateUrl: "partials/rules.html?v=1.0.6", controller: "emptyCtrl"})
        .when("/register", {templateUrl: "partials/register.html?v=1.0.6", controller: "registerCtrl"})
        .when("/rmmaking", {templateUrl: "partials/rmmaking.html?v=1.0.6", controller: "rmmakingCtrl"})
        .when("/cmmaking", {templateUrl: "partials/cmmaking.html?v=1.0.6", controller: "cmmakingCtrl"})
        .when("/newcmatch", {templateUrl: "partials/newcmatch.html?v=1.0.6", controller: "newcmatchCtrl"})
        .when("/match", {templateUrl: "partials/match.html?v=1.0.6", controller: "matchCtrl"})
        .when("/aftermatch", {templateUrl: "partials/aftermatch.html?v=1.0.6", controller: "aftermatchCtrl"})
        .when("/ranking", {templateUrl: "partials/ranking.html?v=1.0.6", controller: "rankingCtrl"})
        .when("/profile", {templateUrl: "partials/login.html?v=1.0.6", controller: "loginCtrl"})
        .when("/bcampmaking", {templateUrl: "partials/bootcampmaking.html?v=1.0.6", controller: "bootCampMakingCtrl"})
        .when("/bootcamp", {templateUrl: "partials/bootcamp.html?v=1.0.6", controller: "bootCampCtrl"})
        .when("/bootaftermatch", {templateUrl: "partials/bootaftermatch.html?v=1.0.6", controller: "bootAftermatchCtrl"})
        .otherwise({templateUrl: "partials/404.html", controller: "emptyCtrl?v=1.0.6"});
});