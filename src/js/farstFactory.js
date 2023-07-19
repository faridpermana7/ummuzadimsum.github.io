(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .factory('farst', farst);
    
    farst.$inject = ['$window', 'ConfigService', '$timeout']; 

    function farst($window, cs, $timeout) {
        var farst = this; 
        
        farst = cs.config;
        farst.l.c = farst.config;  
        farst.Alert = {
            confirm: function (title, message, result) { 
                Swal.fire({
                    title: title,
                    text: message,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                  }).then(result); 
            },
            success: function (message) {
                Swal.fire({
                position: 'top-mid',
                icon: 'success',
                title: message,
                timer: 3500,
                timerProgressBar: true,
                showConfirmButton: false 
              });
            },
            warning: function (message) {
                Swal.fire({
                position: 'top-mid',
                icon: 'warning',
                title: message, 
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false 
              });

            },
            error: function (message) {
                Swal.fire({
                position: 'top-mid',
                icon: 'error',
                title: message, 
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false 
              });; 
            },
            prompt: function (title, message, atn, onOK, onCancel) {
                // alertify.prompt()
                //     .set('onshow', function () {
                //         //console.log($(this.elements.content).find('.ajs-input'));
                //         $(this.elements.content).find('.ajs-input').attr('required', true);
                //         $(this.elements.content).find('.ajs-input').attr('placeholder', 'Please input ' + atn);
                //     }
                //     ).set('labels', { ok: 'Yes', cancel: 'No!' })
                //     .set({ transition: 'fade' });
                // alertify.prompt(title, message, null, onOK, onCancel ? onCancel : function () { });

            }
        };  
        
        farst.loadingIn = function () {
            angular.element('.loading').css('display', 'flex');;
        };
        farst.loadingOut = function () {
            $timeout(function () { 
                angular.element('.loading').fadeOut();
            }, 900);
        };


        farst.getLocalStorage = function (key) {
            return JSON.parse($window.localStorage.getItem(key));
        }

        farst.setLocalStorage = function (key, data) {
            $window.localStorage.setItem(key, JSON.stringify(data));
        } 
        
        farst.removeLocalStorage = function (key) {
            $window.localStorage.removeItem(key);
        } 
        
        farst.getDateRange = function (callback) {
            return {
                'parentEl': '#rightPane',
                'opens': 'left',
                'showISOWeekNumbers': true,
                'alwaysShowCalendars': true,
                'showCustomRangeLabel': false,
                'showDropdowns': true,
                'locale': {
                    'separator': '  to  ',
                    'format': 'DD-MM-YYYY'
                },
                'ranges': {
                    'Today': [moment(), moment()],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()]
                },
                'eventHandlers': {
                    'apply.daterangepicker': function (data) {
                        callback(data);
                    }
                },
            };
        };

        farst.singleDateFormat = function (dateFormat = Farst.DATETIME_FORMAT, min = null, max = null, inline = false) {
            var param = {};
            param.widgetPositioning = {
                horizontal: 'auto',
                vertical: 'bottom'
            };
            param.format = dateFormat;
            min ? param.minDate = min : '';
            max ? param.maxDate = max : '';
            inline ? param.inline = inline : '';
            param.icons = {
                time: 'far fa-clock',
                date: 'far fa-calendar-alt'
            };

            return param;
        };

                /**
         * Normalisasi nomor HP lokal
         * @param {string} phone
         * @return {string}
         */
        function normalisasiNomorHP(phone) {
            phone = String(phone).trim();
            if (phone.startsWith('+62')) {
                phone = '0' + phone.slice(3);
            } else if (phone.startsWith('62')) {
                phone = '0' + phone.slice(2);
            }
            return phone.replace(/[- .]/g, '');
        }

        /**
         * Tes nomor HP lokal
         * @param {string} phone
         * @return {boolean}
         */
        function tesNomorHP(phone) {
            if (!phone || !/^08[1-9][0-9]{7,10}$/.test(phone)) {
                return false;
            }
            return true;
        }

        /**
         * Deteksi operator seluler indonesia
         * @param {string} phone
         * @return {string?}
         */
        function deteksiOperatorSeluler(phone) {
            const prefix = phone.slice(0, 4);
            if (['0831', '0832', '0833', '0838'].includes(prefix)) return 'axis';
            if (['0895', '0896', '0897', '0898', '0899'].includes(prefix)) return 'three';
            if (['0817', '0818', '0819', '0859', '0878', '0877'].includes(prefix)) return 'xl';
            if (['0814', '0815', '0816', '0855', '0856', '0857', '0858'].includes(prefix)) return 'indosat';
            if (['0812', '0813', '0852', '0853', '0821', '0823', '0822', '0851', '0811'].includes(prefix)) return 'telkomsel';
            if (['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix)) return 'smartfren';
            return null;
        }

        /**
         * Apakah nomor HP ini valid?
         * @param {string} phone
         * @return {boolean}
         */
        farst.validasiNomorSeluler = function(phone) {
            phone = normalisasiNomorHP(phone);
            return tesNomorHP(phone) && !!deteksiOperatorSeluler(phone);
        }

        return farst;
    };

})();