'use strict';

mindFrameControllers.controller('loginCtrl', [
  '$scope',
  '$http',
  '$cookieStore',
  '$location',
  'authenticationService',
  'apiService',
  function ($scope, $http, $cookieStore, $location, authenticationService, apiService) {
    $scope.version = apiService.version;
    $scope.authenticationService = authenticationService;

    // by default rememberme is always checked
    $scope.rememberme = true;

    $scope.doLogin = function () {
      $scope.doingLogin = true;
      var rememberme = $scope.rememberme;
      var cred = $scope.user + ':' + $scope.password;
      var credentials64 = Base64.encode(cred);
      authenticationService.authenticate(credentials64, rememberme, $scope, $location);
    };
  }
]);
