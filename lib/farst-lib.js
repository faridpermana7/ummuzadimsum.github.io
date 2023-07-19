/**
 * Dynamic client and webapi endpoint entry
 * @Copyright : Farst 2018
 * @Author : Farid Permana 
 */
var WConfig = function (param) { 
    var t = this; 
    t._urlApi = undefined;
    t._urlClient = undefined;
    t._urlApiHost = undefined;
    t._osmUrl = undefined; 

    t.option = {
        "clientProtocol": "http://",
        "apiProtocol": "http://",
        "clientUrl": undefined,
        "clientPort": 80,
        "apiUrl": undefined,
        "usePort": false,
        "apiPort": 80,
        "apiPoint": "/Services.asmx/call",
        "apiPrefix": "ws",
        "autoDefineClient": true,
        "autoDefineApi": true,
        "autoDefineClientPort": true,
        "autoDefineApiPort": true,
        "log": false
    };

    t.isLogged = function () {
        return t.option.log;
    }

    t.wLog = function (header, msg) {
        if (t.isLogged() === true)
            console.log(header + " : " + msg);
    }

    t._prepareClientUrl = function () {
        if (t.option.autoDefineClient === true) {

            t._urlClient = window.location.hostname;

            t.wLog("Url", "AutoDefineClient [true] " + t._urlClient);
        } else {

            t._urlClient = t.option.clientUrl;

            t.wLog("Url", "AutoDefineClient [false] " + t._urlClient);
        }

        if (t.option.autoDefineClientPort === true) {

            t._urlClient =
                t._urlClient + (
                    (window.location.port == 80 &&
                        (
                            t.option.clientPort == 80 ||
                            _.isUndefined(t.option.clientPort) ||
                            _.isEmpty(t.option.clientPort)
                        )
                    ) ?
                        "" : (":" + window.location.port)
                );

            t.wLog("Url", "AutoDefineClientPort [true] " + t._urlClient);
        } else {

            t._urlClient =
                t._urlClient +
                ((window.location.port == 80 &&
                    (
                        _.isEmpty(t.option.clientPort) ||
                        _.isUndefined(t.option.clientPort)
                    )
                ) ?
                    "" :
                    ":" + t.option.clientPort);

            t.wLog("Url", "AutoDefineClientPort [false] " + +t._urlClient);
        }

        t._urlClient = t.option.clientProtocol + t._urlClient;
        t.wLog("Client Url : ", t._urlClient);
    }

    t._prepareApiUrl = function () {
        //Api

        if (t.option.autoDefineApi === true) {

            t._urlApi = window.location.hostname;

            t.wLog("Url", "AutoDefineApi [true]");
        } else {

            t._urlApi = t.option.apiUrl;

            t.wLog("Url", "AutoDefineApi [false] " + t._urlApi);
        }

        if(t.option.usePort == true){
            
             if (t.option.autoDefineApiPort === true) {
                t._urlApi =
                    t._urlApi +
                    ((window.location.port == 80 &&
                        (
                            t.option.apiPort == 80 ||
                            _.isUndefined(t.option.apiPort) ||
                            _.isEmpty(t.option.apiPort)
                        )
                    ) ?
                        "" :
                        ":" + window.location.port);

                t.wLog("Url", "AutoDefineApiPort [true] " + t._urlApi);
            } else {

                t._urlApi =
                    t._urlApi +
                    ((window.location.port == 80 &&
                        (
                            _.isEmpty(t.option.apiPort) ||
                            _.isUndefined(t.option.apiPort)
                        )
                    ) ?
                        "" :
                        ":" + t.option.apiPort);

                t.wLog("Url", "AutoDefineApiPort [false] " + t._urlApi);
            }
        }

        //adding prefix & protocol
        if (!_.isEmpty(t.option.apiPrefix) || !_.isUndefined(t.option.apiPrefix))
            t._urlApi = t.option.apiPrefix + "." + t._urlApi;

        t._urlApiHost = t.option.apiProtocol + t._urlApi;
        t._urlApi = t._urlApiHost + t.option.apiPoint;

        t.wLog("Api Host : ", t._urlApiHost);
        t.wLog("Api Url : ", t._urlApi);
    }

    t.reload = function () {
        t.wLog("Url Log Mode", "");
        t._prepareClientUrl();
        t._prepareApiUrl();
    }

    t.getUrl = function () {
        return t._urlClient;
    }

    t.getApiUrl = function () {
        return t._urlApi;
    }

    t.getOsmUrl = function () {
        return t.option.osmUrl;
    }

    t.getOsmAttrib = function () {
        return t.option.osmAttrib;
    }

    t.getApiHost = function () {
        return t._urlApiHost;
    }

    t.resolveClient = function (url) {
        return t._urlClient + url;
    }

    t.resolveApi = function (url) {
        return t._urlApiHost + url;
    }
    //constructor
    t._WConfig = (function (s, o) {

        _.defaults(s.option, o);
        _.assign(s.option, o);

        s.reload();
    })

    //call constructor 
    _.once(t._WConfig(t, param));

    return t;
};


var WLocale = function () {

    this.moment;
    // this.DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
    this.DATETIME_FORMAT = 'DD-MMM-YYYY HH:mm';
    this.DATETIME_FORMAT_12 = 'DD/MM/YYYY hh:mm A';
    this.DATEFORMAT = 'DD-MMM-YYYY';
    this.TIME_FORMAT = 'HH:mm';

    this.getDate = function () {
        return this.moment();
    };

    this.c = undefined;

    this.getDateUTC = function () {
        return this.moment().utc();
    };

    this.getDateIsoStr = function () {
        return this.moment().toISOString(true);
    };

    this.getDateStr = function (strFormat) {
        return this.moment().format(strFormat);
    };

    this.toLocaleFromUTC = function (isoUTCDate) {
        return this.moment.clone().moment.utc(isoUTCDate);
    };

    this.toLocaleDateStr = function (isoUTCDateFormat, strDateFormat) {
        return this.moment(isoUTCDateFormat).format(strDateFormat);
    };

    this.toLocaleDateObject = function (isoUTCDateFormat) {
        // if (isoUTCDateFormat.length == 10) {
        isoUTCDateFormat = this.moment(isoUTCDateFormat, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ssZ');
        // }
        return this.moment(isoUTCDateFormat);
    };

    this.toDatetimeUTC = function (localeIsoDateFormat) {
        //return this.moment(localeIsoDateFormat).utc();
        return this.moment.utc(localeIsoDateFormat);
    };
    
    this.toDatetimeLocal = function (localeIsoDateFormat) {
        return this.moment(localeIsoDateFormat);
    };

    this.toISOString = function (momentObject) {
        return momentObject.toISOString(true);
    };

    this.addDate = function (strIsoDate, days) {
        return this.moment(strIsoDate).add(days, 'days');
    };

    this.subtractDate = function (strIsoDate, days) {
        return this.moment(strIsoDate).subtract(days, 'days');
    };

    this.WLocale = function () {

        this.timezone = 'Asia/Jakarta';
        this.moment = moment;
        this.moment.tz.setDefault(this.timezone);

    };

    _.once(this.WLocale());

    return this;
};

var WUtil = function () {

    this.castToEmpty = function (val) {
        if (val === null || val === undefined)
            return "";

        return val;
    };

    this.castToZero = function (val) {
        if (val === null || val === undefined)
            return 0;

        return val;
    };

    /**
     * Generates a GUID string.
     * @returns {String} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser (slavik@meltser.info).
     * @link http://slavik.meltser.info/?p=142
     */
    this.guid = function () {

        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    };

    return this;
};

WConfig.prototype.l = new WLocale();
WConfig.prototype.util = new WUtil();