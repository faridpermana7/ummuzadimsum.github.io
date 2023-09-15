(function () {
	'use strict';
 
	angular
	angular.module('ummuza')
		.factory('ForgotService', Forgot);

	Forgot.$inject = ['HttpService', 'farst'];

	function Forgot(http, farst) {
		var fgt = this; 

		fgt.sendEmail = function (data, onSuccess) { 
			http.post('/emails/send', {
				"email": data
			}).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						// farst.Alert.success(res.data.message);
						onSuccess("true"); 
					} else {
						farst.Alert.error(res.data.message); 
						onSuccess("false"); 
					}
				}
				else {
					farst.Alert.error(res.data.message); 
					onSuccess("false"); 
				}
			});

			return this;
		}

		return fgt;
	}

})();