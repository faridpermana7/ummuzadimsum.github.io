(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name app.controller:orderCtrl
     * @description
     * # dashboardCtrl
     * Controller of the app
     */

    angular
        .module('farst')
        .controller('ForgotPasswordCtrl', ForgotPassword);

    ForgotPassword.$inject = ['$scope', '$stateParams', '$state', 'FarstService', 'HttpAuthInterceptorService', '$http', '$q', 'ConfigService', '$httpParamSerializer', '$window', 'PendingRequest', 'ForgotService'];

    function ForgotPassword($scope, sParam, $state, wz, authService, $http, $q, cs, $httpParamSerializer, $window, PendingRequest, service) {
        var fgt = this;  
        fgt.isSuccess = false;

        fgt.signinStart = function () {
            fgt.isLoading = true;
        };

        fgt.signinFinished = function () {
            fgt.isLoading = false;
        }; 

        fgt.forgotPassword = function () {  
            if(fgt.model.email != ""){
                fgt.signinStart();
                service.sendEmail([fgt.model.email], function (data) {

                    if(data == "true"){
                        fgt.isSuccess = true;
                    } 
                    fgt.signinFinished();
                    // $state.go('app.user-change');
                });
            }
        }

        $scope.$on('$destroy', function () { 
            //PendingRequest.cancelAll();
        });

        fgt.init = function (asvc) {
            if ($state.current.name == "login") {
                fgt.isOpen = true;
            } 

            if (!fgt.isStatePushed) {

                asvc.authChangeState.push(
                    fgt.changeState
                );

                fgt.isStatePushed = true;
            }
        }(authService);

        return fgt;
    }
})();