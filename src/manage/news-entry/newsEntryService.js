(function () {
	'use strict'; 
	angular
		.module('ummuza')
		.factory('newsEntryService', newsService);

		newsService.$inject = ['HttpService', 'farst'];

	function newsService(http, farst) {
		var ne = this;

		ne.saveNews = function (data, onSuccess) {
			farst.loadingIn();
			http.post('/maintainnews/save', data).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('News created!');
					onSuccess();
					farst.loadingOut();
				} else {
					farst.Alert.error(res.data.message);
					farst.loadingOut();
				}
			});

			return this;
		}

		ne.updateNews = function (data, onSuccess) {
			farst.loadingIn();
			http.put('/maintainnews/update', data).then(function (res) {

				if (res.success || res.status == 200) {
					if (res.data.statusCode == 200) {
						farst.Alert.success('News updated!');
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
		
		ne.deleteNews = function (data, dt) {
			farst.Alert.confirm('Delete News',
				'Are you sure you want to delete this?', 
				function (res) { 
					if(res.isConfirmed){ 
						farst.loadingIn();
						http.delete('/maintainnews/' + data.Id, {})
							.then(function (res) {
								
								if (res.status == 200) {
									farst.Alert.success('News deleted!');
									dt.draw();
								} else {
									farst.Alert.error(res.message || res.data.message);
								}
							});
					} 
				});  
			return this;
		}


		return ne;
	}

})();