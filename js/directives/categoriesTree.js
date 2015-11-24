'use strict';

mindFrameApp.directive('categoriesTree', function () {
    return {
        templateUrl: 'templates/main_categories_tree.html',
        replace: true,
        restrict: 'E',
        scope: {
            categories: '=categories'
        },
        controller: function ($scope) {
            $scope.filter = {
                categoryFilter: [],
                subcategoryFilter: []
            };
            $scope.$on('dofilter', function (evt, filter) {
                $scope.$emit('filterbycategory', $scope.filter);
            });
        },
    };
});

mindFrameApp.directive('triStateCheckbox', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            mainlevel: '=',
            sublevel: '='
        },
        templateUrl: 'templates/categories_tree.html',
        controller: function ($scope, $element) {
            $scope.masterChange = function () {
                if ($scope.master) {
                    angular.forEach($scope.sublevel, function (it, index) {
                        it.isSelected = true;
                    });
                    $scope.mainlevel.isSelected = true;
                } else {
                    angular.forEach($scope.sublevel, function (it, index) {
                        it.isSelected = false;
                    });
                    $scope.mainlevel.isSelected = false;
                }
                $scope.doFilter();
            };
            var masterIt = $element.children()[0];
            $scope.itChange = function () {
                var allSet = true,
                    allClear = true;
                angular.forEach($scope.sublevel, function (it, index) {
                    if (it.isSelected) {
                        allClear = false;
                    } else {
                        allSet = false;
                    }
                });
                if (allSet) {
                    $scope.master = true;
                    masterIt.indeterminate = false;
                    $(masterIt).find('label').removeClass('indeterminate-state-checkbox');
                    $scope.mainlevel.isSelected = true;
                } else if (allClear) {
                    $scope.master = false;
                    masterIt.indeterminate = false;
                    $(masterIt).find('label').removeClass('indeterminate-state-checkbox');
                    $scope.mainlevel.isSelected = false;
                } else {
                    $scope.master = false;
                    masterIt.indeterminate = true;
                    $(masterIt).find('label').addClass('indeterminate-state-checkbox');
                    $scope.mainlevel.isSelected = true;

                }

                $scope.doFilter();
            };

            $scope.doFilter = function () {
                $scope.$emit('dofilter', {
                    category: $scope.mainlevel
                });
            }

            $scope.$on('clearcategoryfilter', function () {
                angular.forEach($scope.sublevel, function (it, index) {
                    it.isSelected = false;
                });
                $scope.master = false;
                masterIt.indeterminate = false;
            });
        },
    };
});