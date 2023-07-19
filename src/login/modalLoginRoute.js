'use strict';
 
angular.module('ummuza')
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'src/login/modalLogin.html',
                controller: 'modalLoginCtrl',
                controllerAs: 'auth'
            });

    }]);