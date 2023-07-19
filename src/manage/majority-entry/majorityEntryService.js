(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('majorityEntryService', majorityService);

		majorityService.$inject = ['HttpService', 'farst'];

	function majorityService(http, farst) {
		var mjs = this;

		mjs.saveMajority = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/maintainmajorities/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('Majority created!');
					onSuccess();
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		mjs.updateMajority = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/maintainmajorities/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('Majority updated!');
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
		
		mjs.deleteProduct = function (data, dt) {
			farst.Alert.confirm('Delete Product Majority',
				'Are you sure you want to delete this?',
				function () {
					http.delete('/maintainmajorities/' + data.Id, {})
						.then(function (res) {
							
							if (res.status == 200) {
								farst.Alert.success('Product Majorities deleted!');
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


		return mjs;
	}

})();