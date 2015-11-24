mindFrameApp.constant('PATHS', {
    RES_ACCOUNT_CONTENT_PROVIDER:":account/mindframe/accountContent/:id",
    RES_ACCOUNT_CONTENT_PROVIDER_ACTION:":account/mindframe/accountContent/:contentId/action/:id",
    RES_BILLING_INFO:":account/billingInfo/:id",
    RES_CATEGORY:"category",
    RES_CREDIT_CARD_TYPES:":account/billingInfo/creditCardTypes",
    RES_CONTENT_PROVIDER:":account/mindframe/content/:id",
    RES_PERSON:":account/mindframe/person/:id",
    RES_PLAN:"plan",
    RES_PRODUCT:"product/:id",
    RES_SUPER_USER:"user/:id",
    RES_TAB:":account/mindframe/tab/:id",
    RES_USER:":account/accountUser",

    USER_FORGOT_USER:"user/forgotUsernameAndPassword",
    USER_CHANGE_PASSWORD:"user/changePassword",

    ACCOUNT_ACCEPT_TOS:"/account/acceptTos",
    ACCOUNT_CHECK_FULLNAME:"account/checkFullName",
    ACCOUNT_CALL_MANAGER_CONFIGURATION:"/account/callManagerConfiguration",
    ACCOUNT_ENABLE_ACCOUNT:"/account/enableAccount",
    ACCOUNT_DISABLE_ACCOUNT:"/account/disableAccount",
    ACCOUNT_MY_ACCOUNT:"/account/myAccount",
    ACCOUNT_ACCOUNT_LIST:"account/",
    ACCOUNT_ACCOUNT_INFO:"/account/getAccountInfo",
    ACCOUNT_ACCOUNT_INFO_SAVE:"/account/saveAccountInfo",
    ACCOUNT_ACCOUNT_CONFIG:"/account/getAccountConfig",
    ACCOUNT_ACCOUNT_CONFIG_SAVE:"/account/saveAccountConfig",
    ACCOUNT_ACCOUNT_CONFIG_WEBEX_TEST:"/mindframe/webex/config/testWebExConfig",
    ACCOUNT_SIGNUP:"account/signup",
    ACCOUNT_USER_RESET_PASSWORD:"/accountUser/resetPassword/",
    ACCOUNT_USER_CHECK_USERNAME:"user/checkUsername",
    PERSON_CHECK_PHONES:"/mindframe/person/checkPhone",
    PERSON_CHECK_EMAILS:"/mindframe/person/checkEmail",
    AUTHENTICATION_SOURCE:"/authenticationSource",
    CONTENT:"/mindframe/content",
    CONTENT_ACCOUNT_CONTENT:"/mindframe/accountContent/",
    CONTENT_ACCOUNT_CONTENT_ASSIGN:"/assign",
    CONTENT_ACCOUNT_CONTENT_ENABLED:"/mindframe/accountContent/enabled",
    CONTENT_ALL_TABS:"/mindframe/tab/all",
    CONTENT_ALL_TAGS:"/mindframe/account/allTags",
    CONTENT_CATEGORY_ALL:"category/getAll",
    CONTENT_GROUPS:"/mindframe/groups",
    CONTENT_PUBLISH:"/publish",
    CONTENT_SUBSCRIBE:"/subscribe",
    CONTENT_SEARCH_WITH_STATUS:"/searchContentWithStatus",
    CONTENT_TABS:"/mindframe/tab/",
    CONTENT_UNSUBSCRIBE:"/unsubscribe",
    CREDIT_CARD_TYPES:"/billingInfo/creditCardTypes",

    LICENSE_HOSTING_TYPES:"/license/hostingTypes",
    LICENSE_MINE:"/license/mine",
    LICENSE_UPDATE_LICENSE:"/license/updateLicense",
    LOGOUT:"/logout",
    PERSON_IMPORT_CHECK_PROGRESS:"/mindframe/person/checkImport",
    PERSON_IMPORT_EXPORT_ERRORS:"/mindframe/person/exportErrors?accessToken=",
    PERSON_IMPORT_FROM_CSV:"/mindframe/person/importFromCsv",
    PERSON_IMPORT_FROM_LDAP:"/person/importFromLdap",
    PERSON_ENABLE:"/person/enable",
    PERSON_DISABLE:"/person/disable",
    
    CONTENT_ENABLE:"/accountContent/enable",
    CONTENT_DISABLE:"/accountContent/disable",

    PERSON_SEARCH:"/mindframe/person/search",
    PLAN_AVAILABLE_PLANS:"plan/availablePlans",
    PRODUCTS:"/admin/products"
});

angular.module('services.pathService', []).factory('PathService', [
    '$rootScope',
    'akkadianPlatformApiBaseUrl',
    'PATHS',
    function ($rootScope, akkadianPlatformApiBaseUrl, PATHS) {
        var baseURL = akkadianPlatformApiBaseUrl;
        var baseCurrentAccountURL = function(){
        	return baseURL + $rootScope.currentAccount;
        };

        var baseResourceURL = baseURL.replace(/:([^\/])/, '\\:$1');

        var PathService = {
            getAccountContentProviderResourceUrl:function () {
                return baseResourceURL + PATHS.RES_ACCOUNT_CONTENT_PROVIDER;
            },
            getAccountContentProviderActionResourceUrl:function () {
                return baseResourceURL + PATHS.RES_ACCOUNT_CONTENT_PROVIDER_ACTION;
            },
            getBillingInfoResourceUrl:function () {
                return baseResourceURL + PATHS.RES_BILLING_INFO;
            },
            getCategoryResourceUrl:function () {
                return baseResourceURL + PATHS.RES_CATEGORY;
            },
            getContentProviderResourceUrl:function () {
                return baseResourceURL + PATHS.RES_CONTENT_PROVIDER;
            },
            getCreditCardTypesResourceUrl:function () {
                return baseResourceURL + PATHS.RES_CREDIT_CARD_TYPES;
            },
            getPersonResourceUrl:function () {
                return baseResourceURL + PATHS.RES_PERSON;
            },
            getPlanResourceUrl:function () {
                return baseResourceURL + PATHS.RES_PLAN;
            },
            getProductResourceUrl:function () {
                return baseResourceURL + PATHS.RES_PRODUCT;
            },
            getSuperUserResourceUrl:function () {
                return baseResourceURL + PATHS.RES_SUPER_USER;
            },
            getTabResourceUrl:function () {
                return baseResourceURL + PATHS.RES_TAB;
            },
            getUserResourceUrl:function () {
                return baseResourceURL + PATHS.RES_USER;
            },
            // Actions
            getAccountAcceptTOSUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCEPT_TOS;
            },
            getAccountCheckFullNameUrl:function () {
                return baseURL + PATHS.ACCOUNT_CHECK_FULLNAME;
            },
            getForgotUsernameAndPasswordUrl:function () {
                return baseURL + PATHS.USER_FORGOT_USER;
            },
            getChangePasswordUrl:function () {
                return baseURL + PATHS.USER_CHANGE_PASSWORD;
            },            
            getAccountCallManagerConfigUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_CALL_MANAGER_CONFIGURATION;
            },
            getAccountEnableUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ENABLE_ACCOUNT;
            },
            getAccountDisableUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_DISABLE_ACCOUNT;
            },
            getAccountMineUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_MY_ACCOUNT;
            },
            getAccountListUrl:function () {
                return baseURL + PATHS.ACCOUNT_ACCOUNT_LIST;
            },
            getAccountInfoUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCOUNT_INFO;
            },
            getAccountInfoSaveUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCOUNT_INFO_SAVE;
            },
            getAccountConfigUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCOUNT_CONFIG;
            },
            getAccountConfigSaveUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCOUNT_CONFIG_SAVE;
            },
            getAccountConfigTestWebExUrl:function () {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_ACCOUNT_CONFIG_WEBEX_TEST;
            },
            getAccountSignUpUrl:function () {
                return baseURL + PATHS.ACCOUNT_SIGNUP;
            },
            getAccountUserResetPasswordUrl:function (accountUserId) {
                return baseCurrentAccountURL() + PATHS.ACCOUNT_USER_RESET_PASSWORD + accountUserId;
            },
            getAccountUserCheckUsernameUrl:function () {
                return baseURL + PATHS.ACCOUNT_USER_CHECK_USERNAME;
            },
            getAccountAuthenticationSourceUrl:function () {
                return baseCurrentAccountURL() + PATHS.AUTHENTICATION_SOURCE;
            },
            getContentCategoryAllUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_CATEGORY_ALL;
            },
            getContentUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT;
            },
            getContentAccountUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_ACCOUNT_CONTENT;
            },
            getContentAssignUrl:function (providerId) {
                return baseCurrentAccountURL() + PATHS.CONTENT_ACCOUNT_CONTENT + providerId + PATHS.CONTENT_ACCOUNT_CONTENT_ASSIGN
            },
            getContentAccountEnabledUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_ACCOUNT_CONTENT_ENABLED;
            },
            getContentPublishUrl:function (accountContentId) {
                return baseCurrentAccountURL() + PATHS.CONTENT_ACCOUNT_CONTENT + accountContentId + PATHS.CONTENT_PUBLISH;
            },
            getContentAllTabsUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_ALL_TABS;
            },
            getContentAllTagsUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_ALL_TAGS;
            },
            getContentTabUrl:function (tabId) {
                return baseCurrentAccountURL() + PATHS.CONTENT_TABS + tabId;
            },
            getContentGroupsUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT_GROUPS;
            },
            getContentSubscribeUrl:function (providerId) {
                return baseCurrentAccountURL() + PATHS.CONTENT + providerId + PATHS.CONTENT_SUBSCRIBE;
            },
            getContentUnsubscribeUrl:function (providerId) {
                return baseCurrentAccountURL() + PATHS.CONTENT + providerId + PATHS.CONTENT_UNSUBSCRIBE;
            },
            getContentSearchUrl:function () {
                return baseCurrentAccountURL() + PATHS.CONTENT + PATHS.CONTENT_SEARCH_WITH_STATUS;
            },
            getCreditCardTypesUrl:function () {
                return baseCurrentAccountURL() + PATHS.CREDIT_CARD_TYPES;
            },
            getLicenseHostingTypesUrl:function () {
                return baseCurrentAccountURL() + PATHS.LICENSE_HOSTING_TYPES;
            },
            getLicenseMineUrl:function () {
                return baseCurrentAccountURL() + PATHS.LICENSE_MINE;
            },
            getLicenseUpdateUrl:function () {
                return baseCurrentAccountURL() + PATHS.LICENSE_UPDATE_LICENSE;
            },
            getLogoutUrl:function () {
                return baseCurrentAccountURL() + PATHS.LOGOUT;
            },
            getPersonEnableUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_ENABLE;
            },
            getPersonDisableUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_DISABLE;
            },
            getPersonImportProgressUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_IMPORT_CHECK_PROGRESS;
            },
            getPersonImportErrorsUrl:function (accessToken) {
                return baseCurrentAccountURL() + PATHS.PERSON_IMPORT_EXPORT_ERRORS + accessToken;
            },
            getPersonImportFromCsvUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_IMPORT_FROM_CSV;
            },
            getPersonImportFromLdapUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_IMPORT_FROM_LDAP;
            },
            getPersonSearchUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_SEARCH;
            },
            getPlansAvailableUrl:function () {
                return baseURL + PATHS.PLAN_AVAILABLE_PLANS;
            },
            getProductsUrl:function () {
                return PATHS.PRODUCTS;
            },
            getPersonCheckPhonesUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_CHECK_PHONES;
            },
            getPersonCheckEmailsUrl:function () {
                return baseCurrentAccountURL() + PATHS.PERSON_CHECK_EMAILS;
            }
        }
        return PathService;
    }
]);
