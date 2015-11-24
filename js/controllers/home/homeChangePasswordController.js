'use strict';

mindFrameControllers.controller('changePasswordController', [
  '$scope',
  '$http',
  '$routeParams',
  'PathService',
  'apiService',
  function ($scope, $http, $routeParams, PathService, apiService) {
	    $scope.version = apiService.version;
  }
]);
