'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.menu', {
				url: '/menu-list',
				templateUrl: 'src/sys/sysmenu/sysmenu.html',
				controller: 'sysMenuCtrl',
				controllerAs: 'sm',
				ncyBreadcrumb: {
					label: 'System Menu'
				},
			});
	}]);