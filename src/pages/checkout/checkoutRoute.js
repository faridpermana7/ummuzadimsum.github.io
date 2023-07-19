'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.checkout', {
				url:'/checkout/:id',
				templateUrl: 'src/pages/checkout/checkout.html',
				controller: 'checkCtrl',
				controllerAs: 'ck',
				ncyBreadcrumb: {
                    label: 'Checkout'
                },
			});
		
	}]);
