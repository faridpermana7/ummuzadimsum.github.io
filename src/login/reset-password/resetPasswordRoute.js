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
            .state('reset', {
                url: '/reset/:token',
                templateUrl: 'app/modules/login/reset-password/resetPassword.html',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'rst'
            });

    }]);