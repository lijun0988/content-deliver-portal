'use strict';

mindFrameControllers
    .controller(
        'accountInfoCtrl',
        [
            '$scope',
            '$http',
            '$location',
            'PathService',
            'ngMessages',
            '$dialogs',
            'MESSAGES',
            'GEO_US_STATES',
            'GEO_WORLD_COUNTRIES',
            'VALIDATION_MESSAGES',
            function($scope, $http, $location, PathService,
                ngMessages, $dialogs, MESSAGES, GEO_US_STATES,
                GEO_WORLD_COUNTRIES, VALIDATION_MESSAGES) {
              $scope.VALIDATION_MESSAGES = VALIDATION_MESSAGES;
              $scope.MAIL_EXP=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              $scope.selectedState = undefined;
              $scope.states = GEO_US_STATES;
              $scope.selectedCountry = undefined;
              $scope.countries = GEO_WORLD_COUNTRIES;
              $scope.selectedPlan = {
                id : null
              };

              $http({
                method : 'GET',
                url : PathService.getAccountInfoUrl(),
                account : $scope.currentAccount,
              })
                  .success(
                      function(response) {
                        if (response.data.billingInfos
                            && response.data.licenses) {
                          $scope
                              .editPaymentInfo(response.data.billingInfos[0]);
                          $scope.license = response.data.licenses[0];
                          if ($scope.license.plan) {
                            $scope.selectedPlan.id = $scope.license.plan.id;
                          }
                        }
                      })
                  .error(
                      function(response) {
                        console
                            .log(
                                "getAccountInfo response error",
                                response);
                      });

              $http({
                method : 'GET',
                url : PathService.getLicenseHostingTypesUrl()
              }).success(function(resp) {
                $scope.hostingTypes = resp.types;
              });

              $http({
                method : 'GET',
                url : PathService.getPlansAvailableUrl()
              }).success(function(resp) {
                $scope.plans = {
                  data : resp.plans
                };
              });


              $scope.validatePhone = function(phoneNumber) {
                      if(!phoneNumber||phoneNumber.length < 4){
                        return false;
                      }

                      var phn = phoneNumber.split("+").join("");
                      phn = phn.split("-").join("");
                      phn = phn.split("(").join("");
                      phn = phn.split(")").join("");
                      if (jQuery.isNumeric(phn)) {
                          return true;
                      } else {
                          return false;
                      }
                  };


              $http({
                method : 'GET',
                url : PathService.getCreditCardTypesUrl()
              }).success(function(resp) {
                $scope.ccTypes = resp.data;
              });

              $scope.editPaymentInfo = function(billingInfo) {
                if(billingInfo){
                  var expDate = new Date(
                      billingInfo.creditCardExpirationDate);
                  billingInfo.ccExpirationYear = expDate
                      .getFullYear();
                  billingInfo.ccExpirationMonth = expDate
                      .getMonth();

                  $scope.setCCType(billingInfo.creditCardNumber);
                  $scope.billingInfo = billingInfo;
                }
              };

              var months = [];
              for (var i = 1; i <= 12; i++) {
                if (i < 10) {
                  months.push({
                    name : "0" + i.toString(),
                    value : i - 1
                  });
                } else {
                  months.push({
                    name : i.toString(),
                    value : i - 1
                  });
                }
              }

              $scope.ccExpirationMonths = months;

              var years = [];
              var currentYear = new Date().getFullYear();
              for (var i = 0; i <= 10; i++) {
                years.push(currentYear + i);
              }

              $scope.ccExpirationYears = years;

              $scope.getCCTypeByEvent = function(event) {
                $scope.setCCType(event.target.value);
              }

              $scope.setCCType = function(ccNumber) {
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
                  $scope.accountInfoForm.creditCardNumber
                      .$setValidity("", false);
                } else {
                  $scope.accountInfoForm.creditCardNumber
                      .$setValidity("", true);
                  if ($scope.billingInfo) {
                    $scope.billingInfo.creditCardType = result;
                  }
                }
              };

              $scope.validatePhoneField = function(fieldName){
                if(fieldName.indexOf('alt')!=-1){
                  if(!$scope.billingInfo[fieldName]||$scope.billingInfo[fieldName].trim().length==0){
                    $scope.accountInfoForm[fieldName].$setValidity("phone",true);
                    return;
                  }
                }

                $scope.accountInfoForm[fieldName].$setValidity("phone",$scope.validatePhone($scope.billingInfo[fieldName]));
              };

              $scope.validateZipCode = function(){
                if($scope.billingInfo.country=="United States"){
                  $scope.accountInfoForm.zipcode.$setValidity("zip",/^\d{5}$/.test($scope.billingInfo.zipcode));

                }else{
                  $scope.accountInfoForm.zipcode.$setValidity("zip",true);
                }
              };

              $scope.saveAccountInfo = function() {
                analytics.trackTag("savebillingclick");
                $scope.billingInfo.creditCardExpirationDate = new Date(
                    $scope.billingInfo.ccExpirationYear,
                    $scope.billingInfo.ccExpirationMonth)
                    .toISOString();
                $scope.license.plan = $scope.selectedPlan;

                $scope.accountInfoForm.phoneNumber.$setValidity("phone",$scope.validatePhone($scope.billingInfo.phoneNumber));

                if($scope.billingInfo.altPhoneNumber&&$scope.billingInfo.altPhoneNumber.trim().length>0){
                  $scope.accountInfoForm.altPhoneNumber.$setValidity("phone",$scope.validatePhone($scope.billingInfo.altPhoneNumber));
                }

                if(!$scope.accountInfoForm.$valid){
                  return;
                }

                $http({
                  method : 'POST',
                  url : PathService.getAccountInfoSaveUrl(),
                  data : {
                    paymentInfo : $scope.billingInfo,
                    licenseInfo : $scope.license
                  }
                })
                    .success(
                        function(response) {
                          $scope
                              .editPaymentInfo(response.data.billingInfo);
                          $scope.license = response.data.licenseInfo;
                          if ($scope.license.plan) {
                            $scope.selectedPlan.id = $scope.license.plan.id;
                          }
                          if ($scope['billingInfoAdded']) {
                            $scope
                                .billingInfoAdded();
                          }
                          $scope.accountInfoForm
                              .$setPristine();
                          ngMessages
                              .show(
                                  MESSAGES.account.infoSavedSuccess,
                                  'success',
                                  true);
                          analytics
                              .trackSuccess("savebillingclick");
                        })
                    .error(
                        function(response) {
                          ngMessages
                              .show(
                                  MESSAGES.account.infoSavedError,
                                  'error',
                                  true);
                          analytics
                              .trackError("savebillingclick");
                        });
              };

              // ENABLE / DISABLE //
              $http({
                method : 'GET',
                url : PathService.getAccountMineUrl()
              }).success(function(resp) {
                $scope.account = resp.data;
              });

              $scope.enableAccount = function() {
                analytics
                    .trackTag("account_enableaccountclick");
                var dlg = $dialogs.confirm(
                    MESSAGES.common.headers.confirm,
                    MESSAGES.account.confirmEnable);
                dlg.result
                    .then(
                        function(btn) {
                          $http(
                              {
                                method : 'POST',
                                url : PathService
                                    .getAccountEnableUrl(),
                                params : {
                                  id : $scope.account.id
                                }
                              })
                              .success(
                                  function(
                                      response) {
                                    $scope.account.enabled = true;
                                    ngMessages
                                        .show(
                                            MESSAGES.account.enabled,
                                            'enabled',
                                            true);
                                    analytics
                                        .trackSuccess("account_enableaccountclick");
                                  })
                              .error(
                                  function(
                                      response) {
                                    analytics
                                        .trackError("account_enableaccountclick");
                                  });
                        }, function(btn) {
                        });
              };

              $scope.disableAccount = function() {
                analytics
                    .trackTag("account_disableaccountclick");
                var dlg = $dialogs.confirm(
                    MESSAGES.common.headers.confirm,
                    MESSAGES.account.confirmDisable);
                dlg.result
                    .then(
                        function(btn) {
                          $http(
                              {
                                method : 'POST',
                                url : PathService
                                    .getAccountDisableUrl(),
                                params : {
                                  id : $scope.account.id
                                }
                              })
                              .success(
                                  function(
                                      response) {
                                    $scope.account.enabled = false;
                                    ngMessages
                                        .show(
                                            MESSAGES.account.disabled,
                                            'disabled');
                                    analytics
                                        .trackSuccess("account_disableaccountclick");
                                  })
                              .error(
                                  function(
                                      response) {
                                    analytics
                                        .trackError("account_disableaccountclick");
                                  });
                        }, function(btn) {
                        });
              };
              // END ENABLE / DISABLE //

              $scope.goHome = function() {
                $location.path("/admin/dashboard");
              }
            } ]);
