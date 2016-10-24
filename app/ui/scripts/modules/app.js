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
        Config = require('config/Config');

    // Module that will be used in the application
    require('presentation/app');
    require('presentation/routes');
    require('presentation/ui');
    // dependensies
   

    /**
     * Initialize application
     *
     * @return {module} new module with the {@link angular.Module} api.
     */
    application = angular.module('Application', [
        'Application.ui',
        'Application.loader',
        'Application.routes'
    ]);

        // Add white list
    // application.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
    //         var i, appWhiteList;

    //         appWhiteList = [];
    //         appWhiteList.push('self');
    //         for (i in Config.whiteList) {
    //             appWhiteList.push(Config.whiteList[i] + '/**');
    //         }

    //         $sceDelegateProvider.resourceUrlWhitelist(appWhiteList);

    // }]);

    application.run([
        '$rootScope', function ($rootScope) {
            // var locale;

            $rootScope._MODE_ = 'application';

            // $rootScope.$ACL = {};
            // if (!UserAppService.isLoggedIn('tp')) {
            //     $rootScope.$ACL.tp = true;
            // } else if (!UserAppService.isLoggedIn('tp')) {
            //     $rootScope.$ACL.sh = true;
            // } else {
            //     $rootScope.$ACL.anonymus = true;
            // }
            // $rootScope.$ACL.anonymusmode = true;

            // locale = Config.defaultLocale;
            // ILocaleRepository.setLocale(locale);
            // gettextCatalog.setCurrentLanguage(locale);
        }
    ]);

    return application;
});