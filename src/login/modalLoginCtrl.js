(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .controller('modalLoginCtrl', modalLogin);

    modalLogin.$inject = ['$scope', '$stateParams', '$state', 'farst', 
        'HttpAuthInterceptorService', '$http', '$q', 'ConfigService', 
        '$httpParamSerializer', '$window', 'modalLoginService', 'pendingRequest', 
        'navService', '$timeout'];

    function modalLogin($scope, sParam, $state, farst, authService, $http, $q, 
        cs, $httpParamSerializer, $window, mds, pendingRequest, navService, $timeout) {
        var auth = this; 
        var login_url = cs.config.getApiUrl() + "/token";

        auth.model = {
            username: undefined,
            password: undefined,
            grant_type: "password"
        };
        auth.isRegistered = false;

        auth.isOpen = false;
        auth.validate = function () {
            if (authService.validateLocal()) {
                $state.go("app.main.page");
            }
        };

        auth.signinStart = function () {
            auth.isLoading = true;
        };

        auth.signinFinished = function () {
            auth.isLoading = false;
        };

        auth.mappingTabs = function(tab){
            if(tab == "reg"){
                auth.isRegistered = true;
            }else{
                auth.isRegistered = false;
            }

        }

        auth.signin = function () {
            try {
                auth.signinStart();
                auth.signinSvc(auth.model, function (state) {
                    if (state.auth) {

                        auth.signinFinished();
                        if ($state.current.name == "login") {
                            $state.go("app.main.page");
                        } else {
                            auth.isOpen = false;
                        }

                    } else {
                        auth.signinFinished();
                        console.log(state);
                        farst.Alert.error("Username, password or member code doesn't match! Please provide check your login information.");
                    }
                });
            } catch (error) {
                auth.signinFinished();
                farst.Alert.error("Please reach your account manager about Login:500!");
            }
        };

        auth.signinSvc = function (userInfo, signinFinished = undefined) {
            authService.skipInterceptor = true;
            var deferred = $q.defer();
            var url = login_url;

            var data = $httpParamSerializer(userInfo);

            delete $http.defaults.headers.common['X-Requested-With'];
            $http({
                method: 'POST',
                url: url,
                data: data,
                timeout: deferred.promise,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).then(function (response) {

                try {
                    if (!(signinFinished == undefined)) {
                        if (response.data.error == "invalid_grant") {
                            auth.signinFinished();
                            farst.Alert.error(response.data.error_description);
                            return;
                        }
                        if (response.status == 200) {
                            if (response.data.statusCode == 400) {
                                auth.signinFinished();
                                farst.Alert.error(response.data.message);
                                // alert('errrorr');
                                return;

                            } else {
                                authService.setAccessToken(response.data.data.token);
                                $window.localStorage.setItem('user', response.data.data.userInfo);
                                $window.localStorage.setItem('userMenu', response.data.data.menu);
                            }
                        }
                        setTimeout(function () {
                            signinFinished({
                                auth: (response.status == 200),
                                status: response.status,
                                response: response
                            });
                            mds.callbackNotifyLoginSuccess();

                            authService.skipInterceptor = false;
                            deferred.resolve(response);
                            $timeout(function () {
                                navService.generateMenu($scope);
                            }, 300);
                            console.log('success');
                        });
                    }

                } catch (error) {
                    if (!(signinFinished == undefined)) {
                        signinFinished({
                            auth: (response.status == 200),
                            status: response.status,
                            response: response
                        });
                    }

                    authService.skipInterceptor = false;

                }



            }, function (response) {

                if (!(signinFinished == undefined)) {

                    signinFinished({
                        auth: (response.status == 200),
                        status: response.status,
                        response: response
                    });


                }

                authService.skipInterceptor = false;

                deferred.reject();
            });

            return deferred.promise;
        };

        auth.signout = function () {

        };

        auth.changeState = function (status) {
            if (status == 401 && !auth.isOpen) {
                auth.isOpen = true;
            }
        };



        auth.isStatePushed = false;

        $scope.$on('$destroy', function () {
            mds.clearCallback();
            //pendingRequest.cancelAll();
        });

        auth.init = function (asvc) {
            if ($state.current.name == "login") {
                auth.isOpen = true;
            } 

            if (!auth.isStatePushed) {

                asvc.authChangeState.push(
                    auth.changeState
                );

                auth.isStatePushed = true;
            }
        }(authService);

        return auth;
    }
})();