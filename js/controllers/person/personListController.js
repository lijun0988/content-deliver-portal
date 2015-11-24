'use strict';

mindFrameControllers.controller('personPageToggleCtrl', [
    '$scope',
    '$http',
    'PathService',
    'Person',
    '$dialogs',
    'ngMessages',
    '$modal',
    '$timeout',
    'AccountContentProvider',
    'authenticationService',
    'AUTH_ROLES',
    'AUTH_SOURCES',
    '$location',
    '$routeParams',
    'VALIDATION_MESSAGES',
    function ($scope, $http, PathService, Person, $dialogs, ngMessages, $modal, $timeout,
        AccountContentProvider, authenticationService, AUTH_ROLES, AUTH_SOURCES, $location, $routeParams,
        VALIDATION_MESSAGES) {

        $scope.viewList = true;
        $scope.editPerson = false;
        $scope.includeDisabled = false;
        $scope.activeMenu = 'mindframe';
        $scope.limit = 10;
        $scope.offset = 0;
        $scope.currentListPage = 1;
        $scope.$routeParams = $routeParams;
        $scope.VALIDATION_MESSAGES = VALIDATION_MESSAGES;

        $scope.buttonSave = {inactive: false, message:"Save User"};

        $scope.showEnabled = function(){
            $scope.selectPage($scope.currentListPage);
        };

        $scope.elements = {
          createUserForm: $('form#createUserForm'),
          username: $('input#username'),
          selectedEmail: $('textarea#selectedEmail'),
          password: $('input#password'),
          password2: $('input#password2')
        };

        $scope.persons = Person.query({
            account: $scope.currentAccount,
            id: 'all',
            offset: $scope.offset,
            max: $scope.limit
        });
        $scope.userInfo = {
            hasUser: false,
            enabled: false,
            userId: ''
        }

        $scope.authenticationSources = [
            AUTH_SOURCES.LOCAL,
            AUTH_SOURCES.LDAP,
            AUTH_SOURCES.ACTIVE_DIRECTORY
        ];

        $http({
            method:'GET',
            url:PathService.getAccountAuthenticationSourceUrl()
        }).success(function(response) {
            if(response.data){
                $scope.accountAuthenticationSource = response.data;
            }else{
                $scope.accountAuthenticationSource = {authenticationSource:"LOCAL"};
            }
        });

        $http({
            method: 'GET',
            url: PathService.getContentAccountEnabledUrl()
        }).success(function(res, status) {
            if (!res.data) {
                $scope.aac = [];
            } else {
                $scope.aac = res.data;
            }
        });

        $('input[autofocus]:visible:first').focus();


        $scope.availableGroups = [];

        $http({
                method: 'GET',
                url: PathService.getContentGroupsUrl()
            }).success(function(res, status) {
                if (!res.data) {
                    $scope.availableGroups = [];
                } else {
                    $scope.availableGroups = res.data;
                }
            });



        if (authenticationService.hasRole(AUTH_ROLES.ROLE_SUPERUSER.id)) {
            $scope.availableRoles = [
                AUTH_ROLES.ROLE_SUPERUSER,
                AUTH_ROLES.ROLE_ADMIN,
                AUTH_ROLES.ROLE_CONTENT_MANAGER,
                AUTH_ROLES.ROLE_USER
            ];
        } else if (authenticationService.hasRoleInAccount(AUTH_ROLES.ROLE_ADMIN.id)) {
            $scope.availableRoles = [
                AUTH_ROLES.ROLE_ADMIN,
                AUTH_ROLES.ROLE_CONTENT_MANAGER,
                AUTH_ROLES.ROLE_USER
            ];
        } else {
            $scope.availableRoles = [
            ];
        }

        $scope.roles = {
          ROLE_USER: 'User',
          ROLE_ADMIN: 'Client Admin',
          ROLE_CONTENT_MANAGER: 'Content Manager',
          ROLE_SUPERUSER: 'Akkadian Admin'
        };

        $scope.getRole = function (role) {
          if (!authenticationService.hasRole(AUTH_ROLES.ROLE_SUPERUSER.id)) {
            if ($scope.roles[role] == "Client Admin") {
              return "Admin";
            }
          }
          return $scope.roles[role];
        };

        $scope.selectPage = function (page) {
            if(!$scope.searchTerm){
                $scope.persons = Person.query({
                    account: $scope.currentAccount,
                    id: 'all',
                    offset: ($scope.limit*parseInt(page-1)),
                    max: $scope.limit,
                    includeDisabled: $scope.includeDisabled
                });
            }else{
                $http({
                    method: 'GET',
                    url: PathService.getPersonSearchUrl(),
                    params : {query :$scope.searchTerm, includeDisabled : $scope.includeDisabled, max:$scope.limit, offset:($scope.limit*parseInt(page-1))}
                }).
                success(function(res, status) {
                    if (res.success) {
                        $scope.persons = res;
                    }
                });
            }
        }

        $scope.togglePersonEnabledState = function (person) {
          if (person.enabled) {
            $scope.disablePerson(person);
          } else {
            $scope.enablePerson(person);
          }
        };

        $scope.disablePerson = function (person) {
            analytics.trackTag('user_disableiconclick');
            var dlg = $dialogs.confirm($scope.messages.confirmHeader,$scope.messages.confirmDisable.replace("___PERSON_NAME___", person.firstName + " " + person.lastName));
            dlg.result.then(function() {
                    $http({
                        method:'POST',
                        url:PathService.getPersonDisableUrl(),
                        params:{id:person.id}
                    }).success(function(response) {
                        person.enabled=false;
                        ngMessages.show($scope.messages.personDisabled, 'disabled', true);
                        $scope.selectPage($scope.currentListPage);
                    });
                },function(){}
            );
        };

        $scope.enablePerson = function (person) {
            analytics.trackTag('user_enableiconclick');
            var dlg = $dialogs.confirm($scope.messages.confirmHeader,$scope.messages.confirmEnable);
            dlg.result.then(function() {
                    $http({
                        method:'POST',
                        url:PathService.getPersonEnableUrl(),
                        params:{id:person.id}
                    }).success(function(response) {
                        person.enabled=true;
                         ngMessages.show($scope.messages.personEnabled, 'enabled', true);
                         $scope.selectPage($scope.currentListPage);
                    });
                },function(){}
            );
        };

        $scope.search = function() {
            analytics.trackTag('user_searchclick');
            if ($scope.query != undefined && $scope.query.length > 0) {
                $scope.searchTerm = $scope.query;
                $http({
                    method: 'GET',
                    url: PathService.getPersonSearchUrl(),
                    params: {query :$scope.searchTerm, includeDisabled : $scope.includeDisabled}
                }).
                success(function(res, status) {
                    if (res.success) {
                        $scope.persons = res;
                        $scope.currentListPage = 1;
                    }
                });
            } else {
                $scope.searchTerm = null;
                $scope.persons = Person.query({
                    account: $scope.currentAccount,
                    id: 'all',
                    offset: $scope.offset,
                    max: $scope.limit,
                    includeDisabled: $scope.includeDisabled
                }, function () {
                    $scope.currentListPage = 1;
                });
            }
        };

        $scope.openEditPerson = function(personId) {
          $location.search('action','edit');
          $scope.editPerson = true;
          $scope.toggleView();
          $scope.buttonSave = {inactive: false, message:"Save"};
          $scope.hasPhoneNumbers = true;
          $scope.hasEmails = true;
          $scope.usernameIsNotAvailable = false;
          $scope.person = Person.get({
            id: personId,
            account: $scope.currentAccount
          }, function(response){
            if(!response.authenticationSource){
              $scope.person.authenticationSource = "LOCAL";
            }

            $scope.userInfo.enabled = $scope.person.accountUserEnabled;
            $scope.toggleUserInfo(true);

            if(!$scope.person.accounts||$scope.person.accounts.length == 0){
              $scope.person.accounts = [{
                emails: [],
                phones: [],
                mobilePhones:[],
                homePhones:[],
                priority: 0,
                type: $scope.currentAccount
              }];
            }
            if ($scope.person.accounts[0].phones && $scope.person.accounts[0].phones.length > 0) {
              $scope.person.accounts[0].phones.push("");
            } else {
              $scope.person.accounts[0].phones = [""];
            }

            if ($scope.person.accounts[0].mobilePhones && $scope.person.accounts[0].mobilePhones.length > 0) {
              $scope.person.accounts[0].mobilePhones.push("");
            } else {
              $scope.person.accounts[0].mobilePhones = [""];
            }

            if ($scope.person.accounts[0].homePhones && $scope.person.accounts[0].homePhones.length > 0) {
              $scope.person.accounts[0].homePhones.push("");
            } else {
              $scope.person.accounts[0].homePhones = [""];
            }

            if ($scope.person.accounts[0].emails && $scope.person.accounts[0].emails.length > 0) {
              $scope.person.accounts[0].emails.push("");
            } else {
              $scope.person.accounts[0].emails = [""];
            }
          });
        };

        $scope.resetPassword = function(){
            $http({
                method:'POST',
                url:PathService.getAccountUserResetPasswordUrl($scope.person.accountUserId)
            }).success(function(response) {
                $scope.toggleView();
                ngMessages.show($scope.messages.personPasswordReset, 'enabled', true);
            });
        };

        // ----------------------------------
        // Toggle states
        // ----------------------------------
        $scope.toggleView = function() {
          $scope.viewList = !$scope.viewList;
          if ($scope.viewList) {
            $scope.selectPage($scope.currentListPage);
            $scope.clearPersonForm();
            $scope.selectedContent = null;
            $scope.person = null;
            $location.search('action',null);
          }
        };

        $scope.onCancel = function() {
            $location.search('action',null);
        }

        $scope.$on('$locationChangeStart', function (event, next, current) {

            if(next.indexOf('action=edit')===-1 && (current.indexOf('action=edit')!==-1 || (current.indexOf('action=save')!==-1))){
                $scope.toggleView();
            }


        });

        $scope.toggleUserInfo = function(init) {
            if(!init)
            {
                $scope.userInfo.enabled = !$scope.userInfo.enabled;
                $scope.person.accountUserEnabled = $scope.userInfo.enabled;
            }

           if($scope.userInfo.enabled){
            var firstEmail = $scope.person.accounts[0].emails[0];
            if(firstEmail && !$scope.person.username) {
                $scope.person.username = firstEmail;
                if ($scope.person.username) {
                    $('#username-create-person').blur();
                }
            }
            if($scope.person.authenticationSource=="LOCAL"){
                if($scope.createUserForm){
                    $scope.clearFormElementStatus( $scope.createUserForm.password );
                    $scope.clearFormElementStatus( $scope.createUserForm.password2 );
                }
            }
            }else{
                if($scope.createUserForm){
                    $scope.createUserForm.$valid = true;
                }
            } 
            
        };

        // ----------------------------------
        // Validation
        // ----------------------------------
        $scope.validateEmail = function(email) {
            var re =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.validatePhone = function(phoneNumber) {
            if(!phoneNumber) return;
            var phn = phoneNumber.split("+").join("");
            phn = phn.split("-").join("");
            phn = phn.split("(").join("");
            phn = phn.split(")").join("");
            if (jQuery.isNumeric(phn)) {
                return true;
            } else {
                return false;
            }
        };

        // ----------------------------------
        // Person modal
        // ----------------------------------
        $scope.savePerson = function() {
            $scope.buttonSave.message = 'Saving...';
            if ($scope.person.id) {
                $scope.person.$update({
                    account: $scope.currentAccount
                }, function(data) {
                	for (var i = 0; i < $scope.persons.data.length; i++) {
                        if ($scope.persons.data[i].id == data.data.id) {
                            $scope.persons.data[i] = data.data;
                        }
                    }
                    var fullName = data.data.firstName + ' ' + data.data.lastName;
                    ngMessages.show( $scope.messages.userUpdateSuccess.replace('__FULLNAME__', fullName), 'success', true );
                    //$scope.toggleView();
                    $scope.buttonSave.inactive = false;
                    $scope.clearPersonForm();
                    $location.search('action',null);
                }, function(e) {
                    ngMessages.show( $scope.messages.userUpdateError, 'error' );
                	 //$scope.toggleView();
                    $scope.buttonSave.inactive = false;
                    $scope.clearPersonForm();
                    $location.search('action',null);
                });
            } else {
                $scope.person.$create({
                    account: $scope.currentAccount
                }, function(data) {
                    var fullName = data.data.firstName + ' ' + data.data.lastName;
                    ngMessages.show( $scope.messages.userCreateSuccess.replace('__FULLNAME__', fullName), 'success', true );
              	    /*$scope.persons.data.push(data.data);*/
                    $scope.buttonSave.inactive = false;
                    $scope.clearPersonForm();
                    $location.search('action',null);
                }, function(e) {
                    ngMessages.show( $scope.messages.userCreateError, 'error' );
                	$scope.buttonSave.inactive = false;
                    $scope.clearPersonForm();
                    $location.search('action',null);
                });
            }
        };

        $scope.clearPersonForm = function(){
            $scope.createUserForm.$setPristine();
            $('#' + $scope.elements.username.data('status-indicator-id')).hide();
        };

        // Force to clear element status, when is not working $setPristine() for
        // specific element
        $scope.clearFormElementStatus = function(element){
            element.$setPristine();
            element.$valid = true;
            element.$invalid = false;
            element.$dirty = false;
            element.$setViewValue('');
            $('[name=' + element.$name + ']')
                .removeClass('ng-invalid error ng-dirty ng-invalid-unique ng-invalid-email')
                .val('')
                .next('.status-indicator').remove();
        };

        $scope.newPerson = function() {
            $location.search('action', 'new');
            analytics.trackTag('user_newuserclick');
            $scope.editPerson = false;
            $scope.userInfo.enabled = false;
            $scope.person = new Person();
            $scope.usernameIsNotAvailable = false;
            $scope.person.authenticationSource = "LOCAL";
            $scope.person.content = [];
            // hack to make phone&emails fields to be present on form
            $scope.person.accounts = [{
                emails: [""],
                phones: [""],
                mobilePhones:[""],
                homePhones:[""],
                priority: 0,
                type: $scope.currentAccount
            }];
            $scope.person.enabled = true;
            $scope.person.externalSourceId = 'LOCAL';
            $scope.buttonSave = {inactive: false, message:"Save"};
            $scope.hasPhoneNumbers = true;
            $scope.hasEmails = true;
            //$scope.toggleView();
            $scope.person.roles = ['ROLE_USER'];
        };

        $scope.sortableOptions = {
            update: function(e, ui) {
            },
            axis: 'y'
        };

        $scope.availableGroupsFilter = function(item, idx){
            return $scope.availableGroups.indexOf(item) != -1;
        };

        $scope.addGroup = function() {
            if ($scope.selectedGroup && $scope.selectedGroup.length == 0) {
                return;
            }
            if (!$scope.person.groups) {
                $scope.person.groups = []
            }
            var isInArray = false;
            for (var i = 0; i < $scope.person.groups.length; i++) {
                $scope.person.groups[i];
                isInArray = $scope.selectedGroup.toUpperCase() === $scope.person.groups[i].toUpperCase();
                if (isInArray) {
                    break;
                }
            };
            if (!isInArray) {
                if (jQuery.inArray($scope.selectedGroup, $scope.availableGroups) == -1) {
                    return;
                } else {
                    $scope.person.groups.push($scope.selectedGroup);
                }
            }
            $scope.selectedGroup = '';
        };

        $scope.deleteGroup = function(tag) {
            for (var i = 0; i < $scope.person.groups.length; i++) {
                if ($scope.person.groups[i] == tag) {
                    $scope.person.groups.splice(i, 1);
                }
            }
        };

        $scope.updatePersonTraits = function(evt, trait) {
            var checked = evt.target.checked;
            if(!$scope.person.traits) $scope.person.traits = [];
            // var rolesList = $scope.person.roles || $scope.checkedRoles;
            var idx = $scope.person.traits.indexOf(trait);
            if (checked) {
                // Add Trait
                if(idx === -1){ // check that is not already in the list.
                    $scope.person.traits.push(trait);
                }
            } else if(idx > -1){ // check that is in the list.
                // Remove Trait
                $scope.person.traits.splice(idx, 1);
            }
        };

        $scope.updatePersonGroup = function(evt, group) {
            var checked = evt.target.checked;
            if(!$scope.person.groups) $scope.person.groups = [];
            // var rolesList = $scope.person.roles || $scope.checkedRoles;
            var idx = $scope.person.groups.indexOf(group);
            if(checked){
                // Add Role
                if(idx === -1){ // check that is not already in the list.
                    $scope.person.groups.push(group);
                    $scope.checkAddContentByGroup(group);
                }
            }else if(idx > -1){ // check that is in the list.
                // Remove Role
                $scope.person.groups.splice(idx, 1);
                $scope.checkRemoveContentByGroup(group);
            }
        };

        $scope.checkAddContentByGroup = function(group){
            angular.forEach($scope.aac, function(cnt, key){
                if(cnt.assignment.groups.indexOf(group)!=-1){
                    var exists = false;
                    angular.forEach($scope.person.content, function(existingContent, key){
                        exists = exists || existingContent.id == cnt.id;
                    });
                    if(!exists){
                        $scope.person.content.push(cnt);
                    }

                }
            });
        };

        $scope.checkRemoveContentByGroup = function(group){
            angular.forEach($scope.aac, function(cnt, key){
                if(cnt.assignment.groups.indexOf(group)!=-1){
                    var shouldRemove = ($scope.person.id && cnt.assignment.persons.indexOf($scope.person.id)!=-1) || !$scope.person.id;
                    if(shouldRemove) {
                        var idx = $scope.person.content.indexOf(cnt);
                        if(idx!=-1){
                            $scope.person.content.splice(idx, 1);
                        }
                    }
                }
            });
        };

        $scope.hasContent = function(content){
            if($scope.person && $scope.person.content){
                var i=0, len=$scope.person.content.length;
                for (; i<len; i++) {
                  if ($scope.person.content[i].id == content.id) {
                    return true;
                  }
                }
            }
            return false;
        };

        $scope.updatePersonRoles = function(evt, roleId) {
            var checked = evt.target.checked;
            if(!$scope.person.roles) $scope.person.roles = [];
            // var rolesList = $scope.person.roles || $scope.checkedRoles;
            var idx = $scope.person.roles.indexOf(roleId);
            if(checked){
                // Add Role
                if(idx === -1){ // check that is not already in the list.
                    $scope.person.roles.push(roleId);
                }
            }else if(idx > -1){ // check that is in the list.
                // Remove Role
                $scope.person.roles.splice(idx, 1);
            }
        };

        $scope.selectContent = function(cnt){
            if($scope.selectedContent != cnt){
                $scope.selectedContent = cnt;
            }else{
                $scope.selectedContent = null;
            }

            if(!$scope.person.content) $scope.person.content = [];
            var idx = $scope.person.content.indexOf(cnt);
            if(idx === -1){
                $scope.person.content.push(cnt);
            }else if(idx > -1){ // check that is in the list.
                $scope.person.content.splice(idx, 1);
                $scope.selectedContent = null;
            }
        };

        $scope.viewContent = function (cnt) {
          if($scope.selectedContent != cnt){
            $scope.selectedContent = cnt;
          }else{
            $scope.selectedContent = null;
          }
        };

        $scope.promises = [];

        $scope.syncLdap = function(){
            analytics.trackTag('user_syncldapclick');
            var modalInstance = $modal.open({
                templateUrl : 'partials/admin/ldap_sync.html',
                windowClass : 'sync-ldap-modal',
                backdrop : 'static',
                controller : 'syncLdapController',
                resolve : {
                    accountAuthenticationSource : function() {
                        return $scope.accountAuthenticationSource;
                    },
                    promises : function() {
                        return $scope.promises;
                    }
                }
            });

            modalInstance.result.then(function() {
                angular.forEach($scope.promises, function(val, idx){
                     $timeout.cancel(val);
                });
            }, function() {
                angular.forEach($scope.promises, function(val, idx){
                     $timeout.cancel(val);
                });
            });
        };

        $scope.importCsv = function(){
            analytics.trackTag('user_importclick');
            var modalInstance = $modal.open({
                templateUrl : 'partials/admin/csv_import.html',
                windowClass: 'import-csv-modal',
                backdrop : 'static',
                controller : 'csvImportController',
                resolve : {
                    promises : function() {
                        return $scope.promises;
                    }
                }
            });

            modalInstance.result.then(function() {
                angular.forEach($scope.promises, function(val, idx){
                     $timeout.cancel(val);
                });
                //refresh groups
                $http({
                    method: 'GET',
                    url: PathService.getContentGroupsUrl()
                }).success(function(res, status) {
                    if (!res.data) {
                        $scope.availableGroups = [];
                    } else {
                        $scope.availableGroups = res.data;
                    }
                });

                // refresh user list after import
                $scope.offset = 0;
                $scope.persons = Person.query({
                    account: $scope.currentAccount,
                    id: 'all',
                    offset: $scope.offset,
                    max: $scope.limit
                });
            }, function() {
                angular.forEach($scope.promises, function(val, idx){
                     $timeout.cancel(val);
                });
                // refresh user list after import
                $scope.offset = 0;
                $scope.persons = Person.query({
                    account: $scope.currentAccount,
                    id: 'all',
                    offset: $scope.offset,
                    max: $scope.limit
                });
            });
        };

        $scope.cleanEmptyArrayElements = function (array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i] === "" || array[i] == null) {
              array.splice(1, i);
            }
          };
        };

        $scope.submit = function(){
            $scope.buttonSave.inactive = true;
            $scope.buttonSave.message = "Validating...";
            $scope.createUserForm.firstName.$dirty = true;
            $scope.createUserForm.lastName.$dirty = true;

            if($scope.userInfo.enabled){
                $scope.createUserForm.username.$dirty = true;
                if($scope.person.authenticationSource=="LOCAL"){
                    $scope.createUserForm.password.$dirty = true;
                    $scope.createUserForm.password2.$dirty = true;
                }
            }

            $scope.hasEmails = $scope.person.accounts[0].emails.filter(Boolean).length > 0;
            if ($scope.hasEmails) {
              $scope.person.accounts[0].emails = $scope.person.accounts[0].emails.filter(Boolean);
            }

            var hasOfficePhones = ($scope.person.accounts[0].phones && $scope.person.accounts[0].phones.filter(Boolean).length > 0);
            var hasHomePhones = ($scope.person.accounts[0].homePhones && $scope.person.accounts[0].homePhones.filter(Boolean).length > 0);
            var hasMobilePhones = ($scope.person.accounts[0].mobilePhones && $scope.person.accounts[0].mobilePhones.filter(Boolean).length > 0);

            $scope.hasPhoneNumbers = hasOfficePhones || hasMobilePhones || hasHomePhones;
            if (!$scope.hasPhoneNumbers) {
                if (!hasOfficePhones) {
                    $('#telephone-office-field-0').removeClass('ng-pristine ng-valid').addClass('ng-dirty ng-invalid');
                }
            } else {
              $scope.person.accounts[0].phones = $scope.person.accounts[0].phones.filter(Boolean);
              $scope.person.accounts[0].homePhones = $scope.person.accounts[0].homePhones.filter(Boolean);
              $scope.person.accounts[0].mobilePhones = $scope.person.accounts[0].mobilePhones.filter(Boolean);
            }

            var valid = $scope.createUserForm.$valid && $scope.hasEmails && $scope.hasPhoneNumbers;

            if(valid){
                var checkUniqueUsername = false;
                $scope.person.accountUserEnabled = $scope.userInfo.enabled
                if($scope.userInfo.enabled){
                     if(!$scope.person.id){
                         checkUniqueUsername = true;
                     }else{
                         checkUniqueUsername = false;
                     }
                 }

                if(checkUniqueUsername){
                    $scope.buttonSave.message = "Validating Username...";
                    $http({
                         method: 'GET',
                         url: PathService.getAccountUserCheckUsernameUrl(),
                         params: {username:$scope.person.username}
                       }).success(function(data, status, headers, cfg) {
                          if(data.data.avaialbleUsername == false){
                              // Show error message
                              createUserForm.username.$invalid = true;
                              $scope.usernameIsNotAvailable = true;
                              $scope.buttonSave.message = "Save";
                              $scope.buttonSave.inactive = false;
                          }else{
                              $scope.savePerson();
                          }

                       }).error(function(data, status, headers, cfg) {
                           createUserForm.username.$invalid =true;
                           $scope.buttonSave.message = "Save";
                           $scope.usernameIsNotAvailable = true;
                           $scope.buttonSave.inactive = false;
                       });
                }else{
                    $scope.savePerson();
                }
            }else{
                  $scope.buttonSave.message = "Save";
                  $scope.buttonSave.inactive = false;
                  return false;
            }

            return false;
        };


        if($routeParams.action == "new"){
        	$scope.newPerson();
        }else if($routeParams.action=='edit'){
        	$location.search("action", null);
        }

    }
]);
