define(function (require) {
    'use strict';

    var Application = require('presentation/modules/app');
    // var ResponseError = require('library/Messages/ResponseError');
    var GoogleMaps = require('infrastructurelib/socials/GoogleMaps');

    Application.factory('GooglMapAsyncHelperFactory', [
        '$timeout', '$q',
        function ($timeout, $q) {
            var _defaultOptions, _icons;

            _defaultOptions = {
                // view options
                center: {lat: 63.440630, lng: 16.264805},
                zoom: 5,
                options: {minZoom: 5, maxZoom: 14},
//                mapTypeId: google.maps.MapTypeId.ROADMAP,
                // manual handling options
                refresh: true,
                draggable: true,
                scrollwheel: true,
                // Controlls
                zoomControl: true,
                scaleControl: false,
//                navigationControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                rotateControl: false
            };
            _icons = [
                'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            ];

            // Factory
            return {
                createPromise: function (domElementId, customOptions) {
                    return createGMapAsync(domElementId, customOptions);
                },
                toggleMapCenter: function (map, markers, coordinates)
                {
                    var i, coordinatesToProcess, latLng, marker, bounds;

                    // Set defaults
                    coordinatesToProcess = [];
                    // Get coordinates to process
                    if (!coordinates) {
                        // do nothing
                    } else if ('undefined' !== typeof coordinates.lat
                        && 'undefined' !== typeof coordinates.lng
                        ) {
                        coordinatesToProcess.push({
                            lat: coordinates.lat,
                            lng: coordinates.lng,
                            exist: false
                        });
                    } else {
                        for (i in coordinates) {
                            if (!coordinates[i]) {
                                continue;
                            }
                            if ('number' !== typeof coordinates[i].lat
                                && 'number' !== typeof coordinates[i].lng
                            ) {
                                continue;
                            }
                            coordinatesToProcess.push({
                                lat: coordinates[i].lat,
                                lng: coordinates[i].lng,
                                icon: _icons[i % _icons.length]
                            });
                        }
                    }

                    // If there are no coordinates we need to clear the mpa
                    if (coordinatesToProcess.length < 1) {
                        // If there were markers but they were removed - clear the map
                        // and set default values
                        if (markers) {
                            clearMarkers(markers);
                            setMapCenter(map, _defaultOptions.center);
                            setMapZoom(map, _defaultOptions.zoom);
                        }
                        // Otherhand do not change the map
                        return;
                    }

                    clearMarkers(markers);
                    bounds = new google.maps.LatLngBounds();
                    for (i in coordinatesToProcess) {
                        latLng = new google.maps.LatLng(coordinatesToProcess[i].lat, coordinatesToProcess[i].lng);
                        marker = createMarker(map, latLng);
                        marker.setIcon(coordinatesToProcess[i].icon);
                        markers.push(marker);
                        bounds.extend(latLng);
                    }
                    map.fitBounds(bounds);
                }
            };

            /**
             * Set GoogleMap center to coordinates or calcualte it by array of coordinates depend of parameters
             *
             * coordinates can be array of coordinates
             *      [{lat: lat, lng: lng}, {lat: lat, lng: lng}, {lat: lat, lng: lng}, ....]
             *
             *      {lat: lat, lng: lng}
             *
             * @param {GoogleMap} map
             * @param {object} coordinates can be array of coordinates or single coordinates
             * @returns {undefined}
             */
            function setMapCenter(map, coordinates)
            {
                var i, lat, lng, count;

                lat = 0;
                lng = 0;
                count = 0;
                if (coordinates) {
                    if ('undefined' !== typeof coordinates.lat
                        && 'undefined' !== typeof coordinates.lng
                        ) {
                        lat = 1 * coordinates.lat;
                        lng = 1 * coordinates.lng;
                        count++;
                    } else {
                        for (i in coordinates) {
                            lat += 1 * coordinates[i].lat;
                            lng += 1 * coordinates[i].lng;
                            count++;
                        }
                    }
                }

                if (count) {
                    lat = lat / count;
                    lng = lng / count;
                } else {
                    lat = _defaultOptions.center.lat;
                    lng = _defaultOptions.center.lng;
                }

                map.setCenter({lat: lat, lng: lng});
            }

            /**
             * Set GoogleMap zoom
             *
             * @param {GoogleMap} map
             * @param {integer} setToZoom
             * @returns {undefined}
             */
            function setMapZoom(map, setToZoom)
            {
                var zoom;
                if (setToZoom) {
                    if (setToZoom > _defaultOptions.options.maxZoom) {
                        zoom = _defaultOptions.options.maxZoom;
                    } else if (setToZoom < _defaultOptions.options.minZoom) {
                        zoom = _defaultOptions.options.minZoom;
                    } else {
                        zoom = setToZoom;
                    }
                } else {
                    zoom = _defaultOptions.options.minZoom;
                }
                map.setZoom(zoom);
            }

            /**
             * Adds a marker to the map and push to the array.
             *
             * @param {GoogleMap} map
             * @param {LatLon} location
             * @returns {Marker}
             */
            function createMarker(map, location)
            {
                var marker;
                marker = new google.maps.Marker({
                    position: location,
                    map: map
                });

                return marker;
            }

            /**
             * Deletes all markers in the array by removing references to them.
             *
             * @param {array(Marker)} markers
             * @returns {array}
             */
            function clearMarker(markers, index)
            {
                markers[index].setMap(null);
                markers.splice(index, 1);
                return markers;
            }

            /**
             * Deletes all markers in the array by removing references to them.
             *
             * @param {array(Marker)} markers
             * @returns {array}
             */
            function clearMarkers(markers)
            {
                var i;
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];

                return markers;
            }

            /**
             * Constructor for GMap
             *
             * @param {string} domElementId id of DOM element that will be used
             * @param {object} customOptions options
             * @returns {Promise(GoogleMap)}
             */
            function createGMapAsync(domElementId, customOptions)
            {
                return GoogleMaps.onMapLoadPromise
                    .then(function () {
                        var i, deferred, options;
                        deferred = $q.defer();
                        options = angular.copy(_defaultOptions);
                        for (i in customOptions) {
                            options[i] = customOptions[i];
                        }
                        _onElementFoundCalback(domElementId, 300, 200, function (element) {
                            var map = new google.maps.Map(element, options);
                            deferred.resolve(map);
                        }, function () {
                            deferred.reject('Can`t load element');
                        });

                        return deferred.promise;
                    });

            }

            /**
             * Collback function for checking if element loaded
             *
             * @param {string} domElementId id of DOM element that will be used
             * @returns {undefined}
             */
            function _onElementFoundCalback(domElementId, checkTimerMs, iterationMaxCount, successCallbackFn, errorCallbackFn, iteration)
            {
                var element;
                element = document.getElementById(domElementId);

                iteration = iteration ? iteration + 1 : 1;
                if (!element) {
                    if (iterationMaxCount && iteration > iterationMaxCount) {
                        errorCallbackFn(iteration);
                        return;
                    }
                    $timeout(function () {
                        _onElementFoundCalback(domElementId, checkTimerMs, iterationMaxCount, successCallbackFn, errorCallbackFn, iteration);
                    }, checkTimerMs);
                    return;
                }
                successCallbackFn(element);
            }
        }
    ]);
});
