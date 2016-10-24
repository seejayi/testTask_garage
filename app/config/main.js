"use strict";

require.config({
    baseUrl: './app/',
    paths: {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PATHS FOR SOURCE FILES DEFINITION
        'appservices': 'core/services',
        'library': 'core/lib',
        'presentation': 'ui/scripts',
        'infrastructurelib': 'core/infrastructure',
        'functions': './core/lib/functions',
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // CORE DEFINITIONS FOR INTERFACES
        // --- Promises
        'IPromiseAdapter': 'core/infrastructure/promise/adapters/AngularPromiseAdapter',
        'IImagePromiseAdapter': 'core/infrastructure/promise/adapters/AngularImagePromiseAdapter',
        // --- Requests
        'IHttpAdapter': 'core/infrastructure/request/adapters/AngularHttpAdapter',
        'IRequestService': 'core/infrastructure/request/GenericRequestServiceAsync',
        'IServiceUrlResolver': 'core/infrastructure/request/ServiceUrlResolver',
        // --- Storages
        'ICacheStorage': 'core/infrastructure/storages/CacheStorage',
        'ILocalStorage': 'core/infrastructure/storages/LocalStorage',
        'ISessionStorage': 'core/infrastructure/storages/SessionStorage',
        'ICookieStorage': 'core/infrastructure/storages/CookieStorage',
        'ILocaleRepository': 'core/infrastructure/repositories/custom/LocaleRepository',
        'IUserIdentifierRepository': 'core/infrastructure/repositories/custom/UserIdentifierRepository',
        'IRoleRepository': 'core/infrastructure/repositories/custom/RoleRepository',
        'IVersionRepository': 'core/infrastructure/repositories/custom/VersionRepository',
        'ILastVisitedRepository': 'core/infrastructure/repositories/custom/LastVisitedRepository',
        'ICategoryFieldRepository': 'core/infrastructure/repositories/custom/CategoryFieldRepository',
        'ISubcategoryFieldRepository': 'core/infrastructure/repositories/custom/SubcategoryFieldRepository',
        // --- Socials
        'IFacebook': 'core/infrastructure/socials/Facebook',
        'IGoogleAuth': 'core/infrastructure/socials/GoogleAuth',
        'ISocket': 'core/infrastructure/messages/SocketIo',
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // APPLICATION LEVEL DEFINITIONS
        // ---- Angular : Core libraries
        'angular': './vendor/angular/angular',
        'angular-ui-router': './vendor/angular-ui-router/release/angular-ui-router.min',
        'angular-bootstrap': './vendor/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-bootstrap-select': './vendor/angular-ui-select/dist/select.min',
        'angular-touch': './vendor/angular-touch/angular-touch.min',
        'angular-animate': './vendor/angular-animate/angular-animate.min',
        'angular-simple-logger': './vendor/angular-simple-logger/dist/angular-simple-logger.min',
        'angular-google-plus': './vendor/angular-google-plus/dist/angular-google-plus.min',
        // ---- Angular : translations
        'angular-gettext': './vendor/angular-gettext/dist/angular-gettext.min',
        'translate': './ui/scripts/common/modules/extra/translations',
        // ---- Angular : templates
        'templatesmodule': './ui/scripts/common/modules/templates',
        'templates': './ui/scripts/common/modules/extra/templates',
        // ---- Require Js
        'requirejs-domready': './vendor/requirejs-domready/domReady',
        'requirejs-text': './vendor/requirejs-text/text',
        'async': './vendor/requirejs-plugins/src/async',
        // UI
        'bootstrap-select': './vendor/bootstrap-select/dist/js/bootstrap-select',
        // ---- Global libraties : Jquery
        'jquery': './vendor/jquery/dist/jquery.min',
        // --- Facebook
        'facebook': '//connect.facebook.com/en_US/sdk.js'
    },
    deps: [
        'jquery',
        'functions',
        './core/infrastructure/request/InitFilters',
        './core/infrastructure/repositories/InitRepositories'
    ],
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'bootstrap-select': {
            deps: ['jquery']
        },
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular']
        },
        'angular-touch': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-simple-logger': {
            deps: ['angular']
        },
        'angular-google-plus': {
            deps: ['angular']
        },
        'angular-gettext': {
            deps: ['angular']
        },
        'translate': {
            deps: ['angular', 'angular-gettext']
        },
        'templatesmodule': {
            deps: ['angular']
        },
        'templates': {
            deps: ['angular', 'templatesmodule']
        }
    }
});

//define(function(require) {
//    require('presentation/tp/bootstrap');
//});

switch (localStorage.getItem('mode')) {
    case 'tp':
        require(['presentation/tp/bootstrap'], function() {});
        break;
    case 'shipper':
        require(['presentation/shipper/bootstrap'], function() {});
        break;
    default:
        require(['presentation/landing/bootstrap'], function() {});
        break;
}

//require(['loadfixtures'], function() {});
//window.onerror = function(message, source, lineno) {
//    return true;
//};
