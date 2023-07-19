(function () {
    "use strict";   

    angular.module('ummuza')
    .controller('footerCtrl', footerCtrl); 
    
    footerCtrl.$inject = ['$scope', 'farst', 'HttpService']; 
    function footerCtrl($scope, farst, http){
        var ft = this; 
        // start menus order
        ft.showFooter = true;    
        return ft;
    };
 
})();

