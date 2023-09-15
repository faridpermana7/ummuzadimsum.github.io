'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.order-entry', {
				url:'/order/:id',
				templateUrl: 'src/manage/order-entry/order-entry.html',
				controller: 'orderEntryCtrl',
				controllerAs: 'ode',
				ncyBreadcrumb: {
                    label: 'Mantain Order'
                },
			});
		
	}]);
