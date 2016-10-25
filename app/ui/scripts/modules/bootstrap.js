/**
 * Project START point
 *
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 *
 * @requires angular
 * @requires appmodule
 * @requires presentation/routes
 *
 * @param {require} require
 * @return {undefined}
 */
define(function (require) {
    'use strict';

    /**
     * Initialize all dependencies
     */
    // Libs
    require('functions');
    require('requirejs-domready');

    // Variables
    var angular = require('angular');

    // Application
    require('presentation/modules/app');

    /**
     * Initialize angular bootstrap
     *
     * place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */
    require(['requirejs-domready!'], function (document) {
        /* everything is loaded...go! */
        angular.bootstrap(document, ['Application']);
//        angular.resumeBootstrap();
    });
});
