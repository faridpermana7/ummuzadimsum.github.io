(function () {
    'use strict';    

    angular
        .module('ummuza')
        .controller('userCtrl', User);

    User.$inject = ['$scope', '$state', '$window', '$timeout', 'datatableService', 'userEntryService'
    , 'farst', 'pendingRequest', 'modalLoginService', 'ConfigService', 'HttpService'];

    function User($scope, $state, $window, $timeout, datatableService, service
        , farst, pendingRequest, mds, cs, http) {

        var usr = this;
        usr.ui = {};
        usr.status = 100;
        usr.memberId = 0;
        usr.parentMemberId = 100;
        usr.isVisibleMember = true;
        var data = {};
        data.ids = [];

        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="usr.ui.edit(' + data.userId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="usr.ui.delete(' + data.userId + ')">' +
                '   <i class="fa fa-times"></i>' +
                '</button>&nbsp;';

            if (data.roleName != "Courier") {
                return btnEdit + btnDelete;
            }
            return btnEdit;
        };

        function datetimeFormat(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeUTC(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        } 

        usr.dtCallback = function (dt) {
            usr.datatable = dt.DataTable;
        }

        usr.ui.search = function () {
            usr.datatable.search(usr.Keyword).draw();
        }

        usr.ui.clear = function () {
            usr.username = undefined;
            usr.fullName = undefined;
            usr.roleName = undefined;
            usr.status = undefined;
            usr.memberId = undefined;
            usr.listMember = undefined;
        };
        
        usr.ui.filter = function () {

            var filters = [];

            if(usr.username){
                filters.push({
                    "field": "username",
                    "operator": "=",
                    "value":  usr.username 
                });
            }
            if(usr.fullName){
                filters.push({
                    "field": "fullName",
                    "operator": "=",
                    "value": usr.fullName 
                });
            }
            if(usr.roleName){
                filters.push({
                    "field": "roleName",
                    "operator": "=",
                    "value": usr.roleName 
                });
            }
            if(usr.status != undefined && usr.status != 100){
                filters.push({
                    "field": "isActive",
                    "operator": "=",
                    "value": usr.status 
                });
            } 
            if(usr.memberId != undefined && usr.memberId != 0 && usr.isVisibleMember == true){
                filters.push({
                    "field": "memberId",
                    "operator": "=",
                    "value": usr.memberId 
                });
            } 

            data.filters = filters;
            usr.dtService.param = data;
            usr.datatable.draw()
        }

        
        usr.getMemberList = function (keyword) {
            http.post('/members/get-list', {
                'keyword': keyword,
                'pageSize': 10,
                'filters': [{
                    "field": "parentId",
                    "operator": "=",
                    "value": usr.parentMemberId 
                }]
            }).then(function (res) {
                usr.listMember = res.data.data.records;
            });
        };


        // usr.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     usr.dtService.param.data = data;
        //     usr.datatable.draw()
        // });

        usr.ui.add = function () {
            $state.go('app.sys.user-entry', {
                'id': 'new'
            });
        };

        usr.ui.edit = function (data) {
            $state.go('app.sys.user-entry', {
                'id': data
            });
        };

        usr.ui.delete = function (data) {
            service.deleteUser({
                'Id': data
            }, usr.datatable);
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            usr.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                usr.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            mds.unregisterCallback(usr.logKey);
            pendingRequest.cancelAll();
        });

        usr.logKey = "";

        usr.init = function ($scope, mds) {
            farst.loadingIn();


			var user = $window.localStorage.getItem('user'); 
			$timeout(function () {
				user = JSON.parse(user); 
				if(user.parentMemberName != undefined){
					usr.isVisibleMember = false;
                } 
                usr.parentMemberId = user.memberId;
                usr.getMemberList();
				// console.log(nav.user);
			}, 0); 

            usr.logKey = mds.registerCallback(onNotifyLogin, true);
            // usr.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            usr.dtService = datatableService.getService();
            usr.dtOptions = usr.dtService.initTable($scope, '/users/get-list', {
                route: 'app.user-entry',
                fixedColumn: [3, 1]
            }, 'userId', false, null, null, {
                onStateSaveParam: function (data) {
                    data.statusFilter = usr.status;
                    data.memberFilter = usr.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        usr.Keyword = data.search.search;
                        usr.status = data.statusFilter;
                        usr.memberId = data.memberFilter;
                    }
                }
            });

            usr.dtColumns = usr.dtService.setColumn(
                [{
                        "data": "userId",
                        "className": "text-center"
                    },
                    {
                        "data": "username"
                    },
                    {
                        "data": "fullName"
                    },
                    {
                        "data": "roleName",
                        "className": "text-center"
                    },
                    {
                        "data": "memberName",
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

            usr.isCollapsed = true;
            usr.isCollapsed = true;
            //set statusFilter
            usr.statusParam = [{
                    value: 100,
                    label: "All"
                },
                {
                    value: 1,
                    label: "Active"
                },
                {
                    value: 0,
                    label: "Suspend"
                }
            ];
            usr.listBranch  = [{
                    value: 100,
                    label: "All"
                },
                {
                    value: 1,
                    label: "BCPA"
                },
                {
                    value: 2,
                    label: "BCPJ"
                }
            ];
            farst.loadingOut();
        }($scope, mds);

        function getUserProfile(data) {
            return "<img src='" + cs.config.getApiUrl() + "/galery/profile-picture/" + data + "' style='width:20px'/>";
        }

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    usr.reloadData();
                }
            }
        }

        return usr;
    };
})();