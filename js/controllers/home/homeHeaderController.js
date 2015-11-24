'use strict';

mindFrameControllers.controller('headerCtrl', [
    '$scope',
    '$http',
    'authenticationService',
    '$rootScope',
    '$location',
    '$route',
    function ($scope, $http, authenticationService, $rootScope, $location, $route) {
        $scope.authenticationService = authenticationService;
        $scope.rootScope = $rootScope;
        $scope.hideMenuItem = false;
        $scope.getHomeUrl = function (authenticated) {
            if (authenticated) {
                return '#/admin/dashboard';
            } else {
                return '#/';
            }
        }

        $scope.updateCurrentAccount = function (account) {
            $rootScope.currentAccount = account.name;
            $rootScope.currentAccountFullName = account.fullName;
            $route.reload();
        };

    }
]);
