(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .controller('roleCtrl', Role);

    Role.$inject = ['$scope', '$state', 'datatableService', 'roleEntryService', 'farst', 
        'pendingRequest', 'modalLoginService'];

    function Role($scope, $state, datatableService, service, farst, pendingRequest, mds) {

        var rl = this;
        rl.ui = {};
        rl.status = 100;
        var data = {};
        data.ids = [];

        function action(data, type, full, meta) {
            var buttons =  '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="rl.ui.edit(' + data.roleId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';

            if(data.module != "COU"){
                buttons +='<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="rl.ui.delete(' + data.roleId + ')">' +
                '   <i class="fa fa-times"></i>' +
                '</button>&nbsp;';
            }
            return buttons;
        };

        function getRoleType(type) {
            var roleType = "";
            switch (type) {
                case 1:
                    roleType = "Developer";
                    break;
                case 2:
                    roleType = "Administrator";
                    break;
                case 3:
                    roleType = "Operator";
                    break;
            }
            return roleType;
        }

        function datetimeFormat(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeUTC(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        } 


        rl.dtCallback = function (dt) {
            rl.datatable = dt.DataTable;
        }

        rl.ui.search = function () {
            rl.datatable.search(rl.Keyword).draw();
        }

        rl.ui.clear = function () {
            rl.username = undefined;
            rl.fullName = undefined;
            rl.roleName = undefined;
            rl.status = undefined;
        };
        
        rl.ui.filter = function () {

            var filters = [];

            if(rl.name){
                filters.push({
                    "field": "name",
                    "operator": "=",
                    "value":  rl.name 
                });
            }
            if(rl.type){
                filters.push({
                    "field": "type",
                    "operator": "=",
                    "value": rl.type 
                });
            } 
            if(rl.status != undefined && rl.status != 100){
                filters.push({
                    "field": "isActive",
                    "operator": "=",
                    "value": rl.status 
                });
            } 

            data.filters = filters;
            rl.dtService.param = data;
            rl.datatable.draw()
        }

        rl.ui.opts = farst.getDateRange(function (data) {
            //when click apply
            data.StartDate = data.model.startDate;
            data.EndDate = data.model.endDate;
            rl.dtService.param.data = data;
            rl.datatable.draw()
        });

        rl.ui.add = function () {
            $state.go('app.sys.role-entry', {
                'id': 'new'
            });
        };

        rl.ui.edit = function (data) {
            $state.go('app.sys.role-entry', {
                'id': data
            });
        };

        rl.ui.delete = function (data) {
            service.deleteRole({
                'Id': data
            }, rl.datatable);
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            rl.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                rl.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            mds.unregisterCallback(rl.logKey);
            pendingRequest.cancelAll();
        });


        rl.logKey = "";

        rl.init = function ($scope, mds) {
            farst.loadingIn();
            rl.logKey = mds.registerCallback(onNotifyLogin, true);

            rl.date = {
                startDate: farst.l.getDate().subtract(7, "days"),
                endDate: farst.l.getDate()
            };

            rl.dtService = datatableService.getService();

            rl.dtOptions = rl.dtService.initTable($scope, '/roles/get', {
                route: 'app.role-entry',
                fixedColumn: [3, 1]
            }, 'roleId');

            rl.dtColumns = rl.dtService.setColumn(
                [{
                    "data": "roleId",
                    "className": "text-center"
                },
                {
                    "data": "name"
                },,
                {
                    "data": "type",
                    "render": getRoleType,
                    "className": "text-center"
                },
                {
                    "data": "status",
                    "className": "text-center"
                },
                {
                    "data": "updatedBy",
                    "className": "text-center"
                },
                {
                    "data": "updatedDate",
                    "render": datetimeFormat
                },
                {
                    'data': null,
                    'title': '',
                    'render': action,
                    "className": "text-center"
                }
                ]);

            rl.isCollapsed = true;
            //set statusFilter
            rl.statusParam = [{
                value: 100,
                label: "All"
            },
            {
                value: 0,
                label: "Disable"
            },
            {
                value: 1,
                label: "Enable"
            }
            ];
            farst.loadingOut();
        }($scope, mds);

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    rl.datatable.draw();
                }
            }
        }

        return rl;
    };
})();