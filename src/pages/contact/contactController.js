(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('contCtrl', contCtrl);

    contCtrl.$inject = ['$scope', '$http', 'HttpService'];
    function contCtrl($scope, $http, http){
        var ct = this;
         
        return ct;
    };
    
})();

