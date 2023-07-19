(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .controller('sysMenuCtrl', sysMenu);

        sysMenu.$inject = ['$scope', '$state', 'datatableService', 
            'farst', 'pendingRequest', 'modalLoginService'];

    function sysMenu($scope, $state, datatableService, farst, pendingRequest, mds) {

        var sm = this;
        sm.ui = {};
        sm.status = true;
        var data = {};
        data.ids = [];

        function action(data, type, full, meta) {
            return '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="sm.showMenuModal(' + data.menuId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button class="btn btn-default" rel="tooltip" title="Api" ng-click="sm.showMenuApiModal(' + data.menuId + ')">' +
                '   <i class="fas fa-code"></i>' +
                '</button>&nbsp;' +
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="sm.ui.delete(' + data.menuId + ')">' +
                '   <i class="fa fa-times"></i>' +
                '</button>&nbsp;';
        };

        function dateFormat(data, type, full, meta) {
            return farst.l.toLocaleDateStr(data, farst.l.DATETIME_FORMAT);
        }

        sm.dtCallback = function (dt) {
            sm.datatable = dt.DataTable;
        }

        sm.ui.search = function () {
            sm.datatable.search(sm.Keyword).draw();
            // console.log(sm.Keyword);
        }
        
        sm.ui.filter = function () {

            var filters = [];

            if(sm.name){
                filters.push({
                    "field": "name",
                    "operator": "=",
                    "value":  sm.name 
                });
            }
            if(sm.code){
                filters.push({
                    "field": "code",
                    "operator": "=",
                    "value": sm.code 
                });
            }
            if(sm.pathName){
                filters.push({
                    "field": "pathName",
                    "operator": "=",
                    "value": sm.pathName 
                });
            }
            if(sm.status != undefined && sm.status != 100){
                filters.push({
                    "field": "isActive",
                    "operator": "=",
                    "value": sm.status
                });
            } 

            data.filters = filters;
            sm.dtService.param = data;
            sm.datatable.draw()
        }
        
        sm.ui.clear = function () { 
            sm.name = undefined;
            sm.code = undefined;
            sm.path = undefined;
            sm.status = 100; 
        }

        // sm.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     sm.dtService.param.data = data;
        //     sm.datatable.draw()
        // });

        sm.ui.add = function () {
            $state.go('app.management.menu-entry', {
                'id': 'new'
            });
        };

        sm.ui.edit = function (data) {
            $state.go('app.management.menu-entry', {
                'id': data
            });
        };

        sm.ui.delete = function (data) {
            service.deleteMenu({
                'Id': data
            }, sm.datatable);
        };

        sm.showMenuModal = function (menuId) {
            // console.log(sm.modalMenuCallback.modalInstance);
            sm.modalMenuCallback.modalInstance({
                menuId: menuId || 'new'
            });
        };

        sm.onModalMenuCloseCallback = function (data) { 
            if (data) {
                // sm.dtService.param.data.status = 100;
                sm.datatable.draw();
            }
        };

        sm.showMenuApiModal = function (menuId) {
            // console.log(sm.modalMenuCallback.modalInstance);
            sm.modalMenuApiCallback.modalInstance({
                menuId: menuId || 'new'
            });
        };


        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            sm.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                sm.datatable.columns.adjust();
            }, 700);
        });

        sm.logKey = "";

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            mds.unregisterCallback(sm.logKey);
            pendingRequest.cancelAll();
        });

        sm.init = function ($scope, mds) { 
            sm.dtService = datatableService.getService(); 
            
            var filters = [{
                "field": "isActive",
                "operator": "=",
                "value": sm.status
            }]; 
            data.filters = filters;
            sm.dtService.param = data;
            sm.dtOptions = sm.dtService.initTable($scope, '/menus/get', {
                route: 'app.management.menu-entry',
                fixedColumn: [3, 1], 
            }, 'menuId', false, null, null, {
                onStateLoadCallback: function (data) {
                    if (data) sm.Keyword = data.search.search;
                }
            });

            sm.dtColumns = sm.dtService.setColumn(
                [{
                    "data": "menuId",
                    "className": "text-center", 
                    "searchable": false,
                    "orderable": false,
                    "targets": 0,
                },
                {
                    "data": "name"
                },
                {
                    "data": "menuCode",
                    "className": "text-center"
                },
                {
                    "data": "path"
                },
                {
                    "data": "sequence",
                    "className": "text-center"
                },
                {
                    'data': 'icon',
                    'title': '',
                    'render': function (data) {
                        return "<i class='" + data + "'></i>";
                    },
                    "className": "text-center"
                },
                {
                    "data": "isGroup",
                    "render": checkBoolean,
                    "sortable": false,
                    "className": "text-center"
                },
                {
                    "data": "isActive",
                    "render": checkBoolean,
                    "sortable": false,
                    "className": "text-center"
                },
                {
                    'data': null,
                    'title': '',
                    'render': action,
                    "className": "text-center"
                }
                ]);

            sm.logKey = mds.registerCallback(onNotifyLogin, true);

            sm.isCollapsed = true;
            //set statusFilter
            sm.statusParam = [{
                    value: 100,
                    label: "All"
                },
                {
                    value: true,
                    label: "Active"
                },
                {
                    value: false,
                    label: "Disable"
                }
            ]; 
        }($scope, mds);

        function checkBoolean(data) {
            return data ? "<i class='fas fa-check'></i>" : ""
        }

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    sm.datatable.draw();
                }
            }
        }

        return sm;
    };
})();