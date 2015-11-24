'use strict';

mindFrameControllers.controller('productPageToggleCtrl', [
    '$scope',
    'Product',
    function ($scope, Product) {
        $scope.viewListProducts = true;
        
        $scope.products = Product.query({
            id: 'all'
        });
        
        $scope.newProduct = function () {
            $scope.product = new Product;
            $scope.products = [];
            $scope.toggleView();
            $scope.editProduct = false;
        };

        $scope.saveProduct = function () {
            var prd = new Product($scope.product);
            if (prd.id) {
                prd.$update(function (data) {
                    if (data.success) {
                        $scope.successMessage = "Product updated OK";
                        for (var i = 0; i < $scope.products.data.length; i++) {
                            if (data.data.id == $scope.products.data[i].id) {
                                $scope.products.data[i] = data.data;
                            }
                        }
                    } else {
                        $scope.message = data.message;
                    }
                    $scope.toggleView();
                }, function (e) {
                    $scope.errorMessage = e.data.message;
                });
            } else {
                pln.$create(function (data) {
                    $scope.successMessage = "Product created OK";
                    $scope.products.data.push(data.data);
                    $scope.toggleView();
                }, function (e) {
                    $scope.errorMessage = e.data.message;
                });
            }
        };
        
        $scope.editProd = function (productId) {
            $scope.product = Product.get({
                id: productId
            });
            $scope.toggleView();
            $scope.editProduct = true;
        };

        $scope.toggleView = function () {
            $scope.viewListProducts = !$scope.viewListProducts;
        };

        $scope.backToListProducts = function () {
            $scope.viewListProducts = true;
            $scope.successMessage = "";
            $scope.errorMessage = "";
            $scope.products = Product.query({
                id: 'all'
            });
        };
    }
]);

mindFrameControllers.controller('productListCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'Product',
    function ($scope, $http, $location, $routeParams, Product) {
        $scope.products = Product.get({
            id: 'all'
        });
    },
]);
