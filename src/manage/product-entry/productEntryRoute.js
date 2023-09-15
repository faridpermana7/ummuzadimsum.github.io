'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.product-entry', {
				url:'/product/:id',
				templateUrl: 'src/manage/product-entry/product-entry.html',
				controller: 'productEntryCtrl',
				controllerAs: 'pre',
				ncyBreadcrumb: {
                    label: 'Mantain Product'
                },
			});
		
	}]);
