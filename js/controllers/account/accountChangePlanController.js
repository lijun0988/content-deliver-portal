'use strict';

mindFrameControllers.controller('changePlanCtrl', [
    '$scope',
    '$http',
    'Plan',
    'PathService',
    'ngMessages',
    function ($scope, $http, Plan, PathService, ngMessages) {
        $scope.selectedPlan = {
            id: null
        }
        $http({
            method: 'GET',
            url: PathService.getLicenseHostingTypesUrl()
        }).success(function (resp) {
            $scope.hostingTypes = resp.types;
        });

        $http({
            method: 'GET',
            url: PathService.getPlansAvailableUrl()
        }).success(function (resp) {
            $scope.plans = {
                data: resp.plans
            };
        });

        $http({
            method: 'GET',
            url: PathService.getLicenseMineUrl()
        }).success(function (resp) {
            $scope.license = resp.data[0];
            if ($scope.license.plan) {
                $scope.selectedPlan.id = $scope.license.plan.id;
            }
        });

        $scope.changePlan = function () {
            var lic = $scope.license;
            lic.plan = $scope.selectedPlan;
            $http({
                method: 'PUT',
                data: lic,
                url: PathService.getLicenseUpdateUrl()
            })
            .success(function (resp) {
                $scope.selectPlanForm.$setPristine();
                ngMessages.show($scope.messages.successLicenseUpdated, 'success', true);
                analytics.trackSuccess("saveplanclick");
            })
            .error(function (data, status, headers, config) {
                $scope.selectPlanForm.$setPristine();
                ngMessages.show($scope.messages.errorLicenseUpdated, 'error');
                analytics.trackError("saveplanclick");
            });
        };
    }
]);