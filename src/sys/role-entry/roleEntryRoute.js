'use strict';
 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('app.sys.role-entry', {
				url: '/role-entry/:id',
				templateUrl: 'src/sys/role-entry/role-entry.html',
				controller: 'roleEntryCtrl',
				controllerAs: 'rle',
				ncyBreadcrumb: {
					label: 'Role Entry'
				},
			});
	}]);