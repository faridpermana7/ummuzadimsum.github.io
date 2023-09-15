'use strict';
 

angular.module('ummuza')
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('reset', {
                url: '/reset/:token',
                templateUrl: 'src/login/reset-password/resetPassword.html',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'rst'
            });

    }]);