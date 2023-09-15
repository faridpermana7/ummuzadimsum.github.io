(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('complaintCtrl', complaintCtrl);

    complaintCtrl.$inject = ['$scope', 'farst', '$window', '$timeout', 'datatableService',
        'pendingRequest', 'HttpService', '$state'];
    function complaintCtrl($scope, farst, $window, $timeout, datatableService,
        pendingRequest, http, $state){
        var cm = this;

        cm.ui = {}; 
        var data = {};
        data.ids = [];
        
        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="cm.ui.edit(' + data.productComplaintId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="cm.ui.delete(' + data.productComplaintId + ')">' +
                '   <i class="fa fa-times"></i>' +
                '</button>&nbsp;';

            // if (data.roleName != "Courier") {
            //     return btnEdit + btnDelete;
            // }
            return null; //btnEdit + btnDelete;
        };

        function datetimeFormat(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeUTC(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        } 

        cm.dtCallback = function (dt) {
            cm.datatable = dt.DataTable;
        }

        cm.ui.search = function () {
            cm.datatable.search(cm.Keyword).draw();
        }

        cm.ui.clear = function () {
            cm.productName = undefined;
        };
        
        cm.ui.filter = function () {

            var filters = [];

            if(cm.name){
                filters.push({
                    "field": "name",
                    "operator": "=",
                    "value":  cm.name 
                });
            } 
            data.filters = filters;
            cm.dtService.param = data;
            cm.datatable.draw()
        } 

        // cm.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     cm.dtService.param.data = data;
        //     cm.datatable.draw()
        // });

        cm.ui.add = function () {
            $state.go('app.management.complaint-entry', {
                'id': 'new'
            });
        };

        cm.ui.edit = function (data) {
            $state.go('app.management.complaint-entry', {
                'id': data
            });
        };

        cm.ui.delete = function (data) {
            service.deleteProduct({
                'Id': data
            }, cm.datatable);
			farst.loadingOut();
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            cm.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                cm.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            // mds.unregisterCallback(cm.logKey);
            pendingRequest.cancelAll();
        });

        cm.logKey = "";

        cm.init = function ($scope) {    
			// var user = $window.localStorage.getItem('user'); 
			// $timeout(function () {
			// 	user = JSON.parse(user); 
			// 	if(user.parentMemberName != undefined){
			// 		cm.isVisibleMember = false;
            //     } 
            //     cm.parentMemberId = user.memberId;
            //     cm.getMemberList();
			// 	// console.log(nav.user);
			// }, 0); 

            // cm.logKey = mds.registerCallback(onNotifyLogin, true);
            // cm.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            cm.dtService = datatableService.getService();
            cm.dtOptions = cm.dtService.initTable($scope, '/complaints/get', {
                route: 'app.management.complaint-entry',
                fixedColumn: [3, 1]
            }, 'productComplaintId', false, null, null, {
                onStateSaveParam: function (data) {
                    // data.statusFilter = cm.status;
                    // data.memberFilter = cm.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        cm.Keyword = data.search.search;
                        // cm.status = data.statusFilter;
                        // cm.memberId = data.memberFilter;
                    }
                }
            });

            cm.dtColumns = cm.dtService.setColumn(
                [{
                        "data": "complaintId",
                        "className": "text-center"
                    },
                    {
                        "data": "name"
                    },
                    {
                        "data": "email", 
                    }, 
                    {
                        "data": "title", 
                    }, 
                    {
                        "data": "isi", 
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

            cm.isCollapsed = true;  
        }($scope); 

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    cm.reloadData();
                }
            }
        } 
         

        return cm;
    };
    
})();

