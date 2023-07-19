(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('sysMenuApiCtrl', sysMenuApiCtrl)

    sysMenuApiCtrl.$inject = ['$scope', '$stateParams', '$state', 'sysMenuApiService', 
        'farst', 'validationService', 'HttpService', 'pendingRequest'];

    function sysMenuApiCtrl($scope, sParam, $state, service, farst, validation, 
        http, pendingRequest) {
        var mna = this; 
        mna.menuId = service.modalInstance.data.menuId;
        mna.isCreate = mna.menuId == 'new' ? true : false;
        mna.titleForm = mna.isCreate ? "New Menu API" : "Edit Menu API";
        mna.ui = {};
        mna.model = {};
        mna.claimTypeList = [
            {
                id: 1, name: "read"
            },
            { id: 2, name: "write" },
            { id: 3, name: "delete" }];

        $scope.$on('$destroy', function () {
            // pendingRequest.cancelAll();
        });

        mna.closeModal = function () {
            service.modalInstance.close();
        };

        mna.addApi = function (type) {
            switch (type) {
                case 1: mna.model.read.push({});
                break;
                case 2: mna.model.write.push({});
                break;
                case 3: mna.model.delete.push({});
                break;
            }
        };

        mna.removeApi = function (type, index) {
            switch (type) {
                case 1: mna.model.read.splice(index, 1);
                break;
                case 2: mna.model.write.splice(index, 1);
                break;
                case 3: mna.model.delete.splice(index, 1);
                break;
            }
        };

        mna.ui.save = function(){
            service.update(mna.model, function(){
                service.modalInstance.close();
            });
        }

        mna.init = function () {
            // farst.loadingIn();
            //validation
            http.post('/menus/claim-get', {
                'id': mna.menuId
            }).then(function (res) {
                mna.model = res.data.data.records[0];
            });

            mna.validate = function (field, validate) {
                return validation.formValidation($scope, 'menuApi', field, validate);
            }

        }($scope);

        return mna;
    };
})();