(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('orderCtrl', orderCtrl);

    orderCtrl.$inject = ['$scope', 'farst', '$window', '$timeout', 'datatableService',
        'pendingRequest', 'orderEntryService', 'HttpService', '$state'];
    function orderCtrl($scope, farst, $window, $timeout, datatableService,
        pendingRequest, service, http, $state){
        var od = this;

        od.ui = {};
        od.paymentMethod = 'all'; 
        var data = {};
        data.ids = [];
        
        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="od.ui.edit(' + data.customerOrderId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="od.ui.delete(' + data.customerOrderId + ')">' +
                '   <i class="fa fa-times"></i>' +
                '</button>&nbsp;';

            // if (data.roleName != "Courier") {
            //     return btnEdit + btnDelete;
            // }
            return btnEdit + btnDelete;
        };

        function datetimeFormat(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeUTC(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        } 

        od.dtCallback = function (dt) {
            od.datatable = dt.DataTable;
        }

        od.ui.search = function () {
            od.datatable.search(od.Keyword).draw();
        }

        od.ui.clear = function () {
            od.orderNumber = undefined;
            od.customerName = undefined; 
            od.paymentMethod = undefined; 
        };
        
        od.ui.filter = function () {

            var filters = [];

            if(od.orderNumber){
                filters.push({
                    "field": "orderNumber",
                    "operator": "=",
                    "value":  od.orderNumber 
                });
            }
            if(od.customerName){
                filters.push({
                    "field": "customerName",
                    "operator": "=",
                    "value": od.customerName 
                });
            } 
            if(od.paymentMethod != undefined && od.paymentMethod != 'all'){
                filters.push({
                    "field": "paymentMethod",
                    "operator": "=",
                    "value": od.paymentMethod 
                });
            }  

            data.filters = filters;
            od.dtService.param = data;
            od.datatable.draw()
        } 

        // od.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     od.dtService.param.data = data;
        //     od.datatable.draw()
        // });

        od.ui.add = function () {
            $state.go('app.management.order-entry', {
                'id': 'new'
            });
        };

        od.ui.edit = function (data) {
            $state.go('app.management.order-entry', {
                'id': data
            });
        };

        od.ui.delete = function (data) {
            service.deleteOrder({
                'Id': data
            }, od.datatable);
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            od.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                od.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            // mds.unregisterCallback(od.logKey);
            pendingRequest.cancelAll();
        });

        od.logKey = "";

        od.init = function ($scope) {    
			// var user = $window.localStorage.getItem('user'); 
			// $timeout(function () {
			// 	user = JSON.parse(user); 
			// 	if(user.parentMemberName != undefined){
			// 		od.isVisibleMember = false;
            //     } 
            //     od.parentMemberId = user.memberId;
            //     od.getMemberList();
			// 	// console.log(nav.user);
			// }, 0); 

            // od.logKey = mds.registerCallback(onNotifyLogin, true);
            // od.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            od.dtService = datatableService.getService();
            od.dtOptions = od.dtService.initTable($scope, '/customerorders/get', {
                route: 'app.management.order-entry',
                fixedColumn: [3, 1]
            }, 'customerOrderId', false, null, null, {
                onStateSaveParam: function (data) {
                    // data.statusFilter = od.status;
                    // data.memberFilter = od.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        od.Keyword = data.search.search;
                        // od.status = data.statusFilter;
                        // od.memberId = data.memberFilter;
                    }
                }
            });

            od.dtColumns = od.dtService.setColumn(
                [{
                        "data": "customerOrderId",
                        "className": "text-center"
                    },
                    {
                        "data": "orderNumber", 
                    }, 
                    {
                        "data": "orderDate",
                        "render": datetimeFormat
                    }, 
                    {
                        "data": "customerName",
                    }, 
                    {
                        "data": "finalPrice",
                    },  
                    {
                        "data": "paymentMethod",
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

            od.isCollapsed = true; 
            //set statusFilter
            od.paymentMethodParam = [{
                    value: 'all',
                    label: "All"
                },
                {
                    value: 'Transfer',
                    label: "Transfer"
                },
                {
                    value: 'cod1',
                    label: "COD (Ambil Sendiri)"
                },
                {
                    value: 'cod2',
                    label: "COD (Kirim Ojol)"
                }
            ];  
        }($scope); 

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    od.reloadData();
                }
            }
        } 
         

        return od;
    };
    
})();

