'use strict';

mindFrameControllers.controller('adminMenuCtrl', ['$scope', '$routeParams',
    '$route',
    '$location',
    'authenticationService',
    '$element',
    '$timeout',
    'ngProgress',
    function ($scope, $routeParams, $route, $location, authenticationService, $element, timer, ngProgress) {

        var location = $location.path().substring(7);
        $scope.authenticationService = authenticationService;
        $scope.activeTab = location;
        $scope.activeMenu = 'mindframe';
        $scope.changeAdminMenu = function (menu) {
            $scope.activeMenu = menu;
        };

        $scope.clientsMenu = function (e) {
            $location.path('/admin/clients/onCloud');
            $scope.underlineMenu(e);
        };

        $scope.accountInfoMenu = function (e) {
            $location.path('/admin/account');
            $scope.underlineMenu(e);
        };

        $scope.underlineMenu = function (e){
            var targetElementAnchor= $(e.target).next('ul').find('>li:first-child a');
            targetElementAnchor.addClass('underlined');
        }

        $scope.setMenuEvents = function () {
            var adminNavRoot = $($element).find('ul.admin-nav');
            function showNavItem(item) {
                hideSubnavs();
                var submenuContainer = item.next('.dropdown-menu');
                if ( !! submenuContainer.length) {
                    setTimeout(function () {
                        submenuContainer
                            .css({
                                opacity: 0,
                                left: '0px',
                                display: 'block'
                            })
                            .animate({
                                opacity: 1,
                                left: '0px'
                            });

                    });
                    $('header.wide-top.theme-blue').addClass('header-extended');
                    $('div.view-frame').addClass('frame-extended');
                     $('ul.dropdown-menu.header-dropdown').removeClass('hidden');
                }
            }

            function hideSubnavs() {
                adminNavRoot.find('[role="menu"]').css({
                    display: 'none'
                });
            }

            if ( !! adminNavRoot.length) {
                adminNavRoot.find('a').on('click', function (e) {
                    adminNavRoot.find('.active').removeClass('active');
                    $(this).addClass('active').closest('.dropdown').find('[role="button"]').addClass('active');
                    // actions for level 0 menu items
                    if ($(this).is('[role="button"]')) {
                        e.preventDefault();
                        showNavItem($(this));
                    } else if ($(this).is('[role="menuitem"]')) {
                        $('a.underlined').removeClass('underlined');
                        if (!$(this).closest('ul').hasClass('dropdown-menu')) {
                            $('header.header-extended').removeClass('header-extended');
                            $('div.view-frame.frame-extended').removeClass('frame-extended');
                            $('ul.dropdown-menu.header-dropdown').addClass('hidden');
                        }
                    } else if ($(this).is('[role="menuitembutton"]')) {
                        $('header.header-extended').removeClass('header-extended');
                        $('div.view-frame.frame-extended').removeClass('frame-extended');
                        showNavItem($(this));
                        e.preventDefault();
                    } else if ($(this).parent().is('.dropdown')) {
                        hideSubnavs();
                        // start the progress if is a menu item and the event is not progrematically triggered.
                        if (!arguments[1]) ngProgress.start();
                    };
                })
            }
            // look for the defaul item and show it.
            adminNavRoot.find('.default')
                .trigger('click', [true])
                .closest('.dropdown-menu')
                .css({
                    display: 'block'
                });
        };

        $scope.$watch('authenticationService.authenticated',
            function (newValue, oldValue) {
                timer($scope.setMenuEvents, 100);
            }
        );
        // menu behavior setup
        // Used timer to execute this after content is rendered.
        timer($scope.setMenuEvents, 0);
    },
]);
