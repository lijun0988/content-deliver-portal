'use strict';

mindFrameControllers.controller('accountConfigCtrl', [
    '$scope',
    '$http',
    '$location',
    '$dialogs',
    'PathService',
    'ngMessages',
    'MESSAGES',
    'AUTH_SOURCES',
    'SSO_CONFIGS',
    function ($scope, $http, $location, $dialogs, PathService, ngMessages, MESSAGES, AUTH_SOURCES, SSO_CONFIGS) {
        $scope.authenticationSources = [
            AUTH_SOURCES.LOCAL,
            AUTH_SOURCES.LDAP,
            AUTH_SOURCES.ACTIVE_DIRECTORY
        ];

        $scope.originalIsLocal = true;

        $http({
            method: 'GET',
            url: PathService.getAccountConfigUrl()
        }).success(function (response) {
            $scope.initAccountConfigModelAndForm(response);
        });

        $scope.initAccountConfigModelAndForm = function (response) {
            if (response.data) {
                $scope.aas = response.data.authSourceConfig;
                $scope.callManagerUrl = response.data.urlsConfig.callManagerUrl;
                $scope.jabberDomainUrl = response.data.urlsConfig.jabberDomainUrl;
                $scope.jabberBindingUrl = response.data.urlsConfig.jabberBindingUrl;

                //set properties for piwik
                $scope.fidelusDomainName = response.data.piwikConfig.fidelusDomainName;
                $scope.fidelusAnalyticServerUrl = response.data.piwikConfig.fidelusAnalyticServerUrl;
                $scope.fidelusSiteCode = response.data.piwikConfig.fidelusSiteCode;
                $scope.fidelusToken = response.data.piwikConfig.fidelusToken;


                $scope.webexCurrentAccountName = "";
                $scope.webexCurrentPassword = "";

                $scope.ssoConfigs = response.data.ssoConfigs;

                if(response.data.webExConfigs.length>0){
                    $scope.webExConfigs = response.data.webExConfigs;
                    $scope.webexCurrentSiteName = response.data.webExConfigs[response.data.webExConfigs.length-1].siteName;
                    $scope.webexCurrentPartnerID = response.data.webExConfigs[response.data.webExConfigs.length-1].partnerId;
                    $scope.webexCurrentSiteID = response.data.webExConfigs[response.data.webExConfigs.length-1].siteId;
                    $scope.webexCurrentSSOConfig = response.data.webExConfigs[response.data.webExConfigs.length-1].ssoConfiguration;
                }
                else{
                    $scope.webExConfigs = [];
                }


            } else {
                $scope.aas = {authenticationSource: AUTH_SOURCES.LOCAL.id};
            }
            $scope.originalIsLocal = $scope.aas.authenticationSource == AUTH_SOURCES.LOCAL.id;
        }

        $scope.save = function () {
            analytics.trackTag('account_saveauthclick');

            if($scope.webexCurrentSiteName!==undefined && $scope.webexCurrentPartnerID !==undefined
                && $scope.webexCurrentSiteID!==undefined && $scope.webexCurrentSSOConfig !== undefined) {

                $scope.webExConfigs.push({"siteName": $scope.webexCurrentSiteName, "partnerId": $scope.webexCurrentPartnerID,
                    "siteId": $scope.webexCurrentSiteID,
                    "ssoConfiguration": $scope.webexCurrentSSOConfig});

            }
            if (!$scope.originalIsLocal && $scope.aas.authenticationSource == AUTH_SOURCES.LOCAL.id) {
                var dlg = $dialogs.confirm(MESSAGES.common.headers.warningRemovingExternalAuth,
                    MESSAGES.account.aboutToRemoveExternalAuth);
                dlg.result.then(function () {
                    $scope.doSave();
                }, function () {
                });
            } else {
                $scope.doSave();
            }
        };


        $scope.doSave = function () {
            if($scope.webExConfigs!==undefined && $scope.webExConfigs.length>0){
                $http({
                    method: 'POST',
                    url: PathService.getAccountConfigSaveUrl(),
                    data: {
                        authSourceConfig: $scope.aas,
                        urlsConfig: {
                            callManagerUrl: $scope.callManagerUrl,
                            jabberDomainUrl: $scope.jabberDomainUrl,
                            jabberBindingUrl: $scope.jabberBindingUrl
                        },
                        piwikConfig: {
                            fidelusDomainName: $scope.fidelusDomainName,
                            fidelusAnalyticServerUrl: $scope.fidelusAnalyticServerUrl,
                            fidelusSiteCode: $scope.fidelusSiteCode,
                            fidelusToken: $scope.fidelusToken
                        },
                        webExConfigs: $scope.webExConfigs
                    }
                }).success(function (response) {
                    ngMessages.show(MESSAGES.account.configSavedSuccess, 'success', true);
                    $scope.initAccountConfigModelAndForm(response);
                    analytics.trackSuccess('account_saveauthclick');
                }).error(function (response) {
                    ngMessages.show(MESSAGES.account.configSavedError, 'error');
                    analytics.trackError('account_saveauthclick');
                });
            }
            else{
                $http({
                    method: 'POST',
                    url: PathService.getAccountConfigSaveUrl(),
                    data: {
                        authSourceConfig: $scope.aas,
                        urlsConfig: {
                            callManagerUrl: $scope.callManagerUrl,
                            jabberDomainUrl: $scope.jabberDomainUrl,
                            jabberBindingUrl: $scope.jabberBindingUrl
                        },
                        piwikConfig: {
                            fidelusDomainName: $scope.fidelusDomainName,
                            fidelusAnalyticServerUrl: $scope.fidelusAnalyticServerUrl,
                            fidelusSiteCode: $scope.fidelusSiteCode,
                            fidelusToken: $scope.fidelusToken
                        }
                    }
                }).success(function (response) {
                    ngMessages.show(MESSAGES.account.configSavedSuccess, 'success', true);
                    $scope.initAccountConfigModelAndForm(response);
                    analytics.trackSuccess('account_saveauthclick');
                }).error(function (response) {
                    ngMessages.show(MESSAGES.account.configSavedError, 'error');
                    analytics.trackError('account_saveauthclick');
                });

            }

        };

        $scope.cleanWebExFields = function () {
            $scope.webexCurrentSiteName = "";
            $scope.webexCurrentPartnerID = "";
            $scope.webexCurrentSiteID = "";
            $scope.webexCurrentSSOConfig = "";
        };

        $scope.webExTestConfigs = function () {

           var cred = $scope.webexCurrentAccountName + ':' + $scope.webexCurrentPassword;
           var credentials64 = Base64.encode(cred);

            $http({
                method: 'POST',
                url: PathService.getAccountConfigTestWebExUrl(),
                data: {
                    credentials:credentials64,
                    siteName:$scope.webexCurrentSiteName,
                    partnerId:$scope.webexCurrentPartnerID,
                    siteId:$scope.webexCurrentSiteID,
                    ssoConfiguration:$scope.webexCurrentSSOConfig
                }
            }).success(function (response) {
                ngMessages.show(MESSAGES.account.webExTestConfigSuccess, 'success', true);

            }).error(function (response) {
                ngMessages.show(MESSAGES.account.webExTestConfigError, 'error');

            });
        };

        $scope.toggleConfigFields = function (webExCurrent) {
            $scope.webexCurrentSiteName = webExCurrent.siteName;
            $scope.webexCurrentPartnerID = webExCurrent.partnerId;
            $scope.webexCurrentSiteID = webExCurrent.siteId;
            $scope.webexCurrentSSOConfig = webExCurrent.ssoConfiguration;
        }

        $scope.goToHome = function () {
            $location.path('#/admin/dashboard');
        }
    }
]);
