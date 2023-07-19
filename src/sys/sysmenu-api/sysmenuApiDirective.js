(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .directive('modalMenuApi', modalDirective);

    function modalDirective($uibModal, sysMenuApiService) {
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
                        templateUrl: 'src/sys/sysmenu-api/sysmenu-api.html',
                        controller: 'sysMenuApiCtrl',
                        controllerAs: 'mna',
                        keyboard : false,
                        windowClass: 'modal-menu-api'
                    });
                    sysMenuApiService.modalInstance = modalInstance;
                    sysMenuApiService.modalInstance.data = data;

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