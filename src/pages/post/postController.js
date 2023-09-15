(function ($) {
    "use strict";
    var app = angular.module('ummuza')
    .controller('postCtrl', postCtrl);

    postCtrl.$inject = ['$scope', 'farst', 'HttpService'];
    function postCtrl($scope, farst, http){
        var pt = this;

        function getNews(){
            farst.loadingIn(); 
            http.post('/productnews/get', { 
                "ids": [],
                "filters": [], 
                "keyword": "",
                "sortName":"PostDate",
                "sortDir": "desc"
            }).then(function (res) {
                farst.loadingOut();
                // console.log(res);
                if (res.data.statusCode == 200) { 
                    $scope.listPosts = res.data.data.records;
                    // console.log(vm.listunggul);
                } else {
                    if(res.status == 401 || res.status == 402){
                        farst.Alert.error(res.data.message);
                    }else {
                        farst.Alert.error('Data not found');
                    }  
                }
            });  

        };
        // let SHEET_ID = '1VcwB6bea0mf40hpTl8cI4ILD4HIZd0bu_tZfLAFbvOw';
        // let SHEET_RANGE = 'B2:I100';
        // let URL_SHEET_RANGE =  '&range=' + SHEET_RANGE;
        // let DRAFT_FULL_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=';
        
        // var listSheet = ['post_list'];
        // var posts = [];
        // //post
        // fetch((DRAFT_FULL_URL + listSheet[0] + URL_SHEET_RANGE))
        // .then(res => res.text())
        // .then(res => {
        //     // console.log(data.table);
        //     let data = JSON.parse(res.substr(47).slice(0,-2)); 
        //     posts = ConvertTabletoJSON(data.table); 
        //     // console.log(menus);
        //     $scope.$apply(() => { 
        //         $scope.listPosts = posts;   
        //     });  
        // });
        
    
        // function ConvertTabletoJSON(table) { 
        //     var header = [];
        //     var rows = [];
     
        //     for (var i = 0; i < table.cols.length; i++) {
        //         header.push(table.cols[i].label);
        //     }
     
        //     for (var i = 0; i < table.rows.length; i++) {
        //         var row = {};
        //         for (var j = 0; j < header.length; j++) {
        //             row[header[j]] = table.rows[i].c[j].v;
        //         }
        //         rows.push(row);
        //     }
     
        //     return rows;
        // }      
        // alert(greetingValue) 
        
        pt.datetimeFormat = function(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeLocal(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        };
        
        getNews();
        return pt;
    };
    
})(jQuery);

