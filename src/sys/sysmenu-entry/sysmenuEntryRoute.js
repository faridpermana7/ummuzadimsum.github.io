'use strict';
 

angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.menu-entry', {
				url: '/menu-entry/:id',
				templateUrl: 'src/sys/sysmenu-entry/sysmenu-entry.html',
				controller: 'sysMenuEntryCtrl',
				controllerAs: 'sme',
				ncyBreadcrumb: {
					label: 'System Menu Entry'
				},
			});
	}]);