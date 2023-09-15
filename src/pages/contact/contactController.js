(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('contCtrl', contCtrl);

    contCtrl.$inject = ['$scope', '$state', '$http', 'HttpService', 'contactService', 'validationService'];
    function contCtrl($scope, $state, $http, http, service, validation){
        var ct = this;
        ct.ui = {};
        ct.model = {};    
         
        ct.ui.save = function () {   
            service.saveComplaint(ct.model, function () {
                ct.model = {};
                $state.go('app.pages.contact');
            });
        } 
        
        ct.init = function () {
            //validation
            ct.validate = function (field, validate) {
                return validation.formValidation($scope, 'contact', field, validate);
            }
            
        }($scope);
        return ct;
    };
})();
