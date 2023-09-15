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
        mn.allMenu = [];
        mn.categories = [];
        mn.catChoices = '';
        
        $scope.filterMenu = function(item){
            mn.catChoices = item;
        };
        
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
                    var allCategories = _.map(res.data.data.records, function(detail) {
                        return detail.category;
                      });
                      
                    mn.categories = _.uniq(allCategories, false);
                    mn.allMenu = res.data.data.records;
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
                allMenu: mn.allMenu
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
                var even = {};
                even = _.find(mn.allMenu, function(menu){ return menu.productMenuId == value; });

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
                        max: 100,
                        step: 1,
                        pattern: "[0-9]{10}"
                    },
                    inputValidator: (value) => {
                        if (value > 100) {
                            return 'Maksimal pack adalah 100'
                        }
                        if (value <= 0) {
                            return 'Minimal order adalah 1 pack'
                        } 
                    },
                  })
                  
                  if (pack) {
                    var objExisting = _.find(mn.addChart, function(cart){ return cart.productMenuId == value; }); 

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

