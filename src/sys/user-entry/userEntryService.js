(function () {
	'use strict';

	angular
		.module('ummuza')
		.factory('userEntryService', UserEntry);

	UserEntry.$inject = ['HttpService', 'farst', '$state'];

	function UserEntry(http, farst, $state) {
		var usre = this;
		
		usre.deleteUser = function (data, dt) {
			farst.Alert.confirm(
				'Delete User',
				'Are you sure you want to delete this user?',
				function () {
					http.delete('/users/' + data.Id, {})
						.then(function (res) {
							if (res.status == 200) {
								farst.Alert.success('User deleted!');
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

		usre.saveUser = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/users/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('User created!');
					onSuccess();
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		usre.updateUser = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/users/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('User updated!');
						onSuccess();
						farst.loadingOut();
					} else {
						farst.Alert.error(res.data.message);
						farst.loadingOut();
					}
				}
				else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		return usre;
	}

})();