'use strict';

/* 
  user-list-pagination that overrides angularUI bootstrap pagination 
  http://angular-ui.github.io/bootstrap/#/pagination 
  with slight modifications according to requirements
*/
mindFrameApp.directive('userListPagination', ['$parse', 'paginationConfig',
    function ($parse, config) {
        return {
            restrict: 'EA',
            scope: {
                page: '=',
                totalItems: '=',
                onSelectPage: ' &',
                numPages: '='
            },
            controller: 'PaginationController',
            templateUrl: 'templates/user_list_pagination.html',
            replace: true,
            link: function (scope, element, attrs, paginationCtrl) {

                // Setup configuration parameters
                var maxSize,
                    boundaryLinks = paginationCtrl.getAttributeValue(attrs.boundaryLinks, config.boundaryLinks),
                    directionLinks = paginationCtrl.getAttributeValue(attrs.directionLinks, config.directionLinks),
                    firstText = paginationCtrl.getAttributeValue(attrs.firstText, config.firstText, true),
                    previousText = paginationCtrl.getAttributeValue(attrs.previousText, config.previousText, true),
                    nextText = paginationCtrl.getAttributeValue(attrs.nextText, config.nextText, true),
                    lastText = paginationCtrl.getAttributeValue(attrs.lastText, config.lastText, true),
                    rotate = paginationCtrl.getAttributeValue(attrs.rotate, config.rotate);

                paginationCtrl.init(config.itemsPerPage);

                if (attrs.maxSize) {
                    scope.$parent.$watch($parse(attrs.maxSize), function (value) {
                        maxSize = parseInt(value, 10);
                        paginationCtrl.render();
                    });
                }

                // Create page object used in template
                function makePage(number, text, isActive, isDisabled, isFirstPage, isLastPage, isPreviousPage,
                    isNextPage) {
                    var attrFirstPage = (isFirstPage) ? isFirstPage : false;
                    var attrLastPage = (isLastPage) ? isLastPage : false;
                    var attrPreviousPage = (isPreviousPage) ? isPreviousPage : false;
                    var attrNextPage = (isNextPage) ? isNextPage : false;

                    return {
                        number: number,
                        text: text,
                        active: isActive,
                        disabled: isDisabled,
                        firstPage: attrFirstPage,
                        lastPage: attrLastPage,
                        previousPage: attrPreviousPage,
                        nextPage: attrNextPage
                    };
                }

                paginationCtrl.getPages = function (currentPage, totalPages) {
                    var pages = [];

                    // Default page limits
                    var startPage = 1,
                        endPage = totalPages;
                    var isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages);

                    // recompute if maxSize
                    if (isMaxSized) {
                        if (rotate) {
                            // Current page is displayed in the middle of the visible ones
                            startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                            endPage = startPage + maxSize - 1;

                            // Adjust if limit is exceeded
                            if (endPage > totalPages) {
                                endPage = totalPages;
                                startPage = endPage - maxSize + 1;
                            }
                        } else {
                            // Visible pages are paginated with maxSize
                            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

                            // Adjust last page if limit is exceeded
                            endPage = Math.min(startPage + maxSize - 1, totalPages);
                        }
                    }

                    // Add page number links
                    for (var number = startPage; number <= endPage; number++) {
                        var page = makePage(number, number, paginationCtrl.isActive(number), false);
                        pages.push(page);
                    }

                    // Add links to move between page sets
                    if (isMaxSized && !rotate) {
                        if (startPage > 1) {
                            var previousPageSet = makePage(startPage - 1, '...', false, false);
                            pages.unshift(previousPageSet);
                        }

                        if (endPage < totalPages) {
                            var nextPageSet = makePage(endPage + 1, '...', false, false);
                            pages.push(nextPageSet);
                        }
                    }
                    // Add first & last links
                    if (boundaryLinks) {
                        var firstPage = makePage(1, firstText, false, paginationCtrl.noPrevious(), true);
                        pages.unshift(firstPage);

                        var lastPage = makePage(totalPages, lastText, false, paginationCtrl.noNext(), false, true);
                        pages.push(lastPage);
                    }

                    // Add previous & next links
                    if (directionLinks) {
                        var previousPage = makePage(currentPage - 1, previousText, false, paginationCtrl.noPrevious(),
                            false, false, true);
                        pages.unshift(previousPage);

                        var nextPage = makePage(currentPage + 1, nextText, false, paginationCtrl.noNext(), false,
                            false, false, true);
                        pages.push(nextPage);
                    }
                    return pages;
                };
            }
        };
    }
]);