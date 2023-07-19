'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.menu', {
				url:'/menu',
				templateUrl: 'src/pages/menu/menu.html',
				controller: 'menuCtrl',
				controllerAs: 'mn',
				ncyBreadcrumb: {
                    label: 'Menu'
                },
			});
		
	}]);
