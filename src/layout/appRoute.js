'use strict';

angular.module('ummuza')
	.config(['$stateProvider', '$breadcrumbProvider', function ($stateProvider, $breadcrumbProvider) { 
		
		$breadcrumbProvider.setOptions({
			prefixStateName: 'app',
			includeAbstract: true,
			template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
		});

		$stateProvider
			.state('app', { 
				templateUrl: 'src/layout/app.html',
				abstract: true,
				controller: 'appCtrl',
				controllerAs: 'vm',
				ncyBreadcrumb: {
					label: 'Home'
				}
			})
			.state('app.pages', {
				abstract: true,
				ncyBreadcrumb: {
					label: 'Pages'
				},
			})
			.state('app.main', {
				abstract: true,
				ncyBreadcrumb: {
					label: 'main'
				},
			})
			.state('app.menu', {
				abstract: true,
				ncyBreadcrumb: {
					label: 'Menu'
				},
			})
			.state('app.management', {
				abstract: true,
				ncyBreadcrumb: {
					label: 'Management'
				},
			})
			.state('app.sys', {
				abstract: true,
				ncyBreadcrumb: {
					label: 'System'
				},
			})
			;

	}]);