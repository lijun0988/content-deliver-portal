'use strict';

mindFrameControllers.controller('clientListController', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  '$route',
  'ngMessages',
  'PathService',
  function($scope, $rootScope, $http, $location, $route, ngMessages, PathService) {
		$scope.type = $location.path().indexOf('onPremises') != -1 ? 'ON_PREMISES' : 'ON_CLOUD';

    $http({
        method: 'GET',
        url: PathService.getAccountListUrl() + "all"
      }).success(function(resp, status, headers, cfg) {
    	  $scope.accounts = resp.data;
      }).error(function(data, status, headers, cfg) {
    	  $scope.accounts = [];
    	  ngMessages.show('Error retrieving accounts', 'error', true);
    });

    $scope.createAccount = function () {
      $location.path("/admin/new_account");
    };

    $scope.edit = function (account) {
      $rootScope.currentAccount = account.name;
      $rootScope.currentAccountFullName = account.fullName;
      $route.reload();
      $location.path('/admin/account');
    };
  }
]);
