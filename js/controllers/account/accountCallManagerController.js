'use strict';

mindFrameControllers.controller('callManagerCtrl', [
    '$scope',
    '$http',
    'ngMessages',
    'PathService',
    function ($scope, $http, ngMessages, PathService) {
        $http({
            method: 'GET',
            url: PathService.getAccountMineUrl()
        }).success(function (resp) {
            $scope.myAccount = resp.data;
        });

        $scope.saveCallManagerConfiguration = function () {
            analytics.trackTag("account_savecmclick");

            if (!$scope.callManagerForm.$valid) {
                return;
            }
            $http({
                method: 'POST',
                url: PathService.getAccountCallManagerConfigUrl(),
                data: $scope.myAccount
            })
            .success(function (resp) {
                if (resp.success) {
                    $scope.callManagerForm.$setPristine();
                    ngMessages.show("Call Manager Configuration Saved successfully", 'success', true);
                    analytics.trackSuccess("account_savecmclick");
                } else {
                    $scope.callManagerForm.$setPristine();
                    ngMessages.show("Unable to save Call Manager Configuration", 'error');
                    analytics.trackError("account_savecmclick");
                }
            }).error(function (data, status, headers, config) {
                ngMessages.show("Unable to save Call Manager Configuration", 'error');
                analytics.trackError("account_savecmclick");
            });
        };
    }
]);