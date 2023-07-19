(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .directive('ummuzaModalLogin', farstModalLogin);


    farstModalLogin.$inject = [];

    function farstModalLogin() {
        return {
            restrict: 'E',
            templateUrl: 'app/src/login/modalLogin.html',
            controller: 'modalLoginCtrl',
            controllerAs: 'auth',
            replace: false
        };
    }
})();