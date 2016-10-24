/**
 * Application module for animation
 *
 * @requires angular
 *
 * @param {require} require
 * @return {module} new module with the {@link angular.Module} api.
 */
define(function (require) {
    'use strict';

    /**
     * Initialize all dependencies
     */
    var angular = require('angular'),
        ui;

    // Module that will be used in the application
    require('angular-bootstrap');
    require('bootstrap-select');
    require('angular-animate');

    /**
     * Initiate module for animation
     *
     * @return {module} new module with the {@link angular.Module} api.
     */
    ui = angular.module('Application.ui', [
        'ui.bootstrap', 'ngAnimate'
    ]);
    return ui;
});
