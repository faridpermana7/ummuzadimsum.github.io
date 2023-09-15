(function () {
    'use strict'; 
    angular.module('ummuza')
        .controller('mainPageCtrl', mainPageCtrl);

        mainPageCtrl.$inject = ['$scope', 'pendingRequest', 'farst', 'HttpService'];

    function mainPageCtrl($scope, pendingRequest, farst, http) {
        var main = this;  
        
        function getUnggulData(){ 
            farst.loadingIn(); 
            http.post('/productmajorities/get', { 
                "ids": [],
                "filters": [], 
                "keyword": ""
            }).then(function (res) {
                // console.log(res);
                if (res.data.statusCode == 200) { 
                    main.listunggul = res.data.data.records;
                    // console.log(vm.listunggul);
                } else {
                    if(res.status == 401 || res.status == 402){
                        farst.Alert.error(res.data.message);
                    }else {
                        farst.Alert.error('Data not found');
                    }  
                }
                getLatesNews();
            });  
        }; 

        
        function getLatesNews(){ 
            http.post('/productnews/get', { 
                "pageIndex": 1,
                "pageSize": 3, 
                "sortName":"PostDate",
                "sortDir": "desc"
            }).then(function (res) {
                // console.log(res);
                if (res.data.statusCode == 200) {  
                    // console.log(res.data.data.records);
                    main.listLatesPost = res.data.data.records; 
                } else {
                    if(res.status == 401 || res.status == 402){
                        farst.Alert.error(res.data.message);
                    }else {
                        farst.Alert.error('Data not found');
                    }  
                }
                farst.loadingOut(); 
            });  
        };

        $scope.$on('$destroy', function () {
            // console.log('destroyed'); 
            pendingRequest.cancelAll();
        }); 
        
        main.datetimeFormat = function(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeLocal(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        };
        
        main.init = function ($scope) {  
                
            
            getUnggulData(); 
        }($scope);
         
        function onNotifyLogin(res) {
            if (res) { 
            }
        }

        return main;
    }
})();