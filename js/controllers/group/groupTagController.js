'use strict';

mindFrameControllers.controller('tagsCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'PathService',
    'ngMessages',
    function ($scope, $http, $location, $routeParams, PathService, ngMessages) {
        $http({
            method: 'GET',
            url: PathService.getContentGroupsUrl()
        }).
        success(function (res, status) {
            if (!res.data) {
                $scope.groups = [];
            } else {
                $scope.groups = res.data;
            }
        });
        $scope.editing = true;
        $scope.edit = function () {
            $scope.editing = true;
        };

        $scope.save = function () {
            $scope.groupExists = false;
            analytics.trackTag('groups_saveclick');
            $http({
                method: 'POST',
                url: PathService.getContentGroupsUrl(),
                data: $scope.groups
            }).
            success(function (res, status) {
                ngMessages.show("Success: Groups have been saved successfully", 'success', true);
                analytics.trackSuccess('groups_saveclick');
            })
            .error(function (response) {
                analytics.trackError('groups_saveclick');
            });
        };

        $('input[autofocus]:visible:first').focus();

        $scope.tagText = "";
        $scope.addTag = function () {
        	$scope.error = null;
            if ($scope.tagText.length == 0) {
                return;
            }
            if (!$scope.groups) {
                $scope.groups = [];
            }
            var isInArray = false;
            for (var i = 0; i < $scope.groups.length; i++) {
                var acT = $scope.groups[i];
                isInArray = $scope.tagText.toUpperCase() === acT.toUpperCase();
                if (isInArray) {
                    $scope.error = "Group already exists";
                    break;
                }
            }
            if (!isInArray) {
                $scope.groups.push($scope.tagText);
                $scope.tagText = '';
            }
            analytics.trackTag('group_add');
        };
        $scope.deleteTag = function (tag) {
        	$scope.error = null;
        	for (var i = 0; i < $scope.groups.length; i++) {
                if ($scope.groups[i] == tag) {
                    $scope.groups.splice(i, 1);
                }
            }
            analytics.trackTag('group_delete');
        };

        $scope.goToHome = function () {
            $location.path('#/admin/dashboard');
        };
    },
]);

