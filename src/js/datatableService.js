(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .factory('datatableService', DtService);

    DtService.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', 
        '$compile', 'HttpService', '$cookies', '$state', 'farst'];

    function DtService(DTOptionsBuilder, DTColumnBuilder, 
        $compile, http, $cookies, $state, farst) {

        var dt = this;
        dt.getService = function () {
            return new DTInner(DTOptionsBuilder, DTColumnBuilder, $compile, http, $cookies, $state);
        };

        function DTInner(DTOptionsBuilder, DTColumnBuilder, $compile, http, $cookies, $state) {
            var dt = this;
            dt.param = {
                ids: [],
                filters: [],
                pageIndex: 0,
                pageSize: 50,
                keyword: '',
                sortName: '',
                sortDir: '',
                data: {}
            };

            dt.setColumn = function (column) {
                var col = [];
                var columnDef;
                column.forEach(function (i) {
                    var className = (i.className) ? i.className : "";
                    columnDef = DTColumnBuilder.newColumn(i.data);
                    (i.className) ? columnDef.withClass(className): '';
                    (i.sortable == false) ? columnDef.notSortable(): '';
                    (i.render) ? columnDef.renderWith(i.render): '';
                    col.push(columnDef);
                });
                return col;
            };

            dt.initTable = function ($scope, url, reqData, rowId, callbackData, onInitComplete, stateSave) {
                farst.loadingIn();
                if (!reqData) {
                    reqData = {
                        fixedColumn: [0, 0]
                    };
                }
                var callbackShell = false;
                var setCustomRowCallback = false;

                if (!(callbackData == undefined)) {
                    callbackShell = true;
                }

                try {
                    setCustomRowCallback = (callbackData.rowCallback == undefined) ? false : true;
                } catch (error) {

                }

                return DTOptionsBuilder.newOptions()
                    .withOption('ajax', function (data, callback, setting) {
                        reqData.dataStart = data.start;
                        var pageIndex = Math.floor((data.start / data.length)) + 1;
                        dt.param.pageIndex = pageIndex;
                        dt.param.skip = data.start;
                        dt.param.pageSize = data.length;
                        dt.param.keyword = data.search["value"];
                        dt.param.sortName = data.columns[data.order[0].column].data;
                        dt.param.sortDir = data.order[0].dir;

                        if(dt.param.sortName == 'updatedDate'){
                            dt.param.sortDir = 'desc';
                        }

                        if (callbackShell && !(callbackData.requestCallback === undefined)) {
                            dt.param = callbackData.requestCallback(dt.param);
                        }

                        if (callbackShell && !(callbackData.responseCallback === undefined)) {

                            var getData = (function () {
                                new http.post(url, dt.param)
                                    .then(callbackData.responseCallback);
                            })();
                        } else {
                            if (url != null) {
                                farst.loadingIn();
                                var getData = (function () {
                                    new http.post(url, dt.param)
                                        .then(function (response) {
                                            if (response.status === -1) {
                                                return;
                                            }
                                            if(response.status === 401 || response.status === 402){
                                                farst.Alert.error(response.data.message);
			                                    $state.go('app.main.page');
                                            }
                                            if (response.data.statusCode === 200) {

                                                callback({
                                                    recordsTotal: response.data.data.totalRecords,
                                                    recordsFiltered: response.data.data.totalRecordsFiltered,
                                                    data: response.data.data.records
                                                });
                                            } else if (response.data.statusCode == 404){
                                                callback({
                                                    recordsTotal: 0,
                                                    recordsFiltered:0,
                                                    data: []
                                                });
                                            }else {

                                                if (response.data.data == undefined && dt.param.data != undefined) {
                                                    callback({
                                                        recordsTotal: dt.param.data.total,
                                                        recordsFiltered: dt.param.data.filtered,
                                                        data: dt.param.data.data
                                                    });
                                                }
                                            }
                                            if (onInitComplete) onInitComplete(response.data);
                                        });
                                })();
                            } else {
                                callback({
                                    recordsTotal: dt.param.data.total,
                                    recordsFiltered: dt.param.data.filtered,
                                    data: dt.param.data.data
                                });
                            }
                        }
                        farst.loadingOut();
                    })
                    .withDataProp('data')
                    .withOption('processing', true)
                    .withOption('language', {
                        processing: '<i class="fas fa-circle-notch fa-spin mr-2"></i> Processing ..'
                    })
                    .withDOM(reqData.dom ? reqData.dom : 'rtilp')
                    //.withScroller()
                    .withOption('destroy', true)
                    .withPaginationType('simple_numbers')
                    .withOption('serverSide', true)
                    .withOption('deferRender', false)
                    .withOption('scrollY', 400)
                    .withOption('scrollX', true)
                    .withOption('scrollCollapse', true)
                    .withOption('autoWidth', true)
                    .withOption('select', reqData.select ? reqData.select : true)
                    .withOption('stateSave', true)
                    .withFixedColumns({
                        leftColumns: reqData.fixedColumn[0],
                        rightColumns: reqData.fixedColumn[1]
                    })
                    .withOption('stateSaveParams', function (settings, data) {
                        if (stateSave && stateSave.onStateSaveParam) {
                            stateSave.onStateSaveParam(data);
                        }
                    })
                    .withOption('stateLoadParams', function (settings, data) {
                        if (stateSave && stateSave.onStateLoadCallback) {
                            stateSave.onStateLoadCallback(data);
                        } else {
                            data.search.search = "";
                        }
                    })
                    .withOption('createdRow', function (row, data, dataIndex) { 
                        if (reqData.useNumbering == undefined) {
                            angular.element(row).contents()[0].innerHTML = (dataIndex + 1) + reqData.dataStart;
                        }
                        $compile(angular.element(row).contents())($scope);
                    })
                    .withOption(
                        'rowCallback',
                        (setCustomRowCallback) ? callbackData.rowCallback : internalRowCallback
                    )
                    .withOption('rowGroup', reqData.rowGroup ? {
                        dataSrc: reqData.rowGroup
                    } : false);

                function internalRowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $('td', nRow).unbind('dblclick');
                    $('td', nRow).bind('dblclick', function () {
                        if (reqData.onDoubleClick != undefined) {
                            reqData.onDoubleClick(aData[rowId])
                        } else {
                            $state.go(reqData.route, {
                                'id': aData[rowId]
                            });
                        }
                    });
                    $('[rel="tooltip"]').tooltip();
                    return nRow;
                }

            }
            return dt;
        }

        return dt;
    }

})();