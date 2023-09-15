(function () {
	'use strict'; 

	angular
		.module('ummuza')
		.factory('roleEntryService', RoleEntry);

	RoleEntry.$inject = ['HttpService', 'farst', '$state'];

	function RoleEntry(http, farst, $state) {
		var rle = this; 

		rle.deleteRole = function (data, dt) {
			console.log(data);
			farst.Alert.confirm('Delete Role',
				'Are you sure you want to delete this?',
				function (res) { 
					if(res.isConfirmed){ 
					http.delete('/roles/' + data.Id, {})
					.then(function (res) {
						if (res.status == 200) {
							farst.Alert.success('Role deleted!');
							dt.draw();
						} else {
							farst.Alert.error(res.message || res.data.message);
						}
					});
				} 
			});
			return this;
		}

		rle.saveRole = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/roles/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('Role created, setup menu for this role!');
					onSuccess(res.data.data);
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		rle.updateRole = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/roles/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					// if (res.data[0].status == 200) {
					if (res.status == 200) {
						farst.Alert.success('Role updated!');
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

		return rle;
	}

})();