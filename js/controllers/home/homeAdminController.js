'use strict';

mindFrameControllers.controller('adminCtrl', [
    '$scope',
    '$http',
    '$routeParams',
    '$route',
    '$location',
    'plansService',
    'authenticationService',
    'apiService',
    function ($scope, $http, $routeParams, $route, $location, plansService, authenticationService, apiService) {
        $scope.plansService = plansService;
        var location = $location.path().substring(7);
        $scope.authenticationService = authenticationService;
        $scope.activeTab = location;
        $scope.updateAccount = function() {
            $route.reload();
        };
       	$scope.version = apiService.version;
    },
]);

mindFrameControllers.controller('homeCtrl', [
    '$scope',
    '$http',
    'authenticationService',
    '$rootScope',
    '$location',
    function homeCtrl($scope, $http, authenticationService, $rootScope, $location) {}
]);