'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.product', {
				url:'/products',
				templateUrl: 'src/manage/product/product.html',
				controller: 'productCtrl',
				controllerAs: 'pd',
				ncyBreadcrumb: {
                    label: 'Product List'
                },
			});
		
	}]);
