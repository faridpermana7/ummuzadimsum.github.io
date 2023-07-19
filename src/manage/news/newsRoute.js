'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.news', {
				url:'/news',
				templateUrl: 'src/manage/news/news.html',
				controller: 'newsCtrl',
				controllerAs: 'nw',
				ncyBreadcrumb: {
                    label: 'News List'
                },
			});
		
	}]);
