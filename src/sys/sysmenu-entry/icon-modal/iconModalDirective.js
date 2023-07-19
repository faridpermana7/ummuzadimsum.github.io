(function () {
    'use strict';
 
    angular
        .module('ummuza')
        .directive('modalIcon', modalDirective);

    function modalDirective($uibModal) {
        return {
            restrict: 'A',
            scope: {
                callback: '=',
                param: '='
            },
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'src/sys/sysmenu-entry/icon-modal/icon-modal.html',
                        controller: 'IconModalCtrl',
                        controllerAs: 'modal',
                        windowTopClass: 'modal-icon',
                        keyboard : false,
                        resolve: {
                            param: function () {
                                return scope.param
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {
                        //console.log(data);
                        if (scope.callback) {
                            scope.callback(data);
                        }
                    }, function () { });
                });
            }
        };
    }

})();