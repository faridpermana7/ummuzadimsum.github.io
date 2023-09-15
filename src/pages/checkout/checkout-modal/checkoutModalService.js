(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('checkoutModalService', checkoutModalService);

		checkoutModalService.$inject = ['HttpService', 'farst', '$state'];

	function checkoutModalService(http, farst, $state) {
		var ckm = this; 
		ckm.modalInstance = null;

		ckm.update = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/menus/claim-update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('Menu updated!');
						onSuccess();
						farst.loadingOut();
					} else {
						farst.Alert.error(res.data.message);
						farst.loadingOut();
					}
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		return ckm;
	}

})();