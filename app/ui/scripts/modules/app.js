/**
 * Application defenition
 *
 * @requires angular
 * @requires presentation/routes
 *
 * @param {require} require
 * @return {undefined}
 */
define(function (require) {
    'use strict';

    /**
     * Initialize all required dependincies
     */
    // Variables
    var application,
        angular = require('angular'),
        Config = require('config/Config'),
        ILocaleRepository = require('ILocaleRepository');

    // Module that will be used in the application
    require('presentation/common/modules/appcommon');
    require('presentation/landing/modules/applanding');
    require('presentation/landing/modules/routes');
    // dependensies
    require('presentation/common/services/UserAppService');

    /**
     * Initialize application
     *
     * @return {module} new module with the {@link angular.Module} api.
     */
    application = angular.module('ApplicationLanding', [
        'ApplicationLanding.loader',
        'ApplicationLanding.routes',
        'ApplicationCommon'
    ]);

    application.run([
        '$rootScope', 'gettextCatalog', 'UserAppService', function ($rootScope, gettextCatalog, UserAppService) {
            var locale;

            $rootScope._MODE_ = 'landing';

            $rootScope.$ACL = {};
            if (!UserAppService.isLoggedIn('tp')) {
                $rootScope.$ACL.tp = true;
            } else if (!UserAppService.isLoggedIn('tp')) {
                $rootScope.$ACL.sh = true;
            } else {
                $rootScope.$ACL.anonymus = true;
            }
            $rootScope.$ACL.anonymusmode = true;

            locale = Config.defaultLocale;
            ILocaleRepository.setLocale(locale);
            gettextCatalog.setCurrentLanguage(locale);
        }
    ]);

    return application;
});