(function () {
    "use strict";   

    angular.module('ummuza')
    .controller('navBarCtrl', navBarCtrl); 
    
    navBarCtrl.$inject = ['$scope', '$state', 'farst', 'HttpService', '$rootScope', 
        '$window', '$timeout', '$cookies', 'navService']; 
    function navBarCtrl($scope, $state, farst, http, $rootScope, $window, $timeout, 
        $cookies, navService){
        var nav = this; 
        nav.cartQty = 0;
        nav.subTotalCart = 0; 
		var user;
		nav.isBegining = true;
        
        $scope.status = {
            isopen: false
        };

        nav.addChart = []; 
        nav.shoppingCarts = [];
        nav.allMenu = []; 

        nav.model = {}; 
        nav.opts = farst.singleDateFormat(farst.l.DATEFORMAT); 
        nav.model.orderDate = farst.l.getDate(); 
        
        function updateChart(){
            $rootScope.$broadcast('sendToMenu', {
                cartQty: nav.cartQty,
                addChart: nav.addChart,
                shoppingCarts: nav.shoppingCarts
            }); 
        };

        $rootScope.$on('sendToNavbar', function(event, msg){
            $scope.info = true;
            
            $scope.$apply(() => { 
                nav.cartQty = msg.cartQty;
                nav.addChart = msg.addChart;
                nav.allMenu = msg.allMenu; 
                
            });
            //event handling logic;});
        });

        
        nav.generateShoopingCart = function(){
            nav.shoppingCarts = [];
            for (let index = 0; index < nav.addChart.length; index++) {

                var menu = {};
                var id = nav.addChart[index].productMenuId;
                var listMenu = nav.allMenu;
                
                var objMenu = _.find(listMenu, function(menu){ return menu.productMenuId == id; }); 
                var objExisting = _.find(nav.shoppingCarts, function(cart){ return cart.productMenuId == id; }); 

                menu = objMenu;
                if(objExisting == undefined){
                    menu.qty = 1;
                    menu.subPrice = menu.discountPrice;
                    nav.shoppingCarts.push(menu);
                } else{
                    let indexExisting = _.findIndex(nav.shoppingCarts, function(cart){ return cart.productMenuId == id; }); 
                    nav.shoppingCarts[indexExisting].qty++;
                    nav.shoppingCarts[indexExisting].subPrice = nav.shoppingCarts[indexExisting].qty * nav.shoppingCarts[indexExisting].discountPrice;
                } 
            }
            recalculateTotal(); 
            
        } 
        nav.addQtyItem = function(type, id){
            let indexExisting = _.findIndex(nav.shoppingCarts, function(cart){ return cart.productMenuId == id; }); 
            let indexAddCart = _.findIndex(nav.addChart, function(cart){ return cart.productMenuId == id; });

            if(type == 'add'){
                if(nav.shoppingCarts[indexExisting].qty == 50)
                    farst.Alert.error('Maximal order adalah 50 pack');
                else{
                    nav.shoppingCarts[indexExisting].qty++;
                    nav.shoppingCarts[indexExisting].subPrice = 
                        nav.shoppingCarts[indexExisting].qty * 
                        nav.shoppingCarts[indexExisting].discountPrice;
                }
            }else{
                if(nav.shoppingCarts[indexExisting].qty == 1){
                    farst.Alert.confirm('Hapus dimsum', 'Apakah anda yakin menghapus order ini?', 
                        function(result) {
                            if(result.isConfirmed){
                                if(nav.shoppingCarts.length > 1){
                                    $scope.$apply(() => { 
                                        nav.shoppingCarts.splice(indexExisting, 1); 
                                        nav.addChart.splice(indexAddCart, 1); 
                                        nav.cartQty--;
                                    });
                                }else{
                                    resetCart();
                                }
                                updateChart();
                            }
                    });
                
                }
                else{
                    nav.addChart.splice(indexAddCart, 1); 
                    nav.shoppingCarts[indexExisting].qty--;
                    nav.shoppingCarts[indexExisting].subPrice = 
                        nav.shoppingCarts[indexExisting].qty * 
                        nav.shoppingCarts[indexExisting].discountPrice;
                }
            }
            recalculateTotal(); 
        } 
        function validateForm(){
            var message = '';
            
            nav.model.shoppingCarts = [];
            nav.model.shoppingCarts = nav.shoppingCarts;
            nav.model.subTotalCart = nav.subTotalCart;
            
            if(nav.model.orderDate == undefined){
                return 'Tolong masukkan tanggal pemesanan';
            }
            else if(nav.model.customerName == undefined){
                return 'Tolong masukkan nama anda'; 
            }
            else if(nav.model.phoneNumber == undefined){
                return 'Tolong masukkan nomor anda (yang terhubung dengan WA)'; 
            }
            else if(nav.shoppingCarts.length == 0){
                return 'Anda belum ada masukkan pesanan dimsum, silahkan tambah terlebih dahulu.'; 
            }
            else{
                if(farst.validasiNomorSeluler(nav.model.phoneNumber) == false){
                    return 'Format nomor yang anda masukkan salah. Pastikan nomor anda aktif dan terdaftar provider di Indonesia.'; 
                }
                else
                    return '';
            }

        }
        
        function recalculateTotal(){
            nav.subTotalCart = 0;
            nav.shoppingCarts.forEach(element => { 
                nav.subTotalCart = nav.subTotalCart + element.subPrice;
            });
        }  

        function resetCart(){
            $scope.$apply(() => { 
                nav.shoppingCarts = [];
                nav.addChart = [];
                nav.cartQty = 0;
                nav.subTotalCart = 0;
                nav.model = {}; 
            });  
        }

        
        nav.checkOut = function(){
            var errorMessage = validateForm();
            if(errorMessage == ''){
                let secretPassphrase = (Math.random() + 1).toString(36).substring(2);
                farst.setLocalStorage(secretPassphrase, nav.model); 
                var encryptedAES = CryptoJS.AES.encrypt(secretPassphrase, 'kNISDIqad91210201013lz821b');
                
                // var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, 'kNISDIqad91210201013lz821b');
                // var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
                // var model = farst.getLocalStorage(encryptedAES); 
                
                // var currentUrl = window.location.origin;
                // const url = currentUrl+"/checkout.html?id="+encryptedAES;
                // window.location.href = url; 
                
                $state.go('app.pages.checkout', {
                    'id': encryptedAES
                });
                $('#shoppingCartModal').modal('toggle');
            }else{
                farst.Alert.error(errorMessage);
            }
        }

        nav.tracking = function(){
            $state.go('app.pages.tracking', {
                'ordernumber': ""
            });
        }
        nav.changeMenu = function(id){
            nav.bar = id;
        };
        // start menus order
        
		nav.logout = function () {
            logoutProccess();
		};

		function logoutProccess() {
			$state.go('login');

			$cookies.remove('token');
			$cookies.remove('User');

			$window.localStorage.clear();
		}
 
        
		nav.init = function () {
			user = $window.localStorage.getItem('user');
			if (user == null || user == undefined) {
				nav.isBegining = true;
				// nav.logout();
			}else{
				nav.isBegining = false;
				$timeout(function () {
					nav.user = JSON.parse(user);

					if(nav.user.parentMemberName == undefined){
						nav.user.parentMemberName = nav.user.memberName;
						nav.user.memberName = 'Balikpapan';
					}
					// console.log(nav.user);
				}, 0);

				navService.generateMenu($scope);
				navService.refreshActiveMenu();
			}

		}($scope);
        return nav;
    };
 
})();

