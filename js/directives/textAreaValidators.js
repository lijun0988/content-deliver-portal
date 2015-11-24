'use strict';

mindFrameApp.directive('ngTextAreaEmailValidator', [
    function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var typedEmail;
                function validateEmail(email) {
                    var re =
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                }
                element.bind('keypress', function (e) {
                    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
                    if (charCode == 9 || charCode == 13) {
                        var isValid = validateEmail(typedEmail);
                        ctrl.$error.isInvalidEmail = !isValid;
                    } else {
                        ctrl.$error.isInvalidEmail = false;
                        typedEmail = e.target.value + String.fromCharCode(charCode);
                    }
                });
            }
        }
    }
]);

mindFrameApp.directive('ngTextAreaNumberValidator', [
    function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var typedNumber;
                function validateNumber(number) {
                    return /([0-9\-\(\)\+]+)/.test(number);
                }
                element.bind('keypress', function (e) {
                    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
                    if (charCode == 9 || charCode == 13) {
                        var isNumValid = validateNumber(typedNumber);
                        ctrl.$error.isInvalidNumber = !isNumValid;
                    } else {
                        typedNumber = e.target.value + String.fromCharCode(charCode);
                        ctrl.$error.isInvalidNumber = false;
                    }
                });
            }
        }
    }
]);