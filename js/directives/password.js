'use strict';

mindFrameApp.directive("passwordVerify", function () {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function (scope, element, attrs, ctrl) {
      scope.$watch(function () {
        var combined;
        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function (value) {
        if (value) {
          ctrl.$parsers.unshift(function (viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
    }
  };
});

mindFrameApp.directive('checkStrength', function () {
  return {
    replace: false,
    restrict: 'EACM',
    scope: {
      model: '=checkStrength'
    },
    link: function (scope, element, attrs) {
      var strength = {
        colors: ['#F00', '#F90', '#FF0', '#89e500', '#0F0'],
        mesureStrength: function (p) {
          var _force = 0;
          var _regex = /[$-/:-?{-~!"^_`\[\]]/g; //" (Commentaire juste là pour pas pourrir la coloration sous Sublime...)
          var _lowerLetters = /[a-z]+/.test(p);
          var _upperLetters = /[A-Z]+/.test(p);
          var _numbers = /[0-9]+/.test(p);
          var _symbols = _regex.test(p);
          var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
          var _passedMatches = $.grep(_flags, function (el) {
            return el === true;
          }).length;
            _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
            _force += _passedMatches * 10;
            // penality (short password)
            _force = (p.length <= 6) ? Math.min(_force, 10) : _force;
            // penality (poor variety of characters)
            _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
            _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
            _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;
            return _force;
          },
        getColor: function (s) {
          var idx = 0;
          var strengthClass = "";
          var strengthText = "";
          if (s <= 10) {
            idx = 0;
            strengthClass = "point weak";
            strengthText = "Weak"
          } else if (s <= 30) {
            idx = 1;
            strengthClass = "point so-so";
            strengthText = "Medium"
          } else {
            idx = 2;
            strengthClass = "point great";
            strengthText = "Strong"
          }
          return {
            idx: idx + 1,
            col: this.colors[idx],
            strengthClass: strengthClass,
            strengthText: strengthText
          };
        }
      };

    scope.$watch('model', function (newValue, oldValue) {
      if (!newValue || newValue === '') {
    	  element.children('li')
          .css({
            "display": "none"
          });
      } else {
        var c = strength.getColor(strength.mesureStrength(newValue));
        element.css({
          "display": "block"
        });
        element.children('li')
        .css({
          "display": "none"
        })
        .slice(0, c.idx).each(function (i) {
          $(this)
          .removeClass()
          .addClass(c.strengthClass)
          .css({
            "display": "inline-block"
          })
          .html('<span class="color"></span>');
        });
        /*element.children('li')
            .slice(c.idx - 1)
            .html('<span class="color text">' + c.strengthText + '</span>');*/
      }
    });
  },
  template: '<li class="point weak"><span class="color"></span></li><li class="point so-so"><span class="color"></span></li><li class="point great"><span class="color"></span></li>'
};
});

mindFrameApp.directive('pwCheck', [
  function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        //elem.add(firstPassword).on('blur', function () {
        elem.on('keypress', function () {
          if (elem.val() == '') {
            // ctrl.$setPristine('pwmatch', true);
            //ctrl.$setValidity('pwmatch', true);
          }
        });
        elem.on('blur', function () {
          scope.$apply(function () {
            var v = elem.val() === $(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }
]);
