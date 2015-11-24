'use strict';

mindFrameControllers.controller('tabPropertiesController', [
    '$scope',
    'ngMessages',
    '$modalInstance',
    'selectedTab',
    function ($scope, ngMessages, $modalInstance, selectedTab) {
        $scope.selectedTab = selectedTab;
        $scope.addTrait = function (tab) {
            if (!this.traitText || this.traitText.length == 0) {
                return;
            }
            if (!tab.traits) {
                tab.traits = [];
            }
            var isInArray = false;
            for (var i = 0; i < tab.traits.length; i++) {
                isInArray = this.traitText.toUpperCase() === tab.traits[i].toUpperCase();
                if (isInArray) {
                    break;
                }
            };
            if (!isInArray) {
                tab.traits.push(this.traitText);
            }
            this.traitText = '';
        };

        $scope.deleteTrait = function (idx, tab) {
            tab.traits.splice(idx, 1);
        };

        $scope.saveTabProperties = function () {
            $modalInstance.close($scope.selectedTab);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $('input[autofocus]:visible:first').focus();
    }
]);

mindFrameControllers.controller('tabTagsController', function ($scope) {
    $scope.addTag = function () {
        if ($scope.selected.length == 0) {
            return;
        }
        if (!$scope.tab.tags) {
            $scope.tab.tags = []
        }
        var isInArray = false;
        for (var i = 0; i < $scope.tab.tags.length; i++) {
            $scope.tab.tags[i];
            isInArray = $scope.selected.toUpperCase() === $scope.tab.tags[i].toUpperCase();
            if (isInArray) {
                break;
            }
        };
        if (!isInArray) {
            if (jQuery.inArray($scope.selected, $scope.allTags) == -1) {
                return;
            } else {
                $scope.tab.tags.push($scope.selected);
            }
        }
        $scope.selected = '';
    }
    $scope.deleteTag = function (tag) {
        for (var i = 0; i < $scope.tab.tags.length; i++) {
            if ($scope.tab.tags[i] == tag) {
                $scope.tab.tags.splice(i, 1);
            }
        }
    }
});

mindFrameControllers.controller('tabsCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'PathService',
    'Tab',
    'AccountContentProvider',
    function ($scope, $http, $location, $routeParams, PathService, Tab, AccountContentProvider) {
        $http({
            method: 'GET',
            url: PathService.getContentAllTabsUrl()
        }).
        success(function (res, status) {
            if (res.success) {
                $scope.tabs = res;
            }
        });
        AccountContentProvider.get({
            account: $scope.currentAccount,
            id: 'all'
        }, function (res) {
            var acps = [];
            angular.forEach(res.data, function (acp) {
                acps.push({
                    id: acp.id,
                    name: acp.name
                });
            });
            $scope.accountContentProviders = acps;
        });
        $http({
            method: 'GET',
            url: PathService.getContentAllTagsUrl()
        }).
        success(function (res, status) {
            if (!res.data.tags) {
                res.data.tags = [];
            }
            var allTags = [];
            allTags.push.apply(allTags, res.data.tags);
            allTags.push.apply(allTags, res.data.providedTags);
            $scope.allTags = allTags;
        });
        $scope.add = false;
        $scope.addTab = function () {
            $scope.tab = new Tab();
            $scope.tab.tags = [];
            $scope.add = true;
        };
        $scope.saveNewTab = function () {
            if (!$scope.tabs.data) {
                $scope.tabs.data = [];
            }
            $scope.add = false;
            var tb = new Tab($scope.tab);
            tb.$create({
                account: $scope.currentAccount
            }, function (res) {
                if (res.success) {
                    $scope.tab.id = res.data.id;
                    $scope.tabs.data.push($scope.tab);
                }
            });
        };
        $scope.saveTab = function (tab) {
            $scope.editing = false;
            var t = new Tab(tab);
            t.$update({
                id: tab.id,
                account: $scope.currentAccount
            });
        };
        $scope.editTab = function (tab) {
            angular.forEach($scope.accountContentProviders, function (acp) {
                if (acp.id == tab.accountContentProvider.id) {
                    tab.accountContentProvider = acp;
                    return;
                }
            });
        };
        $scope.deleteTab = function (tab) {
            if (confirm("Are you sure you want to delete the tab?")) {
                $http({
                    method: 'DELETE',
                    url: PathService.getContentTabUrl(tab.id)
                }).
                success(function (res, status) {
                    for (var i = 0; i < $scope.tabs.data.length; i++) {
                        if ($scope.tabs.data[i].id == tab.id) {
                            $scope.tabs.data.splice(i, 1);
                        }
                    }
                });
            }
        };
    },
]);