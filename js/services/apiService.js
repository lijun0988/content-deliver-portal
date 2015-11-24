angular.module('services.apiService', []).service('ApiService', [
    '$q', '$http', 'akkadianPlatformApiBaseUrl',
    function ($q, $http, akkadianPlatformApiBaseUrl) {

    	var deferred = $q.defer();
        
        $http({
            method:'GET',
            url: akkadianPlatformApiBaseUrl + "version/catalog"
          }).success(function (response) {

            var ApiService = {
                version : response.data.version,
                api : response.data.api,
                hasFeature : function(feature){
              	  return this.api.hasOwnProperty(feature);
                }
            }
            deferred.resolve(ApiService);
         });

        return deferred.promise;
        
    }
]);

