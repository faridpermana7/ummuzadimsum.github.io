(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('sysMenuEntryCtrl', MenuEntry)

    MenuEntry.$inject = ['$scope', '$stateParams', '$state', 'sysMenuEntryService', 
        'farst', 'validationService', 'HttpService', 'pendingRequest'];

    function MenuEntry($scope, sParam, $state, service, farst, validation, http, pendingRequest) {
        var sme = this; 
        sme.menuId = service.modalInstance.data.menuId;
        sme.isCreate = sme.menuId == 'new' ? true : false;
        sme.titleForm = sme.isCreate ? "New Menu" : "Edit Menu";
        sme.ui = {};
        sme.model = {};
        sme.model.subPath = []; 
        sme.menuParents = [];
        
        // sme.accessLevel = [{
        //     id: 1,
        //     name: 'Root'
        // }, {
        //     id: 2,
        //     name: 'Dev'
        // }, {
        //     id: 4,
        //     name: 'User'
        // }, {
        //     id: 8,
        //     name: 'Root Menu'
        // }];

        sme.accessLevel = [{
            id: 0,
            name: 'Root'
        },{
            id: 1,
            name: 'Developer'
        }, {
            id: 2,
            name: 'Administrator'
        }, {
            id: 3,
            name: 'Operator'
        }];

        sme.ui.back = function () {
            $state.go('app.management.sysmenu');
        };
        sme.ui.save = function () {
            var d = sme.model;

            if (sme.isCreate) {
                service.saveMenu(d, function () {
                    service.modalInstance.close(true);
                    $state.go('app.management.sysmenu');
                });
            } else {
                service.updateMenu(d, function () {
                    service.modalInstance.close(true);
                    $state.go('app.management.sysmenu');
                });
            }
        }

        sme.closeModal = function () {
            service.modalInstance.close();
            $state.go('app.management.sysmenu');
        }

        sme.addSubPath = function(){
            console.log(sme.model.subPath);
            sme.model.subPath.push({path: ""});
        }

        sme.removeSubPath = function(index){
            sme.model.subPath.splice(index, 1);
        }

        sme.getMenus = function (isCreate) {
            if (!isCreate) {
                http.post('/menus/get', {
                    'id': sme.menuId
                }).then(function (res) {
                    sme.model = res.data.data.records[0];
                })
            }
            console.log(sme.model);
            farst.loadingOut();
        }

        sme.getParents = function () {
            return http.post('/menus/group/get',{ 
                "ids": [],
                "filters": [], 
                "pageSize":100,
                "keyword": ""
            }).then(function (res) {
                sme.menuParents = res.data.data.records;
                sme.model.menuAccessType = 4;
                sme.model.parentMenuId = 7;
                sme.getMenus(sme.isCreate);
            });
        };

        sme.iconCallback = function (data) {
            if (data) sme.model.icon = data;
        }

        $scope.$on('$destroy', function () {
            // pendingRequest.cancelAll();
        });

        sme.init = function () {
            farst.loadingIn();
            sme.getParents();

            //validation
            sme.validate = function (field, validate) {
                return validation.formValidation($scope, 'menu', field, validate);
            }
            // sme.dCurrency = farst.dCurrency;

        }($scope);

        return sme;
    };
})();