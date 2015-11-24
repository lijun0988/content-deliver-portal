'use strict';

var cssClasses = {
  NG_VALID: 'ng-valid',
  NG_INVALID: 'ng-invalid',
  NG_INVALID_REQUIRED: 'ng-invalid-required'
}

mindFrameApp.directive('multiSelect',
    function ($q) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                selectedLabel: "@",
                availableLabel: "@",
                displayAttr: "@",
                available: "=",
                model: "=ngModel"
            },
            template: '<div class="multiSelect">' + '<div class="select">' +
                '<label class="control-label" for="multiSelectSelected">{{ selectedLabel }} ' +
                '({{ model.length }})</label>' +
                '<select id="currentRoles" ng-model="selected.current" multiple ' +
                'class="pull-left" ng-options="e as e[displayAttr] for e in model">' + '</select>' + '</div>' +
                '<div class="select buttons">' +
                '<button class="btn mover left" ng-click="add()" title="Add selected" ' +
                'ng-disabled="selected.available.length == 0">' + '<i class="icon-arrow-left"></i>' + '</button>' +
                '<button class="btn mover right" ng-click="remove()" title="Remove selected" ' +
                'ng-disabled="selected.current.length == 0">' + '<i class="icon-arrow-right"></i>' + '</button>' +
                '</div>' +
                '<div class="select">' +
                '<label class="control-label" for="multiSelectAvailable">{{ availableLabel }} ' +
                '({{ available.length }})</label>' +
                '<select id="multiSelectAvailable" ng-model="selected.available" multiple ' +
                'ng-options="e as e[displayAttr] for e in available"></select>' + '</div>' + '</div>',
            link: function (scope, elm, attrs) {
                scope.selected = {
                    available: [],
                    current: []
                };

                /*
                 * Handles cases where scope data hasn't been
                 * initialized yet
                 */
                var dataLoading = function (scopeAttr) {
                    var loading = $q.defer();
                    if (scope[scopeAttr]) {
                        loading.resolve(scope[scopeAttr]);
                    } else {
                        scope.$watch(scopeAttr, function (newValue,
                            oldValue) {
                            if (newValue !== undefined)
                                loading.resolve(newValue);
                        });
                    }
                    return loading.promise;
                };

                /*
                 * Filters out items in original that are also in
                 * toFilter. Compares by reference.
                 */
                var filterOut = function (original, toFilter) {
                    var filtered = [];
                    angular
                        .forEach(
                            original,
                            function (entity) {
                                var match = false;
                                for (var i = 0; i < toFilter.length; i++) {
                                    if (toFilter[i][attrs.displayAttr] == entity[attrs.displayAttr]) {
                                        match = true;
                                        break;
                                    }
                                }
                                if (!match) {
                                    filtered.push(entity);
                                }
                            });
                    return filtered;
                };

                scope.refreshAvailable = function () {
                    scope.available = filterOut(scope.available,
                        scope.model);
                    scope.selected.available = [];
                    scope.selected.current = [];
                };

                scope.add = function () {
                    scope.model = scope.model
                        .concat(scope.selected.available);
                    scope.refreshAvailable();
                };
                scope.remove = function () {
                    scope.available = scope.available
                        .concat(scope.selected.current);
                    scope.model = filterOut(scope.model,
                        scope.selected.current);
                    scope.refreshAvailable();
                };

                $q.all(
                    [dataLoading("model"),
                        dataLoading("available")
                    ]).then(
                    function (results) {
                        scope.refreshAvailable();
                    });
            }
        };
    });

// DIRECTIVE FOR CREATE ACCOUNT FORM//

mindFrameApp.directive('ngRepeatDone', function () {
    return function (scope, element, attrs) {
        if (scope.$last) { // all are rendered
            // execute callback passed in directive
            scope.$eval(attrs.ngRepeatDone);
            // Hide loader
            if (attrs.ngRepeatDoneLoaderId && attrs.ngRepeatDoneLoaderId !== '') {
                $('#' + attrs.ngRepeatDoneLoaderId).addClass('hide');
            }
            // Show target element
            if (attrs.ngRepeatDoneTargetId && attrs.ngRepeatDoneTargetId !== '') {
                var elementToShow = $('#' + attrs.ngRepeatDoneTargetId);
                if ( !! elementToShow.length) {
                    elementToShow
                        .css({
                            opacity: 0
                        })
                        .removeClass('hide')
                    setTimeout(function () {
                        elementToShow.css({
                            opacity: 1
                        })
                    }, 100);
                }
            }
        }
    }
});

mindFrameApp.directive('ngResetNav', [

    function () {
        return function (scope, element) {
            var eventType;
            if (element[0].nodeName.toLowerCase() === 'a') {
                eventType = 'click';
            } else if (element[0].nodeName.toLowerCase() === 'select') {
                eventType = 'change';
            }

            if (typeof eventType === "undefined") return;

            element.bind(eventType, function () {
                $('#navbar-admin-akkadian')
                    .find('.active').removeClass('active')
                    .end().find('.dropdown-menu').hide();
            })
        }
    }
]);

mindFrameApp.directive('ngRequiredMultiple', [

    function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                function countItems() {
                    return element.parent().find('> div').length;
                }

                function checkValidity() {
                    var elementsCount = countItems();
                    ctrl.$dirty = true;
                    var validity = true;
                    if (elementsCount === 0) validity = false;
                    ctrl.$setValidity('ngRequiredMultiple', validity);
                }

                element.off('blur.ngRequiredMultiple')
                    .on('blur.ngRequiredMultiple', function () {
                        checkValidity()
                    });
            }

        }
    }
]);

mindFrameApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

mindFrameApp.directive('ngRequiredToggle', [

    function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                element.off('blur.ngRequiredToggle')
                    .on('blur.ngRequiredToggle', function () {
                        var validity = true;
                        var enabled = scope.$eval(attrs.ngRequiredToggle);
                        if (enabled === true && element.val() == '') {
                            validity = false;
                        }
                        ctrl.$setValidity('ngRequiredToggle', validity);
                    });
            }
        }
    }
]);

mindFrameApp.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.$render = function () {
                elm.html(ctrl.$viewValue);
            };

            // load init value from DOM
            //ctrl.$setViewValue(elm.html());
        }
    };
});

mindFrameApp.directive('placeholder', function($timeout){
        var i = document.createElement('input');
        if ('placeholder' in i) {
            return {}
        }
        return {
            link: function(scope, elm, attrs){
                if (attrs.type === 'password') {
                    return;
                }

                if (elm.val() == '') {
                    elm.val(attrs.placeholder);
                    $(elm).addClass('ie9placeholder');
                }

                $timeout(function(){
                    elm.val(attrs.placeholder);
                    elm.bind('focus', function(){
                        if (elm.val() == attrs.placeholder) {
                            elm.val('');
                            $(this).removeClass('ie9placeholder');
                        }
                    }).bind('blur', function(){
                        if (elm.val() == '') {
                            elm.val(attrs.placeholder);
                            $(this).addClass('ie9placeholder');
                        }
                    });
                });
            }
        }
});

mindFrameApp.directive('userListSeparators', [
  function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs) {
        scope.$watch('person.data', function () {
          $('#userTable tr.first-name-initial').each(function (index, initialRow) {
            $(this).remove();
          });
          var numberOfColumns = element.children().length;
          /*if (scope.$first) {
            $('#userTable tr.first-name-initial').each(function (index, initialRow) {
              $(this).remove();
            });
          }*/
          if (scope.$last) {
            var currentInitial = "";
            $('#userTable tr.person-data').each(function (index, row) {
              var rowElement = angular.element(row);
              var modelAttr = rowElement.attr('ng-model');
              var rowElementModel = rowElement.scope()[modelAttr];
              var firstNameLetter = rowElementModel.firstName.charAt(0).toUpperCase();
              if (currentInitial != firstNameLetter) {
                currentInitial = firstNameLetter;
                $(this).before('<tr class="first-name-initial grey-bg"><td></td><td colspan="'+ numberOfColumns +'"><span class="text-center">'+ firstNameLetter +'</span></td></tr>');
              }
            });
          }
        });
      }
    }
  }
]);


mindFrameApp.directive('headerMenu',function(){
  return{
    restrict:'A',
    link:function(scope,element,attrs,ctrl){
          $(document).on('click', function(e){
            var mobileTopMenu = $('.admin-nav');
            var target = $(e.target);

            if (mobileTopMenu.is(':visible') && target.attr('id') != 'show-mobile-menu') {
                     $('#show-mobile-menu').removeClass('active');
                     $('.admin-nav').removeClass('shown');
                     $('.admin-nav').addClass('hiden');
                   }
          });

          $(element).on('click',function(e){
              var mobileTopMenu = $('.admin-nav');
            if (mobileTopMenu.is(':visible')) {
               $('#show-mobile-menu').removeClass('active');
               $('.admin-nav').removeClass('shown');
               $('.admin-nav').addClass('hidden');
            } else {
                $('#show-mobile-menu').addClass('active');
                $('.admin-nav').removeClass('hidden');
                $('.admin-nav').addClass('shown');
            }
            e.stopPropagation();

          });

    }
  }
});


//PIWIK DIRECTIVE


mindFrameApp.directive('googleTracker', function($rootScope){
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ctrl){
      $rootScope.$on('setGoogleTracker', function(){
          window._paq = window._paq || [];
          window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
          window._paq.push(["setCookieDomain", scope.fidelusDomainName]);
          window._paq.push(["setDomains", [scope.fidelusDomainName]]);
          window._paq.push(["trackPageView"]);
          window._paq.push(["enableLinkTracking"]);

          (function() {
            var u=(("https:" == document.location.protocol) ? "https" : "http") + "://" + scope.fidelusAnalyticServerUrl;
            window._paq.push(["setTrackerUrl", u+"piwik.php"]);
            window._paq.push(["setSiteId", scope.fidelusSiteCode]);
            var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
            g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
          })();
      });

    }
  }
})

mindFrameApp.directive('plainText', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ctrl){
      element.on('paste',function(e) {
            e.preventDefault();
            var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
            document.execCommand('insertText', false, text);
        });
    }
  }
})
