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
    // var VatAppService = require('appservices/VatAppService');
    // Required SERVICES
    // require('presentation/shipper/services/DeliveryAppService');
    // Required CONTROLLERS
    // require('presentation/shipper/controllers/Deliveries/AddRootCtrl');
    // require('presentation/shipper/controllers/Deliveries/ListRootCtrl');
    // require('presentation/shipper/controllers/Inbox/ListRootCtrl');
    var routes = [
        ////////////////////////////////
        // NOT AUTHORISED USER
        ////////////////////////////////
        {
            'name': 'home',
            'url': '/app',
            'title': 'Test',
            'templateUrl': '/app/ui/views/overview.html'
        },
        {
            'name': 'details',
            'url': '/app/details',
            'title': 'Details',
            'templateUrl': '/app/ui/views/overview.html'
        }
        // {
        //     'name': 'deliveryAdd',
        //     'url': '/app/sh/get-quotes',
        //     'title': 'Get Quotes',
        //     'controller': 'Deliveries/AddRootCtrl',
        //     'templateUrl': '/app/ui/views/Shipper/Deliveries/AddRootView.html',
        //     'resolve': {
        //         'DeliveryItemResolver': function () {
        //             return null;
        //         }
        //     }
        // },
        // {
        //     'name': 'deliveryEdit',
        //     'url': '/app/sh/delivery/{deliveryId}',
        //     'title': 'Edit Delivery',
        //     'controller': 'Deliveries/AddRootCtrl',
        //     'templateUrl': '/app/ui/views/Shipper/Deliveries/AddRootView.html',
        //     'resolve': {
        //         'DeliveryItemResolver': [
        //             '$stateParams', 'DeliveryAppService',
        //             function ($stateParams, DeliveryAppService) {
        //                 return DeliveryAppService.getDeliveryForEditByIdAsync($stateParams.deliveryId)
        //                     .then(function (response) {
        //                         return response;
        //                     });
        //             }
        //         ],
        //     }
        // },
        // {
        //     'name': 'deliveriesMy',
        //     'url': '/app/sh/deliveries',
        //     'title': 'My Deliveries',
        //     'controller': 'Deliveries/ListRootCtrl',
        //     'resolve': {
        //         vatValuesResolver: function () {
        //             return VatAppService.getVatValuesAsync();
        //         }
        //     },
        //     'templateUrl': '/app/ui/views/Shipper/Deliveries/ListRootView.html'
        // },
        // {
        //     'name': 'inbox',
        //     'url': '/app/sh/inbox?chatId',
        //     'title': 'Inbox',
        //     'controller': 'Inbox/ListRootCtrl',
        //     'templateUrl': '/app/ui/views/Common/Inbox/ListRootView.html'
        // }
    ];
    return routes;
});
