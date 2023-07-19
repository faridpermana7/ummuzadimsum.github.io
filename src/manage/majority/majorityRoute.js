'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.majority', {
				url:'/majority',
				templateUrl: 'src/manage/majority/majority.html',
				controller: 'majorityCtrl',
				controllerAs: 'mj',
				ncyBreadcrumb: {
                    label: 'Majority List'
                },
			});
		
	}]);
