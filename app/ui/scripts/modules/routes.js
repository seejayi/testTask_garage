/**
 * Routes definition
 *
 * @requires angular
 *
 * @param {require} require
 * @return {undefined}
 */

define(function (require) {
    'use strict';


    /**
     * Initialize all dependencies
     */
    var angular = require('angular'),
        Config = require('config/Config'),
        routesList = require('presentation/modules/extra/routes'),
        routes;

    // Module that will be used in the application
    require('angular-ui-router');

    // Controllers that are used in routes
    // require('controllers/_Partials/HeaderPartialsCtrl');
    // require('controllers/_Partials/FooterPartialsCtrl');
    // require('controllers/_Partials/AsidePartialsCtrl');

    /**
     * Initiate module for routes
     *
     * @return {module} new module with the {@link angular.Module} api.
     */
    routes = angular.module('Application.routes', [
        'ui.router'
    ]);

    /**
     * Define routes for the application
     *
     * @param {$stateProvider} $stateProvider
     * @param {$urlRouterProvider} $urlRouterProvider
     */
    routes.config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // Use the HTML5 History API
            // Enable routes rewrite
              $stateProvider.state('details', {
                templateUrl: 'app/ui/views/details.html'
              });

            $locationProvider.html5Mode(true);

            // if state is not registered in app redirect to
            $urlRouterProvider.otherwise("/app");


            var i;

            for (var i in routesList) {
                $stateProvider.state(routesList[i].name, formRoute(routesList[i]));
            }

            function formRoute(routesListItem) {
                var route, i;
                route = {
                    url: routesListItem.url,
                    permissions: routesListItem.permissions ? routesListItem.permissions : [],
                };

                if (routesListItem.views) {
                    route.views = routesListItem.views;
                }

                if (routesListItem.controller) {
                    route.controller = routesListItem.controller;
                }

                if (routesListItem.templateUrl) {
                    route.templateUrl = routesListItem.templateUrl;
                }

                if (routesListItem.resolve) {
                    route.resolve = {};
                    for (i in routesListItem.resolve) {
                        route.resolve[i] = routesListItem.resolve[i];
                    }
                }


//                route.resolve = {
//                    load : ['$q', function($q) {
//                        var i, dependencies;
//
//                        dependencies = [];
//                        for (i in routesListItem.views) {
//                            if ('string' === typeof routesListItem.views[i].controller) {
//                                dependencies.push(routesListItem.views[i].controller);
//                            }
//                        }
//                        if ('string' === typeof routesListItem.controller) {
//                            dependencies.push(routesListItem.controller);
//                        }
//
//                        if (0 === dependencies.length) {
//                            return true;
//                        }
//
//                        var deferred, dependencies;
//
//                        deferred = $q.defer();
//                        require(dependencies, function() {
//                            deferred.resolve(true);
//                        }, function() {
//                            deferred.reject(arguments);
//                        });
//                        return deferred.promise;
//                    }]
//                };

                return route;
            }

        }
    ]);



    // This call IS REQUIRED
    // If not be use error will occur::
    //    initial state will not be defined
    //
    // the angular "$locationChangeSuccess" is broadcast, the listener in ui-router is not
    // initialized yet. I'm finding the difference is that we have a separate (reusable) login app that is
    // bootstrapped initially, which then upon successful login, bootstraps the actual app. At the time
    // the actual app is bootstrapped, the $locationChangeSuccess has already been broadcast and
    // the ui-router listener isn't initialized yet to catch it.
    //
    // Putting the broadcast into the app's main directive's link function (where the ui-view is)
    // works, but not sure this is a good approach.
    routes.run(['$state', function ($state) {}]);

    return routes;

});