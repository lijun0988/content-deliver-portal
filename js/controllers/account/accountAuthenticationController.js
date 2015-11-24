'use strict';

mindFrameControllers.controller('authenticationSourceCtrl', [
    '$scope',
    '$http',
    'ngMessages',
    '$modal',
    '$dialogs',
    'PathService',
    'AUTH_SOURCES',
    function ($scope, $http, ngMessages, $modal, $dialogs, PathService, AUTH_SOURCES) {
        $scope.authenticationSources = [
            AUTH_SOURCES.LOCAL,
            AUTH_SOURCES.LDAP,
            AUTH_SOURCES.ACTIVE_DIRECTORY
        ];

        $scope.originalIsLocal = true;
        
        $http({
            method:'GET',
            url:PathService.getAccountAuthenticationSourceUrl()
        }).success(function(response) {
            if(response.data){
                $scope.aas = response.data;
            }else{
                $scope.aas = {authenticationSource:"LOCAL"};
            }
            $scope.originalIsLocal = $scope.aas.authenticationSource == 'LOCAL';
        });
        
        $scope.syncMappings = function(){
            analytics.trackTag('account_syncmapclick')
            var modalInstance = $modal.open({
                templateUrl : 'partials/admin/ldap_mappings.html',
                controller : 'syncLdapMappingsController',
                resolve : {
                    accountAuthenticationSource : function() {
                        return $scope.aas;
                    }
                }
            });

            modalInstance.result.then(function() {
            }, function() {
            });
        };
        
        $scope.saveAuthenticationSource = function(){
            analytics.trackTag('account_saveauthclick');
            if(!$scope.originalIsLocal&&$scope.aas.authenticationSource=='LOCAL'){
                var dlg = $dialogs.confirm("You are about to remove external authenication", "Are you sure you want to remove external authentication? The users in your account with external authentication will be changed to LOCAL authentication and an email wll be sent with their new password.");
                dlg.result.then(function() {
                    $scope.doSave();
                },function(){});
            }else{
                $scope.doSave();
            }
        };
        
        $scope.doSave = function(){
            $http({
                method:'POST',
                url:PathService.getAccountAuthenticationSourceUrl(),
                data: $scope.aas
            }).success(function(response) {
                ngMessages.show("Authentication Source Saved Successfully", 'success', true);
                $scope.createAuthenticationSourceForm.$setPristine();
                if(response.data){
                    $scope.aas = response.data;
                }else{
                    $scope.aas = {authenticationSource:"LOCAL"};
                }
                $scope.originalIsLocal = $scope.aas.authenticationSource == 'LOCAL';
                analytics.trackSuccess('account_saveauthclick');
            }).error(function (response) {
                analytics.trackError('account_saveauthclick');
            });
        };
    }
]);