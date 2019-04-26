/*
 * SessionHandler: sfrutta una variabile per stabilire se la sessione corrente
 * è valida; eventualmente rimanda alla splash page
 */
angular.module('codyColor').factory("sessionHandler", function() {
    let sessionHandler = {};
    let isSessionValid;

    sessionHandler.validateSession = function() {
        isSessionValid = true;
    };

    sessionHandler.isSessionInvalid = function () {
        return isSessionValid === undefined || isSessionValid === false;
    };

    return sessionHandler;
});