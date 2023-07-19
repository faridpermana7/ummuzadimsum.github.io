(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .factory('modalLoginService', modalLogin);

    modalLogin.$inject = ['farst'];

    function modalLogin(farst) {
        var md = this;

        md.authCallback = [];

        md.callbackNotifyLoginSuccess = function () {

            var data = {
                login: true,
                key: "",
                reload: false
            };
            for (var i = 0; i < md.authCallback.length; i++) {
                data.key = md.authCallback[i].key;
                data.reload = md.authCallback[i].reload;

                var cb = md.authCallback[i].callback;

                if (cb !== undefined) {
                    cb(data);

                    console.log("Broadcasted to : " + data.key);
                } else {
                    console.log("Null ptr callback on key:" + data.key);
                }
            }
        };

        md.clearCallback = function () {
            for (var i = 0; i < md.authCallback.length; i++) {
                md.authCallback[i].callback = undefined;
            }

            md.authCallback = undefined;
            md.authCallback = [];
        };

        md.registerCallback = function (callback, reload) {
            //return hash key

            var key = farst.util.guid();

            var data = {
                callback: callback,
                reload: reload,
                key: key
            };

            md.authCallback.push(data);
            return key;
        };


        md.unregisterCallback = function (key) {

            var index = _.findIndex(md.authCallback, function (data) { return data.key === key; });

            if (index < 0)
                return false;

            md.authCallback[index].callback = undefined;
            md.authCallback.splice(index, 1);

            return true;
        };

        return md;
    }


})();
