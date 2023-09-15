'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.order', {
				url:'/order',
				templateUrl: 'src/manage/order/order.html',
				controller: 'orderCtrl',
				controllerAs: 'od',
				ncyBreadcrumb: {
                    label: 'Order List'
                },
			});
		
	}]);
