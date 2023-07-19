(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('aboutCtrl', aboutCtrl);

    aboutCtrl.$inject = ['$scope', '$http', 'HttpService'];
    function aboutCtrl($scope, $http, http){
        var ab = this;
         
        return ab;
    };
    
})();

