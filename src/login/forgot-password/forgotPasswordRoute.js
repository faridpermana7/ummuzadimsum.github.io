'use strict';

/**
 * @ngdoc function
 * @name app.route:dashboardRoute
 * @description
 * # dashboardRoute
 * Route of the app
 */

angular.module('farst')
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'app/modules/login/forgot-password/forgotPassword.html',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'fgt'
            });

    }]);