(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('roleEntryCtrl', RoleEntry)

    RoleEntry.$inject = ['$scope','$timeout', '$stateParams', '$state', 'roleEntryService', 
        'farst', 'validationService', 'HttpService', 'pendingRequest', 'modalLoginService'];

    function RoleEntry($scope, $timeout, sParam, $state, service, farst, validation, 
        http, pendingRequest, mds) {
        var rle = this; 

        rle.isCreate = sParam.id == 'new' ? true : false;
        rle.ui = {};
        rle.model = {};

        rle.accessLevel = [{
            id: 1,
            name: 'Developer'
        }, {
            id: 2,
            name: 'Administrator'
        }, {
            id: 3,
            name: 'Operator'
        }];

        rle.ui.back = function () {
            $state.go('app.sys.role');
        };
        rle.ui.save = function () {

            rle.model.isActive = rle.model.isActive == true ? 1 : 0 ;
            if (rle.isCreate) {
                service.saveRole(rle.model, function (data) {
                    $state.go('app.sys.role-entry', {
                        id: data
                    });
                });
            } else {
                service.updateRole(rle.model, function () {
                    $state.go('app.sys.role');
                });
            }
        }

        rle.getMenus = function (keyword) {
            return http.post('/roles/getById', {
                'id': parseInt(sParam.id)
            }).then(function (res) {
                rle.model.roleAccess = res.data.data.records;
                // console.log(rle.model.roleAccessLevels );
            });
        };

        function getEntry(res) {
            rle.model = res.data.data.records[0];
            rle.prefType = rle.model.type;
            rle.getMenus();
            
            rle.model.isActive = rle.model.isActive == 1 ? true : false ;
            //rle.model.birthDate = farst.l.toLocaleDateObject(rle.model.birthDate);
            farst.loadingOut();
        }

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            mds.unregisterCallback(rle.logKey);
            pendingRequest.cancelAll();
        });

        rle.changeRoleType = function(data){
            farst.loadingIn();
            console.log(data);
            // rle.model.roleAccess = []; 
			farst.Alert.confirm(
                'Perubahan Role',
                'Are you sure you want to change this role? you will lost your data.',
                function () { 

                    $scope.$apply(function(){
                        rle.model.roleAccess.forEach(element => {
                            element.access = false;
                            element.read = false;
                            element.write = false;
                            element.delete = false; 
                        });
                        rle.prefType = rle.model.type; 
                    });
                },
                function () { 
                    $scope.$apply(function(){
                        rle.model.type = rle.prefType;
                    });
                } 
            );
            farst.loadingOut();
        };


        rle.logKey = "";

        rle.init = function () {
            rle.logKey = mds.registerCallback(onNotifyLogin, true);

            farst.loadingIn();
            rle.opts = farst.singleDateFormat(farst.l.DATEFORMAT);

            if (!rle.isCreate) {
                http.post('/roles/get', {
                    'id': parseInt(sParam.id)
                }).then(getEntry)
            }


            //validation
            rle.validate = function (field, validate) {
                return validation.formValidation($scope, 'roleForm', field, validate);
            }
            rle.dCurrency = farst.dCurrency;
            farst.loadingOut();
        }($scope);

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    rle.init();
                }
            }
        }

        return rle;
    };
})();