'use strict';

mindFrameControllers.controller('accountIncompleteCtrl', [
    '$scope',
    '$http',
    '$cookieStore',
    '$location',
    'authenticationService',
    'PathService',
    function ($scope, $http, $cookieStore, $location, authenticationService, PathService) {
        $scope.authenticationService = authenticationService;

        $scope.acceptTerms = function () {
            $http({
                method: 'POST',
                url: PathService.getAccountAcceptTOSUrl()
            }).success(function (resp) {
                $scope.account.acceptedTermsAndConditions = true;
                if ($scope.account.hasBillingInfo) {
                    authenticationService.reauthenticate();
                }
            });
        };

        $scope.billingInfoAdded = function () {
            $scope.account.hasBillingInfo = true;
            if ($scope.account.acceptedTermsAndConditions) {
                authenticationService.reauthenticate();
            }
        };

        $scope.account = authenticationService.accountsMap[$scope.currentAccount];
    }
]);