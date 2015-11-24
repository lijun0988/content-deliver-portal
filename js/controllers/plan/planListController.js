'use strict';

mindFrameControllers.controller('planPageToggleCtrl', [
  '$scope',
  'Plan',
  'Product',
  'ngMessages',
  'MESSAGES',
  '$location',
  '$routeParams',
  'VALIDATION_MESSAGES',
  function ($scope, Plan, Product, ngMessages, MESSAGES, $location, $routeParams, VALIDATION_MESSAGES ) {
    $scope.VALIDATION_MESSAGES = VALIDATION_MESSAGES;
    $scope.viewList = true;
    $scope.limit = 10;
    $scope.offset = 0;
    $scope.$routeParams = $routeParams;
    $scope.plans = Plan.query({
      id: 'all',
      offset: $scope.offset,
      max: $scope.limit
    });

    $scope.nextPage = function () {
      $scope.offset += $scope.limit;
      $scope.plans = Plan.query({
        id: 'all',
        offset: $scope.offset,
        max: $scope.limit
      });
    };

    $scope.prevPage = function () {
      $scope.offset -= $scope.limit;
      $scope.plans = Plan.query({
        id: 'all',
        offset: $scope.offset,
        max: $scope.limit
      });
    };

    $scope.newPlan = function () {
      $scope.planForm.$setPristine();
      $location.search('action', 'new');
      analytics.trackTag('price_addnewplanclick');
      $scope.plan = new Plan;
      $scope.plan.enabled = true;
      $scope.toggleView();
      $scope.editPlan = false;
    };

    $scope.save = function () {
      var pln = new Plan($scope.plan);
      pln.users = parseInt(pln.users);
      //pln.persons = parseInt(pln.persons);
      pln.persons = pln.users;
      pln.price = parseInt(pln.price);
      if (pln.id) {
        pln.$update(function (data) {
          if (data.success) {
            ngMessages.show(MESSAGES.plan.updatedSuccess.replace('__PLAN_NAME__', data.data.name),
              'success', true);
            for (var i = 0; i < $scope.plans.data.length; i++) {
              if (data.data.id == $scope.plans.data[i].id) {
                $scope.plans.data[i] = data.data;
              }
            };
            $scope.toggleView();
          } else {
            $scope.errorMessage = MESSAGES.plan.savedError;
            $scope.planForm.code.$setValidity('required',false);
          }
        }, function (e) {
            $scope.errorMessage = MESSAGES.plan.savedError;
        	$scope.planForm.code.$setValidity('required',false);
        });
      } else {
        pln.$create(function (data) {
          ngMessages.show(MESSAGES.plan.savedSuccess.replace('__PLAN_NAME__', data.data.name),
            'success', true);
          $scope.plans.data.push(data.data);
          $scope.toggleView();
        }, function (e) {
          $scope.errorMessage = MESSAGES.plan.savedError;
          $scope.planForm.code.$setValidity('required',false);
        });
      }
    };

    $scope.edit = function (planId) {
      $scope.planForm.$setPristine();
      $location.search('action', 'edit');
      analytics.trackTag('price_addnewplanclick');
      $scope.plan = Plan.get({
        id: planId
      });
      $scope.products = Product.get({
        id: 'all'
      });
      $scope.toggleView();
      $scope.editPlan = true;
    };

    $scope.enablePlan = function (plan) {
      $scope.plan.enabled = true;
    };

    $scope.disablePlan = function (plan) {
      $scope.plan.enabled = false;
    };

    $scope.toggleView = function () {
      $scope.viewList = !$scope.viewList;
      if($scope.viewList){
    	  $location.search('action', null);
      }
    };

    $scope.backToListPlans = function () {
      $scope.toggleView();
    };

    if($routeParams.action == "new"||$routeParams.action=='edit'){
    	$location.search("action", null);
    }

    $scope.selectPage = function (page) {
                $scope.plans = Plan.query({
                    id: 'all',
                    offset: ($scope.limit * parseInt(page - 1)),
                    max: $scope.limit,
                    includeDisabled: $scope.includeDisabled
                });
        }
    }
]);
