'use strict';

mindFrameApp.factory('BreadCrumbsService', function ($rootScope, $log) {
    var data = {};
    var ensureIdIsRegistered = function (id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
    };
    return {
        push: function (id, item) {
            ensureIdIsRegistered(id);
            data[id].push(item);
            $rootScope.$broadcast('breadcrumbsRefresh');
        },
        get: function (id) {
            ensureIdIsRegistered(id);
            return angular.copy(data[id]);
        },
        setLastIndex: function (id, idx) {
            ensureIdIsRegistered(id);
            if (data[id].length > 1 + idx) {
                data[id].splice(1 + idx, data[id].length - idx);
            }
        },
        updateMindframeBreadcrumb: function (locationPath) {
            if (locationPath != '/admin/dashboard' && locationPath != '/') {
                this.push("breadcrumb", {
                    href: '#/admin/dashboard',
                    label: 'Dashboard',
                    id: 'bc-dashboard'
                })
            };
            switch (locationPath) {
            case '/':
            case '/admin/dashboard':
                this.clear();
                break;
            case '/admin/new_account':
                this.push("breadcrumb", {
                    href: '#/admin/account',
                    label: 'Clients',
                    id: 'bc-clients'
                });
                this.push("breadcrumb", {
                    href: '#/admin/new_account',
                    label: 'Create new account',
                    id: 'bc-create-new-account'
                });
                break;
            case '/admin/account':
                this.push("breadcrumb", {
                    href: '#/admin/account',
                    label: 'Clients',
                    id: 'bc-clients'
                });
                this.push("breadcrumb", {
                    href: '#/admin/account',
                    label: 'Account Info',
                    id: 'bc-account-info'
                });
                break;
            case '/admin/groups':
                this.push("breadcrumb", {
                    href: '#/admin/account',
                    label: 'Clients',
                    id: 'bc-clients'
                });
                this.push("breadcrumb", {
                    href: '#/admin/groups',
                    label: 'Groups',
                    id: 'bc-groups'
                });
                break;
            case '/admin/content':
                this.push("breadcrumb", {
                    href: '#/admin/content',
                    label: 'Manage Content',
                    id: 'bc-content'
                });
                break;
            case '/admin/persons':
                this.push("breadcrumb", {
                    href: '#/admin/persons',
                    label: 'Contacts',
                    id: 'bc-persons'
                })
                break;
            case '/admin/plans':
                this.push("breadcrumb", {
                    href: '#/admin/plans',
                    label: 'Plans',
                    id: 'bc-plans'
                })
                break;

            }
        },
        clear: function () {
            data = {};
        }
    };
}).directive('breadCrumbs', function ($log, BreadCrumbsService) {
    return {
        restrict: 'A',
        template: '<ul class="breadcrumb"><li ng-repeat=\'bc in breadcrumbs\' ng-class="{\'active\': {{$last}} }"><a id="{{bc.id}}" ng-click="unregisterBreadCrumb( $index )" ng-href="{{bc.href}}">{{bc.label}}</a></li></ul>',
        replace: true,
        compile: function (tElement, tAttrs) {
            return function ($scope, $elem, $attr) {
                var bc_id = $attr['id'],
                    resetCrumbs = function () {
                        $scope.breadcrumbs = [];
                        angular.forEach(BreadCrumbsService.get(bc_id), function (v) {
                            $scope.breadcrumbs.push(v);
                        });
                    };
                resetCrumbs();
                $scope.unregisterBreadCrumb = function (index) {
                    BreadCrumbsService.setLastIndex(bc_id, index);
                    resetCrumbs();
                };
                $scope.$on('breadcrumbsRefresh', function () {
                    resetCrumbs();
                });
            }
        }
    };

});
