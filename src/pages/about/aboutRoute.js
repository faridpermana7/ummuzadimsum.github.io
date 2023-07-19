'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.about', {
				url:'/about',
				templateUrl: 'src/pages/about/about.html',
				controller: 'aboutCtrl',
				controllerAs: 'ab',
				ncyBreadcrumb: {
                    label: 'Tentang'
                },
			});
		
	}]);
