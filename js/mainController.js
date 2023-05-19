(function ($) {
    "use strict"; 
    var app = angular.module('ummuza', [])
    .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['$scope', '$http'];

    function mainCtrl($scope, $http){
 
        //START JSON
        var menus = {
            "menus": [
            {
                "id": 1,
                "title": "Dimsum Nori",
                "subtitle": "(8 pcs)",
                "discountPrice": "30000",
                "originPrice": "35000"
            },
            {
                "id": 2,
                "title": "Dimsum Nori Mentai",
                "subtitle": "(8 pcs)",
                "discountPrice": "35000",
                "originPrice": "45000"
            },
            {
                "id": 3,
                "title": "Dimsum Crab Stick",
                "subtitle": "(8 pcs)",
                "discountPrice": "30000",
                "originPrice": "35000"
            }
            ] 
        };  


        var listunggul = [
            {
                "id": 1,
                "name": "Fresh Meat",
                "src": "img/icon-1.png",
                "delay": "0.1s",
                "detail": "Hanya mengolah daging yang fresh, agar kebersihan terjaga & menghadirkan makanan yang sehat."
            },
            {
                "id": 2,
                "name": "Dimsum Juicy",
                "src": "img/icon-2.png",
                "delay": "0.3s",
                "detail": "Menggunakan bahan daging ayam pilihan, yang membuat tekstur dimsum menjadi lebih juicy, yummy."
            },
            {
                "id": 3,
                "name": "Safe Earth",
                "src": "img/icon-3.png",
                "delay": "0.5s",
                "detail": "Meminimalisir penggunaan plastik dengan menggunakan bahan yang bisa didaur ulang, seperti packaging berbahan dasar kertas."
            },
        ]; 
        //END JSON

        
        $scope.listunggul = listunggul;  

        // $http.get('js/json/menus.json').then(function(response) {
        //     $scope.menus = response.data;
        //     console.log($scope.menus);
        //  });

    };

    
 
    // // read local JSON file using jQuery
    // $.getJSON("./js/json/menus.json", function (data) {
    //     console.log(data);
    // })

    // // read local JSON file in javascript
    // fetch("./js/json/menus.json")
    // .then(function (response) {
    // return response.json();
    // })
    // .then(function (data) {
    // console.log(data);
    // })
})(jQuery);

