'use strict';

mindFrameApp.directive('ngShowAsModal', [
    function () {
        return {
            link: function (scope, element, attrs) {
                function closeModal() {
                    element.data('nunning-close', true); // Flag to prevent multible modal close.
                    var overlay = $('.modal-backdrop').removeClass('in');
                    $('.modal-content').removeClass('in');
                    setTimeout(function () {
                        overlay.remove();
                        element.data('nunning-close', false);
                        // Set scroll to top
                        element.scrollTop(0);
                        // look for callback to execute after close modal.
                        var afterCloseLink = element.find('.modal-after-close');
                        if ( !! afterCloseLink.length) afterCloseLink.trigger('click');
                    }, 500);
                }

                function setModalHeight() {
                    var maxHeight = window.outerHeight * 65 / 100;
                    element.css({
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden',
                        'max-height': maxHeight + 'px'
                    });
                }

                $(window).off('resize.setModalHeight')
                    .on('resize.setModalHeight', function () {
                        clearTimeout(global.timeOuts['setModalHeight']);
                        global.timeOuts['setModalHeight'] = setTimeout(function () {
                            setModalHeight();
                        }, 300);
                    })

                // Element attrs.ngShowAsModal should have the scope expression to evaluate in watch
                // in order to open | close modal.
                scope.$watch(attrs.ngShowAsModal, function (newValue, oldValue) {
                    if (newValue === false && oldValue === true) {
                        // Wrap the element with modal containers.
                        if (!element.parent().is('.js-modal-wrap')) {
                            element.wrap('<div class="modal-content fade js-modal-wrap"></div>')
                                .wrap('<div class="modal-dialog js-modal-wrap"></div>')
                                .wrap('<div class="modal js-modal-wrap" id="inlineModal"></div>');
                        }
                        // Create overlay.
                        // Associated to element with data associated-element-id.
                        var overlay = $(
                            '<div class="modal-backdrop fade" modal-backdrop="" style="z-index: 1040;"></div>');
                        overlay.data('associated-element-id', element.attr('id'))
                        // Modal close callback.
                        .on('click', function () {
                            var associatedElement;
                            var associatedElementId = $(this).data('associated-element-id');
                            if (associatedElementId && associatedElementId !== '') {
                                associatedElement = $('#' + associatedElementId);
                                // Trigger modal close click.
                                if ( !! associatedElement.length) associatedElement.find('.close-modal').trigger(
                                    'click');
                            }
                            setTimeout(function () {
                                overlay.remove();
                            }, 250);
                        })
                        // Append close button
                        if (!element.find('.close-modal').length) {
                            var modalClose = $('<a id="close-modal" class="close-modal" href="#closeModal">close</a>');
                            modalClose.on('click', function (event) {
                                event.preventDefault();
                                closeModal();
                            });
                            element.prepend(modalClose);
                        }
                        // Show the modal.
                        setTimeout(function () {
                            overlay.addClass('in');
                            setTimeout(function () {
                                $('.modal-content').addClass('in');
                                setModalHeight();
                            }, 250)
                        }, 50);
                        overlay.appendTo($('body'));
                    }
                    // Close the modal if new value for watch expression is true.
                    if (newValue === true && !element.data('nunning-close')) {
                        closeModal();
                    }
                });
            }
        }
    }
]);
