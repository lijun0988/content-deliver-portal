'use strict';

mindFrameControllers.controller('billingInfoCtrl', [
    '$scope',
    '$http',
    'BillingInfo',
    'PathService',
    'ngMessages',
    'GEO_US_STATES',
    'GEO_WORLD_COUNTRIES',
    'authenticationService',
    function ($scope, $http, BillingInfo, PathService, ngMessages, GEO_US_STATES, GEO_WORLD_COUNTRIES, authenticationService) {
        $scope.selectedState = undefined;
        $scope.states = GEO_US_STATES;
        $scope.selectedCountry = undefined;
        $scope.countries = GEO_WORLD_COUNTRIES;

        $scope.billingInfos = BillingInfo.get({
            id : 'all',
            account : $scope.currentAccount
        }, function(resp) {
            if (resp.total > 0 || resp.length > 0) {
                $scope.edit(resp.data[0].id);
            } else {
                $scope.billingInfo = new BillingInfo;
            }
        });

        $scope.saveBillingInfo = function() {
            var billingInfo = new BillingInfo($scope.billingInfo);
            billingInfo.creditCardExpirationDate = new Date(billingInfo.ccExpirationYear,billingInfo.ccExpirationMonth).toISOString();
            analytics.trackTag("savebillingclick");
            if (billingInfo.id) {
                billingInfo.$update({account : $scope.currentAccount},
                    function(data) {
                        for (var i = 0; i < $scope.billingInfos.data.length; i++) {
                            if (data.data.id == $scope.billingInfos.data[i].id) {
                                $scope.billingInfos.data[i] = data.data;
                            }
                        }
                        if($scope['billingInfoAdded']){
                            $scope.billingInfoAdded();
                        }
                        // Set user message
                        $scope.createBillingInfoForm.$setPristine();
                        ngMessages.show($scope.messages.successBillingUpdated, 'enabled', true);
                        analytics.trackSuccess("savebillingclick");
                    },
                    function (data) {
                        analytics.trackError("savebillingclick")
                    });
            } else {
            	billingInfo.emailAddress = authenticationService.credentials.user;
                billingInfo.$create({account : $scope.currentAccount},
                    function(data) {
                        var billingInfo = new BillingInfo(data.data);
                        var expDate = new Date(
                            data.data.creditCardExpirationDate);
                        billingInfo.ccExpirationYear = expDate
                        .getFullYear();
                        billingInfo.ccExpirationMonth = expDate
                        .getMonth();
                        $scope.billingInfo = billingInfo;
                        if($scope['billingInfoAdded']){
                            $scope.billingInfoAdded();
                        }
                    // Set user message
                    $scope.createBillingInfoForm.$setPristine();
                    ngMessages.show($scope.messages.successBillingCreated, 'success', true);
                    analytics.trackSuccess("savebillingclick");
                },function (data) {
                    analytics.trackError("savebillingclick")
                });
            }
        };

        $scope.edit = function(billingInfoId) {
            BillingInfo.get({
                id : billingInfoId,
                account : $scope.currentAccount
            }, function(resp) {
                var billingInfo = new BillingInfo(resp);
                var expDate = new Date(resp.creditCardExpirationDate);
                billingInfo.ccExpirationYear = expDate.getFullYear();
                billingInfo.ccExpirationMonth = expDate.getMonth();
                $scope.setCCType(billingInfo.creditCardNumber);
                $scope.billingInfo = billingInfo;
            });
        };

        $http({
            method : 'GET', 
            url : PathService.getCreditCardTypesUrl()
        }).success(function(resp){
            $scope.ccTypes = resp.data; 
        });

        var months = [];
        for (var i = 1; i <= 12; i++) {
            if (i < 10) {
                months.push({name: "0" + i.toString(), value: i - 1});
            } else {
                months.push({name: i.toString(), value: i - 1});
            }
        }

        $scope.ccExpirationMonths = months;

        var years = [];
        var currentYear = new Date().getFullYear();
        for (var i = 0; i <= 10; i++) {
            years.push(currentYear + i);
        }

        $scope.ccExpirationYears = years;

        $scope.getCCTypeByEvent = function (event) {
            $scope.setCCType(event.target.value);
        }

        $scope.setCCType = function (ccNumber) {
            var result = "";
            if (/^5[1-5]/.test(ccNumber)) {
                result = "MASTERCARD";
            } else if (/^4/.test(ccNumber)) {
                result = "VISA";
            } else if (/^3[47]/.test(ccNumber)) {
                result = "AMEX";
            } else {
                result = "";
            }

            $scope.creditCardLogoClass = result;
            if (result == "") {
                $scope.createBillingInfoForm.creditCardNumber.$setValidity("", false);                
            } else {
                $scope.createBillingInfoForm.creditCardNumber.$setValidity("", true);
                if ($scope.billingInfo) {
                    $scope.billingInfo.creditCardType = result;
                }
            }
        }
    }
]);