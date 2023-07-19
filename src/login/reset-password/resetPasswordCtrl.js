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
        .controller('ResetPasswordCtrl', ResetPassword);

    ResetPassword.$inject = ['$scope', '$stateParams', '$state', 'FarstService', 'HttpService', '$http', '$q', 'ConfigService', '$httpParamSerializer', '$window', 'PendingRequest', 'NavService', '$timeout'];

    function ResetPassword($scope, sParam, $state, fsvc, http, $http, $q, cs, $httpParamSerializer, $window, PendingRequest, NavService, $timeout) {
        var rst = this;
        rst.isReset = false; 
        rst.model = {}; 
        rst.generateToken = sParam.token; 

        rst.resetStart = function () {
            rst.isLoading = true;
        };

        rst.resetFinished = function () {
            rst.isLoading = false;
        };
        
        function ValidatePassword(){ 
            var message = "";
            if(rst.model.newPassword != rst.model.confirmPassword){ 
                message = "Password isn't equal! Please check your password.";
            }  
            return message;
        }
 
        rst.reset = function () {    
            var msg = ValidatePassword();
            if(msg != ""){
                fsvc.Alert.error(msg);
                return;
            } 

            if(rst.invalidPass == ""){ 
                rst.resetStart();
                http.post('/emails/reset-pass', {
                    "email" : rst.model.data.email[0],
                    "newPassword" : rst.model.newPassword,
                    "confirmPassword" : rst.model.confirmPassword, 
                    "oldPassword" : null, 
                }).then(function (res) {

                    if (res.success || res.status == 200) {
                        if (res.data.statusCode == 200) {
                            // fsvc.Alert.success(res.data.message); 
                            rst.isReset = true;
                            rst.resetFinished();
                        } else {
                            // fsvc.Alert.error(res.data.message);
                            rst.isReset = false;
                            rst.resetFinished();
                        }
                    }
                    else {
                        // fsvc.Alert.error(res.data.message);
                        rst.isReset = false;
                        rst.resetFinished();
                    }
                });
            }
            else{
                fsvc.Alert.error(rst.invalidPass); 
                rst.isReset = false; 
            }
        } 
 
        rst.CheckPassword = function(){  
            var message = "";
            if(rst.model.newPassword){ 
                var digit = rst.model.newPassword.match(/(?=.*\d)/); 
                var lowerCase = rst.model.newPassword.match(/(?=.*[a-z])/); 
                var upperCase = rst.model.newPassword.match(/(?=.*[A-Z])/); 
                var eightCar = rst.model.newPassword.match(/[a-zA-Z0-9!@#$%^&*]{8,}/);  
                var specialCar = rst.model.newPassword.match(/(?=.*[!@#$%^&*])/); 

                if(digit == null)
                    message += "Should contain at least one digit";
                if(lowerCase == null)
                    message = ((message === "") ? "Should contain at least lower case" : message + "\nShould contain at least lower case");
                if(upperCase == null) 
                    message = ((message === "") ? "Should contain at least upper case" : message + "\nShould contain at least upper case");
                if(eightCar == null)
                    message = ((message === "") ? "Should contain at least 8 characters" : message + "\nShould contain at least 8 characters");
                if(specialCar == null)
                    message = ((message === "") ? "Should contain at least one special characters" : message + "\nShould contain at least one special characters");
            }
            rst.invalidPass = message;
        }

 

        $scope.$on('$destroy', function () {
            // consousre.log('destroyed');
            PendingRequest.cancelAll();
        });

        rst.init = function () {
			fsvc.loadingIn();
            if (rst.generateToken == "" || rst.generateToken == undefined) {
                fsvc.Alert.error("Token is invalid");
                fsvc.loadingOut();
                $state.go("forgot"); 
            }  
            else{
                http.post('/emails/validate', {
                    "token": rst.generateToken
                }).then(function (res) {
                    if (res.success || res.status == 200) {
                        if (res.data.statusCode == 200) {
                            fsvc.Alert.success(res.data.message); 
                            rst.model = res.data;
                            fsvc.loadingOut();
                        } else {
                            fsvc.Alert.error(res.data.message);
                            fsvc.loadingOut();
                            $state.go("forgot"); 
                        }
                    }
                    else {
                        fsvc.Alert.error(res.data.message);
                        fsvc.loadingOut();
                        $state.go("forgot"); 
                    }
                });

            }
        }($scope);

        return rst;
    }
})();