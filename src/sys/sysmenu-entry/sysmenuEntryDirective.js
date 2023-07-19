(function () {
    'use strict';
 
    angular
        .module('ummuza')
        .directive('modalMenuEntry', modalDirective);

    function modalDirective($uibModal, sysMenuEntryService) {
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
                        templateUrl: 'src/sys/sysmenu-entry/sysmenu-entry.html',
                        controller: 'sysMenuEntryCtrl',
                        controllerAs: 'sme',
                        keyboard : false,
                        windowClass: ''
                    });
                    sysMenuEntryService.modalInstance = modalInstance;
                    sysMenuEntryService.modalInstance.data = data;

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