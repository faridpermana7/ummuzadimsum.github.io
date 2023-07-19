'use strict';

angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.user', {
				url: '/user-list',
				templateUrl: 'src/sys/user/user.html',
				controller: 'userCtrl',
				controllerAs: 'usr',
				ncyBreadcrumb: {
					label: 'User'
				},
			});
	}]);