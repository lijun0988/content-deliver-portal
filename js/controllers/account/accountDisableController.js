'use strict';

mindFrameControllers.controller('disableAccountCtrl', [
    '$scope',
    '$http',
    'PathService',
    'ngMessages',
    '$dialogs',
    function ($scope, $http, PathService, ngMessages, $dialogs) {
        $http({
            method:'GET', 
            url:PathService.getAccountMineUrl()
        }).success(function(response) {
            $scope.account = response.data;
        });

        $scope.enableAccount = function(){
            analytics.trackTag("account_enableaccountclick");
            var dlg = $dialogs.confirm($scope.messages.confirmHeader,$scope.messages.confirmEnable);
            dlg.result.then(function(btn){
                $http({
                    method:'POST',
                    url:PathService.getAccountEnableUrl(),
                    params:{id:$scope.account.id}
                }).success(function(response) {
                    $scope.account.enabled=true;
                    ngMessages.show($scope.messages.accountEnabled, 'enabled', true);
                    analytics.trackSuccess("account_enableaccountclick");
                }).error(function (response) {
                    analytics.trackError("account_enableaccountclick");
                });
            },function(btn){});
        };

        $scope.disableAccount = function(){
            analytics.trackTag("account_disableaccountclick");
            var dlg = $dialogs.confirm($scope.messages.confirmHeader,$scope.messages.confirmDisable);
            dlg.result.then(function(btn){
                $http({
                    method:'POST',
                    url:PathService.getAccountDisableUrl(),
                    params:{id:$scope.account.id}
                }).success(function(response) {
                    $scope.account.enabled = false;
                    ngMessages.show($scope.messages.accountDisabled, 'disabled', true);
                    analytics.trackSuccess("account_disableaccountclick");
                }).error(function (response) {
                    analytics.trackError("account_disableaccountclick");
                });
            },function(btn){});
        };
    }
]);