(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('productCtrl', productCtrl);

    productCtrl.$inject = ['$scope', 'farst', '$window', '$timeout', 'datatableService',
        'pendingRequest', 'ConfigService', 'HttpService'];
    function productCtrl($scope, farst, $window, $timeout, datatableService,
        pendingRequest, cs, http){
        var pd = this;

        pd.ui = {};
        pd.category = 'all'; 
        var data = {};
        data.ids = [];
        
        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="pd.ui.edit(' + data.productMenuId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="pd.ui.delete(' + data.productMenuId + ')">' +
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

        pd.dtCallback = function (dt) {
            pd.datatable = dt.DataTable;
        }

        pd.ui.search = function () {
            pd.datatable.search(pd.Keyword).draw();
        }

        pd.ui.clear = function () {
            pd.title = undefined;
            pd.subtitle = undefined; 
            pd.category = undefined; 
        };
        
        pd.ui.filter = function () {

            var filters = [];

            if(pd.title){
                filters.push({
                    "field": "title",
                    "operator": "=",
                    "value":  pd.title 
                });
            }
            if(pd.subtitle){
                filters.push({
                    "field": "subtitle",
                    "operator": "=",
                    "value": pd.subtitle 
                });
            } 
            if(pd.category != undefined && pd.category != 'all'){
                filters.push({
                    "field": "category",
                    "operator": "=",
                    "value": pd.category 
                });
            }  

            data.filters = filters;
            pd.dtService.param = data;
            pd.datatable.draw()
        } 

        // pd.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     pd.dtService.param.data = data;
        //     pd.datatable.draw()
        // });

        pd.ui.add = function () {
            $state.go('app.manage.product-entry', {
                'id': 'new'
            });
        };

        pd.ui.edit = function (data) {
            $state.go('app.manage.product-entry', {
                'id': data
            });
        };

        pd.ui.delete = function (data) {
            service.deleteUser({
                'Id': data
            }, pd.datatable);
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            pd.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                pd.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            // mds.unregisterCallback(pd.logKey);
            pendingRequest.cancelAll();
        });

        pd.logKey = "";

        pd.init = function ($scope) {    
			// var user = $window.localStorage.getItem('user'); 
			// $timeout(function () {
			// 	user = JSON.parse(user); 
			// 	if(user.parentMemberName != undefined){
			// 		pd.isVisibleMember = false;
            //     } 
            //     pd.parentMemberId = user.memberId;
            //     pd.getMemberList();
			// 	// console.log(nav.user);
			// }, 0); 

            // pd.logKey = mds.registerCallback(onNotifyLogin, true);
            // pd.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            pd.dtService = datatableService.getService();
            pd.dtOptions = pd.dtService.initTable($scope, '/maintainmenus/get', {
                route: 'app.manage.product-entry',
                fixedColumn: [3, 1]
            }, 'productMenuId', false, null, null, {
                onStateSaveParam: function (data) {
                    // data.statusFilter = pd.status;
                    // data.memberFilter = pd.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        pd.Keyword = data.search.search;
                        // pd.status = data.statusFilter;
                        // pd.memberId = data.memberFilter;
                    }
                }
            });

            pd.dtColumns = pd.dtService.setColumn(
                [{
                        "data": "productMenuId",
                        "className": "text-center"
                    },
                    {
                        "data": "category"
                    },
                    {
                        "data": "title"
                    },
                    {
                        "data": "subtitle",
                        "className": "text-center"
                    },
                    // {
                    //     "data": "src",
                    // },
                    // {
                    //     "data": "delay",
                    //     "className": "text-center"
                    // },
                    {
                        "data": "discountPrice",
                        "className": "text-right"
                    },
                    {
                        "data": "originPrice", 
                        "className": "text-right"
                    },
                    // {
                    //     "data": "isDiscount",
                    // },
                    // {
                    //     "data": "isNew", 
                    // },
                    // {
                    //     "data": "isBest",
                    // },
                    {
                        "data": "stok", 
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

            pd.isCollapsed = true; 
            //set statusFilter
            pd.catParam = [{
                    value: 'all',
                    label: "All"
                },
                {
                    value: 'ori',
                    label: "Original"
                },
                {
                    value: 'mix',
                    label: "Mix Menu"
                },
                {
                    value: 'HAMPRES',
                    label: "Hampres"
                },
                {
                    value: 'Frozen',
                    label: "Frozen"
                } 
            ];  
        }($scope);

        function getUserProfile(data) {
            return "<img src='" + cs.config.getApiUrl() + "/galery/profile-picture/" + data + "' style='width:20px'/>";
        }

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    pd.reloadData();
                }
            }
        } 
         

        return pd;
    };
    
})();

