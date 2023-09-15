'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.tracking', {
				url:'/cekorder/:ordernumber',
				templateUrl: 'src/pages/tracking/tracking.html',
				controller: 'trackingCtrl',
				controllerAs: 'trc',
				ncyBreadcrumb: {
                    label: 'Cek Order'
                },
			});
		
	}]);
