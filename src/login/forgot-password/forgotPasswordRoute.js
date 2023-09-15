'use strict';
 
angular.module('ummuza')
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'src/login/forgot-password/forgotPassword.html',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'fgt'
            });

    }]);