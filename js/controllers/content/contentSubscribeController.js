mindFrameControllers.controller('subscribeContentCtrl', [
    '$scope',
    '$http',
    'PathService',
    'ContentProvider',
    '$routeParams',
    'authenticationService',
    function ($scope, $http, PathService, ContentProvider, $routeParams, authenticationService) {
        $scope.authenticationService = authenticationService;
        $scope.categories = null;
        $scope.providers = null;
        $scope.categoriesLoaded = false;
        $scope.providersLoaded = false;
        $scope.contentQuery = "";
        $scope.filteredQuery = false;
        $scope.currentContentQuery = null;
        $scope.limit = 8;
        $scope.offset = 0;

        $scope.getAllProviders = function () {
            $scope.providers = ContentProvider.get({
                id: "all",
                offset: $scope.offset,
                max: $scope.limit,
                account: $scope.currentAccount
            }, function (res) {
                if (res.success) {
                    $scope.providersLoaded = true;
                    $scope.filter = null;
                }
            });
        };

        $scope.getAllCategories = function () {
            $http({
                method: 'GET',
                url: PathService.getContentCategoryAllUrl()
            }).success(function (res, status) {
                if (res.success) {
                    $scope.categories = res.data;
                    $scope.categoriesLoaded = true;
                }
            });
        };

        $scope.getAllProviders();
        $scope.getAllCategories();

        $scope.nextPage = function () {
            $scope.offset += $scope.limit;
            if ($scope.filteredQuery) {
                $scope.getFilteredProviders();
            } else {
                $scope.getAllProviders();
            }
        };

        $scope.prevPage = function () {
            $scope.offset -= $scope.limit;
            if ($scope.filteredQuery) {
                $scope.getFilteredProviders();
            } else {
                $scope.getAllProviders();
            }
        };

        $scope.search = function () {
            $scope.providersLoaded = false;
            $scope.contentQueryLoaded = false;
            $scope.currentContentQuery = $scope.contentQuery;
            if ($scope.contentQuery != undefined && $scope.contentQuery.length > 0) {
                $scope.getFilteredProviders();
            } else {
                $scope.getAllProviders();
                $scope.$broadcast('clearcategoryfilter');
            }
            $scope.offset = 0;
        };

        $scope.getFilteredProviders = function () {
            var searchURL = PathService.getContentSearchUrl();
            var params = {};
            params.query = $scope.contentQuery;
            params.max = $scope.limit;
            params.offset = $scope.offset;

            $http({
                method: 'POST',
                url: searchURL,
                params: params,
                data: $scope.filteredCategories()
            }).
            success(function (res, status) {
                if (res.success) {
                    $scope.providers = res;
                    $scope.providersLoaded = true;
                    if ($scope.contentQuery != undefined && $scope.contentQuery.length > 0) {
                        $scope.contentQueryLoaded = true;
                    }
                    $scope.filteredQuery = true;
                }
            });
        };

        $scope.$on('filterbycategory', function (evt, filter) {
            $scope.offset = 0;
            if (!filter && (!$scope.contentQuery || $scope.contentQuery == "")) {
                $scope.getAllProviders();
            } else {
                $scope.getFilteredProviders();
            }
        });

        $scope.subscribe = function (provider) {
            $http({
                method: 'POST',
                url: PathService.getContentSubscribeUrl(provider.id)
            }).
            success(function (res, status) {
                if (res.success) {
                    $scope.providers.data.status[provider.id] = "unsubscribe";
                }
            });
        };

        $scope.unsubscribe = function (provider) {
            $http({
                method: 'DELETE',
                url: PathService.getContentUnsubscribeUrl(provider.id)
            }).
            success(function (res, status) {
                if (res.success) {
                    $scope.providers.data.status[provider.id] = "subscribe";
                }
            });
        };

        $scope.filteredCategories = function () {
            var filteredCategories = [];
            var filteredSubcategories = [];
            angular.forEach($scope.categories, function (category, index) {
                if (category.isSelected) {
                    angular.forEach(category.subcategories, function (subcategory, index) {
                        if (subcategory.isSelected) {
                            filteredSubcategories.push(subcategory.id);
                        }
                    });
                    filteredCategories.push(category.id);
                }
            });
            var filter = {
                categories: filteredCategories,
                subcategories: filteredSubcategories
            };
            return filter;
        }
    }
]);