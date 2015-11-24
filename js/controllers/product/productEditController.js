'use strict';

mindFrameControllers.controller('editProductCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    'Product',
    function ($scope, $location, $routeParams, Product) {
        $scope.product = Product.get({
            id: $routeParams.id
        });
        $scope.save = function () {
            $scope.product.$update(function (data) {
                $location.path('/admin/products');
            }, function (e) {
                $scope.errorMessage = e.data.message;
            });
        };
    },
]);