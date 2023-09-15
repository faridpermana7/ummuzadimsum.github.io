(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('newsEntryCtrl', newsEntry)

    newsEntry.$inject = ['$scope', '$stateParams', '$window', '$timeout', 
        '$state', 'newsEntryService', 'farst', 'validationService', 
        'HttpService', 'pendingRequest'];

    function newsEntry($scope, sParam, $window, $timeout, $state, service, 
        farst, validation, http, pendingRequest) {
        var ne = this; 

        ne.isCreate = sParam.id == 'new' ? true : false;
        ne.ui = {};
        ne.model = {};    

        ne.ui.back = function () {
            $state.go('app.management.news');
        };
        ne.ui.save = function () {   
            if (ne.isCreate) {
                service.saveNews(ne.model, function () {
                    $state.go('app.management.news');
                });
            } else {
                service.updateNews(ne.model, function () {
                    $state.go('app.management.news');
                });
            }  
        } 
        function getEntry(res) { 
            ne.model = res.data.data; 
            // console.log(ne.model);
            //ne.model.birthDate = farst.l.toLocaleDateObject(ne.model.birthDate); 
            farst.loadingOut();
        }

        $scope.$on('$destroy', function () {
            // consone.log('destroyed');
            pendingRequest.cancelAll();
        });

        ne.init = function () {
            farst.loadingIn();
            ne.opts = farst.singleDateFormat(farst.l.DATEFORMAT);
            ne.model.postDate = farst.l.getDate(); 

			var user = $window.localStorage.getItem('user'); 
			$timeout(function () {
				user = JSON.parse(user); 
				if(user.parentMemberName != undefined){
                    ne.isVisibleMember = false;   
                    ne.model.memberId = user.memberId; 
                    ne.isGroup = false;
                } 
                ne.parentMemberId = user.memberId;
				// console.log(nav.user);
			}, 0); 


            if (!ne.isCreate) {
                http.get('/maintainnews/' + sParam.id, {}).then(getEntry)
            }

            //validation
            ne.validate = function (field, validate) {
                return validation.formValidation($scope, 'news', field, validate);
            }
            ne.dCurrency = farst.dCurrency;
            farst.loadingOut();
        }($scope);

        return ne;
    };
})();