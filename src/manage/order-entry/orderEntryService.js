(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('orderEntryService', orderService);

		orderService.$inject = ['HttpService', 'farst'];

	function orderService(http, farst) {
		var ode = this;

		ode.saveOrder = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/customerorders/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('Order created!');
					onSuccess();
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		ode.updateOrder = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/customerorders/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('Order updated!');
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
		
		ode.deleteOrder = function (data, dt) {
			farst.Alert.confirm('Delete Order',
				'Are you sure you want to delete this?',
				function (res) { 
					if(res.isConfirmed){ 
					farst.loadingIn();
					http.delete('/customerorders/' + data.Id, {})
						.then(function (res) {
							
							if (res.status == 200) {
								farst.Alert.success('Order deleted!');
								dt.draw();
							} else {
								farst.Alert.error(res.message || res.data.message);
							}
						});
				} 
			});  
			return this;
		}


		return ode;
	}

})();