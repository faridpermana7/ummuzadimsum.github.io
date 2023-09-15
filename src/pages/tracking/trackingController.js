(function () {
    "use strict";
    var app = angular.module('ummuza')
    .controller('trackingCtrl', trackingCtrl);

    trackingCtrl.$inject = ['$scope', '$http', 'HttpService', 'farst', 'validationService'
        ,'$stateParams'];
    function trackingCtrl($scope, $http, http, farst, validation, sParam){
        var trc = this;
        trc.ui = {};
        trc.model = {};
        trc.model.isHaveGeoPoint = false;
        trc.isOngkir = false;
        
        trc.oneAtATime = true;
        trc.status = {
          infoGeneral: false,
          orderItems: false,
          payment: false
        };

        function validate(){
            if(trc.model.statusId == 2){
                if(trc.isOngkir == true){
                    trc.model.statusId = 3;
                } 
            }

        };

        function updateService(){
            farst.loadingIn(); 
            validate();
			http.put('/clientorders/update-response', trc.model).then(function (res) {
				console.log(res);
				if (res.data.statusCode == 200) {
					farst.Alert.success('success!'); 
				} else {
					farst.Alert.error(res.data.message); 
				}
                farst.loadingOut();
			}); 

        }
        
        trc.ui.updateResponse = function () { 
            if(trc.model.status == undefined){
                farst.Alert.warning('Pastikan anda sudah mencari ordernya!');  
            }
            else{
                if(trc.model.statusId == 2 && trc.isOngkir == false){
                    farst.Alert.confirm('Konfirmasi Ongkir',
                    'Apakah anda ingin melanjutkan? anda tidak menyetujui ongkir yang ada',
                    function (res) { 
                        if(res.isConfirmed){
                            updateService(); 
                        } 
                    });
                }
                else{
                    updateService();
                }   
            } 
        }  

        trc.ui.save = function () {     
            farst.loadingIn();
            http.get('/clientorders/' + trc.model.orderNumber, {}).then(getOrder)
        } 
        function getOrder(res) { 
            farst.loadingOut();
            if(res.status == 401 || res.status == 402 || res.data.statusCode != 200){
                farst.Alert.error(res.data.message);
            }else {
                trc.model = res.data.data; 
                if(trc.model.lat != undefined && trc.model.long != undefined){
                    trc.model.isHaveGeoPoint = true; 
                    if(mymap == undefined){
                        trc.setmap();  
                    }
                    trc.setMarker(trc.model.lat, trc.model.long, 18);
                }

                if(trc.model.orderItems.length > 0){
                    trc.calcullateOrder();
                }
            }   
        }
        
        
        trc.calcullateOrder = function () {
            let sum = trc.model.orderItems.reduce((s, f) => {
             return s + f.totalPrice;               // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);   
            trc.model.subTotalCart = sum; 
            trc.model.grandTotal = trc.model.subTotalCart + trc.model.ongkir;  
        };
        
        trc.datetimeFormat = function(data, type, full, meta) {
            return data ? farst.l.toLocaleDateStr(farst.l.toDatetimeLocal(data).toString(), farst.l.DATETIME_FORMAT) : '-';
        };
        
        // MAPS
        
        var base_maxboxUrl = farst.option.maxboxUrl;
        var base_maxboxAttrib = farst.option.maxboxAttrib;
        var token = farst.option.accessToken;
        var base_lat = farst.option.defaultLat;
        var base_long = farst.option.defaultLong;
        
        var mymap;
        var marker;
        
        // MAP SETTING 
        
        function onMapClick(e) {
            if(trc.model.isHaveGeoPoint){

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
                if (trc.model.isHaveGeoPoint) {
                    $timeout(function () {
                        trc.model.lat = lat;
                        trc.model.long = long;
                        getFullAddress(lat, long);
                    }, 0);
                } 
            }
        } 

        function onDragEnd(event) {
            var latlng = event.target.getLatLng();
            $timeout(function () {
                trc.model.lat = formatGCS(latlng.lat);
                trc.model.long = formatGCS(latlng.lng);
            }, 0);
        } 

        trc.setmap = function () {
            mymap = new L.map('mapidtrack').setView([base_lat, base_long], 11);
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
        function formatGCS(coordinate) {

            var str = coordinate + "";
            var array = str.split(".", 2);
            var formatgcs = array[1].substr(0, 5);
            var result = array[0] + "." + formatgcs;

            return parseFloat(result);
        }
        
        function getFullAddress(lat, long){
            trc.model.address = ''; 
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
                        trc.model.address = tempat + sep + jalan + sep + detailAddress;
                    }
                    else if(tempat != undefined && jalan == undefined){
                        trc.model.address = tempat + sep + detailAddress;
                    }
                    else if(tempat == undefined && jalan != undefined){
                        trc.model.address = jalan + sep + detailAddress;
                    }
                    else{
                        trc.model.address = detailAddress;
                    }
                }); 
            });
        };

        trc.setMarker = function (lat, long, zoom, place) {
            if (trc.model.isHaveGeoPoint) {
                if (marker) {
                    mymap.removeLayer(marker);
                }

                trc.model.lat = formatGCS(lat);
                trc.model.long = formatGCS(long);

                mymap.panTo(new L.LatLng(lat, long));

                if (zoom) {
                    mymap.flyTo(new L.LatLng(lat, long), zoom);
                }

                marker = new L.marker([trc.model.lat, trc.model.long], { draggable: true });
                marker.on('dragend', function (event) {
                    var latlng = event.target.getLatLng();
                    $timeout(function () {
                        trc.model.lat = latlng.lat;
                        trc.model.long = latlng.lng;
                    }, 0);
                });

                marker.addTo(mymap);
                mymap.addLayer(marker); 
                getFullAddress(trc.model.lat, trc.model.long);

                if (place) {
                    marker.bindPopup("<b>Lokasi</b>. <br/>" + place).openPopup();
                }
                else {
                    marker.bindPopup("<b>Lokasi</b>. <br/>").openPopup();
                }
            }
        };
        // MAPS END
        trc.init = function () { 
            trc.model.orderNumber = sParam.ordernumber;//'ORD20230301-001';//
            //validation
            trc.validate = function (field, validate) {
                return validation.formValidation($scope, 'tracking', field, validate);
            } 
        }($scope);
        return trc;
    };
    
})();

