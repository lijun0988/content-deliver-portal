'use strict';

angular.module('services.searchService', []).factory('SearchService', [
  '$http',
  '$q',
  'PathService',
  function ($http, $q, PathService) {
    var SearchService = {
      searchAlreadyAssignedPhone:function (paramsObject) {
        var promise = $http({
          method: 'GET',
          url: PathService.getPersonCheckPhonesUrl(),
          params: paramsObject
        });
        return promise;
      },

      searchAlreadyAssignedEmail:function (paramsObject) {
          var promise = $http({
              method: 'GET',
              url: PathService.getPersonCheckEmailsUrl(),
              params: paramsObject
          });
          return promise;
      }
    }
    return SearchService;
  }
]);
