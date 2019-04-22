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

    sessionHandler.isSessionValid = function () {
        if (isSessionValid === undefined) {
            console.log('Session not valid anymore. Return to splash page.');
            isSessionValid = false;
            return false;

        } else return isSessionValid;
    };

    return sessionHandler;
});