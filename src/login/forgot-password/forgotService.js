(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:dausrboardService
	 * @description
	 * # dausrboardService
	 * Service of the app
	 */

	angular
	angular.module('farst')
		.factory('ForgotService', Forgot);

	Forgot.$inject = ['HttpService', 'FarstService'];

	function Forgot(HttpService, fsvc) {
		var fgt = this;
		var http = HttpService;

		fgt.sendEmail = function (data, onSuccess) { 
			http.post('/emails/send', {
				"email": data
			}).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						// fsvc.Alert.success(res.data.message);
						onSuccess("true"); 
					} else {
						fsvc.Alert.error(res.data.message); 
						onSuccess("false"); 
					}
				}
				else {
					fsvc.Alert.error(res.data.message); 
					onSuccess("false"); 
				}
			});

			return this;
		}

		return fgt;
	}

})();