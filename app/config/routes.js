/**
 * Definition for Routes. Contains application external routes
 *
 * @returns {object}
 */
define(function () {
    'use strict';

    var _routes;
    _routes = {
        // ----- API URLs -----
        //////////////////////////////////////////////////////////////////////////////
        // File
        //////////////////////////////////////////////////////////////////////////////
        'File__upload': ['POST_AS_FORM', '{apiUrl}/api/s3/upload'],
        'User__zipCheck': ['POST', '{apiUrl}/api/zipCheck'],
        'Public__getCompanyDetailsByCin': ['POST', '{apiUrl}/api/checkCIN', ['companyCIN']],
        //////////////////////////////////////////////////////////////////////////////
        // Auth
        //////////////////////////////////////////////////////////////////////////////
        'User__login': ['POST', '{apiUrl}/api/login'],
        'User__logout': ['POST', '{apiUrl}/api/login'],
        'User__signUp': ['POST', '{apiUrl}/api/signup'],
        'User__refreshToken': ['POST', '{apiUrl}/api/refreshToken'],
        'User__resendLoginLink': ['POST', '{apiUrl}/api/activation/resendActivationLink', ['email']],
        'User__resendPasswordRecovery': ['POST', '{apiUrl}/api/user/me/password/recovery', ['password']],
        'User__passwordRestore': ['PUT', '{apiUrl}/api/user/me/password/restore', ['password', 'passwordConfirmation', 'recoveryHash']],
        //////////////////////////////////////////////////////////////////////////////
        // User Socials
        //////////////////////////////////////////////////////////////////////////////
        'UserSocials__facebookLogin': ['POST', '{apiUrl}/api/login'],
        'UserSocials__facebookSignUp': ['POST', '{apiUrl}/api/signup'],
        'UserSocials__googleLogin': ['POST', '{apiUrl}/api/login'],
        'UserSocials__googleSignUp': ['POST', '{apiUrl}/api/signup'],
        //////////////////////////////////////////////////////////////////////////////
        // User
        //////////////////////////////////////////////////////////////////////////////
        'User__getMyProfile': ['GET', '{apiUrl}/api/user/me'],
        'User__updateMyProfile': ['POST', '{apiUrl}/api/user/me/changeBasicInfo'],
        'User__updateMyLocale': ['POST', '{apiUrl}/api/user/me/changeLocale'],
        'User__updateMyPassword': ['POST', '{apiUrl}/api/user/me/changePassword'],
        'User__updateMySettings': ['GET', '{apiUrl}/api/user/me'],
        //////////////////////////////////////////////////////////////////////////////
        // User Company
        //////////////////////////////////////////////////////////////////////////////
        'UserCompany__inviteUser': ['POST', '{apiUrl}/api/company/invite', ['email', 'role']],
        'UserCompany__getCompaniesList': ['GET', '{apiUrl}/api/user/me/companies', ['limit', 'offset']],
        'UserCompany__setActiveCompany': ['PUT', '{apiUrl}/api/user/me/setActiveCompany', ['activeCompany']],
        'UserCompany__updateActiveCompany': ['POST', '{apiUrl}/api/company/{id}', []],
        'UserCompany__getActiveCompany': ['GET', '{apiUrl}/api/company'],
        'UserCompany__getActiveCompaniesUsersFullList': ['GET', '{apiUrl}/api/company/users', ['limit', 'offset']],
        //////////////////////////////////////////////////////////////////////////////
        // Payment
        //////////////////////////////////////////////////////////////////////////////
        'Payment__getCardsList': ['GET', '{apiUrl}/api/company/card'],
        'Payment__getDefaultCard': ['GET', '{apiUrl}/api/company/card/default'],
        'Payment__addCard': ['POST', '{apiUrl}/api/company/card', ['token']],
        'Payment__changeDefaultCard': ['PUT', '{apiUrl}/api/company/card/default', ['cardId']],
        'Payment__deleteCard': ['DELETE', '{apiUrl}/api/company/card'],
        //////////////////////////////////////////////////////////////////////////////
        // Notifications
        //////////////////////////////////////////////////////////////////////////////
        'Notifications__getMyList': ['GET', '{apiUrl}/api/user/me/notifications', [
                'isRead', //	1 - only shown previously, 0 - only new
                'leaveUnread',
                'limit',
                'offset'
            ]
        ],
        //EXAMPLES
        //All notifications will be marked as read:
        ///api/user/me/notifications
        ///api/user/me/notifications?leaveUnread=0
        ///api/user/me/notifications?leaveUnread=false
        //
        //Read/unread status of notifications is not changed:
        ///api/user/me/notifications?leaveUnread
        ///api/user/me/notifications?leaveUnread=1
        ///api/user/me/notifications?leaveUnread=true
        ///api/user/me/notifications?leaveUnread=TRUE
        //*) /api/user/me/notifications?isRead=1
        //*) /api/user/me/notifications?leaveUnread=true&isRead=1
        //
        //All new notifications without marking them as read
        ///api/user/me/notifications?isRead=0&leaveUnread

        //////////////////////////////////////////////////////////////////////////////
        // Category
        //////////////////////////////////////////////////////////////////////////////
        'Category__getCategoriesList': ['GET', '{apiUrl}/api/category'],
        'Category__getSubcategoriesByCategoryIdList': ['GET', '{apiUrl}/api/subcategory/{categoryId}'],
        'Category__getCategoryFieldsById': ['GET', '{apiUrl}/api/category/fieldsById/{id}'],
        'Category__getSubcategoryFieldsById': ['GET', '{apiUrl}/api/subcategory/fieldsById/{id}'],
        //////////////////////////////////////////////////////////////////////////////
        // Delivery
        //////////////////////////////////////////////////////////////////////////////
        // ---------- Public ----------
        'Delivery__getPublicList': ['GET', '{apiUrl}/public-api/delivery/search',
            ['limit', 'offset', 'categories', 'pickUpDate', 'deliveryDate', 'deliveryCity', 'pickUpCity']
        ],
        // ---------- Transport Provider ----------
        'Delivery__getSearchListAsProvider': ['GET', '{apiUrl}/api/delivery/search',
            ['limit', 'offset', 'categories', 'pickUpDate', 'deliveryDate', 'deliveryCity', 'pickUpCity']
        ],
        'Delivery__getDeliveryById': ['GET', '{apiUrl}/api/delivery/{deliveryId}'],
        'Delivery__getMyQuotesListAsProvider': ['GET', '{apiUrl}/api/delivery/quotes',
            ['limit', 'offset', 'status', 'assignedToMe']
                // status = (string) ['Pending', 'Successful', 'UnSuccessful', 'QuoteExpired', 'RequestExpired', 'RequestCanceled']
                // assignedToMe = (bolean) true
        ],
        'Delivery__getMyAcceptedQuotesListAsProvider': ['GET', '{apiUrl}/api/delivery/accepted', [
                'limit', 'offset',
                'status', // status = (string) ['Active', 'Booked', 'Dispatched', 'PickedUp', 'Delivered', 'RequestCanceled', 'RequestExpired']
                'assignedToMe'// assignedToMe = (bolean) true
            ]],
        'Delivery__getWatchlistListAsProvider': ['GET', '{apiUrl}/api/delivery/watched',
            ['limit', 'offset']
        ],
        'Delivery__toggleWatchlistAsProvider': ['POST', '{apiUrl}/api/delivery/{deliveryId}/watch', [
                'isFavorite' // current status
            ]],
        'Delivery__toggleStatusAsProvider': ['POST', '{apiUrl}/api/delivery/changeStatus/{deliveryId}', [
                'status',
                'confirmationCode', // required when status == Delivered
                'stripeToken' // required when status == Booked and there is no
            ]
        ],
        'Delivery__toggleAcceptBooked': ['POST', '{apiUrl}/api/delivery/confirmAcceptance/{deliveryId}', [
            ]
        ],
        // ---------- Shipper ----------
        'Delivery__add': ['POST', '{apiUrl}/api/delivery/'],
        'Delivery__editDelivery': ['PUT', '{apiUrl}/api/delivery/'],
        'Delivery__getListAsShipper': ['GET', '{apiUrl}/api/delivery/myDeliveries',
            ['limit', 'offset']
        ],
        'Delivery__getVatValues': ['GET', '{apiUrl}/api/vat/getValues'],
        // Both
        'Delivery__cancel': ['POST', '{apiUrl}/api/delivery/cancel/{deliveryId}'],
        //////////////////////////////////////////////////////////////////////////////
        // Quote
        //////////////////////////////////////////////////////////////////////////////
        'Quote__getQuoteByDeliveryAsProvider': ['GET', '{apiUrl}/api/quote/byDelivery/{deliveryId}', []],
        'Quote__updateQuote': ['PUT', '{apiUrl}/api/quote', [
                // required:
                'id', // integer     Id
                'deliveryId', // integer     Id of target delivery
                'startQuote', // integer     quote amount
                'pickUpDate', // DateTime     Date is the string in format ISO-8601
                'deliveryDate', // DateTime     Date is the string in format ISO-8601
                // optional:
                'driverId', // integer     Primary id of user which is assigned to this quote
                'autoBid', // integer     Minimum quote amount
                'comment', // string
                'expiredAt', // DateTime     Date is the string in format ISO-8601
                'latestPickupDate', // DateTime     Date is the string in format ISO-8601
                'latestDeliveryDate', // DateTime     Date is the string in format ISO-8601
            ]],
        'Quote__addQuote': ['POST', '{apiUrl}/api/quote', [
                // required:
                'deliveryId', // integer     Id of target delivery
                'startQuote', // integer     quote amount
                'pickUpDate', // DateTime     Date is the string in format ISO-8601
                'deliveryDate', // DateTime     Date is the string in format ISO-8601
                // optional:
                'driverId', // integer     Primary id of user which is assigned to this quote
                'autoBid', // integer     Minimum quote amount
                'comment', // string
                'expiredAt', // DateTime     Date is the string in format ISO-8601
                'latestPickupDate', // DateTime     Date is the string in format ISO-8601
                'latestDeliveryDate', // DateTime     Date is the string in format ISO-8601
            ]
        ],
        //////////////////////////////////////////////////////////////////////////////
        // Feedback
        //////////////////////////////////////////////////////////////////////////////
        'Feedback__add': ['POST', '{apiUrl}/api/feedback', [
                'quoteId', 'comment', 'stars'
            ]
        ],
        //////////////////////////////////////////////////////////////////////////////
        // Quote Status
        //////////////////////////////////////////////////////////////////////////////
        'QuoteStatus__accept': ['POST', '{apiUrl}/api/quote/accept', [
                'quoteId'
            ]
        ],
        //////////////////////////////////////////////////////////////////////////////
        // Inbox
        //////////////////////////////////////////////////////////////////////////////
        'Inbox__getChatbyId': ['GET', '{apiUrl}/api/chat/{chatId}', []],
        'Inbox__getChatsList': ['GET', '{apiUrl}/api/chat/list', [
                'deliveryId',
                'recipientId'
            ]
        ],
        'Inbox__getChatHistory': ['GET', '{apiUrl}/api/chat/{chatId}/history', [
                'limit',
                'offset',
                'reverse'
            ]
        ],
        'Inbox__getUnreadCounters': ['GET', '{apiUrl}/api/chat/unreadCounters'],
        //////////////////////////////////////////////////////////////////////////////
        // Location
        //////////////////////////////////////////////////////////////////////////////
        'Location__getCountriesList': ['POST', '{apiUrl}/api/country/list'],
        'Location__getLocationsList': ['POST', '{apiUrl}/api/locations/list'],
        //////////////////////////////////////////////////////////////////////////////
        // Contacts
        //////////////////////////////////////////////////////////////////////////////
        'Contacts__contactUs': ['POST', '{apiUrl}/contacts/contact-us'],
        //////////////////////////////////////////////////////////////////////////////
        // External Urls
        //////////////////////////////////////////////////////////////////////////////
    };

    return _routes;
});
