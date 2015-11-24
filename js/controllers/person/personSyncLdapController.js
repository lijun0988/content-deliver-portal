'use strict';

mindFrameControllers.controller('syncLdapController', [
    '$scope',
    '$modalInstance',
    'accountAuthenticationSource',
    '$timeout',
    '$http',
    'PathService',
    'ngMessages',
    'promises',
    function ($scope, $modalInstance, accountAuthenticationSource, $timeout, $http, PathService,  ngMessages, promises) {
        $scope.accountAuthenticationSource = accountAuthenticationSource;

        $scope.syncInfo = {
            ldapQuery: accountAuthenticationSource.syncQuery,
            username: "",
            password: "",
            updateExistingUsers: false
        };
        
        $scope.progressMax = 100;
        $scope.currentProgres = 50;
        $scope.syncing = false;
        $scope.page = 1;
        $scope.showErrors = false;
        $scope.modalBody;
        $scope.modalSize = {
            large: 'large',
            normal: 'normal',
            cssClasses: {
                large: 'modal-large'
            }
        };

        $scope.back = function () {
            $scope.page = 1;
            $scope.setModalSize($scope.modalSize.normal);
        };
        $scope.importStatus = {
            status: 'INITIAL'
        };

        $scope.promises = promises;

        $scope.toggleErrors = function () {
            $scope.showErrors = !$scope.showErrors;
            if ($scope.showErrors) {
                $scope.page = 5;
                $scope.exportUrl = PathService.getPersonImportErrorsUrl(
                    encodeURIComponent($http.defaults.headers.common['Access-Token'])
                );
                $scope.setModalSize($scope.modalSize.large);
            } else {
                $scope.page = 4;
                $scope.setModalSize($scope.modalSize.normal);
            } 
        };

        $scope.pullStatus = true;
        
        var progress = function () {
            if ($scope.pullStatus) { 
                $http({
                    method: 'GET',
                    url: PathService.getPersonImportProgressUrl(),
                    params: {t:new Date().getTime()}
                }).success(function (response) {
                    $scope.importStatus = response.data;
                });
                $scope.promises.push($timeout(progress, 800));
            }
        };

        $scope.sync = function () {
            $scope.page = 2;
            $scope.setModalSize($scope.modalSize.normal);
            $scope.promises.push($timeout(progress, 1000));

            $http({
                method: 'POST',
                url: PathService.getPersonImportFromLdapUrl(),
                data: $scope.syncInfo
            }).success(function (response) {
                $scope.pullStatus = false;
                $scope.importedSuccessfully = response.data.importedSuccessfully;
                $scope.errors = response.data.errors;
                $scope.page = 3;
                $scope.setModalSize($scope.modalSize.normal);
            }).error(function (status) {
                $scope.pullStatus = false;
                $scope.message = status.message;
                $scope.page = 4;
                $scope.setModalSize($scope.modalSize.normal);
            });
        };

        $scope.ok = function () {
            $modalInstance.dismiss();
        };

        $scope.setModalSize = function (size) {
            if (!$scope.modalBody) $scope.modalBody = $('#ldap-sync');
            switch (size) {
            case $scope.modalSize.large:
                $scope.modalBody.closest('.modal').addClass($scope.modalSize.cssClasses.large);
                break;
            case $scope.modalSize.normal:
                $scope.modalBody.closest('.modal').removeClass($scope.modalSize.cssClasses.large);
                break;
            }
        }
    }
]);