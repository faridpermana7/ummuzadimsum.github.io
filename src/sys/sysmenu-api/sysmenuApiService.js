(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('sysMenuApiService', sysMenuApiService);

		sysMenuApiService.$inject = ['HttpService', 'farst', '$state'];

	function sysMenuApiService(http, farst, $state) {
		var mna = this; 
		mna.modalInstance = null;

		mna.update = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/menus/claim-update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.status == 200) {
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

		return mna;
	}

})();