(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('menuCtrl', menuCtrl);

    menuCtrl.$inject = ['$scope', 'farst', 'HttpService', '$rootScope'];
    function menuCtrl($scope, farst, http, $rootScope){
        var mn = this;
        
        mn.addChart = [];  
        mn.shoppingCarts = [];  
        mn.cartQty = 0;  
        
        function getMenuData(){ 
            farst.loadingIn(); 
            http.post('/productmenus/get', { 
                "ids": [],
                "filters": [], 
                "pageSize":100,
                "keyword": ""
            }).then(function (res) {
                farst.loadingOut(); 
                // console.log(res);
                if (res.data.statusCode == 200) {  
                    // console.log(res.data.data.records);
                    mn.listMenu = _.filter(res.data.data.records, 
                        function(obj){ 
                            return obj.category == 'ORI';
                        });

                    mn.listMixMenu = _.filter(res.data.data.records, 
                        function(obj){ 
                            return obj.category == 'MIX';
                        });
                        
                    mn.listHampresMenu = _.filter(res.data.data.records, 
                        function(obj){ 
                            return obj.category == 'HAMPRES';
                        });
                    
                    mn.listFrozenMenu = _.filter(res.data.data.records, 
                        function(obj){ 
                            return obj.category == 'Frozen';
                        });
                } else {
                    if(res.status == 401 || res.status == 402){
                        farst.Alert.error(res.data.message);
                    }else {
                        farst.Alert.error('Data not found');
                    }  
                }
            });  
        };  
        
        function updateQty(){
            $rootScope.$broadcast('sendToNavbar', {
                cartQty: mn.cartQty,
                addChart: mn.addChart,
                listMenu: mn.listMenu,
                listMixMenu: mn.listMixMenu,
                listHampresMenu: mn.listHampresMenu,
                listFrozenMenu: mn.listFrozenMenu
            }); 
        };

        $rootScope.$on('sendToMenu', function(event, msg){
            $scope.info = true; 
            $scope.$apply(() => { 
                mn.cartQty = msg.cartQty;
                mn.addChart = msg.addChart;
                mn.shoppingCarts = msg.shoppingCarts;
            });
            //event handling logic;});
        });

        mn.addToCart = async function(type, value){ 
            
            
            if(value != undefined && value > 0){ 
                var even = [];
                
                switch (type) {
                    case "mix":
                        even = _.find(mn.listMixMenu, function(menu){ return menu.productMenuId == value; });
                        break;
                    case "ham":
                        even = _.find(mn.listHampresMenu, function(menu){ return menu.productMenuId == value; });
                        break;
                    case "froz":
                        even = _.find(mn.listFrozenMenu, function(menu){ return menu.productMenuId == value; });
                        break;
                    default:
                        even = _.find(mn.listMenu, function(menu){ return menu.productMenuId == value; });
                        break;
                }

                if(even.stok == 0){
                    return farst.Alert.error('Stok sudah habis, ditunggu ya');
                }
                // farst.Alert.success('Add new item');    
                const { value: pack } = await Swal.fire({
                    title: 'Tambahkan Dimsum ke Keranjang',
                    input: 'number',
                    inputLabel: even.title,
                    inputPlaceholder: 'Berapa pack?',
                    inputAttributes: {
                        min: 1,
                        max: 50,
                        step: 1,
                        pattern: "[0-9]{10}"
                    },
                    inputValidator: (value) => {
                        if (value > 50) {
                            return 'Maksimal pack adalah 50'
                        }
                        if (value <= 0) {
                            return 'Minimal order adalah 1 pack'
                        } 
                    },
                  })
                  
                  if (pack) {
                    var objExisting = _.find(mn.shoppingCarts, function(cart){ return cart.productMenuId == value; }); 

                    for (let index = 0; index < pack; index++) {
                        mn.addChart.push({"productMenuId": value});
                    }
                    farst.Alert.success('Berhasil menambahkan '+ even.title + ' untuk ' + pack + ' pack');
                    if(objExisting == undefined){
                        mn.cartQty++;
                        updateQty();
                    }
                    // Swal.fire(`Entered password: ${password}`)
                            
                  }
                // farst.Alert.confirm('Add Item', 'Do you want to add ' + even.title + ' on your carts ?', function (result) {
                //     if (result.isConfirmed){ 
                //         mn.cartQty++;
                //         $scope.addChart.push({"id": value});
                //         farst.Alert.success('Success add '+ even.title)
                //     }; 
                // });
            }  
        } 

        
        mn.init = function ($scope) {  
            getMenuData();
        }($scope);
         

        return mn;
    };
    
})();

