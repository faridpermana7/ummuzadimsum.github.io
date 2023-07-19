(function () {
    'use strict';

    angular
        .module('ummuza')
        .controller('userEntryCtrl', UserEntry)

    UserEntry.$inject = ['$scope', '$stateParams', '$window', '$timeout', 
        '$state', 'userEntryService', 'farst', 'validationService', 
        'HttpService', 'pendingRequest'];

    function UserEntry($scope, sParam, $window, $timeout, $state, service, 
        farst, validation, http, pendingRequest) {
        var usre = this; 

        usre.isCreate = sParam.id == 'new' ? true : false;
        usre.ui = {};
        usre.model = {};
        usre.isVisibleMember = true;
        usre.isGroup = true;
        usre.invalidPass ="";
        usre.model.userAddresses = [];
        usre.model.contactPersons = [];
        usre.model.dataStatusId = 1;
        usre.model.gender = 1; 
        usre.useContact = false;

        usre.ui.back = function () {
            $state.go('app.sys.user');
        };
        usre.ui.save = function () {  
            ValidateMember(); 
            if(usre.invalidPass == ""){
                if (usre.isCreate) {
                    service.saveUser(usre.model, function () {
                        $state.go('app.sys.user');
                    });
                } else {
                    service.updateUser(usre.model, function () {
                        $state.go('app.sys.user');
                    });
                }  
            }
        }

        function ValidateMember(){
            if(usre.isGroup == true){
                usre.model.memberId = usre.parentMemberId;
            }  
        }
 
        usre.CheckPassword = function(){  
            var message = "";
            if(usre.model.password){ 
                var digit = usre.model.password.match(/(?=.*\d)/); 
                var lowerCase = usre.model.password.match(/(?=.*[a-z])/); 
                var upperCase = usre.model.password.match(/(?=.*[A-Z])/); 
                var eightCar = usre.model.password.match(/[a-zA-Z0-9!@#$%^&*]{8,}/);  
                var specialCar = usre.model.password.match(/(?=.*[!@#$%^&*])/); 

                if(digit == null)
                    message += "Should contain at least one digit";
                if(lowerCase == null)
                    message = ((message === "") ? "Should contain at least lower case" : message + "\nShould contain at least lower case");
                if(upperCase == null) 
                    message = ((message === "") ? "Should contain at least upper case" : message + "\nShould contain at least upper case");
                if(eightCar == null)
                    message = ((message === "") ? "Should contain at least 8 characters" : message + "\nShould contain at least 8 characters");
                if(specialCar == null)
                    message = ((message === "") ? "Should contain at least one special characters" : message + "\nShould contain at least one special characters");
            }
            usre.invalidPass = message;
        }

        usre.getCitizenship = function (keyword) {
            return http.post('/country/get', {
                'Keyword': keyword
            }).then(function (res) {
                usre.listCitizenship = res.data.data.data;
            });
        };

        usre.getCity = function (keyword) {
            http.post('/cities/get-list', {
                'keyword': keyword,
                'pageSize': 10
            }).then(function (res) {
                usre.listCity = res.data.data.records;
            });
        };

        usre.getRole = function (keyword) {
            return http.post('/roles/get', {
                'id': 0,
                'Keyword': 'COU',
                'sortDir': 'asc',
                'sortName': 'roleId',
            }).then(function (res) {
                usre.listRole = res.data.data.records;
            });
        }   
        
        usre.getMemberList = function (keyword) {
            http.post('/members/get-list', {
                'keyword': keyword,
                'pageSize': 10,
                'filters': [{
                    "field": "parentId",
                    "operator": "=",
                    "value": usre.parentMemberId 
                }]
            }).then(function (res) {
                usre.listMember = res.data.data.records;
            });
        };

        usre.getGender = function (keyword) {
            usre.listGender = [
                { "id": 1, "name": "Male" },
                { "id": 2, "name": "Female" }
            ];
        };

        usre.getStatus = function (keyword) {
            usre.listStatus = [
                { "id": 1, "name": "Active" },
                { "id": 0, "name": "Suspend" }
            ];
        };

        function getEntry(res) { 
            usre.model = res.data.data; 
            console.log(usre.model);
            //usre.model.birthDate = farst.l.toLocaleDateObject(usre.model.birthDate);
            
            usre.listCity = [{
                cityId: usre.model.cityId,
                name: usre.model.cityName
            }]
            usre.listLocation = [{
                locationId: usre.model.locationId,
                name: usre.model.locationName
            }]
            usre.listRole = [{
                roleId: usre.model.roleId,
                name: usre.model.roleName
            }]

            if(usre.model.parentMemberId > 0){
                usre.isGroup = false;
            }
            farst.loadingOut();
        }

        $scope.$on('$destroy', function () {
            // consousre.log('destroyed');
            pendingRequest.cancelAll();
        });

        usre.init = function () {
            farst.loadingIn();
            usre.opts = farst.singleDateFormat(farst.l.DATEFORMAT);
            usre.model.birthDate = farst.l.getDate(); 

			var user = $window.localStorage.getItem('user'); 
			$timeout(function () {
				user = JSON.parse(user); 
				if(user.parentMemberName != undefined){
                    usre.isVisibleMember = false;   
                    usre.model.memberId = user.memberId; 
                    usre.isGroup = false;
                } 
                usre.parentMemberId = user.memberId;
				// console.log(nav.user);
			}, 0); 


            if (!usre.isCreate) {
                http.get('/users/' + sParam.id, {}).then(getEntry)
            }

            //validation
            usre.validate = function (field, validate) {
                return validation.formValidation($scope, 'user', field, validate);
            }
            usre.dCurrency = farst.dCurrency;
            farst.loadingOut();
        }($scope);

        return usre;
    };
})();