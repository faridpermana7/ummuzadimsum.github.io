'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.pages.post', {
				url:'/post',
				templateUrl: 'src/pages/post/post.html',
				controller: 'postCtrl',
				controllerAs: 'pt',
				ncyBreadcrumb: {
                    label: 'Post Page'
                },
			});
		
	}]);
