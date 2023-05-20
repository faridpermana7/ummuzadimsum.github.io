(function ($) {
    "use strict";
    var app = angular.module('ummuza', [])
    .controller('postCtrl', postCtrl);

    postCtrl.$inject = ['$scope', '$http'];
    function postCtrl($scope, $http){
    
    var posts = [
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
        {
            "id": 4,
            "type": "video",
            "src": "img/blog-4.mp4",
            "user": "admin",
            "postDate": "05 April 2023",
            "delay": "0.1s",
            "title": "Makan.Balikpapan: SANGAT DIREKOMENDASIKAN! INI...",
            "detail": "Makan.Balikpapan: SANGAT DIREKOMENDASIKAN! INI..."
        },
        {
            "id": 5,
            "type": "image",
            "src": "img/blog-5.jpg",
            "user": "admin",
            "postDate": "25 March 2023",
            "delay": "0.3s",
            "title": "Terima kasih orderannya hari ini sobat ummuza😍🥰...",
            "detail": "Terima kasih orderannya hari ini sobat ummuza😍🥰..."
        },
        {
            "id": 6,
            "type": "image",
            "src": "img/blog-6.jpg",
            "user": "admin",
            "postDate": "25 March 2023",
            "delay": "0.5s",
            "title": "Alhamdulillah, terima kasih orderannya sobat. 50pack...",
            "detail": "Alhamdulillah, terima kasih orderannya sobat. 50pack..."
        },
        {
            "id": 7,
            "type": "video",
            "src": "img/blog-7.mp4",
            "user": "admin",
            "postDate": "25 March 2023",
            "delay": "0.1s",
            "title": "Alhamdulillah, terima kasih orderannya sobat. 50pack...",
            "detail": "Alhamdulillah, terima kasih orderannya sobat. 50pack..."
        },
        {
            "id": 8,
            "type": "image",
            "src": "img/blog-8.jpg",
            "user": "admin",
            "postDate": "23 March 2023",
            "delay": "0.3s",
            "title": "Selamat menunaikan ibadah puasa ya Sobat Ummuza 🙏🏻☺️",
            "detail": "Selamat menunaikan ibadah puasa ya Sobat Ummuza 🙏🏻☺️."
        },
        {
            "id": 9,
            "type": "video",
            "src": "img/blog-9.mp4",
            "user": "admin",
            "postDate": "19 March 2023",
            "delay": "0.5s",
            "title": "kulineran.balikpapan: Kami bangga banget sama UMKM...",
            "detail": "kulineran.balikpapan: Kami bangga banget sama UMKM..."
        }
    ]; 

    $scope.listPosts = posts;  
    
 
    var urlParams = new URLSearchParams(window.location.search);
    var greetingValue = urlParams.get('value');
    // alert(greetingValue); 

    };
    
})(jQuery);

