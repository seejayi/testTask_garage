/**
 * Footer line
 *
 * @require presentation/shipper/modules/appshipper
 */
define(function (require) {
    'use strict';

    // Required APPLICATION PART
    var Application = require('presentation/shipper/modules/appshipper');
    // Required SERVICES
    require('presentation/common/services/storages/InboxCounterStorage');
    require('presentation/common/services/InboxAppService');
    // Required CONTROLLERS
    // Required DIRECTIVES
    // Required FILTERS

    Application.controller('_Partials/AsidePartialsCtrl', [
        '$scope', '$state', '$timeout', 'gettext', 'InboxCounterStorage', 'InboxAppService',
        function ($scope, $state, $timeout, gettext, InboxCounterStorage, InboxAppService) {

////////////////////////////// INITIATE DATA

            $scope.$state = $state;

            $scope.mainMenu = {
                items: [
                    {
                        label: 'DASHBOARD',
                        isAllowed: true,
                        icon: 'icon dashboard',
                        state: ['home'],
                        title: gettext('Dashboard')
                    },
                    {
                        label: 'ADD',
                        isAllowed: true,
                        icon: 'icon quote',
                        state: ['deliveryAdd'],
                        title: gettext('Get Quotes')
                    },
                    {
                        label: 'DELIVERIES',
                        isAllowed: true,
                        icon: 'icon search',
                        state: ['deliveriesMy'],
                        title: gettext('My deliveries')
                    },
                    {
                        label: 'INBOX',
                        isAllowed: true,
                        icon: 'icon inbox',
                        state: ['inbox'],
                        counter: InboxCounterStorage.data,
                        title: gettext('Inbox')
                    },
                    {
                        label: 'SUPPORT',
                        isAllowed: true,
                        icon: 'icon support',
                        href: 'https://support.foxrey.com',
                        title: gettext('Support')
                    }
                ]
            };

            InboxCounterStorage.getUnreadInboxCountAsync();

////////////////////////////// MAIN DATA PROCESSING

            $scope.changeState = function (menuItem, params)
            {
                var i;
                for (i in $scope.mainMenu.items) {
                    $scope.mainMenu.items[i].active = false;
                }
                menuItem.active = true;
                $state.go(menuItem.state[0]);
            };

            $scope.closeSideBarForMobile = function () {
                if (window.innerWidth < 481) {
                    $timeout(function() {
                        angular.element('#menu-toggle').trigger('click');
                    }, 100);
                }
                return;
            };

////////////////////////////// SUBSCRIBE TO EVENTS

            InboxAppService.addListener(function (event, data) {
                console.log(event, data);
                InboxCounterStorage.getUnreadInboxCountAsync();
            }, 'chatMessage');

////////////////////////////// DEFINE VISIBILITY FUNCTIONALITY

////////////////////////////// DEFINE DATA PROCESSING FUNCTIONALITY

////////////////////////////// PRIVATE FUNCTIONS

            function _getUnreadInboxCount()
            {
                InboxAppService.getUnreadInboxCountAsync()
                    .then(function(response) {
                        var i, index, counter;
                        index = 0;
                        for (i in $scope.mainMenu.items) {
                            if ('INBOX' === $scope.mainMenu.items[i].label) {
                                index = i;
                                break;
                            }
                        }
                        counter = 0;
                        for (i in  response) {
                            counter += response[i].unreadCount;
                        }
                        $timeout(function() {
                            $scope.mainMenu.items[index].count = counter;
                        });
                    });
            }

////////////////////////////// END

        }
    ]);
});