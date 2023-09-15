'use strict'; 
angular.module('ummuza')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('app.management.complaint', {
				url:'/complaint',
				templateUrl: 'src/manage/complaint/complaint.html',
				controller: 'complaintCtrl',
				controllerAs: 'cm',
				ncyBreadcrumb: {
                    label: 'Complaint List'
                },
			});
		
	}]);
