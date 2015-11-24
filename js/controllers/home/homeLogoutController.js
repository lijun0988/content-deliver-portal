'use strict';

mindFrameControllers.controller('logoutCtrl', [
    '$scope',
    '$http',
    '$cookieStore',
    '$location',
    'authenticationService',
    function loginCtrl($scope, $http, $cookieStore, $location,
        authenticationService) {
        $scope.authenticationService = authenticationService;
        authenticationService.logout();
    }
]);