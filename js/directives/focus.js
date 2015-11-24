'use strict';

mindFrameApp.directive('focusMe', function() {
	  return {
	    link: function(scope, element, attrs) {
	    	element[0].focus();
	    }
	  };
});

mindFrameApp.directive('ngFocus', [
  function () {
    var FOCUS_CLASS = "ng-focused";
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$focused = false;
        element.bind('focus', function (evt) {
          element.addClass(FOCUS_CLASS);
        }).bind('blur', function (evt) {
          element.removeClass(FOCUS_CLASS);
        });
      }
    }
  }
]);

mindFrameApp.directive('ngFocusVerify', ['$http', '$timeout', 'akkadianPlatformApiBaseUrl',
  function ($http, $timeout, akkadianPlatformApiBaseUrl) {
    return {
      restrict: 'A',
      require: 'ngModel',
      controller: function ($scope, akkadianPlatformApiBaseUrl) {
        $scope.akkadianPlatformApiBaseUrl = akkadianPlatformApiBaseUrl;
        $scope.alreadyCheckedValue = null;
        $scope.validAlreadyCheckedValue = false;
        $scope.apiCheckUrl = null;
        $scope.setApiCheckUrl = function (url) {
          if (!url) {
            return false;
          }
          $scope.apiCheckUrl = url.replace(/'/g, '');
          return true;
        };
      },
      link: function ($scope, element, attrs, ctrl) {
        element.bind('focus', function (evt) {}).bind('blur', function (evt) {
          if (!$scope.setApiCheckUrl(attrs.apiCheckUrl)) {
            return;
          } else {
            var valueToCheck = $scope.$eval(attrs.ngModel);
            var originalValue = $scope.$eval(attrs.ngFocusVerifyDoNotCheck);
            if (valueToCheck === originalValue) {
              ctrl.$setValidity('unique', true);
              return;
            }
            if (valueToCheck) {
              if (valueToCheck !== $scope.alreadyCheckedValue) {
                element.removeClass('ng-pristine');
                element.addClass('ng-dirty');
                $scope.validAlreadyCheckedValue = false;
                $http({
                  method: 'GET',
                  url: $scope.akkadianPlatformApiBaseUrl + $scope.apiCheckUrl + valueToCheck
                }).success(function (data) {
                  if (data.data.available == false) {
                    ctrl.$setValidity('unique', false);
                  }
                  if (data.data.avaialbleUsername == false) {
                    ctrl.$setValidity('unique', false);
                  } else {
                    ctrl.$setValidity('unique', data.success);
                    $scope.validAlreadyCheckedValue = true;
                  }
                }).error(function (data) {
                  ctrl.$setValidity('unique', false);
                });
                $scope.safeApply(function () {
                  $scope.alreadyCheckedValue = valueToCheck;
                });
              } else {
                if (!$scope.validAlreadyCheckedValue) {
                  ctrl.$setValidity('unique', false);
                }
              }
            }
          }
        });
      }
    }
  }
]);
