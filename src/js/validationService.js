(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .factory('validationService', Validation);

    Validation.$inject = [];

    function Validation() {
        var vm = this;

        vm.formValidation = function (scope, form, field, validation) {
            try {
                if (validation) {
                    return (scope[form][field].$dirty && scope[form][field].$error[validation]) || (scope[form].$submitted && scope[form][field].$error[validation]);
                }
                return (scope[form][field].$dirty && scope[form][field].$invalid) || (scope[form].$submitted && scope[form][field].$invalid);
            } catch (e) {

            }
        }
        return vm;
    }

})();