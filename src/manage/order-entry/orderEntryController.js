(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .controller('orderEntryCtrl', orderEntry)

    orderEntry.$inject = ['$scope', '$stateParams', '$window', '$timeout', 
        '$state', 'orderEntryService', 'farst', 'validationService', 
        'HttpService', 'pendingRequest'];

    function orderEntry($scope, sParam, $window, $timeout, $state, service, 
        farst, validation, http, pendingRequest) {
        var ode = this; 

        ode.isCreate = sParam.id == 'new' ? true : false;
        ode.ui = {};
        ode.model = {};    
        ode.listProductMenu = [];
        ode.model.isHaveGeoPoint = false;
        
        var base_maxboxUrl = farst.option.maxboxUrl;
        var base_maxboxAttrib = farst.option.maxboxAttrib;
        var token = farst.option.accessToken;
        var base_lat = farst.option.defaultLat;
        var base_long = farst.option.defaultLong;
        
        var mymap;
        var marker;
        
        // MAP SETTING
        ode.setMarker = function (lat, long, zoom, place) {
            if (ode.model.isHaveGeoPoint) {
                if (marker) {
                    mymap.removeLayer(marker);
                }

                ode.model.lat = formatGCS(lat);
                ode.model.long = formatGCS(long);

                mymap.panTo(new L.LatLng(lat, long));

                if (zoom) {
                    mymap.flyTo(new L.LatLng(lat, long), zoom);
                }

                marker = new L.marker([ode.model.lat, ode.model.long], { draggable: true });
                marker.on('dragend', function (event) {
                    var latlng = event.target.getLatLng();
                    $timeout(function () {
                        ode.model.lat = latlng.lat;
                        ode.model.long = latlng.lng;
                    }, 0);
                });

                marker.addTo(mymap);
                mymap.addLayer(marker); 
                getFullAddress(ode.model.lat, ode.model.long);

                if (place) {
                    marker.bindPopup("<b>Lokasi</b>. <br/>" + place).openPopup();
                }
                else {
                    marker.bindPopup("<b>Lokasi</b>. <br/>").openPopup();
                }
            }
        };

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
            ode.model.address = ''; 
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
                        ode.model.address = tempat + sep + jalan + sep + detailAddress;
                    }
                    else if(tempat != undefined && jalan == undefined){
                        ode.model.address = tempat + sep + detailAddress;
                    }
                    else if(tempat == undefined && jalan != undefined){
                        ode.model.address = jalan + sep + detailAddress;
                    }
                    else{
                        ode.model.address = detailAddress;
                    }
                }); 
            });
        };

        function onMapClick(e) {
            if(ode.model.isHaveGeoPoint){

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
                if (ode.model.isHaveGeoPoint) {
                    $timeout(function () {
                        ode.model.lat = lat;
                        ode.model.long = long;
                        getFullAddress(lat, long);
                    }, 0);
                } 
            }
        } 

        function onDragEnd(event) {
            var latlng = event.target.getLatLng();
            $timeout(function () {
                ode.model.lat = formatGCS(latlng.lat);
                ode.model.long = formatGCS(latlng.lng);
            }, 0);
        } 

        ode.setmap = function () {
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
        };

        ode.ui.back = function () {
            $state.go('app.management.order');
        };
        ode.ui.save = function () {   
            if (ode.isCreate) {
                service.saveOrder(ode.model, function () {
                    $state.go('app.management.order');
                });
            } else {
                // console.log(ode.model);
                service.updateOrder(ode.model, function () {
                    $state.go('app.management.order');
                });
            }  
        } 
        
        ode.getStatus = function (keyword) {
            ode.listStatus = [
                { "id": 1, "name": "Menunggu Konfirmasi Pesanan" },
                { "id": 2, "name": "Konfirmasi Ongkir" },
                { "id": 3, "name": "Sedang diproses" },
                { "id": 4, "name": "Selesai" },
                { "id": 5, "name": "Batal" }
            ];
        };

        ode.addOrderItems = function () {
            ode.model.orderItems.push({});
        };
        
        ode.removeOrderItems = function (index) {
            ode.model.orderItems.splice(index, 1);
        };
        
        ode.getProductMenu = function (keyword) {
            http.post('/productmenus/get', {
                'keyword': keyword,
                'pageSize': 100
            }).then(function (res) {
                ode.listProductMenu = res.data.data.records;
            });
        };
        ode.changeMenu = function(selected, index){
            if(selected){ 
                var existing = _.find(ode.model.orderItems, function (o) { return o.productMenuId == selected.productMenuId; });
                
                if(existing != undefined && existing.productMenuSRC != undefined){
                    farst.Alert.warning('Kamu sudah memilih menu ini, silahkan tambahkan yang lain');
                    ode.model.orderItems[index] = {};
                }else{ 
                    ode.model.orderItems[index].productName = selected.title; 
                    ode.model.orderItems[index].productMenuSRC = selected.src; 
                    ode.model.orderItems[index].price = selected.discountPrice; 
                    ode.model.orderItems[index].qty = 1; 
                    ode.model.orderItems[index].discount = 0; 
                    ode.model.orderItems[index].totalPrice = selected.discountPrice; 
                }
                ode.calcullateOrder();
            } 
        }; 
        ode.changeQty = function(index){
            ode.model.orderItems[index].totalPrice = (ode.model.orderItems[index].qty * ode.model.orderItems[index].price) - ode.model.orderItems[index].discount;
            ode.calcullateOrder();
        }
        
        ode.calcullateOrder = function () {
            let sum = ode.model.orderItems.reduce((s, f) => {
             return s + f.totalPrice;               // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);   
            ode.model.subTotalCart = sum; 
            ode.model.grandTotal = ode.model.subTotalCart + ode.model.ongkir;  
        };
        
        ode.choosePaymentMethod = function(value){
            if(ode.model.ongkir == undefined){
                ode.model.ongkir = 0; 
            }
            ode.model.paymentMethod = value; 
            
            if(value == 'cod1'){
                ode.model.ongkir = 0;
            }
            ode.calcullateOrder();
            // farst.Alert.warning(value);
        } 

        /* FUNCTION TO GET MAP*/
        ode.getCurrentLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){ 
                    
                    ode.model.lat = position.coords.latitude;
                    ode.model.long = position.coords.longitude;
                    
                    ode.setMarker(position.coords.latitude, position.coords.longitude, 17, 'lokasi saya');
                }, function(error){
                    farst.Alert.error(error.message);   
                });
                
            } else { 
                farst.Alert.error("Geolocation is not supported by this browser.");
            }
        }
         
        ode.convertLinkGoogleMaps = function (e) {
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
                    ode.setMarker(coordinate[0], coordinate[1], zoom, place);
                }
            }
            else {
                farst.Alert.error('location not found');
            }
        };
        function getEntry(res) { 
            if(res.status == 401 || res.status == 402){
                farst.Alert.error(res.data.message);
            }else {
                ode.model = res.data.data; 
                if(ode.model.lat != undefined && ode.model.long != undefined){
                    ode.model.isHaveGeoPoint = true;
                    ode.setMarker(ode.model.lat, ode.model.long, 18);
                }

                if(ode.model.orderItems.length > 0){
                    ode.calcullateOrder();
                }
            }   
            farst.loadingOut();
        }

        $scope.$on('$destroy', function () {
            // consoode.log('destroyed');
            pendingRequest.cancelAll();
        });

        ode.init = function () {
            farst.loadingIn();
            ode.opts = farst.singleDateFormat(farst.l.DATEFORMAT);
            ode.model.orderDate = farst.l.getDate();   
            ode.setmap(); 

            if (!ode.isCreate) {
                http.get('/customerorders/' + sParam.id, {}).then(getEntry)
            }
            else{
                ode.model.orderItems = [];
                farst.loadingOut();
            }

            //validation
            ode.validate = function (field, validate) {
                return validation.formValidation($scope, 'order', field, validate);
            }
            ode.dCurrency = farst.dCurrency;
        }($scope);

        return ode;
    };
})();