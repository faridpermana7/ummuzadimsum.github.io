(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.service('navService', navService); 
        navService.$inject = ['$http', '$window', '$compile']; 
	function navService($http, $window, $compile) {
        var nav = {}; 
        var tpl = '';
        
		function generate(data) {
			data.forEach(function (i, index) {
				if (i.subMenus.length > 0) {
					tpl = tpl + '<li class="nav-item dropdown">' +
						'<a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle" ui-sref="' + i.path + '" href="#" ui-sref-active="active">';
				} else if(i.code == "eticket") {
					tpl = tpl + '<li class="nav-item">' + '<a aria-haspopup="true" aria-expanded="false" class="nav-link" ui-sref="' + i.path + '" href="'+ i.path +'" ui-sref-active="active">';
				} else {
					tpl = tpl + '<li class="nav-item">' + '<a aria-haspopup="true" aria-expanded="false" class="nav-link" ui-sref="' + i.path + '" href="#" ui-sref-active="active">';
				}

				tpl = tpl + '<i class="' + i.icon + '"></i> <span>' + i.name + '</span></a>' + '<ul class="dropdown-menu">';

				(i.subMenus.length > 0) ? generate(i.subMenus): '';

				tpl = tpl + '</ul>' +
					'</li>';
			});

			return tpl;

        }
        
		nav.generateMenu = function ($scope) {
			tpl = '';

			var menu = $window.localStorage.getItem('userMenu');
			var myMenu = JSON.parse(menu);

			if (myMenu != undefined) { 
				var menuHtml = generate(myMenu);
				angular.element('#nav').html($compile(menuHtml)($scope));
			}
		}

        
		nav.refreshActiveMenu = function () {
			setTimeout(() => {
				var active = $("#mainnav").find(".nav-item.dropdown").find('.nav-item .active');
				active.parent().parent().parent().find("a").first().addClass("active");
			}, 100);
		}

		return nav;
	};

})();