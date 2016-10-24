/**
 * Definition for singleton Config. Contains main configurations of the application
 * Returns an instance of Config that will be used as singleton in the application
 *
 * @returns {Config} Instance of Config
 */
define(function (require) {
    'use strict';

    var _routes;
    _routes = require('./routes');

    function _Config() {

        var _enviroment, _apiVersion, _apiPort, _apiProtocol, _apiHost,
            _siteFullUrl, _apiFullURL, _localeObj,
            _defaultLocale,
            _config;

        // Define default language
        _localeObj = {
            'en': {
                url: 'en',
                locale: 'en'
            },
            'se': {
                url: 'se',
                locale: 'sv'
            }
        };
        _defaultLocale = _localeObj['en'];
        if (location.hostname.search('se.') > -1 || location.hostname.search('.se') > -1) {
            _defaultLocale = _localeObj['se'];
        }

        // Define base variables
        _apiVersion = 'v1.0';
        _enviroment = 'PRODUCTION'; // PRODUCTION, STAGING, DEVELOPER
        _apiProtocol = 'http';
        switch (_enviroment) {
            case 'PRODUCTION':
                // stable
                _apiPort = '3000';
                _apiHost = 'ec2-52-18-124-83.eu-west-1.compute.amazonaws.com';
                break;
            case 'STAGING':
            case 'DEVELOPER':
                // staging
                _apiPort = '3000';
                _apiHost = 'ec2-52-18-124-83.eu-west-1.compute.amazonaws.com';
                break;
            default:
                // local
                _apiPort = '3003';
                _apiHost = 'localhost';
                break;
        }

        // Build output  variables
        _apiFullURL = _apiProtocol + '://' + _apiHost + ':' + _apiPort;
        _siteFullUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        _config = {
            'enviroment': _enviroment,
            'cmsUrl': 'http://' + _defaultLocale.url + '.staging.foxrey.com',
            'siteUrl': _siteFullUrl,
            'whiteList': [_siteFullUrl, _apiFullURL],
            'request': _routes,
            'locales': {'en': 'English', 'sv': 'Swedish'},
            'defaultLocale': _defaultLocale.locale,
            // Geo location, gmaps
            'googleMapsApiKey': 'AIzaSyAvfT6tZ1ypcwTzU1nrKpXlrFkZUOMbVpY',
            'socketio': {
                'socketUrl': 'ws://' + _apiHost + ':' + _apiPort + '/?EIO=4&transport=websocket',
                'socketPort': _apiPort
            },
            'facebook': {
                'appId': '601473976697172',
                'permissions': 'email,public_profile',
                'redirectUrl': _siteFullUrl + '/app/fbaotoauth',
                'version': 'v2.7'
            },
            gplus: {
                clientId: '1081750589953-857hd6f93aqrvsf8vk50alsaidkgv7qf',
                permissions: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
            },
            grecaptcha: {
                key: '6LeB4QwTAAAAAHuTbpQGlIZwmIrQNyESSxDG0F5y',
            },
            stripe: {
                name: 'Foxrey',
                key: 'pk_test_9diYN5qOEJXM9BpuNB39UoUt',
                imag: _siteFullUrl + '/app/ui/images/other/logo_white/fox_only.png',
            },
            'validators': {
                eneblePostalCode: false
            },
            'version': _apiVersion
        };

        // Process routes
        for (var i in _config.request) {
            _config.request[i][1] = _config.request[i][1].replace('{apiUrl}', _apiFullURL);
            _config.request[i][1] = _config.request[i][1].replace('{v}', _apiVersion);
            _config.request[i] = _config.request[i];
        }

        return _config;
    }

    // socket io test url
    // http://ec2-52-17-20-238.eu-west-1.compute.amazonaws.com:3000/test/socket
    // socket io lib
    // http://ec2-52-17-20-238.eu-west-1.compute.amazonaws.com:3000/socket.io/socket.io.js
    return _Config();
});
