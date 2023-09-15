(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('majorityCtrl', majorityCtrl);

    majorityCtrl.$inject = ['$scope', 'farst', '$window', '$timeout', 'datatableService',
        'pendingRequest', 'majorityEntryService', 'HttpService', '$state'];
    function majorityCtrl($scope, farst, $window, $timeout, datatableService,
        pendingRequest, service, http, $state){
        var mj = this;

        mj.ui = {}; 
        var data = {};
        data.ids = [];
        
        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="mj.ui.edit(' + data.productMajorityId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="mj.ui.delete(' + data.productMajorityId + ')">' +
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

        mj.dtCallback = function (dt) {
            mj.datatable = dt.DataTable;
        }

        mj.ui.search = function () {
            mj.datatable.search(mj.Keyword).draw();
        }

        mj.ui.clear = function () {
            mj.productName = undefined;
        };
        
        mj.ui.filter = function () {

            var filters = [];

            if(mj.title){
                filters.push({
                    "field": "productName",
                    "operator": "=",
                    "value":  mj.productName 
                });
            } 
            data.filters = filters;
            mj.dtService.param = data;
            mj.datatable.draw()
        } 

        // mj.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     mj.dtService.param.data = data;
        //     mj.datatable.draw()
        // });

        mj.ui.add = function () {
            $state.go('app.management.majority-entry', {
                'id': 'new'
            });
        };

        mj.ui.edit = function (data) {
            $state.go('app.management.majority-entry', {
                'id': data
            });
        };

        mj.ui.delete = function (data) {
            service.deleteProduct({
                'Id': data
            }, mj.datatable);
			farst.loadingOut();
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            mj.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                mj.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            // mds.unregisterCallback(mj.logKey);
            pendingRequest.cancelAll();
        });

        mj.logKey = "";

        mj.init = function ($scope) {    
			// var user = $window.localStorage.getItem('user'); 
			// $timeout(function () {
			// 	user = JSON.parse(user); 
			// 	if(user.parentMemberName != undefined){
			// 		mj.isVisibleMember = false;
            //     } 
            //     mj.parentMemberId = user.memberId;
            //     mj.getMemberList();
			// 	// console.log(nav.user);
			// }, 0); 

            // mj.logKey = mds.registerCallback(onNotifyLogin, true);
            // mj.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            mj.dtService = datatableService.getService();
            mj.dtOptions = mj.dtService.initTable($scope, '/maintainmajorities/get', {
                route: 'app.management.majority-entry',
                fixedColumn: [3, 1]
            }, 'productMajorityId', false, null, null, {
                onStateSaveParam: function (data) {
                    // data.statusFilter = mj.status;
                    // data.memberFilter = mj.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        mj.Keyword = data.search.search;
                        // mj.status = data.statusFilter;
                        // mj.memberId = data.memberFilter;
                    }
                }
            });

            mj.dtColumns = mj.dtService.setColumn(
                [{
                        "data": "productMajorityId",
                        "className": "text-center"
                    },
                    {
                        "data": "productName"
                    },
                    {
                        "data": "detail", 
                    }, 
                    {
                        "data": "delay",
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

            mj.isCollapsed = true;  
        }($scope); 

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    mj.reloadData();
                }
            }
        } 
         

        return mj;
    };
    
})();

