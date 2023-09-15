(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('contactService', contactService);

		contactService.$inject = ['HttpService', 'farst'];

	function contactService(http, farst) {
		var ct = this;

		ct.saveComplaint = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/complaints/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('Complaint created!');
					farst.loadingOut();
					onSuccess();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		} 


		return ct;
	}

})();