'use strict';

var authenticationServiceFactory = function ($http, $mfCookieStore, $rootScope,
    akkadianPlatformApiBaseUrl, $q, $location) {
    var authenticationService = this;

    this.authenticated = false; // this is a boolean that will be modified by
    // the following methods:
    this.credentials = {};
    this.accountsMap = {};

    this.isLoggedIn = function () {
      var token = $mfCookieStore.get('token');
      var usr = $mfCookieStore.get('loggedin');
      var deferred = $q.defer();
      
      if(authenticationService.authenticated){
    	  deferred.resolve(true);
    	  return deferred.promise;
      }
      
      if (token != '' && usr != '') {
        $http({
          method: 'GET',
          url: akkadianPlatformApiBaseUrl + 'user/me',
          headers: {
            'Access-Token': token
          }
        }).success(function (data, status) {
          var resp = data.data;
          resp.accessToken = token;
          authenticationService.loggedIn(resp);
          deferred.resolve(resp);
        }).error(function (data, status) {
          authenticationService.authenticated = false;
          deferred.reject();
        });
      }
      return deferred.promise;
    }

    this.loggedIn = function (credentials) {
        authenticationService.credentials = credentials;

        $http.defaults.headers.common['Access-Token'] = credentials.accessToken;
        for (var i = 0; i < credentials.roles.length; i++) {
            var role = credentials.roles[i];
            authenticationService['is' + role] = true;
        }

        for (var i = 0; i < credentials.clientAccounts.length; i++) {
            var clientAccount = credentials.clientAccounts[i];
            authenticationService.accountsMap[clientAccount.name] = clientAccount;
        }

        $rootScope.currentAccount = credentials.clientAccounts[0].name;
        $rootScope.currentAccountFullName = credentials.clientAccounts[0].fullName;

        authenticationService.authenticated = true;
    };

    this.hasRole = function (role) {
        if (authenticationService.authenticated) {
            return authenticationService.credentials.roles.indexOf(role) != -1;
        } else {
            return false;
        }
    };

    this.hasRoleInAccount = function (role) {
        if (authenticationService.authenticated) {
            if (authenticationService.credentials.roles.indexOf("ROLE_SUPERUSER") != -1) {
                return true;
            } else {
                return authenticationService.accountsMap[$rootScope.currentAccount].roles.indexOf(role) != -1;
            }
        } else {
            return false;
        }
    };

    /*this.onLoad = function () {
        // check the service user/me to get the accounts and roles and
        // save them in the autentication service
        // and if token & user are ok.
        // if token & user are not ok we need to delete the cookies
        var token = $mfCookieStore.get('token');
        var usr = $mfCookieStore.get('loggedin');
        if (token != '' && usr != '') {
            $http({
                method: 'GET',
                url: akkadianPlatformApiBaseUrl + 'user/me',
                headers: {
                    'Access-Token': token
                },
            }).
            // if the ajax request goes fine success its executed
            success(function (data, status) {
                var resp = data.data;
                resp.accessToken = token;
                authenticationService.loggedIn(resp);
            }).error(function (data, status) {
                authenticationService.authenticated = false;
            });
        }
    };*/

    // I supose that you have methods similar to these ones
    this.authenticate = function (credentials64, rememberMe, $scope, $location) {
        analytics.trackTag('signin');
        var permanent = '';
        if (rememberMe) {
            permanent = '&permanent=true'
        }
        $http
        .get(akkadianPlatformApiBaseUrl + 'user/getAccessToken?credentials=' + credentials64 + permanent)
        .success(function (resp, status) {
            var credentials = resp.data;
            $scope.username = credentials.user;
            $scope.accessToken = credentials.accessToken;
            $scope.credentials = credentials;
            if (!resp.success) {
                $scope.message = "Invalid Username or Password";
            } else {
                $scope.message = "Welcome, Your Username is: " + credentials.user;
                authenticationService.loggedIn(credentials);
                if (rememberMe) {
                    $mfCookieStore.put('loggedin', credentials.user, {
                        expires: 365
                    });
                    $mfCookieStore.put('token', credentials.accessToken, {
                        expires: 365
                    });
                } else {
                    $mfCookieStore.put('loggedin', credentials.user);
                    $mfCookieStore.put('token', credentials.accessToken);
                }
                $scope.doingLogin = false;
                $location.path('/admin');
                analytics.trackSuccess('signin');
            }
        })
        .error(function (credentials, status) {
            $scope.doingLogin = false;
            $scope.credentials = credentials || false;
            $scope.status = status;
            $scope.message = "Invalid Username or Password";
            authenticationService.authenticated = false;
            analytics.trackError('signin');
        });
    };

    this.logout = function () {
        analytics.trackTag('userlogout');
        $mfCookieStore.remove('token');
        $mfCookieStore.remove('loggedin');
        authenticationService.authenticated = false;
        for (var i = 0; i < authenticationService.credentials.roles.length; i++) {
            var role = authenticationService.credentials.roles[i];
            authenticationService['is' + role] = false;
        }
        authenticationService.credentials = {};
        $location.path('/');
    };

    this.isAccountComplete = function () {
        var currentAccount = authenticationService.accountsMap[$rootScope.currentAccount];
        var isComplete = currentAccount && !currentAccount.incompleteAccount;
        return isComplete;
    };

    this.reauthenticate = function () {
        authenticationService.authenticated = false;

        $http({
            method: 'GET',
            url: akkadianPlatformApiBaseUrl + 'user/me',
            headers: {
                'Access-Token': authenticationService.credentials.accessToken
            },
        }).
        // if the ajax request goes fine success its executed
        success(function (data, status) {
            var resp = data.data;
            resp.accessToken = authenticationService.credentials.accessToken;
            authenticationService.loggedIn(resp);
        }).error(function (data, status) {
            authenticationService.authenticated = false;
        });
    };
    return authenticationService;
};
