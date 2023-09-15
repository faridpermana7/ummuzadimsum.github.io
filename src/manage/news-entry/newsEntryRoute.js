'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.news-entry', {
				url:'/news/:id',
				templateUrl: 'src/manage/news-entry/news-entry.html',
				controller: 'newsEntryCtrl',
				controllerAs: 'ne',
				ncyBreadcrumb: {
                    label: 'Mantain News'
                },
			});
		
	}]);
