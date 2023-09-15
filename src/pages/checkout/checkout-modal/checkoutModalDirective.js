(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .directive('modalCheckout', modalDirective);

    function modalDirective($uibModal, checkoutModalService) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                callback: '=',
                // param: '=',
                // modalItemMethod: '=',
                onCloseCallback: '=',
                // openModalItem: '='
            },
            link: function (scope, element, attrs) {
                scope.callback = scope;
                scope.modalInstance = function (data) {

                    var modalInstance = $uibModal.open({
                        backdrop: 'static',
                        templateUrl: 'src/pages/checkout/checkout-modal/checkout-modal.html',
                        controller: 'checkoutModalCtrl',
                        controllerAs: 'ckm',
                        keyboard : false,
                        windowClass: 'modal-checkout'
                    });
                    checkoutModalService.modalInstance = modalInstance;
                    checkoutModalService.modalInstance.data = data;

                    modalInstance.result.then(function (data) {
                        // console.log(data);
                        if (scope.onCloseCallback) {
                            scope.onCloseCallback(data);
                        }
                    }, function () { });
                };
            }
        };
    }

})();