'use strict';

mindFrameControllers.controller('listCategoriesController', [
    '$scope',
    '$http',
    'akkadianPlatformApiBaseUrl',
    'Category',
    'ngMessages',
    '$modal',
    'authenticationService',
    'selectCategoryAndSubCategoryService',
    'UI_CONSTANTS',
    function ($scope, $http, akkadianPlatformApiBaseUrl, Category, ngMessages, $modal, authenticationService,
        selectCategoryAndSubCategoryService, UI_CONSTANTS) {
        $scope.selectCategoryAndSubCategoryService = selectCategoryAndSubCategoryService;
        $scope.authenticationService = authenticationService;
        $scope.categories = [];
        $scope.subCategories = [];
        $scope.limit = 10;
        $scope.offset = 0;

        Category.query({
            id: 'all'
        }, function (response) {
            var data = response.data;
             $scope.categories = data || [];

            $scope.categories.push({
                "id": "new",
                "name": "Create New Category"
            });



            //if (!$scope.selectCategoryAndSubCategoryService.selectedCategory) {
            //    $scope.selectCategoryAndSubCategoryService.selectedCategory = $scope.categories[0].id;
            //}
            $scope.savedContentCategory = $scope.selectCategoryAndSubCategoryService.selectedCategory;
        });

        $scope.toggleAdding = function(){
        	$scope.adding = !$scope.adding;
        };

        $scope.categoryAdded = function(data){
        	$scope.adding = false;
        	$scope.categories.splice($scope.categories.length-1, 0, data.data);
        	$scope.selectCategoryAndSubCategoryService.selectedCategory = data.data.id;
        };

        $scope.subCategoryAdded = function(data){
        	$scope.adding = false;
        	$scope.subCategories.splice($scope.subCategories.length-1, 0, data.data);
        	$scope.selectCategoryAndSubCategoryService.selectedSubCategory = data.data.id;
        };

        $scope.selectedCategory = function(){
        	if($scope.selectCategoryAndSubCategoryService.selectedCategory == "new"){
        		return null;
        	}else{
        		return $scope.selectCategoryAndSubCategoryService.selectedCategory;
        	}
        };

        $scope.$watch('selectCategoryAndSubCategoryService.selectedCategory', function () {
            $scope.adding=false;

            if ($scope.selectCategoryAndSubCategoryService.selectedCategory != null
                && $scope.selectCategoryAndSubCategoryService.selectedCategory != UI_CONSTANTS.selectOption.id) {
                if ($scope.selectCategoryAndSubCategoryService.selectedCategory == "new") {
                    $scope.adding=true;
                } else {
                	$scope.selectedParentCategoryId = $scope.selectCategoryAndSubCategoryService.selectedCategory;
                    Category.query({
                        id: 'all',
                        parentCategoryId: $scope.selectCategoryAndSubCategoryService.selectedCategory
                    }, function (response) {
                        var data = response.data;
                        if (data && data.length > 0) {

                           $scope.subCategories = data;
                            //Adding template select category for options list
                            $scope.subCategories.splice(0, 0, {
                                "id": "Select",
                                "name": "Select a Subcategory"
                            });

                        } else {
                            $scope.subCategories = [{
                                "id": "Select",
                                "name": "Select a Subcategory"
                            }];
                        }
                        $scope.subCategories.push({
                            "id": "new",
                            "name": "Create New Subcategory"
                        });

                        $scope.selectCategoryAndSubCategoryService.selectedSubCategory = $scope.subCategories[0].id;

                        if (!$scope.savedContentSubCategory) {
                            $scope.savedContentSubCategory = $scope.selectCategoryAndSubCategoryService.selectedSubCategory;
                        } else {
                            $scope.selectCategoryAndSubCategoryService.selectedSubCategory = $scope.savedContentSubCategory;
                        }

                    });
                }
            } else {
                $scope.subCategories = [{
                    "id": "Select",
                    "name": "Select a Subcategory"
                }];
                $scope.subCategories.push({
                    "id": "new",
                    "name": "Create New Subcategory"
                });
                if (!$scope.selectCategoryAndSubCategoryService.selectedSubCategory ||
                    $scope.selectCategoryAndSubCategoryService.selectedCategory == $scope.categories[0].id) {
                    $scope.selectCategoryAndSubCategoryService.selectedSubCategory = $scope.subCategories[0].id;
                }
            }
        });

        $scope.$watch('selectCategoryAndSubCategoryService.selectedSubCategory', function () {
            $scope.adding=false;

            if ($scope.selectCategoryAndSubCategoryService.selectedSubCategory != null && $scope.selectCategoryAndSubCategoryService
                .selectedSubCategory == "new") {
                $scope.adding=true;
            }
        });

        $scope.resetCategoriesToSaved = function (wasCreatingSubCategory) {
            if (!wasCreatingSubCategory) {
                $scope.selectCategoryAndSubCategoryService.selectedCategory = $scope.savedContentCategory;
            } else {
                if ($scope.savedContentSubCategory) {
                    $scope.selectCategoryAndSubCategoryService.selectedSubCategory = $scope.savedContentSubCategory;
                } else {
                    $scope.selectCategoryAndSubCategoryService.selectedSubCategory = null;
                }
            }
        }

        $scope.setSelectedCategory = function (cat) {
            if (cat.parentCategory != null) {
                for (var idx = 0; idx < $scope.subCategories.length; idx++) {
                    if (cat.id == $scope.subCategories[idx].id) {
                        $scope.selectCategoryAndSubCategoryService.selectedSubCategory = $scope.subCategories[idx].id;
                        break;
                    }
                };

                for (var idx = 0; idx < $scope.categories.length; idx++) {
                    if (cat.parentCategory.id == $scope.categories[idx].id) {
                        $scope.selectCategoryAndSubCategoryService.selectedCategory = $scope.categories[idx].id;
                        break;
                    }
                };
            } else {
                for (var idx = 0; idx < $scope.categories.length; idx++) {
                    if (cat.id == $scope.categories[idx].id) {
                        $scope.selectCategoryAndSubCategoryService.selectedCategory = $scope.categories[idx].id;
                        break;
                    }
                };
            }
        }

        $scope.openCreateCategoryDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/admin/content/createCategoriesDialog.html',
                controller: 'createCategoriesController',
                windowClass: 'modal-one-col',
                resolve: {
                    selectedParentCategoryId: function () {
                        if ($scope.selectCategoryAndSubCategoryService.selectedCategory != null && $scope.selectCategoryAndSubCategoryService
                            .selectedCategory != "new") {
                            return $scope.selectCategoryAndSubCategoryService.selectedCategory;
                        }
                        return null;
                    }
                }
            });

            // And when back to the list do as below...
            modalInstance.result.then(function (resultCategory) {
                if (resultCategory) {
                    ngMessages.show($scope.messages.categoryCreated.replace('__CATEGORYNAME__', resultCategory.name),
                        'success', true);
                    if (resultCategory.parentCategory != null) {
                        $scope.subCategories.splice($scope.subCategories.length - 1, 0, resultCategory);
                        $scope.setSelectedCategory(resultCategory);
                    } else {
                        $scope.categories.splice($scope.categories.length - 1, 0, resultCategory);
                        $scope.setSelectedCategory(resultCategory);
                    }
                } else {
                    ngMessages.show($scope.messages.categoryNotCreated, 'error');
                }
            }, function (wasCreatingSubCategory) {
                $scope.resetCategoriesToSaved(wasCreatingSubCategory);
            });
        };
    }
]);
