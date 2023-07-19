'use strict';

angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.role', {
				url: '/role-list',
				templateUrl: 'src/sys/role/role.html',
				controller: 'roleCtrl',
				controllerAs: 'rl',
				ncyBreadcrumb: {
					label: 'Role'
				},
			});
	}]);