(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('majorityEntryCtrl', majorityEntry)

    majorityEntry.$inject = ['$scope', '$stateParams', '$window', '$timeout', 
        '$state', 'majorityEntryService', 'farst', 'validationService', 
        'HttpService', 'pendingRequest'];

    function majorityEntry($scope, sParam, $window, $timeout, $state, service, 
        farst, validation, http, pendingRequest) {
        var mje = this; 

        mje.isCreate = sParam.id == 'new' ? true : false;
        mje.ui = {};
        mje.model = {};    

        mje.ui.back = function () {
            $state.go('app.management.majority');
        };
        mje.ui.save = function () {   
            if (mje.isCreate) {
                service.saveMajority(mje.model, function () {
                    $state.go('app.management.majority');
                });
            } else {
                service.updateMajority(mje.model, function () {
                    $state.go('app.management.majority');
                });
            }  
        } 
        function getEntry(res) { 
            mje.model = res.data.data; 
            // console.log(mje.model);
            //mje.model.birthDate = farst.l.toLocaleDateObject(mje.model.birthDate); 
            farst.loadingOut();
        }

        $scope.$on('$destroy', function () {
            // consomje.log('destroyed');
            pendingRequest.cancelAll();
        });

        mje.init = function () {
            farst.loadingIn();
            mje.opts = farst.singleDateFormat(farst.l.DATEFORMAT);
            mje.model.birthDate = farst.l.getDate(); 

			var user = $window.localStorage.getItem('user'); 
			$timeout(function () {
				user = JSON.parse(user); 
				if(user.parentMemberName != undefined){
                    mje.isVisibleMember = false;   
                    mje.model.memberId = user.memberId; 
                    mje.isGroup = false;
                } 
                mje.parentMemberId = user.memberId;
				// console.log(nav.user);
			}, 0); 


            if (!mje.isCreate) {
                http.get('/productmajorities/' + sParam.id, {}).then(getEntry)
            }

            //validation
            mje.validate = function (field, validate) {
                return validation.formValidation($scope, 'majority', field, validate);
            }
            mje.dCurrency = farst.dCurrency;
            farst.loadingOut();
        }($scope);

        return mje;
    };
})();