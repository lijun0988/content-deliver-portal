'use strict';

mindFrameControllers.controller('contentProviderCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'PathService',
    'ContentProvider',
    'AccountContentProvider',
    function ($scope, $http, $location, $routeParams, PathService, ContentProvider, AccountContentProvider) {
        $scope.providers = ContentProvider.get({
            id: "all",
            account: $scope.currentAccount
        });
        $scope.subscribe = function(provider) {
            $http({
                method: 'POST',
                url: PathService.getContentSubscribeUrl(provider.id)
            }).
            success(function(res, status) {
                if (res.success) {
                    $scope.providers.data.status[provider.id] = "unsubscribe";
                }
            });
        };
        $scope.unsubscribe = function(provider) {
            $http({
                method: 'DELETE',
                url: PathService.getContentUnsubscribeUrl(provider.id)
            }).
            success(function(res, status) {
                if (res.success) {
                    $scope.providers.data.status[provider.id] = "subscribe";
                }
            });
        };
    },
]);