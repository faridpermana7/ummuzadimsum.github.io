(function () {
	'use strict';
 

	angular
		.module('ummuza')
		.factory('sysMenuEntryService', sysMenuEntry);

	sysMenuEntry.$inject = ['HttpService', 'farst', '$state'];

	function sysMenuEntry(http, farst, $state) {
		var sme = this; 
		sme.modalInstance = null;
		
		sme.deleteMenu = function (data, dt) { 
			console.log(data);
			farst.Alert.confirm('Delete Menu',
				'Are you sure you want to delete this?',
				function () {
					http.delete('/menus/delete', [data.Id]).then(function (res) {
						if (res.data.statusCode == 200) {
							farst.Alert.success('Menu deleted!');
							dt.draw();
						} else {
							farst.Alert.error(res.message || res.data.message);
						}
					});
				},
				null
			);
			return this;
		}


		sme.saveMenu = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/menus/save', data).then(function (res) {
				console.log(res);
				// if (res.data[0].status == 200) {
				if (res.data.statusCode == 200) {
					farst.Alert.success('Menu created!');
					onSuccess();
					farst.loadingOut();
				} else {
					// farst.Alert.error(res.data[0].message);
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		sme.updateMenu = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/menus/update', data).then(function (res) {

				if (res.data || res.status == 200) {
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

		return sme;
	}

})();