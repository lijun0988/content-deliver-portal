/*
    ngMessages 1.0.0 - user messages for AngularJS
*/
angular.module('ngMessages.provider', [])
    .provider('ngMessages', function () {
        'use strict';
        //Default values for provider
        this.autoCloseTime = 3000;
        this.autoCloseTimeOut;
        this.message = '';
        this.$get = ['$document',
            '$window',
            '$compile',
            '$rootScope', function ($document, $window, $compile, $rootScope) {
            var message = this.message,
                autoCloseTime = this.autoCloseTime,
                autoCloseTimeOut = this.autoCloseTimeOut,
                $scope = $rootScope,
                $body = $document.find('body');

            // hide message
            function hideMessage(){
                $('#ngMessages-container').removeClass('showing')
                    .find('.message').text('').end().find('.close-message').hide();
                clearTimeout(autoCloseTimeOut);
            }

            // The ID for the interval controlling start()
            return {
                hide: function () {
                    hideMessage();
                },
                show: function (text, type, autoClose) {
                    if(!text || text === '') return;
                    var messageWrapper = $('#ngMessages-container');
                    messageWrapper.find('#ngMessages').removeAttr('class').addClass(type || 'success');
                    messageWrapper.addClass('showing').find('.message').text(text);
                    messageWrapper.find('.close-message').show();
                    messageWrapper.find('.close-message').on('click', function(e){
                        e.preventDefault();
                        hideMessage();
                    })

                    // scroll to top in order to see the message.
                    // $('html, body').animate({scrollTop: 0}, 500);

                    if(autoClose){
                        autoCloseTimeOut = setTimeout(function(){
                            hideMessage();
                        }, autoCloseTime)
                    }

                },
                css: function (args) {
                    return messageWrapperElement.children().css(args);
                }
            };
        }];
    });


angular.module('ngMessages', ['ngMessages.provider']);
