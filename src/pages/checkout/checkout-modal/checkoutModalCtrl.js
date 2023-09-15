(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('checkoutModalCtrl', checkoutModalCtrl)

    checkoutModalCtrl.$inject = ['$scope', '$stateParams', '$state', 'checkoutModalService', 
        'farst', 'validationService', 'HttpService', 'pendingRequest', '$timeout'];

    function checkoutModalCtrl($scope, sParam, $state, service, farst, validation, 
        http, pendingRequest, $timeout) {
        var ckm = this; 
        ckm.orderNumber = service.modalInstance.data.orderNumber; 
        ckm.titleForm = "PESANAN BERHASIL";
        ckm.ui = {};
        ckm.model = {}; 

        $scope.$on('$destroy', function () {
            // pendingRequest.cancelAll();
        });

        ckm.redirect = function(){
            // alert("ok"); 
            service.modalInstance.close();
            // var currentUrl = window.location.origin;
            // const url = currentUrl+"/#!/cekorder/"+ckm.orderNumber;
            // window.location.href = url; 
            $state.go('app.pages.tracking', {
                'ordernumber': ckm.orderNumber
            });
        }
        ckm.closeModal = function () {
            ckm.redirect();
        }; 

        function setBarcode(){
            var qrcode = new QRCode(document.getElementById("qrcode_container1"), {
                width : 250,
                height : 250
            }); 
            
            var currentUrl = window.location.origin;
            const url = currentUrl+"/#!/cekorder/"+ckm.orderNumber; 
            qrcode.makeCode(url); 
        } 

        ckm.ui.save = function(){
            service.update(ckm.model, function(){
                service.modalInstance.close();
            });
        } 

        ckm.init = function () { 
            
            $timeout(function () {
                setBarcode();
            });
        }($scope);

        return ckm;
    };
})();