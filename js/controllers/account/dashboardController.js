'use strict';

mindFrameControllers.controller('dashboardCtrl', [
  '$scope',
  '$http',
  '$location',
  '$dialogs',
  'PathService',
  'AUTH_SOURCES',
  function ($scope, $http, $location, $dialogs, PathService, AUTH_SOURCES) {
    $scope.authenticationSources = [
      AUTH_SOURCES.LOCAL,
      AUTH_SOURCES.LDAP,
      AUTH_SOURCES.ACTIVE_DIRECTORY
    ];

    $scope.date= new Date();
    $scope.originalIsLocal = true;

    $http({
      method:'GET',
      url:PathService.getAccountConfigUrl()
    }).success(function (response) {
      $scope.dashboardData(response);
    });

    $scope.dashboardData = function (response) {
      if (response.data) {
        $scope.aas = response.data.authSourceConfig;
        $scope.callManagerUrl = response.data.urlsConfig.callManagerUrl;
        $scope.jabberDomainUrl = response.data.urlsConfig.jabberDomainUrl;
        $scope.jabberBindingUrl = response.data.urlsConfig.jabberBindingUrl;

        //set properties for piwik
        $scope.fidelusDomainName = response.data.piwikConfig.fidelusDomainName;
        var fidelusAnalyticServerUrl=(("https:" == document.location.protocol) ? "https" : "http") + "://"+ response.data.piwikConfig.fidelusAnalyticServerUrl;
        $scope.fidelusAnalyticServerUrl = fidelusAnalyticServerUrl;
        $scope.fidelusSiteCode = response.data.piwikConfig.fidelusSiteCode;
        $scope.fidelusToken = response.data.piwikConfig.fidelusToken;
      } else {
        $scope.aas = {authenticationSource:AUTH_SOURCES.LOCAL.id};
      }
      $scope.originalIsLocal = $scope.aas.authenticationSource == AUTH_SOURCES.LOCAL.id;

    }

  }
]);
