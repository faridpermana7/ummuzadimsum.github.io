(function () {
    'use strict';
 
    angular
        .module('ummuza')
        .controller('appCtrl', App);

    App.$inject = ['$rootScope', '$scope', 'HttpService', '$window'];

    function App($rootScope, $scope, http, $window) {
        var vm = this;

        vm.login = {}; 

        vm.setLoginMod = function (val) {
            vm.login = val;
        };

        return vm;
    }

})();