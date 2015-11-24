'use strict';

mindFrameControllers.controller('newAccountCtrl', [
    '$scope',
    '$http',
    '$location',
    'checkoutService',
    'plansService',
    'PathService',
    'Plan',
    'ngMessages',
    'ngProgress',
    function ($scope, $http, $location, checkoutService, plansService, PathService, Plan, ngMessages,
        ngProgress) {
        $scope.checkoutService = checkoutService;
        $scope.plansService = plansService;
        $scope.user = {};
        $scope.clientAccount = {};
        $scope.successMessage = "";
        $scope.selectPlanMessage = "";
        $scope.notAvailableMsg = "";
        $scope.companyNameNotAvailableMsg = "";

        plansService.loadAvailableList(function () {
            $scope.plans = plansService.getAvailableList();
            $scope.premisesPlans = [];
            $scope.cloudPlans = [];
            for (var i = 0; i < $scope.plans.length; i++) {
                if ($scope.plans[i].hostingType == "ON_CLOUD") {
                    $scope.cloudPlans.push($scope.plans[i]);
                } else {
                    $scope.premisesPlans.push($scope.plans[i]);
                }
            };
        });

        $scope.submitted = false;
        $scope.planType = "planTypeOnCloud";

        $scope.submitNewAccount = function () {
            analytics.trackTag('newaccount_registerclick');
            $http({
                method: 'GET',
                url: PathService.getAccountCheckFullNameUrl(),
                params: {fullName:$scope.clientAccount.fullName}
            }).success(function (data, status, headers, cfg) {
                if (data.data.available == false) {
                    //Show error message
                    $scope.companyNameNotAvailableMsg = "That Company Name already exist.";
                    $scope.createAccountForm.companyName.$invalid = true;
                    $scope.createAccountForm.$invalid = true;
                } else {
                    $scope.createAccount();
                }
            }).error(function (data, status, headers, cfg) {
                //Show error message
                $scope.companyNameNotAvailableMsg = "That Company Name already exist.";
                $scope.createAccountForm.companyName.$invalid = true;
                $scope.createAccountForm.$invalid = true;
            });
        };

        $scope.createAccount = function () {
            var createAccount = {
                user: $scope.user,
                clientAccount: $scope.clientAccount,
                plan: $scope.selectedPlan
            };

            ngProgress.start();

            $http({
                method: 'POST',
                url: PathService.getAccountSignUpUrl(),
                data: createAccount
            }).
            success(function (res, status) {
                ngProgress.complete();
                if (res.success) {
                    $scope.successMessage = "Success: Account for " + createAccount.user.firstName + " " + createAccount
                        .user.lastName + " " + "successfully created";
                    ngMessages.show($scope.successMessage, 'success', true);
                    $scope.createAccountForm.$setPristine();
                    $scope.user = {};
                    $scope.clientAccount = {};
                } else {
                    $scope.message = res.message;
                }
            });
        };

        $scope.fixLayout = function () {
            var planChart = $('.plan-chart');
            if ( !! planChart.length) {
                var plansContainer = planChart.find('.plans-wrapper > ul:first-child');
                var plansCount = planChart.find('.plan-item').length;
                var planItemWidth = planChart.find('.plan-item:first-child').width();
                plansContainer.width(planItemWidth * plansCount + 10);
            }
        };

        $scope.fixLayoutOnPremises = function () {
            var planChartOnPremises = $('.plan-chartOnPremises');
            if ( !! planChartOnPremises.length) {
                var plansContainerOnPremises = planChartOnPremises.find('.plans-wrapperOnPremises > ul:first-child');
                var plansCountOnPremises = planChartOnPremises.find('.plan-itemOnPremises').length;
                var planItemWidthOnPremises = planChartOnPremises.find('.plan-itemOnPremises:first-child').width();
                plansContainerOnPremises.width(planItemWidthOnPremises * plansCountOnPremises + 10);
            }
        };

        $scope.selectPlan = function (plan) {
            analytics.trackTag('newaccount_priceplanclick');
            $scope.selectedPlan = plan;
        };

        $scope.clearSelectedPlan = function () {
            $scope.selectedPlan = null;
            $('.nav-pills li').removeClass('active');
        };

        /*$scope.$watch('clientAccount.fullName', function () {
            if ($scope.createAccountForm.companyName.$invalid) {
                $scope.companyNameNotAvailableMsg = "";
            }
        });*/

        $scope.goToHome = function () {
          $location.path('#/admin/dashboard');
        };
    }
]);
