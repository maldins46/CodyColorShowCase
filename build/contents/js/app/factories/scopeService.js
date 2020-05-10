/*
 * Permette di applicare cambiamenti di scope in modo sicuro
 */
angular.module('codyColor').service('scopeService', function() {
    return {
        safeApply: function ($scope, changeInScope) {
            var phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (changeInScope && typeof changeInScope === 'function') {
                    changeInScope();
                }
            } else {
                $scope.$apply(changeInScope);
            }
        },
    };
});