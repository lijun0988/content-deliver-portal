'use strict';

mindFrameApp.directive('tagInput', [
    '$http',
    'PathService',
    '$compile',
    function ($http, PathService, $compile) {
        return {
            restrict: 'A',
            controller: function ($scope) {
                var self = this;

                this.validateNumber = function (number) {
                    return /(^[0-9\-\(\)\+]+)$/.test(number);
                }

                this.validateEmail = function (email) {
                    var re =
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                }

                // phone existence check methods
                this.checkInOfficePhones = function (phoneNumber) {
                    var isInArray = false;
                    for (var i = 0; i < $scope.person.accounts[0].phones.length; i++) {
                        isInArray = phoneNumber.toUpperCase() === $scope.person.accounts[0].phones[i].toUpperCase();
                        if (isInArray) {
                            break;
                        }
                    };
                    return isInArray;
                }

                this.checkInHomePhones = function (phoneNumber) {
                    var isInArray = false;
                    for (var i = 0; i < $scope.person.accounts[0].homePhones.length; i++) {
                        isInArray = phoneNumber.toUpperCase() === $scope.person.accounts[0].homePhones[i].toUpperCase();
                        if (isInArray) {
                            break;
                        }
                    };
                    return isInArray;
                }

                this.checkInMobilePhones = function (phoneNumber) {
                    var isInArray = false;
                    for (var i = 0; i < $scope.person.accounts[0].mobilePhones.length; i++) {
                        isInArray = phoneNumber.toUpperCase() === $scope.person.accounts[0].mobilePhones[i].toUpperCase();
                        if (isInArray) {
                            break;
                        }
                    };
                    return isInArray;
                }

                this.getOwner = function (typedPhone, phoneType) {
                    var typedPhoneNumber = typedPhone.replace(/[^0-9]/g, '');
                    $http({
                        method: 'GET',
                        url: PathService.getPersonSearchUrl(),
                        params: {query:typedPhoneNumber, includeDisabled:'true'}
                    }).success(function (data, status, headers, cfg) {
                        $scope.owners = self.searchInOwners(data.data, typedPhone);
                        if ($scope.owners.length > 0) {
                            self.showPhoneReassignDialog($scope.owners);
                        }
                    }).error(function (data, status, headers, cfg) {
                        return null;
                    });
                }

                this.searchInOwners = function (possibleOwners, typedPhone) {
                    var exactPhoneNumberOwners = [];
                    if (possibleOwners) {
                        possibleOwnersLoop: for (var i = 0; i < possibleOwners.length; i++) {
                            //bypass loop if iteration matches edited user
                            if (!($scope.person.id == possibleOwners[i].id)) {
                                for (var j = 0; j < possibleOwners[i].accounts[0].phones.length; j++) {
                                    if (possibleOwners[i].accounts[0].phones[j] === typedPhone) {
                                        exactPhoneNumberOwners.push(possibleOwners[i]);
                                        continue possibleOwnersLoop;
                                    }
                                }

                                for (var j = 0; j < possibleOwners[i].accounts[0].homePhones.length; j++) {
                                    if (possibleOwners[i].accounts[0].homePhones[j] === typedPhone) {
                                        exactPhoneNumberOwners.push(possibleOwners[i]);
                                        continue possibleOwnersLoop;
                                    }
                                }

                                for (var j = 0; j < possibleOwners[i].accounts[0].mobilePhones.length; j++) {
                                    if (possibleOwners[i].accounts[0].mobilePhones[j] === typedPhone) {
                                        exactPhoneNumberOwners.push(possibleOwners[i]);
                                        continue possibleOwnersLoop;
                                    }
                                }
                            }
                        }
                    }
                    return exactPhoneNumberOwners;
                }
                // end phone existence check methods
            },

            link: function (scope, element, attrs, ctrl) {
                var inputWidth = 20;
                // Watch for changes in text field
                scope.$watch(attrs.ngModel, function (value) {
                    if (value != undefined) {
                        var tempEl = $('<span>' + value + '</span>').appendTo('body');
                        inputWidth = tempEl.width() + 5;
                        tempEl.remove();
                    }
                });

                ctrl.showPhoneReassignDialog = function (owners) {
                    element.hide();
                    var dialogTemplate =
                        "<ng-phone-reassign-dialog current-phone-owners=\"owners\" intended-phone-owner=\"person\" current-account='" +
                        scope.currentAccount + "' entered-phone='" + scope.enteredPhone + "' entered-phone-type='" +
                        scope.phoneType + "'></ng-phone-reassign-dialog>";
                    $compile(dialogTemplate)(scope, function (dialogTemplate, scope) {
                        dialogTemplate.insertAfter(element.parent());
                    });
                }

                element.on('keydown', function (event) {
                    scope.personDontExist = false;
                    if (event.target.value.length == 0) {
                        return;
                    }
                    if (event.which == 9 || event.which == 13) {
                        event.preventDefault();
                    }
                });

                element.on('keyup', function (event) {
                    var tagValue = event.target.value;
                    var validTag = false;
                    if (event.which == 8) {
                        scope.$apply(attrs.deleteTag);
                    }
                    if (event.which == 9 || event.which == 13) {
                        event.preventDefault();
                        if (attrs.tagInput == "phone") {
                            if (ctrl.validateNumber(tagValue)) {
                                validTag = true;
                                scope.enteredPhone = tagValue;
                                scope.phoneType = (attrs.phoneType) ? attrs.phoneType : "office";

                                var phoneAlreadyAdded = false;
                                if (scope.phoneType == "office" && ctrl.checkInOfficePhones(tagValue)) {
                                    phoneAlreadyAdded = true;
                                } else if (scope.phoneType == "home" && ctrl.checkInHomePhones(tagValue)) {
                                    phoneAlreadyAdded = true;
                                } else if (scope.phoneType == "mobile" && ctrl.checkInMobilePhones(tagValue)) {
                                    phoneAlreadyAdded = true;
                                }
                                if (!phoneAlreadyAdded) {
                                    ctrl.getOwner(scope.enteredPhone, scope.phoneType);
                                }
                            }
                        } else if (attrs.tagInput == "email") {
                            if (ctrl.validateEmail(tagValue)) {
                                validTag = true;
                            }
                        } else {
                            validTag = true;
                        }

                        if (validTag) {
                            scope.$apply(attrs.newTag);
                        }
                    }
                });
            }
        }
    }
]);

mindFrameApp.directive('mfDynamicPhoneEmailInput', [
  '$http',
  'PathService',
  'SearchService',
  '$compile',
  function ($http, PathService, SearchService, $compile) {
    return {
      restrict: 'A',
      require: ['?ngModel', 'mfDynamicPhoneEmailInput'],
      controller: function ($scope, $attrs) {
        var self = this;
        self.list = $scope.$eval($attrs.pointingArray);
        self.fieldType = $attrs.mfDynamicPhoneEmailInput;
        self.phoneType = $attrs.phoneType;

        self.validateNumber = function (number) {
          var regExp = /(^[0-9\-\(\)\+]+)$/;
          return regExp.test(number);
        };
        self.validateEmail = function (email) {

          var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regExp.test(email);
        };
        self.lookForDuplicates = function (itemIndex) {
          var duplicated = false;
          for (var i = 0; i < self.list.length; i++) {
            if ((itemIndex !== i) && (self.list[itemIndex] === self.list[i])) {
              duplicated = true;
              break;
            }
          };
          return duplicated;
        };
        self.lookForPhoneAssigned = function (itemIndex) {
          var type = $scope.$eval($attrs.mfDynamicPhoneEmailInput);
          var item = (type === 'email') ? self.list[itemIndex] : encodeURIComponent(self.list[itemIndex]);
          var paramsObject = {phone:item};
          var searchPromise;
          if (item && item !== "") {
            $scope.$apply(function () {
              searchPromise = SearchService.searchAlreadyAssignedPhone(paramsObject);
            });
          }
          return searchPromise;
        };

          self.lookForEmailAssigned = function (itemIndex) {
              var type = $scope.$eval($attrs.mfDynamicPhoneEmailInput);
              var item = self.list[itemIndex];
              var paramsObject = {email:item};
              var searchPromise;
              if (item && item !== "") {
                  $scope.$apply(function () {
                      searchPromise = SearchService.searchAlreadyAssignedEmail(paramsObject);
                  });
              }
              return searchPromise;
          };

        self.searchInOwners = function (possibleOwners, item) {
          var actualOwners = [];
          if (possibleOwners) {
            possibleOwnersLoop: for (var i = 0; i < possibleOwners.length; i++) {
              if ($scope.person.id!= null && !($scope.person.id == possibleOwners[i].id)) {
                for (var j = 0; j < possibleOwners[i].accounts[0].phones.length; j++) {
                  if (possibleOwners[i].accounts[0].phones[j] === item) {
                    actualOwners.push(possibleOwners[i]);
                    continue possibleOwnersLoop;
                  }
                }
                for (var j = 0; j < possibleOwners[i].accounts[0].homePhones.length; j++) {
                  if (possibleOwners[i].accounts[0].homePhones[j] === item) {
                    actualOwners.push(possibleOwners[i]);
                    continue possibleOwnersLoop;
                  }
                }
                for (var j = 0; j < possibleOwners[i].accounts[0].mobilePhones.length; j++) {
                  if (possibleOwners[i].accounts[0].mobilePhones[j] === item) {
                    actualOwners.push(possibleOwners[i]);
                    continue possibleOwnersLoop;
                  }
                }
              }
            }
          }
          return actualOwners;
        };

        self.addItem = function (itemIndex, fieldValue) {
          $scope.$apply(function () {
            self.list[$scope.$index] = fieldValue;
          });
        };
        self.removeItem = function (itemIndex) {
          $scope.$apply(function () {
            self.list.splice(itemIndex, 1);
          });
        };
        self.addExtraItem = function (itemIndex) {
          if (self.list[itemIndex+1] || self.list[itemIndex+1] != "") {
            $scope.$apply(function () {
              self.list.push("");
            });
          }
        };
      },
      link: function ($scope, element, attrs, controllers) {
        var validateNumber = function (number) {
          var regExp = /(^[0-9\-\(\)\+]+)$/;
          return regExp.test(number);
        };
        element.on('keyup', function (event) {

            // get keycode of current keypress event
            var code = (event.keyCode || event.which);
            if(code == 37 || code == 38 || code == 39 || code == 40) {
                return;
            }
          var fieldValue = element.val();
          var validValue = false;
          var newFieldAdded = false;

          if (fieldValue == "") {
            controllers[0].$setValidity('', true);
            if (!$scope.$last) {
              controllers[1].removeItem($scope.$index);
            }

          }
          if ((controllers[1].fieldType === "phone" && controllers[1].validateNumber(fieldValue)) ||
              (controllers[1].fieldType === "email" && controllers[1].validateEmail(fieldValue))) {

            controllers[1].addItem($scope.$index, fieldValue);

            if ($scope.$last && fieldValue !== "") {
              controllers[1].addExtraItem($scope.$index);
            }
          }
          var selectionStart = element.get(0).selectionStart;
          var selectionEnd = element.get(0).selectionEnd;
          element.val(fieldValue);
          element.get(0).selectionStart = selectionStart;
          element.get(0).selectionEnd = selectionEnd;
        });

        element.on('blur', function (event) {
          var isDuplicated = controllers[1].lookForDuplicates($scope.$index)
          if(!isDuplicated && validateNumber($(this).val())){
            controllers[0].$setValidity('', !isDuplicated);
          }
          if (!isDuplicated && controllers[1].fieldType === "phone") {
            var searchPromise = controllers[1].lookForPhoneAssigned($scope.$index);
            if (searchPromise) {
              searchPromise.then(function (response) {
                var owners = response.data.owners;
                if (response.data.data.availablePhone !== true) {
                  showPhoneReassignDialog(owners);
                }
              });
            }
          }
            if (!isDuplicated && controllers[1].fieldType === "email") {
                var searchPromise = controllers[1].lookForEmailAssigned($scope.$index);
                if (searchPromise) {
                    searchPromise.then(function (response) {
                        var owners = response.data.owners;
                        if (response.data.data.availablePhone !== true) {
                            showPhoneReassignDialog(owners);
                        }
                    });
                }
            }
        });

        function showPhoneReassignDialog (owners) {
          $scope.owners = owners;
          var type = "email";
          var dialogTemplate =
            "<ng-phone-reassign-dialog current-phone-owners=\"owners\" intended-phone-owner=\"person\" entered-phone='" +
            controllers[1].list[$scope.$index] + "' entered-phone-type='" + controllers[1].phoneType + "'></ng-phone-reassign-dialog>";
          $compile(dialogTemplate)($scope, function (dialogTemplate, $scope) {
            dialogTemplate.insertAfter(element.parent());
          });
        };
      }
    }
  }
]);


mindFrameApp.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
