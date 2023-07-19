'use strict';

angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.user-entry', {
				url: '/user-entry/:id',
				templateUrl: 'src/sys/user-entry/user-entry.html',
				controller: 'userEntryCtrl',
				controllerAs: 'usre',
				ncyBreadcrumb: {
					label: 'User Entry'
				},
			});
	}]);