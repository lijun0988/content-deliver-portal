'use strict';

mindFrameControllers.controller('csvImportController', [
    '$scope',
    '$modalInstance',
    '$timeout',
    '$http',
    'PathService',
    'ngMessages',
    'promises',
    '$upload',
    'authenticationService',
    function ($scope, $modalInstance, $timeout, $http, PathService, ngMessages, promises, $upload) {
        $scope.page = 1;

        $scope.csvPostUrl = PathService.getPersonImportFromCsvUrl();
        $scope.token = $http.defaults.headers.common['Access-Token'];
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.back = function () {
            $scope.page = 1;
        };

        $scope.uploaded = 0;

        $scope.importStatus = {
            status: 'INITIAL'
        };

        $scope.promises = promises;

        $scope.addOnChange = function(){
        	$("#csvFile").change(function(){
        		 $('#csvFileUploadForm').submit();
        		 $scope.page=2;
        		 $scope.uploaded = 100;
                 $scope.promises.push($timeout(progress, 1000));
        	});
        };

        var progress = function () {
            $http({
                method: 'GET',
                url: PathService.getPersonImportProgressUrl(),
                params: {t:new Date().getTime()}
            }).success(function (response) {
                $scope.importStatus = response.data;
                if ($scope.importStatus.status == 'PROCESSING' && $scope.importStatus.processed < $scope.importStatus
                    .size) {
                    $scope.promises.push($timeout(progress, 800));
                    $scope.processed = parseInt(100.0 * $scope.importStatus.processed / $scope.importStatus.size);
                }
                if ($scope.importStatus.status == 'SUCCESS') {
                    $scope.page = 3;
                }
                if ($scope.importStatus.status == 'ERROR') {
                    $scope.page = 6;
                }
            });
        };

        $scope.toggleErrors = function () {
            $scope.page = 5;
            $scope.exportUrl = PathService.getPersonImportErrorsUrl(encodeURIComponent($http.defaults.headers.common['Access-Token']));
            $('#import-csv-popup').closest('.modal').addClass("modal-large");
        };

        $scope.onFileSelect = function ($files) {
        	$scope.page = 2;
            $scope.promises.push($timeout(progress, 1000));
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                console.log("uploading");
                $scope.upload = $upload.upload({
                    url: PathService.getPersonImportFromCsvUrl(), //upload.php script, node.js route, or servlet url
                    file: file
                }).progress(function (evt) {
                	console.log(evt);
                    $scope.uploaded = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                	console.log(data);
                	$scope.uploaded = 100;
                }).error(function(evt){
                	console.log('Error');
                	console.log(evt);
                });
            }
        };

        $scope.preventBrowseButtonClick = function (evt) {
          e.preventDefault();
        };
    }
]);
