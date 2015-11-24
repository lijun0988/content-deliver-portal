'use strict';

// Plans Services
var plansServiceFactory = function ($http, authenticationService,
    akkadianPlatformApiBaseUrl) {
    var plansService = this;

    var availabeList = [];

    this.loadAvailableList = function (callback) {
        $http.get(akkadianPlatformApiBaseUrl + "plan/availablePlans").success(
            function (data, status) {
                plansService.availableList = data.plans;

                if (typeof callback == 'function') {
                    callback(data, status);
                }
            }).error(function (data, status) {});
    };

    this.getAvailableList = function () {
        return plansService.availableList;
    };

    this.savePlan = function (plan) {
        $http.post(akkadianPlatformApiBaseUrl + 'plan', {
            data: plan
        }).success(function (data, status) {
            console.log(data);
        }).error(function (data, status) {});
    };

    this.updatePlan = function (plan) {

        $http.put(akkadianPlatformApiBaseUrl + 'plan/' + plan.id, {
            data: plan
        }).success(function (data, status) {

        }).error(function (data, status) {});
    };

    return plansService;
};


// Plans Services
var checkoutServiceFactory = function () {
    var checkoutService = {};
    //checkoutService.texto = 'this kind of ';
    checkoutService.planActive = {};
    checkoutService.showFree = false;
    checkoutService.conf = false;
    checkoutService.startPay = false;
    checkoutService.review = false;
    checkoutService.reviewTerm = false;
    //checkoutService.check = false;
    return checkoutService;
}