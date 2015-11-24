'use strict';

mindFrameControllers.controller('freeCtrl', [
    '$scope',
    '$http',
    '$location',
    'checkoutService',
    'plansService',
    function ($scope, $http, $location, checkoutService, plansService) {
        plansService.loadAvailableList();
        $scope.plansService = plansService;
        $scope.free = function() {
            var plan = plansService.availableList[0];
            var id = plan.id;
            checkoutService.planActive = plan;
            checkoutService.showFree = false;
            checkoutService.conf = false;
            checkoutService.check = false;
            checkoutService.reviewTerm = false;
            checkoutService.startPay = true;
            $location.path('/checkout/' + id);
        };
    }
]);

mindFrameControllers.controller('buyPlanCtrl', [
    '$scope',
    '$http',
    '$location',
    'checkoutService',
    'plansService',
    function ($scope, $http, $location, checkoutService, plansService) {
        $scope.checkoutService = checkoutService;
        $scope.plansService = plansService;
        $scope.buy = function(index) {
            var index = index;
            var plan = plansService.availableList[index];
            checkoutService.planActive = plan;
            if (plan.id == 1) {
                checkoutService.showFree = false;
                checkoutService.check = false;
                checkoutService.conf = false;
                checkoutService.reviewTerm = false;
                checkoutService.startPay = true;
            } else {
                checkoutService.startPay = false;
                checkoutService.conf = false;
                checkoutService.reviewTerm = false;
            }
            $location.path('/checkout/' + plan.id);
        };
    }
]);

mindFrameControllers.controller('selectCtrl', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    'checkoutService',
    'plansService',
    function ($scope, $http, $routeParams, $location, checkoutService, plansService) {
        var id = $routeParams.id;
        $scope.checkoutService = checkoutService;
        $scope.plansService = plansService;
        plansService.loadAvailableList(function(data, status) {
            var p = plansService.getAvailableList();
            for (var i = 0; i < p.length; i++) {
                if (p[i].id == id) {
                    var plan = plansService.availableList[i];
                }
            }
            checkoutService.planActive = plan;
        });
        if (id == 1) {
            checkoutService.startPay = true;
            checkoutService.review = true;
        } else {}
        $scope.$on('$viewContentLoaded', function() {
            // TODO: code here
        });
        $scope.getFree = function() {
            var p = plansService.availableList;
            for (var i = 0; i < p.length; i++) {
                if (p[i].id == 1) {
                    var plan = plansService.availableList[i];
                };
            };
            checkoutService.startPay = true;
            checkoutService.planActive = plan;
            checkoutService.review = true;
        };
        $scope.next = function() {
            checkoutService.check = true;
            checkoutService.startPay = true;
        };
    }
]);

mindFrameControllers.controller('reviewCtrl', [
    '$scope',
    '$http',
    '$location',
    'checkoutService',
    'plansService',
    function ($scope, $http, $location, checkoutService, plansService) {
        $scope.checkoutService = checkoutService;
        $scope.plansService = plansService;
        $scope.confirm = function() {
            checkoutService.conf = true;
            checkoutService.review = false;
            checkoutService.reviewTerm = true;
            $scope.checkoutService = checkoutService;
        };
        $scope.back = function() {
            var plan = checkoutService.planActive;
            if (plan.id == 1) {
                checkoutService.check = false;
                checkoutService.reviewTerm = false;
            } else {
                checkoutService.reviewTerm = false;
                checkoutService.startPay = false;
                checkoutService.check = false;
            }
        };
    }
]);

mindFrameControllers.controller('thankYouCtrl', function() {});

mindFrameControllers.controller('confirmCtrl', [
    '$scope',
    '$http',
    '$location',
    'checkoutService',
    'plansService',
    'akkadianPlatformApiBaseUrl',
    function ($scope, $http, $location, checkoutService, plansService, akkadianPlatformApiBaseUrl) {
        $scope.checkoutService = checkoutService;
        $scope.plansService = plansService;
        $scope.user = {};
        $scope.clientAccount = { acceptedTermsAndConditions: true };
        $scope.selected = undefined;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
            'California', 'Colorado', 'Connecticut', 'Delaware',
            'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
            'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan',
            'Minnesota', 'Mississippi', 'Missouri', 'Montana',
            'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Dakota', 'North Carolina',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
            'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
            'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        $scope.backConfirm = function() {
            checkoutService.review = true;
            checkoutService.reviewTerm = false;
            checkoutService.conf = false;
        };
        $scope.purchase = function() {
            var createAccount = {
                user: $scope.user,
                clientAccount: $scope.clientAccount,
                plan: checkoutService.planActive
            };
            $location.path('/thankYou');
            $http({
                method: 'POST',
                url: akkadianPlatformApiBaseUrl + 'account/signup',
                data: createAccount
            }).success(function(res, status) {
                if (res.success) {
                    $location.path('/thankYou');
                } else {
                    $scope.message = res.message;
                }
            });
        };
    }
]);