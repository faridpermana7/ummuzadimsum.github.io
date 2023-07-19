'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.main.page', {
				url:'/',
				templateUrl: 'src/layout/main-page/main-page.html',
				controller: 'mainPageCtrl',
				controllerAs: 'main',
				ncyBreadcrumb: {
                    label: 'Main Page'
                },
			});
		
	}]);
