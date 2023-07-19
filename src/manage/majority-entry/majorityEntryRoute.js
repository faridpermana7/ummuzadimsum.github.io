'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.majority-entry', {
				url:'/majority/:id',
				templateUrl: 'src/manage/majority-entry/majority-entry.html',
				controller: 'majorityEntryCtrl',
				controllerAs: 'mje',
				ncyBreadcrumb: {
                    label: 'Mantain Majority'
                },
			});
		
	}]);
