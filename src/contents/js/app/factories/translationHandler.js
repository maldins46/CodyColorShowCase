/*
 * TraductionHandler: fornisce metodi utili per gestire le traduzioni ed evutare relativo
 * codice duplicato sparso per i controllers
 */
angular.module('codyColor').factory("translationHandler", [ '$translate', function($translate) {
    let traductionHandler = {};

    traductionHandler.setTranslation = function ($scope, container, traductionId) {
        $translate(traductionId).then(function (finalText) {
            $scope[container] = finalText;
        }, function (translationId) {
            $scope[container] = translationId;
        });
    };

    return traductionHandler;
}]);