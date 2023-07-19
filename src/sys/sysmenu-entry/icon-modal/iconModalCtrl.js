(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .controller('IconModalCtrl', IconModal);

    IconModal.$inject = ['$scope', '$uibModalInstance', 'farst', 'datatableService', 'param', '$http'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */
    function IconModal($scope, $uibModalInstance, farst, datatableService, param, $http) {
        /*jshint validthis: true */
        var mic = this;

        var fsvc = farst;
        mic.isMore = true;
        mic.pageSize = 90;

        mic.getIcon = function () {
            $http.get("src/json/icon_file.json").then(function (response) {
                mic.listIcon = response.data;
                mic.icons = response.data;
            });
        };

        mic.getIcon();

        mic.moreIcon = function () {
            mic.pageSize += 90;
        };
        
        mic.search = function () {
            var ic = mic.listIcon;
            mic.icons = ic.filter(function (icon) {
                return icon.includes(mic.Keyword);
            });
            if (mic.icons.length <= 90) {
                mic.isMore = false;
            } else {
                mic.isMore = true;
            }
        };

        mic.ok = function () {
            $uibModalInstance.close(mic.iconSelected);
        };
        mic.cancel = function () {
            $uibModalInstance.close();
        };


        return mic;
    }
})();