'use strict';

/* App Module */

var mindFrameApp = angular.module('mindFrameApp', ['ngCookies', 'resources', 'ui.bootstrap.typeahead',
  'mindFrameControllers','ngProgress','ngMessages','ui.bootstrap','dialogs' , 'ngDragDrop', 'ui.sortable',
    'angularFileUpload', 'perfectScrollbar', 'services.pathService', 'services.apiService', 'services.searchService'
]);

var url,
    domain = location.hostname,
    subdomain = domain.split('.');

// get only the fist parameter
subdomain = subdomain[0];

// for local purpose...
//


if(subdomain === 'local'|| subdomain === 'localhost') {
  domain = 'localhost:8080';
  subdomain = 'localhost';
}

var API_URL = '@APIURL@';

if (API_URL.indexOf('http') === -1 ) {
    url = location.protocol + '//' + domain + (location.port ? ':' + location.port : '');
}
else{
    url = API_URL;
}

/* Controllers */
var mindFrameControllers = angular.module('mindFrameControllers', []);

mindFrameApp.factory('akkadianPlatformApiBaseUrl', function() {
    if (API_URL.indexOf('http') === -1 ) {
        return url + '/mindframe-backend/api/';
    }
    else{
        return url + '/ws/';
    }
});



mindFrameApp.factory('akkadianPlatformResouceApiBaseUrl', function(
  akkadianPlatformApiBaseUrl) {
  return akkadianPlatformApiBaseUrl.replace(/:([^\/])/, '\\:$1');
});

mindFrameApp.provider('$mfCookieStore', [
  function() {
    var self = this;
    self.defaultOptions = {};
    self.setDefaultOptions = function(options){
      self.defaultOptions = options;
    };
    self.$get = function(){
      return {
        get: function(name){
          var jsonCookie = $.cookie(name);
          if(jsonCookie){
              return angular.fromJson(jsonCookie);
          }
        },
        put: function(name, value, options){
          options = $.extend({}, self.defaultOptions, options);
          $.cookie(name, angular.toJson(value), options);
        },
        remove: function(name, options){
          options = $.extend({}, self.defaultOptions, options);
          $.removeCookie(name, options);
        }
      };
    };
  }
]);

mindFrameApp.config([
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',
  '$mfCookieStoreProvider',
  '$tooltipProvider',
  function($routeProvider, $locationProvider, $httpProvider, $mfCookieStoreProvider, $tooltipProvider) {
    $mfCookieStoreProvider.setDefaultOptions({
      path : '/' // Cookies should be available on all pages
    });

    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur',
      'never': 'mouseenter'
    });

    var routes = {
        '/' : {
            templateUrl : 'partials/login.html',
            controller : 'loginCtrl'
        },
        '/home' : {
            templateUrl : 'partials/home.html',
            controller : 'homeCtrl'
        },
        '/user' : {
            templateUrl : 'partials/user.html',
            controller : 'homeCtrl'
        },
        '/admin' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/dashboard' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/users' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/providers' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/content' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl',
            reloadOnSearch : false
        },
        '/admin/account' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/account-config' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/delivery' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/reports' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/billing' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/plans' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl',
            reloadOnSearch : false
        },
        '/admin/plans/new' : {
            templateUrl : 'partials/admin/plans/form.html',
            controller : 'editPlanCtrl'
        },
        '/admin/plans/edit_plan/:id' : {
            templateUrl : 'partials/admin/plans/form.html',
            controller : 'editPlanCtrl'
        },
        '/admin/tabs' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/groups' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/products' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/admin/persons' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl',
            reloadOnSearch: false
        },
        '/edit_product/:id' : {
            templateUrl : 'partials/admin/product/form.html',
            controller : 'editProductCtrl'
        },
        '/new_product' : {
            templateUrl : 'partials/admin/product/form.html',
            controller : 'newProductCtrl'
        },
        '/edit_user/:id' : {
            templateUrl : 'partials/admin/user/form.html',
            controller : 'editUserCtrl'
        },
        '/admin/content/:id' : {
            templateUrl : 'partials/admin/content.html',
            controller : 'contentPageToggleCtrl'
        },
        '/new_user' : {
            templateUrl : 'partials/admin/user/form.html',
            controller : 'newUserCtrl'
        },
        '/admin/new_account' : {
            templateUrl : 'partials/admin.html',
            controller : 'adminCtrl'
        },
        '/superadmin' : {
            templateUrl : 'partials/superadmin.html',
            controller : 'adminCtrl'
        },
        '/checkout' : {
            templateUrl : 'partials/checkout.html',
            controller : 'freeCtrl'
        },
        '/terms' : {
            templateUrl : 'partials/terms.html',
            controller : 'adminCtrl'
        },
        '/checkout/:id' : {
            templateUrl : 'partials/checkout.html',
            controller : 'selectCtrl'
        },
        '/thankYou' : {
            templateUrl : 'partials/thankYou.html',
            controller : 'thankYouCtrl'
        },
        '/logout' : {
            templateUrl : 'partials/logout.html',
            controller : 'logoutCtrl'
        },
        '/billingInfo' : {
            templateUrl : 'partials/accountInfo.html',
            controller : 'adminCtrl'
        },
        '/admin/contentCreator/:id' : {
            templateUrl : 'partials/admin/content_creator.html'
        },
        '/admin/clients/onCloud' : {
            templateUrl: 'partials/admin.html',
            controller: 'adminCtrl'
        },
        '/admin/clients/onPremises' : {
            templateUrl: 'partials/admin.html',
            controller: 'adminCtrl'
        },
        '/changePassword/:token' : {
            templateUrl : 'partials/change_password.html',
            controller: 'changePasswordController'
        },
      '/forgotPassword' : {
          templateUrl : 'partials/forgot_password.html',
          controller: 'forgotUserPasswordCtrl'
      },
      '/emailSentToResetPassword' : {
          templateUrl : 'partials/email_sent_to_reset_password.html',
          controller: 'forgotUserPasswordCtrl'
      },
      '/resetPassword' : {
          templateUrl : 'partials/reset_password.html',
          controller: 'forgotUserPasswordCtrl'
      }
    };

    for (var path in routes) {
      routes[path].resolve = {
        apiService : function(ApiService) {
          return ApiService;
        }
      };
      $routeProvider.when(path, routes[path]);
    }

    $routeProvider.otherwise({
    redirectTo : '/'
    });
    }
]);

mindFrameApp.controller('mainController',[
  '$scope',
  '$rootScope',
  '$http',
  'PathService',
   function ($scope, $rootScope, $http, PathService){

    $rootScope.$watch('currentAccount', function(new_value, oldValue){
      if(new_value != oldValue){
        $http({
          method:'GET',
          url:PathService.getAccountConfigUrl()
        }).success(function (response) {

            $scope.fidelusDomainName = response.data.piwikConfig.fidelusDomainName;
            $scope.fidelusAnalyticServerUrl = response.data.piwikConfig.fidelusAnalyticServerUrl;
            $scope.fidelusSiteCode = response.data.piwikConfig.fidelusSiteCode;
            $rootScope.$broadcast('setGoogleTracker');
        });
      }
    });
  }
]);

// Use following code to execute code on controller change.
mindFrameApp.run(function($rootScope, ngProgress, $location, BreadCrumbsService, authenticationService, LIST_OF_PAGES_ALLOW_FOR_ANY) {
  $rootScope.$on('$routeChangeStart', function(ev,data) {
  });

  $rootScope.$on('$routeChangeError', function(ev,data) {
  });

  $rootScope.$on('$routeChangeSuccess', function(ev,data) {
    ngProgress.complete();
    BreadCrumbsService.clear();
    BreadCrumbsService.updateMindframeBreadcrumb($location.path());
  });

  $rootScope.$on('$locationChangeStart', function (event, data) {
    var isLoggedIn = authenticationService.isLoggedIn();
    isLoggedIn.then(function (result) {
      // user is logged in, so let it go wherever he wants
      // unless he tries to go to login page then drive him to the dashboard
      if ($location.path() == "/") {
        $location.path('/admin');
      }
    }, function (reason) {
      // user is NOT logged in, so always drive him to login page
      if ($location.path() != "/") {
        for(var i = 0; i < LIST_OF_PAGES_ALLOW_FOR_ANY.length; i ++)
        {
          if ($location.path() == LIST_OF_PAGES_ALLOW_FOR_ANY[i]) {
            $location.path(LIST_OF_PAGES_ALLOW_FOR_ANY[i]);
          }
        }
      }
    }, function (update) {
      // this could be used to track progress
    });
    });

  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
});

// Global definitions
var global = {};
global.timeOuts = [];

// Global events
$(document).ready(function(){
  $('body').on('click', 'a.close-modal',function(){
    $('.modal-backdrop.fade.in').trigger('click');
  })
  $('body').on('click','ul.subBrandOptions a', function(){
    var dropDownBtn  = $('.show-on-mobile.drop-down-btn');
    if(dropDownBtn.is(':visible') && !$(this).next('ul').length > 0 ){
      dropDownBtn.trigger('click');
    }
  })
  analytics.init();

});



