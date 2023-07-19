(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .factory('HttpService', Http)
        .factory('pendingRequest', Pending);

    Http.$inject = ['$http', '$state', '$cookies', '$q', 'ConfigService', 'pendingRequest', '$httpParamSerializer', 'HttpAuthInterceptorService'];

    function Http($http, $state, $cookies, $q, cs, pendingRequest, $httpParamSerializer, auth) { 
        var base_url = cs.config.getApiUrl();
        var hash = true;
        return {

            post: function (url, requestData) {
                var deferred = $q.defer();
                
                url = base_url + url + ((hash) ? "?q=" + $wConfig.util.guid() : "");

                var data = requestData;
                //var data = JSON.stringify(requestData);

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                $http({
                    method: 'POST',
                    url: url,
                    data: data,
                    timeout: deferred.promise,
                    headers: {
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Content-Type': 'application/json; charset=utf-8',
                        'Path': $state.current.name
                    }
                }).then(function (response) {
                    deferred.resolve(response);
                    pendingRequest.remove(url);

                    auth.authCheck(response.status);
                }, function (response) {
                    pendingRequest.remove(url);
                    deferred.reject(response);

                    auth.authCheck(response.status);
                });

                return deferred.promise;
            },
            put: function (url, requestData) {
                var deferred = $q.defer();

                url = base_url + url + ((hash) ? "?q=" + $wConfig.util.guid() : "");

                var data = requestData;

                //var data = JSON.stringify(requestData);

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                $http({
                    method: 'PUT',
                    url: url,
                    data: data,
                    timeout: deferred.promise,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Path': $state.current.name
                    }

                }).then(function (response) {

                    deferred.resolve(response);
                    pendingRequest.remove(url);
                    auth.authCheck(response.status);

                }, function (response) {

                    pendingRequest.remove(url);
                    deferred.reject(response);
                    auth.authCheck(response.status);

                });

                return deferred.promise;
            },
            get: function (url, requestData) {
                var deferred = $q.defer();

                url = base_url + url + ((hash) ? "?q=" + $wConfig.util.guid() : "");

                var data = requestData;
                //var data = JSON.stringify(requestData);

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                $http({
                    method: 'GET',
                    url: url,
                    data: data,
                    timeout: deferred.promise,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Path': $state.current.name
                    }

                }).then(function (response) {

                    deferred.resolve(response);
                    pendingRequest.remove(url);
                    auth.authCheck(response.status);
                }, function (response) {


                    pendingRequest.remove(url);
                    deferred.reject(response);
                    auth.authCheck(response.status);
                });

                return deferred.promise;
            },
            delete: function (url, requestData) {
                var deferred = $q.defer();

                url = base_url + url + ((hash) ? "?q=" + $wConfig.util.guid() : "");

                //var data = JSON.stringify(requestData);
                var data = requestData;

                //service/order
                //service/order

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                delete $http.defaults.headers.common['X-Requested-With'];
                $http({
                    method: 'DELETE',
                    url: url,
                    data: data,
                    timeout: deferred.promise,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Path': $state.current.name
                    }

                }).then(function (response) {

                    deferred.resolve(response);

                    pendingRequest.remove(url);
                    auth.authCheck(response.status);

                }, function (response) {
                    console.log(response.xhrStatus);

                    pendingRequest.remove(url);
                    deferred.reject(response);

                    console.log("REJECTED");
                    console.log(response);

                    auth.authCheck(response.status);
                });

                return deferred.promise;
            },
            postFile:function (url, requestData) {
                var deferred = $q.defer();                
                url = base_url + url + ((hash) ? "?q=" + $wConfig.util.guid() : "");

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                $http({
                    method: 'POST',
                    url: url,
                    data: requestData,
                    timeout: deferred.promise,
                    transformRequest: angular.identity,                                        
                    headers: {
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Content-Type': undefined,
                        'Path': $state.current.name
                    }
                }).then(function (response) {
                    

                    deferred.resolve(response);
                    pendingRequest.remove(url);

                    auth.authCheck(response.status);
                }, function (response) {
                    
                    pendingRequest.remove(url);
                    deferred.reject(response);

                    auth.authCheck(response.status);
                });

                return deferred.promise;
            },
            postInter: function (url, requestData) {
                var deferred = $q.defer();  
                var data = requestData;
                //var data = JSON.stringify(requestData);

                pendingRequest.add({
                    url: url,
                    canceller: deferred
                });

                $http({
                    method: 'POST',
                    url: url,
                    data: data,
                    timeout: deferred.promise,
                    headers: {
                        'Authorization': 'Bearer ' + auth.getAccessToken(),
                        'Content-Type': 'application/json; charset=utf-8',
                        'Path': $state.current.name
                    }
                }).then(function (response) {
                    deferred.resolve(response);
                    pendingRequest.remove(url);

                    auth.authCheck(response.status);
                }, function (response) {
                    pendingRequest.remove(url);
                    deferred.reject(response);

                    auth.authCheck(response.status);
                });

                return deferred.promise;
            }
        };

        return this;
    }
    
    function Pending() {
        var pending = [];

        this.get = function () {
            return pending;
        };

        this.add = function (request) {
            pending.push(request);
        };


        this.remove = function (request) {

            //this lead to bugs in here when same url hit could be removed
            //fix is to add query string with guid hash on each request
            pending = _.filter(pending, function (p) {
                return p.url !== request;
            });
        };

        this.cancelAll = function () {

            angular.forEach(pending, function (p) {
                p.canceller.resolve();
            });

            pending.length = 0;
        };

        return this;
    }
})();