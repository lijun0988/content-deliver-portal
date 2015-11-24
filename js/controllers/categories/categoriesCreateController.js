'use strict';

mindFrameControllers.controller('createCategoriesController', [
    '$scope',
    '$http',
    'akkadianPlatformApiBaseUrl',
    'Category',
    'ngMessages',
    function ($scope, $http, akkadianPlatformApiBaseUrl, Category, ngMessages) {
        $scope.category = new Category();
        $scope.isCreatingASubCategory = false;
        
        if ($scope.selectedCategory()) {
            $scope.category.parentCategoryId = $scope.selectedCategory();
            $scope.isCreatingASubCategory = true;
            $scope.level = "Sub Category Name";
        }else{
        	$scope.level = "Category Name";
        }

        $scope.saveCategory = function () {
            if ($scope.category.id) {
                $scope.category.$update({}, function (data) {
                    $scope.toggleAdding();
                }, function (e) {
                    ngMessages.show($scope.messages.categoryNotUpdated, 'error');
                    $scope.toggleAdding();
                });
            } else {
                $scope.category.$create({}, function (data) {
                    if($scope.selectedCategory()){
                    	$scope.subCategoryAdded(data);
                    }else{
                    	$scope.categoryAdded(data);	
                    }
                    $scope.category = new Category();
                }, function (e) {
                    $scope.toggleAdding();
                });
            }
        };
        
        

        $scope.cancel = function () {
            $scope.toggleAdding();
        };
    }
]);