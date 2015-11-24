'use strict';

mindFrameApp.directive('ngPhoneReassignDialog', [
  function () {
    return {
      restrict: 'EA',
      scope: {
        enteredPhone: '@',
        enteredPhoneType: '@',
        currentPhoneOwners: '=',
        intendedPhoneOwner: '=',
      },
      templateUrl: 'templates/dialogs/phone_reassign_dialog.html',
      replace: true,
      controller: function ($scope) {
        var self = this;
        self.init = function () {
          $scope.hideMain = false;
          $scope.currentOwner = $scope.currentPhoneOwners[0];
        };
        self.deleteOfficePhone = function (phone) {
          for (var i = 0; i < $scope.intendedPhoneOwner.accounts[0].phones.length; i++) {
            if ($scope.intendedPhoneOwner.accounts[0].phones[i] == phone) {
              $scope.intendedPhoneOwner.accounts[0].phones.splice(i, 1);
            }
          }
        };
        self.deleteHomePhone = function (phone) {
          for (var i = 0; i < $scope.intendedPhoneOwner.accounts[0].homePhones.length; i++) {
            if ($scope.intendedPhoneOwner.accounts[0].homePhones[i] == phone) {
              $scope.intendedPhoneOwner.accounts[0].homePhones.splice(i, 1);
            }
          }
        };
        self.deleteMobilePhone = function (phone) {
          for (var i = 0; i < $scope.intendedPhoneOwner.accounts[0].mobilePhones.length; i++) {
            if ($scope.intendedPhoneOwner.accounts[0].mobilePhones[i] == phone) {
              $scope.intendedPhoneOwner.accounts[0].mobilePhones.splice(i, 1);
            }
          }
        };
        $scope.close = function (doReassign) {
          if (!doReassign) {
            if ($scope.enteredPhoneType == "office") {
              self.deleteOfficePhone($scope.enteredPhone);
            }
            if ($scope.enteredPhoneType == "home") {
              self.deleteHomePhone($scope.enteredPhone);
            }
            if ($scope.enteredPhoneType == "mobile") {
              self.deleteMobilePhone($scope.enteredPhone);
            }
          }
          self.removeDialog();
        }
        self.init();
      },
      link: function (scope, element, attrs, ctrl) {
        ctrl.removeDialog = function () {
          element.parent().find("[data-phone-type='" + scope.enteredPhoneType + "']").show();
          element.remove();
        }
        element.parent().find("[data-phone-number='" + scope.enteredPhone + "']").on('$destroy', function (
          event) {
          ctrl.removeDialog();
        });
      }
    };
  }
]);
