(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('productEntryCtrl', productEntry)

    productEntry.$inject = ['$scope', '$stateParams', '$window', '$timeout', 
        '$state', 'productEntryService', 'farst', 'validationService', 
        'HttpService', 'pendingRequest'];

    function productEntry($scope, sParam, $window, $timeout, $state, service, 
        farst, validation, http, pendingRequest) {
        var pre = this; 

        pre.isCreate = sParam.id == 'new' ? true : false;
        pre.ui = {};
        pre.model = {};    

        pre.ui.back = function () {
            $state.go('app.management.product');
        };
        pre.ui.save = function () {   
            if (pre.isCreate) {
                service.saveMenu(pre.model, function () {
                    $state.go('app.management.product');
                });
            } else {
                service.updateMenu(pre.model, function () {
                    $state.go('app.management.product');
                });
            }  
        } 
        function getEntry(res) { 
            farst.loadingOut();
            if(res.status === 401 || res.status === 402){
                farst.Alert.error(res.data.message);
                $state.go('app.main.page');
            }
            pre.model = res.data.data; 
            // console.log(pre.model);
            //pre.model.birthDate = farst.l.toLocaleDateObject(pre.model.birthDate); 
        }

        $scope.$on('$destroy', function () {
            // consopre.log('destroyed');
            pendingRequest.cancelAll();
        });

        pre.init = function () {
            farst.loadingIn();
            pre.opts = farst.singleDateFormat(farst.l.DATEFORMAT);
            pre.model.birthDate = farst.l.getDate(); 

			var user = $window.localStorage.getItem('user'); 
			$timeout(function () {
				user = JSON.parse(user); 
				if(user.parentMemberName != undefined){
                    pre.isVisibleMember = false;   
                    pre.model.memberId = user.memberId; 
                    pre.isGroup = false;
                } 
                pre.parentMemberId = user.memberId;
				// console.log(nav.user);
			}, 0); 


            if (!pre.isCreate) {
                http.get('/maintainmenus/' + sParam.id, {}).then(getEntry)
            }

            //validation
            pre.validate = function (field, validate) {
                return validation.formValidation($scope, 'product', field, validate);
            }
            pre.dCurrency = farst.dCurrency;
            farst.loadingOut();
        }($scope);

        return pre;
    };
})();