'use strict';

mindFrameControllers.controller('forgotUserPasswordCtrl', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    'authenticationService',
    'PathService',
    'VALIDATION_MESSAGES',
    function ($scope, $http, $routeParams, $location, authenticationService, PathService, VALIDATION_MESSAGES) {
        var location = $location.path().substring(7);
        $scope.authenticationService = authenticationService;
        $scope.activeTab = location;
        $scope.VALIDATION_MESSAGES = VALIDATION_MESSAGES;
        $scope.user = {
        	username: "",
        	firstname: "",
        	lastname: ""
        };

        $scope.MAIL_EXP=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        $scope.forgotPassword = function(){

	        $http({
                    method:'POST',
                    url: PathService.getForgotUsernameAndPasswordUrl(),
                    data: $scope.user
                }).success(function(response) {
                	// the username was found and an email sent to reset the password
                    $location.path('/emailSentToResetPassword');
                }).error(function (response) {
                   $scope.message = response.message;
                   $location.path('/forgotPassword');
                });
        };

        $scope.resetPassword = {
            token: "",
            password: ""
        };

        $scope.changePassword = function(){

            $http({
                    method:'POST',
                    url: PathService.getChangePasswordUrl(),
                    data: $scope.resetPassword
                }).success(function(response) {
                    // the username was found and an email sent to reset the password
                    $location.path('/');
                }).error(function (response) {
                   $scope.message = response.message;
                   $location.path('/resetPassword');
                });
        };
    },
]);
