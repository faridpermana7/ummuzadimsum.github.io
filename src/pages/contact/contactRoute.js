'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.contact', {
				url:'/contact',
				templateUrl: 'src/pages/contact/contact.html',
				controller: 'contCtrl',
				controllerAs: 'ct',
				ncyBreadcrumb: {
                    label: 'Hubungi'
                },
			});
		
	}]);
