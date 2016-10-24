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
            _siteFullUrl, _apiFullURL,
            _config;


        // Define base variables
        _apiVersion = 'v1.0';
        _enviroment = 'DEVELOPER'; // PRODUCTION, STAGING, DEVELOPER
        _apiProtocol = 'http';
        switch (_enviroment) {
            case 'PRODUCTION':
                // stable
                _apiPort = '3000';
                _apiHost = ' ';
                break;
            case 'STAGING':
            case 'DEVELOPER':
                // staging
                _apiPort = '3000';
                _apiHost = 'localhost';
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
            'siteUrl': _siteFullUrl,
            'whiteList': [_siteFullUrl, _apiFullURL],
            'request': _routes,
            // Geo location, gmaps
            // 'googleMapsApiKey': 'AIzaSyAvfT6tZ1ypcwTzU1nrKpXlrFkZUOMbVpY',
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
