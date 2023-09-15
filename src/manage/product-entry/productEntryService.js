(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('productEntryService', productService);

		productService.$inject = ['HttpService', 'farst'];

	function productService(http, farst) {
		var pre = this;

		pre.saveMenu = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/maintainmenus/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('Menu created!');
					onSuccess();
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		pre.updateMenu = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/maintainmenus/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('Menu updated!');
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
		
		pre.deleteMenu = function (data, dt) {
			farst.Alert.confirm('Delete Product Menu',
				'Are you sure you want to delete this?',
				function (res) { 
					if(res.isConfirmed){ 
					farst.loadingIn();
					http.delete('/maintainmenus/' + data.Id, {})
						.then(function (res) {
							
							if (res.status == 200) {
								farst.Alert.success('Product menu deleted!');
								dt.draw();
							} else {
								farst.Alert.error(res.message || res.data.message);
							}
						});
				} 
			});  
			return this;
		}


		return pre;
	}

})();