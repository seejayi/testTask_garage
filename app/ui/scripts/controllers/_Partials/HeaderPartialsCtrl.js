/**
 * Header line
 *
 * @require presentation/shipper/modules/appshipper
 */
define(function (require) {
    'use strict';

    // Required APPLICATION PART
    var Application = require('presentation/shipper/modules/appshipper');
    // Required SERVICES
    require('presentation/common/services/storages/UserProfileStorage');
    require('presentation/common/services/storages/UserCompanyStorage');
    require('presentation/common/services/UserAppService');
    // Required CONTROLLERS
    require('presentation/shipper/controllers/Profile/ProfilePartialsCtrl');
    require('presentation/shipper/controllers/Profile/PaymentsPartialsCtrl');
    require('presentation/shipper/controllers/Profile/SettingsPartialsCtrl');
    require('presentation/shipper/controllers/Profile/CompanyPartialsCtrl');
    require('presentation/shipper/controllers/_Partials/NotificationPartialsCtrl');
    // Required DIRECTIVES
    require('presentation/common/directives/Dom/ToggledDrctv');
    // Required FILTERS
    // Required FILTERS
    require('presentation/common/filters/User/FullNameFltr');

    Application.controller('_Partials/HeaderPartialsCtrl', [
        '$state', '$scope', '$timeout', 'gettext', '$uibModal',
        'UserProfileStorage', 'UserCompanyStorage',
        'UserAppService', 'VatAppService',
        function ($state, $scope, $timeout, gettext, $uibModal,
            UserProfileStorage, UserCompanyStorage,
            UserAppService, VatAppService) {

////////////////////////////// INITIATE DATA

            var _settingsTabs, targetData;

            targetData = UserAppService.getLoginTarget(['profile', 'delivery', 'inbox']);

            $scope.currentProfile = UserProfileStorage.profileData;

            _settingsTabs = {
                items: [
                    {label: 'PROFILE', title: gettext('My Profile'),
                        isAllowed: true,
                        selectedSubItemName: 'selectedProfileItem',
                        selectedSubItemType: 'tab',
                        class: 'profile-tab'},
                    {label: 'COMPANY_SHIPPER', title: gettext('Company Profile'),
                        isAllowed: false,
                        selectedSubItemName: 'selectedCompanyItem',
                        selectedSubItemType: 'accordion',
                        class: 'company-tab'},
                    {label: 'PAYMENTS', title: gettext('Payments'),
                        isAllowed: false,
                        class: 'payment-tab'},
                    {label: 'SETTINGS', title: gettext('Settings'),
                        isAllowed: true,
                        selectedSubItemName: 'selectedSettingsItem',
                        selectedSubItemType: 'tab',
                        class: 'settings-tab'}
                ],
                activeCount: 3
            };
            $scope.settingsMenu = {
                items: [
                    {
                        label: 'PROFILE',
                        isAllowed: true,
                        subLabel: 0,
                        icon: 'icon user',
                        title: gettext('My Profile')
                    },
                    {
                        label: 'COMPANY_SHIPPER',
                        isAllowed: false,
                        subLabel: 'isBasicInformationOpened',
                        icon: 'icon company',
                        title: gettext('Company Profile')
                    },
                    {
                        label: 'PAYMENTS',
                        isAllowed: false,
                        icon: 'icon billing',
                        title: gettext('Payments')
                    },
                    {
                        label: 'SETTINGS',
                        isAllowed: true,
                        icon: 'icon setting',
                        title: gettext('Settings')
                    }
                ]
            };

            UserProfileStorage.getMyProfileAsync()
                .then(function (userData) {
                    $timeout(function () {
                        _buildMenu(userData);
                    });
                });

            if (targetData) {
                switch (targetData.target) {
                    case 'profile':
                        $timeout(function () {
                            _modal({label: 'PROFILE'});
                        });

                        break;
                    case 'delivery':
                        // Show delivery
                        _showDeliveryModal(targetData.id);

                        break;
                    case 'inbox':
                        $state.go('inbox', {chatId: targetData.id});

                        break;
                    default:
                        break;
                }
            }

////////////////////////////// MAIN DATA PROCESSING

            $scope.logout = function () {
                UserProfileStorage.logout();
            };

            $scope.openModal = function (menuItem) {
                _modal(menuItem);
            };

////////////////////////////// SUBSCRIBE TO EVENTS

////////////////////////////// DEFINE VISIBILITY FUNCTIONALITY

////////////////////////////// DEFINE DATA PROCESSING FUNCTIONALITY

////////////////////////////// PRIVATE FUNCTIONS

            function _buildMenu(userData)
            {
                var i, isCompanyAllowed, isAllowedPayments, activeCount;
                isCompanyAllowed = (userData.activePosition && 'Owner' === userData.activePosition.role && false === userData.activePosition.isIndividual)
                    ? true
                    : false;
                isAllowedPayments = (userData.activePosition && 'Owner' === userData.activePosition.role)
                    ? true
                    : false;
                activeCount = 0;
                for (i in _settingsTabs.items) {
                    switch (_settingsTabs.items[i].label) {
                        case 'COMPANY_SHIPPER':
                            _settingsTabs.items[i].isAllowed = isCompanyAllowed;
                            activeCount += isCompanyAllowed ? 1 : 0;
                            break;
                        case 'PAYMENTS':
                            _settingsTabs.items[i].isAllowed = isAllowedPayments;
                            activeCount += isAllowedPayments ? 1 : 0;
                            break;
                        default:
                            activeCount++;
                            break;
                    }
                }
                _settingsTabs.activeCount = activeCount;

                activeCount = 0;
                for (i in $scope.settingsMenu.items) {
                    switch ($scope.settingsMenu.items[i].label) {
                        case 'COMPANY_SHIPPER':
                            $scope.settingsMenu.items[i].isAllowed = isCompanyAllowed;
                            activeCount += isCompanyAllowed ? 1 : 0;
                            break;
                        case 'PAYMENTS':
                            $scope.settingsMenu.items[i].isAllowed = isAllowedPayments;
                            activeCount += isAllowedPayments ? 1 : 0;
                            break;
                        default:
                            activeCount++;
                            break;
                    }
                }
                $scope.settingsMenu.activeCount = activeCount;
            }

            function _modal(menuItem)
            {
                var i, iLength, index = 0, subName, subIndex;
                iLength = (_settingsTabs.items).length;
                for (i = 0; i < iLength; i++) {
                    if (menuItem.label === _settingsTabs.items[i].label) {
                        index = i;
                        break;
                    }
                }
                if (_settingsTabs.items[index] && _settingsTabs.items[index].selectedSubItemName
                    && ('undefined' !== typeof menuItem.subLabel)) {
                    switch (_settingsTabs.items[index].selectedSubItemType) {
                        case 'tab':
                            subName = _settingsTabs.items[index].selectedSubItemName;
                            subIndex = menuItem.subLabel;
                            break;
                        case 'accordion':
                            subName = _settingsTabs.items[index].selectedSubItemName;
                            subIndex = {};
                            subIndex[menuItem.subLabel] = true;
                            break;
                    }
                }
                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/app/ui/views/Common/Settings/SettingsModalView.html',
                    controller: ['$scope',
                        function ($scope) {
                            $scope.settingsTabs = _settingsTabs;
                            $scope.selectedIndex = index;
                        }
                    ],
                    windowClass: 'bottombtn-modal',
                    resolve: {
                        items: function () {
                            return [];
                        }
                    }
                });

            }

            function _showDeliveryModal(deliveryId) {
                var modalInstance;

                modalInstance = $uibModal.open({
                    size: 'md',
                    templateUrl: '/app/ui/views/Common/Deliveries/partials/ItemDetailedPartialModalView.html',
                    windowClass: 'modal-success',
                    'resolve': {
                        vatValuesResolver: function () {
                            return VatAppService.getVatValuesAsync();
                        }
                    },
                    controller: ['$scope', '$timeout', '$uibModalInstance', 'vatValuesResolver',
                        function ($scope, $timeout, $uibModalInstance, vatValuesResolver) {
                            $scope.selectedObj = {id: 0};
                            $scope.vatValues = vatValuesResolver;
                            $timeout(function () {
                                $scope.selectedObj = {
                                    id: deliveryId
                                };
                            });
                            $scope.cancel = function ()
                            {
                                $uibModalInstance.dismiss(null);
                            };

                            $scope.toggleSelection = function () {
                                $scope.selectedObj = null;
                                $uibModalInstance.dismiss(null);
                            };
                        }
                    ]
                });
            }

////////////////////////////// END
        }
    ]);
});
