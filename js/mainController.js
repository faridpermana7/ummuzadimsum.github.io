(function ($) {
    "use strict"; 
    var app = angular.module('ummuza', [])
    .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['$scope', '$http'];

    function mainCtrl($scope, $http){
 
        //START JSON
        var menus = [
            {
                "id": 1,
                "title": "Dimsum Nori",
                "subtitle": "(8 pcs)",
                "src": "img/prod-nori.jpg",
                "delay": "0.1s",
                "discountPrice": "30000",
                "originPrice": "35000",
                "isDiscount": true,
                "isNew": true,
                "isBest": false
            },
            {
                "id": 2,
                "title": "Dimsum Nori Mentai",
                "subtitle": "(8 pcs)",
                "src": "img/prod-norimentai.jpg",
                "delay": "0.3s",
                "discountPrice": "35000",
                "originPrice": "45000",
                "isDiscount": false,
                "isNew": true,
                "isBest": false
            },
            {
                "id": 3,
                "title": "Dimsum Crab Stick",
                "subtitle": "(8 pcs)",
                "src": "img/prod-crabstick.jpg",
                "delay": "0.5s",
                "discountPrice": "30000",
                "originPrice": "35000",
                "isDiscount": true,
                "isNew": true,
                "isBest": false
            },
            {
                "id": 4,
                "title": "Dimsum Mozzarela",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mozza.jpg",
                "delay": "0.75s",
                "discountPrice": "35000",
                "originPrice": "35000",
                "isDiscount": false,
                "isNew": true,
                "isBest": true
            },
            {
                "id": 5,
                "title": "Dimsum Original",
                "subtitle": "(8 pcs)",
                "src": "img/prod-original.jpg",
                "delay": "1s",
                "discountPrice": "25000",
                "originPrice": "0",
                "isDiscount": false,
                "isNew": false,
                "isBest": true
            },
            {
                "id": 6,
                "title": "Dimsum Mentai",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mentai.jpg",
                "delay": "1.3s",
                "discountPrice": "30000",
                "originPrice": "0",
                "isDiscount": false,
                "isNew": false,
                "isBest": true
            }
        ];  
        
        var mix_menus = [
            {
                "id": 1,
                "title": "Mix 1",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mix1.jpg",
                "delay": "0.1s",
                "discountPrice": "27000",
                "originPrice": "30000",
                "isDiscount": true,
                "isNew": false,
                "isBest": true
            },
            {
                "id": 2,
                "title": "Mix 2",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mix2.jpg",
                "delay": "0.3s",
                "discountPrice": "27000",
                "originPrice": "30000",
                "isDiscount": true,
                "isNew": false,
                "isBest": false
            },
            {
                "id": 3,
                "title": "Mix 3",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mix3.jpg",
                "delay": "0.5s",
                "discountPrice": "30000",
                "originPrice": "35000",
                "isDiscount": false,
                "isNew": false,
                "isBest": false
            },
            {
                "id": 4,
                "title": "Mix 4",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mix4.jpg",
                "delay": "0.75s",
                "discountPrice": "33000",
                "originPrice": "35000",
                "isDiscount": false,
                "isNew": false,
                "isBest": true
            },
            {
                "id": 5,
                "title": "Mix 5",
                "subtitle": "(8 pcs)",
                "src": "img/prod-mix5.jpg",
                "delay": "1s",
                "discountPrice": "33000",
                "originPrice": "35000",
                "isDiscount": false,
                "isNew": false,
                "isBest": true
            }
        ];  
        
        var hampres_menus = [
            {
                "id": 1,
                "title": "Mini Hampres",
                "subtitle": "(16 pcs + paper bag + kartu ucapan + hiasan)",
                "src": "img/prod-hampres.jpg",
                "delay": "0.1s",
                "discountPrice": "85000",
                "originPrice": "95000",
                "isDiscount": true,
                "isNew": true,
                "isBest": false
            },
            {
                "id": 2,
                "title": "Dimsum Nampan",
                "subtitle": "(50 pcs + nampan + cover + hiasan)",
                "src": "img/prod-nampan.jpg",
                "delay": "0.3s",
                "discountPrice": "190000",
                "originPrice": "200000",
                "isDiscount": true,
                "isNew": false,
                "isBest": false
            }
        ];
        
        var frozen_menus = [
            {
                "id": 1,
                "title": "Frozen Original",
                "subtitle": "(10 pcs)",
                "src": "img/prod-forzen-ori.jpg",
                "delay": "0.1s",
                "discountPrice": "35000",
                "originPrice": "0",
                "isDiscount": false,
                "isNew": true,
                "isBest": false
            },
            {
                "id": 2,
                "title": "Frozen Mix Varian",
                "subtitle": "(10 pcs)",
                "src": "img/prod-forzen-mix.jpg",
                "delay": "0.3s",
                "discountPrice": "40000", 
                "originPrice": "0",
                "isDiscount": false,
                "isNew": true,
                "isBest": true
            }
        ]; 

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
        
        var lates_posts = [
            {
                "id": 1,
                "type": "image",
                "src": "img/blog-1.jpg",
                "user": "admin",
                "postDate": "07 May 2023",
                "delay": "0.1s",
                "title": "Bismillah, open order kembali mulai Senin, 8 Mei ya Sobat 🙏...",
                "detail": "Bismillah, open order kembali mulai Senin, 8 Mei ya Sobat 🙏..."
            },
            {
                "id": 2,
                "type": "video",
                "src": "img/blog-2.mp4",
                "user": "admin",
                "postDate": "07 May 2023",
                "delay": "0.3s",
                "title": "Terima kasih ya sobat setia Ummuza buat...",
                "detail": "Terima kasih ya sobat setia Ummuza buat..."
            },
            {
                "id": 3,
                "type": "video",
                "src": "img/blog-3.mp4",
                "user": "admin",
                "postDate": "07 May 2023",
                "delay": "0.5s",
                "title": "Assalamualaikum Sobat Ummuza gmn kabarnya?...",
                "detail": "Assalamualaikum Sobat Ummuza gmn kabarnya?..."
            },
        ]; 
        //END JSON

        
        $scope.listunggul = listunggul;  
        $scope.listMenu = menus;  
        $scope.listMixMenu = mix_menus;  
        $scope.listHampresMenu = hampres_menus;  
        $scope.listFrozenMenu = frozen_menus; 
        $scope.listLatesPost = lates_posts; 

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

