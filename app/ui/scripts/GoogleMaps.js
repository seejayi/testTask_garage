define(function (require) {
    'use strict';

    var Config = require('config/Config');

    if (!window.google || !google.maps || !google.maps.places) {
        var url, gmapScript;

        url = 'https://maps.googleapis.com/maps/api/js';
        url += '?key=' + Config.googleMapsApiKey;
        url += '&libraries=places';
        url += '&language=en';

        gmapScript = document.createElement('script');
        gmapScript.setAttribute('src', url);
        gmapScript.setAttribute('id', 'gmapScript');
        document.head.appendChild(gmapScript);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Constructor for GoogleMaps
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @public
     * @constructor
     * @returns {undefined}
     */

    function GoogleMaps()
    {
        this.onMapLoadPromise = this.__onGoogleMapsLoadPromise(200, 300);
    }

    /**
     *
     * @retur {Promise<object>}
     */
    GoogleMaps.prototype.getMyGeoLocationAsync = function ()
    {
        var deferred, that, _location;

        that = this;
        _location = this._getDefaultLocation();
        deferred = IPromiseAdapter.defer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(_successFunction, _errorFunction);

        } else {
            deferred.reject(_location);
        }

        return deferred.promise;

        function _successFunction(position) {
            var latlng, geocoder;

            _location.latitude = position.coords.latitude;
            _location.longitude = position.coords.longitude;

            try {

                latlng = new google.maps.LatLng(_location.latitude, _location.longitude);
                geocoder = geocoder = new google.maps.Geocoder();

                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    var i;
                    if (status == google.maps.GeocoderStatus.OK) {
                        for (i in results) {
                            if (-1 < (results[i].types).indexOf('locality')) {
                                _location.locality = results[i].formatted_address;
                            }
                            if (-1 < (results[i].types).indexOf('postal_town')) {
                                _location.postalTown = results[i].formatted_address;
                            }
                            if (-1 < (results[i].types).indexOf('postal_code')) {
                                _location.postalCode = results[i].formatted_address;
                            }
                            if (-1 < (results[i].types).indexOf('administrative_area_level_2')) {
                                _location.region = results[i].formatted_address;
                            }
                            if (-1 < (results[i].types).indexOf('country')) {
                                _location.country = results[i].formatted_address;
                            }
                        }
                        deferred.resolve(_location);
                    } else {
                        deferred.reject(_location);
                    }
                });

                return deferred;

            } catch (e) {
                deferred.reject(_location);
            }
        }

        function _errorFunction() {
            deferred.reject(arguments);
        }
    };

    GoogleMaps.prototype.__onGoogleMapsLoadPromise = function (checkTimerMs, iterationsMaxCount) {

        var deferred, _location;

        _location = this._getDefaultLocation();
        deferred = IPromiseAdapter.defer();

        checkTimerMs = checkTimerMs ? checkTimerMs : 100;
        _loadGooleCalback(checkTimerMs, iterationsMaxCount, function () {
            deferred.resolve(true);
        }, function () {
            deferred.reject('Can not load Google Maps');
        });

        return deferred.promise;

        // core recursive constructor fn based on collback
        function _loadGooleCalback(checkTimerMs, iterationMaxCount, successCallbackFn, errorCallbackFn, iteration)
        {
            iteration = iteration ? iteration + 1 : 1;
            if (!window.google || !google.maps) {
                if (iterationMaxCount && iteration > iterationMaxCount) {
                    errorCallbackFn(iteration);
                    return;
                }
                setTimeout(function () {
                    _loadGooleCalback(checkTimerMs, iterationMaxCount, successCallbackFn, errorCallbackFn, iteration);
                }, checkTimerMs);
                return;
            }
            successCallbackFn();
        }
    };

    GoogleMaps.prototype._getDefaultLocation = function () {
        var locationObj;
        locationObj = {
            'latitude': '',
            'longitude': '',
            'country': '',
            'region': '',
            'city': ''
        };

        return locationObj;
    };

    // Returns an instance of GoogleMaps. This instance will be used as singlton in the applicatio
    return new GoogleMaps();
});
