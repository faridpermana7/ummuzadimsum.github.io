(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('newsCtrl', newsCtrl);

    newsCtrl.$inject = ['$scope', 'farst', '$window', '$timeout', 'datatableService',
        'pendingRequest', 'ConfigService', 'HttpService'];
    function newsCtrl($scope, farst, $window, $timeout, datatableService,
        pendingRequest, cs, http){
        var nw = this;

        nw.ui = {};
        nw.type = 'all'; 
        var data = {};
        data.ids = [];
        
        function action(data, type, full, meta) {
            var btnEdit = '<button class="btn btn-default" rel="tooltip" title="Edit" ng-click="nw.ui.edit(' + data.productNewsId + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;';
            var btnDelete =
                '<button class="btn btn-default" rel="tooltip" title="Delete" ng-click="nw.ui.delete(' + data.productNewsId + ')">' +
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

        nw.dtCallback = function (dt) {
            nw.datatable = dt.DataTable;
        }

        nw.ui.search = function () {
            nw.datatable.search(nw.Keyword).draw();
        }

        nw.ui.clear = function () {
            nw.title = undefined;
            nw.delay = undefined; 
            nw.type = undefined; 
        };
        
        nw.ui.filter = function () {

            var filters = [];

            if(nw.title){
                filters.push({
                    "field": "title",
                    "operator": "=",
                    "value":  nw.title 
                });
            }
            if(nw.delay){
                filters.push({
                    "field": "delay",
                    "operator": "=",
                    "value": nw.delay 
                });
            } 
            if(nw.type != undefined && nw.type != 'all'){
                filters.push({
                    "field": "type",
                    "operator": "=",
                    "value": nw.type 
                });
            }  

            data.filters = filters;
            nw.dtService.param = data;
            nw.datatable.draw()
        } 

        // nw.ui.opts = farst.getDateRange(function (data) {
        //     //when click apply
        //     data.StartDate = data.model.startDate;
        //     data.EndDate = data.model.endDate;
        //     nw.dtService.param.data = data;
        //     nw.datatable.draw()
        // });

        nw.ui.add = function () {
            $state.go('app.manage.news-entry', {
                'id': 'new'
            });
        };

        nw.ui.edit = function (data) {
            $state.go('app.manage.news-entry', {
                'id': data
            });
        };

        nw.ui.delete = function (data) {
            service.deleteUser({
                'Id': data
            }, nw.datatable);
        };

        $scope.$on('ui.layout.resize', function (e, beforeContainer, afterContainer) {
            nw.datatable.columns.adjust();
        });

        $scope.$on('ui.layout.toggle', function (e, container) {
            setTimeout(function () {
                nw.datatable.columns.adjust();
            }, 700);
        });

        $scope.$on('$destroy', function () {
            // console.log('destroyed');
            // mds.unregisterCallback(nw.logKey);
            pendingRequest.cancelAll();
        });

        nw.logKey = "";

        nw.init = function ($scope) {    
			// var user = $window.localStorage.getItem('user'); 
			// $timeout(function () {
			// 	user = JSON.parse(user); 
			// 	if(user.parentMemberName != undefined){
			// 		nw.isVisibleMember = false;
            //     } 
            //     nw.parentMemberId = user.memberId;
            //     nw.getMemberList();
			// 	// console.log(nav.user);
			// }, 0); 

            // nw.logKey = mds.registerCallback(onNotifyLogin, true);
            // nw.date = {
            //     startDate: farst.l.getDate().subtract(7, "days"),
            //     endDate: farst.l.getDate()
            // };
            nw.dtService = datatableService.getService();
            nw.dtOptions = nw.dtService.initTable($scope, '/maintainnews/get', {
                route: 'app.manage.news-entry',
                fixedColumn: [3, 1]
            }, 'productNewsId', false, null, null, {
                onStateSaveParam: function (data) {
                    // data.statusFilter = nw.status;
                    // data.memberFilter = nw.memberId;
                },
                onStateLoadCallback: function (data) {
                    if (data) {
                        nw.Keyword = data.search.search;
                        // nw.status = data.statusFilter;
                        // nw.memberId = data.memberFilter;
                    }
                }
            });

            nw.dtColumns = nw.dtService.setColumn(
                [{
                        "data": "productNewsId",
                        "className": "text-center"
                    },
                    {
                        "data": "type"
                    },
                    {
                        "data": "postDate",
                        "render": datetimeFormat
                    },
                    {
                        "data": "title"
                    },
                    {
                        "data": "user", 
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

            nw.isCollapsed = true; 
            //set statusFilter
            nw.catParam = [{
                    value: 'all',
                    label: "All"
                },
                {
                    value: 'image',
                    label: "Image"
                },
                {
                    value: 'video',
                    label: "Video"
                }
            ];  
        }($scope);

        function getUserProfile(data) {
            return "<img src='" + cs.config.getApiUrl() + "/galery/profile-picture/" + data + "' style='width:20px'/>";
        }

        function onNotifyLogin(res) {
            if (res) {
                if (res.reload) {
                    nw.reloadData();
                }
            }
        } 
         

        return nw;
    };
    
})();

