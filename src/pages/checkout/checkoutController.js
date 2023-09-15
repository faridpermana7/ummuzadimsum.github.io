(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('checkCtrl', checkCtrl);

    checkCtrl.$inject = ['$scope', 'farst', 'HttpService', '$timeout', '$stateParams'];
    function checkCtrl($scope, farst, http, $timeout, sParam){
        var ck = this;

        ck.param = sParam.id;

        var base_maxboxUrl = farst.option.maxboxUrl;
        var base_maxboxAttrib = farst.option.maxboxAttrib;
        var token = farst.option.accessToken;
        var base_lat = farst.option.defaultLat;
        var base_long = farst.option.defaultLong;

        ck.codeEnabled = true;
        
        var finalValue = ck.param.replace(/\s/g, "+");
        var decryptedBytes = CryptoJS.AES.decrypt(finalValue, 'kNISDIqad91210201013lz821b');
        var key = decryptedBytes.toString(CryptoJS.enc.Utf8);
        ck.model = farst.getLocalStorage(key);   
        ck.model.isHaveGeoPoint = true; 

        // MAP SETTING
        ck.setMarker = function (lat, long, zoom, place) {
            if (ck.model.isHaveGeoPoint) {
                if (marker) {
                    mymap.removeLayer(marker);
                }

                ck.model.lat = formatGCS(lat);
                ck.model.long = formatGCS(long);

                mymap.panTo(new L.LatLng(lat, long));

                if (zoom) {
                    mymap.flyTo(new L.LatLng(lat, long), zoom);
                }

                marker = new L.marker([ck.model.lat, ck.model.long], { draggable: true });
                marker.on('dragend', function (event) {
                    var latlng = event.target.getLatLng();
                    $timeout(function () {
                        ck.model.lat = latlng.lat;
                        ck.model.long = latlng.lng;
                    }, 0);
                });

                marker.addTo(mymap);
                mymap.addLayer(marker); 
                getFullAddress(ck.model.lat, ck.model.long);

                if (place) {
                    marker.bindPopup("<b>Lokasi</b>. <br/>" + place).openPopup();
                }
                else {
                    marker.bindPopup("<b>Lokasi</b>. <br/>").openPopup();
                }
            }
        };
        // MAP SETTING
        ck.setMarker = function (lat, long, zoom, place) {
            if (ck.model.isHaveGeoPoint) {
                if (marker) {
                    mymap.removeLayer(marker);
                }

                ck.model.lat = formatGCS(lat);
                ck.model.long = formatGCS(long);

                mymap.panTo(new L.LatLng(lat, long));

                if (zoom) {
                    mymap.flyTo(new L.LatLng(lat, long), zoom);
                }

                marker = new L.marker([ck.model.lat, ck.model.long], { draggable: true });
                marker.on('dragend', function (event) {
                    var latlng = event.target.getLatLng();
                    $timeout(function () {
                        ck.model.lat = latlng.lat;
                        ck.model.long = latlng.lng;
                    }, 0);
                });

                marker.addTo(mymap);
                mymap.addLayer(marker); 
                getFullAddress(ck.model.lat, ck.model.long);

                if (place) {
                    marker.bindPopup("<b>Lokasi</b>. <br/>" + place).openPopup();
                }
                else {
                    marker.bindPopup("<b>Lokasi</b>. <br/>").openPopup();
                }
            }
        };
        
        ck.getCurrentLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){ 
                    
                    ck.model.lat = position.coords.latitude;
                    ck.model.long = position.coords.longitude;
                    
                    ck.setMarker(position.coords.latitude, position.coords.longitude, 17, 'lokasi saya');
                }, function(error){
                    farst.Alert.error(error.message);   
                });
                
            } else { 
                farst.Alert.error("Geolocation is not supported by this browser.");
            }
        }
         
        ck.convertLinkGoogleMaps = function (e) {
            var link = e.originalEvent.clipboardData.getData('text/plain');
            var place = getPlace(link);
            var zoom = 17;

            var regEx = /![34]d(-?[\d\.]+)/g;
            // var data = "/data=!3m1!4b1!4m5!3m4!1s0x310957360e265763:0x4a3989b09e7ae9c7!8m2!3d11.520896!4d104.945442?hl=en";
            var coordinate = [];

            var match = regEx.exec(link);

            if (match != null) {
                while (match !== null) {
                    coordinate.push(match[1]);
                    match = regEx.exec(link);
                }

                if (coordinate.length > 1) {
                    ck.setMarker(coordinate[0], coordinate[1], zoom, place);
                }
            }
            else {
                farst.Alert.error('location not found');
            }
        };

        
        var mymap;
        var marker;
        
        function formatGCS(coordinate) {

            var str = coordinate + "";
            var array = str.split(".", 2);
            var formatgcs = array[1].substr(0, 5);
            var result = array[0] + "." + formatgcs;

            return parseFloat(result);
        }

        function getPlace(url) {
            var result = '';
            var arryLink = url.split("/");
            var addr = arryLink[5];

            if (addr) {
                var addrs = addr.split("+");
                result = addrs.join(" ");
            }
            return result;
        }

        function getFullAddress(lat, long){
            ck.model.address = ''; 
            $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+long, function(data){
                var tempat = data.address.building;
                var jalan = data.address.road;
                var sep = ', ';

                var detailAddress = data.address.village + sep +  
                    data.address.city + sep +
                    data.address.state + sep +
                    data.address.postcode + ' ' + data.address.country;

                if(data.address.amenity){
                    tempat = data.address.amenity;
                } 

                $scope.$apply(() => { 
                    if(tempat != undefined && jalan != undefined){
                        ck.model.address = tempat + sep + jalan + sep + detailAddress;
                    }
                    else if(tempat != undefined && jalan == undefined){
                        ck.model.address = tempat + sep + detailAddress;
                    }
                    else if(tempat == undefined && jalan != undefined){
                        ck.model.address = jalan + sep + detailAddress;
                    }
                    else{
                        ck.model.address = detailAddress;
                    }
                }); 
            });
        };

        function onMapClick(e) {
            if(ck.model.isHaveGeoPoint){

                // console.log(e);
                if (marker) {
                    mymap.removeLayer(marker);
                }
    
                var lat = formatGCS(e.latlng.lat);
                var long = formatGCS(e.latlng.lng);
    
                mymap.panTo(new L.LatLng(lat, long));
                marker = new L.marker([lat, long], { draggable: true });
    
                marker.on('dragend', onDragEnd);
    
                marker.addTo(mymap);
                marker.bindPopup("<b>Alamat saya disini</b>.").openPopup();
                if (ck.model.isHaveGeoPoint) {
                    $timeout(function () {
                        ck.model.lat = lat;
                        ck.model.long = long;
                        getFullAddress(lat, long);
                    }, 0);
                } 
            }
        }
        

        function onDragEnd(event) {
            var latlng = event.target.getLatLng();
            $timeout(function () {
                ck.model.lat = formatGCS(latlng.lat);
                ck.model.long = formatGCS(latlng.lng);
            }, 0);
        }


        ck.setmap = function () {
            mymap = new L.map('mapid').setView([base_lat, base_long], 11);
            L.tileLayer(base_maxboxUrl, {
                attribution: base_maxboxAttrib,
                tileSize: 512,
                maxZoom: 18, 
                zoomOffset: -1,
                id: 'mapbox/streets-v11',
                accessToken: token
            }).addTo(mymap);
            mymap.on('click', onMapClick);
            // mymap.dragging.disable();
            // mymap.touchZoom.disable();
            // mymap.doubleClickZoom.disable();
            // mymap.scrollWheelZoom.disable();
            // mymap.boxZoom.disable();
            // mymap.keyboard.disable();
            // if (mymap.tap) mymap.tap.disable();
            // document.getElementById('mapid').style.cursor='default';
        };

        function reactivateMap(){
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            if (map.tap) map.tap.enable();
            document.getElementById('map').style.cursor='grab';
        };

        
        // MAP SETTING END

        // PAYMENT DETAIL
        ck.model.paymentMethod = 'Transfer';
        ck.model.bankName = 'BSI';
        ck.model.ongkir = 0;
        ck.model.grandTotal = ck.model.subTotalCart + ck.model.ongkir;
        // $('.radio-group .radio').click(function(){
        //     $('.radio').addClass('gray');
        //     $(this).removeClass('gray');
        // });

        ck.choosePaymentMethod = function(value){
            ck.model.bankName = null;
            ck.model.paymentMethod = value;
            ck.model.grandTotal = ck.model.subTotalCart + ck.model.ongkir;

            if(value == 'Transfer'){
                ck.model.bankName = 'BSI';
            }
            // farst.Alert.warning(value);
        }

        function remappingItems(){ 
            ck.model.orderItems = [];

            ck.model.shoppingCarts.forEach(element => {
                var obj = {}; 
                obj.productMenuId = element.productMenuId;
                obj.productName = element.title;
                obj.subtitle = element.subtitle;
                obj.price = element.discountPrice;
                obj.qty = element.qty;
                obj.totalPrice = element.subPrice;
                obj.discount = 0;
                obj.src = element.src;
                ck.model.orderItems.push(obj);
            });
            ck.model.statusId = 1;
        }

        ck.orderNow = function(){
            if(ck.model.address == undefined){
                farst.Alert.warning("Masukkan alamat anda");
            }
            else if(ck.model.addressNote == undefined){
                farst.Alert.warning("Tolong beri catatan pada alamat, lebih memudahkan dalam pencarian");
            }
            else if(ck.model.shoppingCarts.length == 0){
                farst.Alert.warning("Anda belum memesan 1 produk dari ummuza");
            }
            else if(ck.model.isHaveGeoPoint == true && (ck.model.lat == undefined || ck.model.lat == false)){
                farst.Alert.warning("Anda memilih alamat otomatis, pilih alamat dimap dengan cara Lokasi Saya atau klik menggunakan marker");
            }else{
                    
                // var qrcode = new QRCode(document.getElementById("qrcode_container"), {
                //     width : 100,
                //     height : 100
                // }); 
                // qrcode.makeCode("faridpermana");
                
                // ck.showCheckoutModal("ORD-0101230i123-9120");
                farst.loadingIn();
                http.post('/clientorders/save', ck.model).then(function (res) {
                    console.log(res);
                    farst.loadingOut();
                    if (res.data.statusCode == 200) {
                        farst.Alert.success("Terima kasih sudah order. Nomor Ordermu:"+res.data.data); 
                        ck.showCheckoutModal(res.data.data);
                    } else {
                        farst.Alert.error(res.data.message); 
                    }
                });
            }

        };
        

        ck.onModalCheckoutCloseCallback = function (data) { 
            if (data) {
                // ck.dtService.param.data.status = 100; 
            }
        };

        ck.showCheckoutModal = function (orderNumber) {
            // console.log(ck.modalMenuCallback.modalInstance);
            
            farst.removeLocalStorage(key);
            ck.modalCheckoutCallback.modalInstance({
                orderNumber: orderNumber || ''
            });
        };


        ck.printDiv = function() 
        {  
            var oldTextAreaCopy = $('#textAreaCopy')
                .replaceWith("<div id='divForTACopy' class='divTextArea'>" + $('#textAreaCopy')
                .val()
                .replace(/\n/g, "<br>") + "</div>");
                
            var oldTextArea = $('#textArea')
                .replaceWith("<div id='divForTA' class='divTextArea'>" + $('#textArea')
                .val()
                .replace(/\n/g, "<br>") + "</div>");

            html2canvas($("#DivIdToPrint")[0], {
                useCORS: true,
                allowTaint: false,
                ignoreElements: (node) => {
                    return node.nodeName === 'IFRAME';
                }
                }).then(canvas => {
                $('#divForTACopy').replaceWith(oldTextAreaCopy);
                $('#divForTA').replaceWith(oldTextArea);
                $("#out_image").append(canvas); 
                
                var a = document.createElement('a');
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                a.download = ck.model.name +'_'+ck.model.orderDate+'_invoice.jpg';
                a.click();
            });
        } 
        ck.init = function ($scope) {  
            // $timeout(function () {
            // }, 0); 
            // ck.model.address = 'test';
            // ck.model.addressNote = 'test';
            // ck.model.isHaveGeoPoint = false; 
            ck.setmap(); 
            remappingItems();
        }($scope);
         
        return ck;
    };
    
})();

