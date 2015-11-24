'use strict';

mindFrameControllers.controller('newProductCtrl', [
    '$scope',
    '$http',
    '$location',
    '$routeParams',
    'Product',
    function ($scope, $http, $location, $routeParams, Product) {
        $scope.product = new Product;
        $scope.save = function () {
            $scope.product.$create(function (data) {
                $location.path('/admin/products');
            }, function (e) {
                $scope.errorMessage = e.data.message;
            });
        };
    },
]);