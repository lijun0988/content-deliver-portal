'use strict';

mindFrameControllers.controller('contentPageToggleCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'AccountContentProvider',
    'AccountContentProviderAction',
    'authenticationService',
    function ($scope, $location, $routeParams, AccountContentProvider, AccountContentProviderAction, authenticationService) {
        $scope.authenticationService = authenticationService;
        $scope.viewList = true;

        $scope.tabs = [{
            type: 'all',
            heading: 'All',
            includeAll: true,
            selected: (!$routeParams.view || $routeParams.view == 'all')
        }, {
            type: 'contact',
            heading: 'Contact',
            counterpart: true,
            selected: ($routeParams.view && $routeParams.view == 'contact')
        }, {
            type: 'user',
            heading: 'User',
            counterpart: false,
            selected: ($routeParams.view && $routeParams.view == 'user')
        }];

        $scope.providers = AccountContentProvider.get({
            id: 'all',
            account: $scope.currentAccount
        });

        $scope.toggleView = function (id) {
            $scope.viewList = !$scope.viewList;
            if (!$scope.viewList) {
                var idp = id;
                $scope.formAction = false;
                $scope.provider = {};
                if (idp != 0) {
                    $scope.showTitle = true;
                    $scope.provider = AccountContentProvider.get({
                        account: $scope.currentAccount,
                        id: idp
                    }, function (res) {
                        if (!res.tags) {
                            res.tags = [];
                        }
                        $scope.actions = AccountContentProviderAction.get({
                            account: $scope.currentAccount,
                            id: 'all',
                            contentId: idp
                        });
                    });
                }
            }
        };
        $scope.addFormAction = function () {
            $scope.add = true;
            $scope.action = new AccountContentProviderAction();
            $scope.action.tags = [];
            $scope.action.type = "DO";
        };
        $scope.saveContent = function () {
            var provider = new AccountContentProvider($scope.provider);
            if (provider.id) {
                provider.$update({
                    account: $scope.currentAccount,
                    id: provider.id
                }, function (data) {
                    $scope.successMessage = "Provider updated OK";
                    for (var i = 0; i < $scope.providers.data.length; i++) {
                        if ($scope.providers.data[i].id == data.data.id) {
                            $scope.providers.data[i] = data.data;
                        }
                    }
                    $scope.toggleView();
                }, function (e) {
                    $scope.errorMessage = e.data.message;
                });
            } else {
                provider.$create({
                    account: $scope.currentAccount,
                    id: 'all'
                }, function (data) {
                    $scope.successMessage = "Provider created OK";
                    $scope.providers.data.push(data.data);
                    $scope.provider = new AccountContentProvider(data.data);
                }, function (e) {
                    $scope.errorMessage = e.data.message;
                });
            }
        };

        $scope.saveAction = function (idx) {
            var action = {};
            if (idx != undefined) {
                action = $scope.actions.data[idx];
            } else {
                action = $scope.action;
                if (!$scope.actions || !$scope.actions.data) {
                    $scope.actions = {
                        data: []
                    };
                }
                $scope.actions.data.push(action);
                $scope.add = false;
            }
            action.index = parseInt(action.index);
            var act = new AccountContentProviderAction(action);
            if (act.id) {
                act.$update({
                    account: $scope.currentAccount,
                    id: act.id,
                    contentId: $scope.provider.id
                });
            } else {
                act.$create({
                    account: $scope.currentAccount,
                    id: "all",
                    contentId: $scope.provider.id
                }, function (res) {
                    if (res.success) {
                        action.id = res.data.id;
                    }
                });
            }
        };
        $scope.cancelAddAction = function () {
            $scope.add = false;
        };
    }
]);

mindFrameControllers.controller('contentListCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'PathService',
    'AccountContentProvider',
    'ngMessages',
    function ($scope, $http, $location, $routeParams, PathService, AccountContentProvider, ngMessages) {
        $scope.showRightPanel = false;
        $scope.contentTags = [];
        $scope.selectedProvider = null;
        $http({
            method: 'GET',
            url: PathService.getContentGroupsUrl()
        }).
        success(function (res, status) {
            if (!res.data) {
                $scope.availableGroups = [];
            } else {
                $scope.availableGroups = res.data;
            }
        });

        $scope.changeTab = function (view) {
            $location.search('view', view);
            $scope.showRightPanel = false;
            $scope.selectedProvider=null;
             /*$('.contentListContainer').find('div.contentRightPanel').addClass('hidden');*/
            $('.contentListContainer').find('div.contentRightPanel').removeClass('blue-border');
        };

        $scope.filterProvs = function(provs, tab){

        	var result = [];
            angular.forEach(provs, function(value, key) {
                if (((value.enabled || $scope.includeDisabled)&&(tab.includeAll||value.counterpart==tab.counterpart))) {
                	result.push(value);
                }
            });
            return result;

        };

        $scope.addGroup = function () {
            $scope.clearPersonAndGroupInputErrors();

            if (!this.groupText || this.groupText.length == 0) {
                return;
            }
            if (!$scope.selectedContent.groups) {
                $scope.selectedContent.groups = [];
            }
            var isInArray = false;
            for (var i = 0; i < $scope.selectedContent.groups.length; i++) {
                isInArray = this.groupText.toUpperCase() === $scope.selectedContent.groups[i].toUpperCase();
                if (isInArray) {
                    $scope.errorAddingGroup = "Group already added";
                    break;
                }
            };

            if ($scope.availableGroups.indexOf(this.groupText) != -1) {
                if (!isInArray) {
                    $scope.selectedContent.groups.push(this.groupText);
                }
            } else {
                $scope.invalidGroup = true;
            }

            this.groupText = '';
            analytics.trackTag('assign_groupadd');
        };

        $scope.deleteGroup = function (idx) {
            $scope.clearPersonAndGroupInputErrors();
            $scope.selectedContent.groups.splice(idx, 1);
            analytics.trackTag('assign_groupdelete');
        };

        $scope.addPerson = function () {
            $scope.clearPersonAndGroupInputErrors();
            if (!$scope.selectedPerson || $scope.selectedPerson.length == 0) {
                return;
            }
            if (!$scope.selectedContent.persons) {
                $scope.selectedContent.persons = [];
            }
            var isInArray = false;
            for (var i = 0; i < $scope.selectedContent.persons.length; i++) {
                isInArray = $scope.selectedPerson.id === $scope.selectedContent.persons[i].id;
                if (isInArray) {
                    $scope.errorAddingPerson = "Person already added";
                    break;
                }
            };
            if (!isInArray) {
                if ($scope.selectedPerson.id) {
                    $scope.selectedContent.persons.push($scope.selectedPerson);
                    $scope.openPersonTraitsPanel($scope.selectedPerson);
                } else {
                    $scope.personDontExist = true;
                }
            }

            $scope.selectedPerson = null;
            analytics.trackTag('assign_personadd');
        };

        $scope.deletePerson = function (idx) {
            if ($scope.personUnderTraitsEdition && $scope.showTraitsPanel && ($scope.personUnderTraitsEdition.id ==
                $scope.selectedContent.persons[idx].id)) {
                $scope.closePersonTraitsPanel();
            }
            $scope.selectedContent.persons.splice(idx, 1);
            $scope.clearPersonAndGroupInputErrors();
            analytics.trackTag('assign_persondelete');
        };

        $scope.clearPersonAndGroupInputErrors = function () {
          if ($scope.personDontExist) {
            $scope.personDontExist = false;
          }

          if ($scope.errorAddingPerson) {
            $scope.errorAddingPerson = null;
          }

          if ($scope.invalidGroup) {
            $scope.invalidGroup = false;
          }

          if ($scope.errorAddingGroup) {
            $scope.errorAddingGroup = null;
          }
        };

        $scope.persons = function (personName) {
            return $http({
                method: 'GET',
                url:PathService.getPersonSearchUrl(),
                params:{query:personName}
            }).then(function (response) {
                var foundPersons = response.data.data;
                angular.forEach(foundPersons, function (p, key) {
                    p.fullName = "";
                    if (p.firstName) {
                        p.fullName += p.firstName;
                    }
                    if (p.lastName) {
                        p.fullName += " " + p.lastName
                    }
                });
                return foundPersons;
            });
        };

        $scope.assign = function () {
            $http({
                method: 'POST',
                url: PathService.getContentAssignUrl($scope.selectedContent.accountContent.id),
                data: $scope.selectedContent
            }).
            success(function (res, status) {
                ngMessages.show('Success: Content was assigned successfully!', 'success', true);
            });
        };

        $scope.loadProviderElements = function (evt, provider) {
            $scope.closePersonTraitsPanel();
            $scope.clearPersonAndGroupInputErrors();
            $scope.selectedProvider = provider;
            var newId = provider.id;

            $http({
                method: 'GET',
                url:PathService.getContentAssignUrl(provider.id)
            }).then(function (response) {
                $scope.selectedContent = response.data.data;
                return response.data.data;
            });

            $scope.showRightPanel = true;
            $('.contentListContainer').find('div.contentRightPanel').addClass('blue-border');
            if ($('div.contentRightPanel').hasClass('hidden')) {
                $('.contentListContainer').find('div.contentRightPanel').removeClass('hidden');

            }

        };



        $scope.openPersonTraitsPanel = function (person) {
            $scope.showTraitsPanel = true;
            if (person) {
                $scope.personUnderTraitsEdition = jQuery.extend(true, {}, person);
            }
        };

        $scope.closePersonTraitsPanel = function () {
            $scope.showTraitsPanel = false;
            $scope.personUnderTraitsEdition = null;
        }

        $scope.saveAndCloseTraitsPanel = function (person) {
            for (var i = 0; i < $scope.selectedContent.persons.length; i++) {
                if (person.id === $scope.selectedContent.persons[i].id) {
                    $scope.selectedContent.persons[i] = person;
                    break;
                }
            };
            $scope.closePersonTraitsPanel();
        }

        $scope.temporaryUpdatePersonTraits = function (evt, trait) {
            var checked = evt.target.checked;
            if (!$scope.personUnderTraitsEdition.traits) {
                $scope.personUnderTraitsEdition.traits = [];
            }
            var idx = $scope.personUnderTraitsEdition.traits.indexOf(trait);
            if (checked) {
                if (idx === -1) {
                    $scope.personUnderTraitsEdition.traits.push(trait);
                }
            } else if (idx > -1) {
                $scope.personUnderTraitsEdition.traits.splice(idx, 1);
            }

            //$scope.saveAndCloseTraitsPanel($scope.personUnderTraitsEdition);
        };

        $scope.clearFilterListProviders = function(){
            $scope.providerQueryFilter = '';
        };

    }
]);
