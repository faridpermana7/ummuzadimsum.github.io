var $wConfig;

(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .factory('ConfigService', Config);

    Config.$inject = [];
    
    function Config() {
        var vm = this;

        //CHANGE apiURL & mapbox token on package.json!!
        //DONT CHANGE HERE, OTHERWISE CI WILL FAILED!!

        vm.config = new WConfig({
            apiProtocol: "https://",
            usePort: false,
            autoDefineApi: false,
            autoDefineApiPort: false,
            apiPort: "44346",
            apiPoint: "/api",
            // apiUrl: "localhost",
            apiUrl: "ummuza.bsite.net",
            log: false,
            apiPrefix: undefined, 
            osmAttrib: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxboxUrl: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
            maxboxAttrib: 'Map data &cdeopy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            accessToken: 'pk.eyJ1Ijoid3p5LWRldiIsImEiOiJjanhwanA1eXcwaWhoM2JvNzhzenprNm1kIn0.6BuQGkMfAS5WG9yeZp0wpg',
            defaultLat: -1.2399448,
            defaultLong: 116.8582612
        }); 

        vm.config.l.c = vm.config; 
 
        vm.init = function () { 
            $wConfig = vm.config;
        }();
        return vm;
    } 


    angular
        .module('ummuza')
        .factory('HttpAuthInterceptorService', httpAuthInterceptor);


    httpAuthInterceptor.$inject = ['ConfigService', '$cookies'];

    function httpAuthInterceptor(cs, $cookies) {
        var ai = this;
        var api_url = cs.config.getApiUrl();
        var login_url = cs.config.getApiHost() + "/token";

        ai.isDebugMode = cs.config.isLogged();

        ai.requestCallback = undefined;

        ai.requestErrorCallback = undefined;

        ai.responseCallback = undefined;

        ai.responseErrorCallback = undefined;

        ai.refreshAfterReAuth = [];

        //callback to listen state changed
        ai.authChangeState = [];

        ai.skipInterceptor = false;

        ai.validate = function () {

        };



        ai.authCheck = function (status) {

            var stateUnauthorized = (status === 401) ? true : false;


            if (stateUnauthorized && !ai.skipInterceptor) {
                ai.removeToken();


                if (!(ai.authChangeState === undefined))

                    for (var index = 0; index < ai.authChangeState.length; index++) {
                        var element = ai.authChangeState[index];
                        element(status);
                    }

                return false;
            }

            return true;
        };

        ai.setAccessToken = function (token) {
            $cookies.put('token', token);
        };

        ai.getAccessToken = function () {
            return $cookies.get('token');
        };

        ai.removeToken = function () {
            //remove token
            $cookies.remove('token');
        };



        ai.request = function (config) {
            ai.debugMode("request", config);
            return config;
        };




        ai.debugMode = function (state, obj) {

            // if (ai.isDebugMode) {
            // 	console.log("Int : " + state);
            // 	console.log(obj);
            // }
        };

        ai.requestError = function (config) {

            if (!ai.requestErrorCallback === undefined) {
                ai.requestErrorCallback(config);
            }

            ai.debugMode("reqErr", config);

            return config;
        };

        ai.response = function (res) {

            if (!ai.skipInterceptor) {
                ai.authCheck(res);
            }

            if (!ai.responseCallback === undefined) {
                res = ai.responseCallback(res);
            }

            ai.debugMode("res", res);

            return res;
        };

        ai.responseError = function (res) {

            if (!ai.skipInterceptor) {
                ai.authCheck(res);
            }

            if (!(ai.responseErrorCallback == undefined)) {
                ai.responseErrorCallback(res);
            }

            ai.debugMode("resErr", res);

            return res;
        };

        return ai;

    }
      
    angular
    .module('ummuza')
    .config(configure)
    .run(runBlock);


    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.hashPrefix('!');

        $httpProvider.interceptors.push('HttpAuthInterceptorService');

        // This is required for Browser Sync to work poperly
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; 
        
        $urlRouterProvider
            .otherwise('/'); 
    }
    
    runBlock.$inject = ['$rootScope', '$transitions', 'navService'];

    function runBlock($rootScope, $transitions, navService) {
        'use strict';
        console.log('WebApp run() function...');

        $transitions.onSuccess({}, function (trans) {
            navService.refreshActiveMenu();
        });

    }
})();