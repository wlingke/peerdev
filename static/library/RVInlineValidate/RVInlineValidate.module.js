var RVInlineValidate = angular.module('RVInlineValidate',[]);
RVInlineValidate.directive('rvInlineValidate', function ($compile, $rootScope, $log) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            maxlength: "@ngMaxlength",
            charLeft: "@", //accepts true (always), onFocus
            minlength: "@ngMinlength",
            submitCallback: "=?",
            rvEmail: '@',
            type: "@",
            target: "@helpBlockTarget"
        },
        link: function (scope, element, attrs, ctrl) {
            //tracker to hold types of errors that are possible, property name should match that of NgModelController.$error
            scope.error_tracker = {};
            if (angular.isDefined(scope.maxlength)) {
                element.attr('maxlength', scope.maxlength);
                scope.error_tracker.maxlength = {
                    msg: "You may only enter a maximum of " + scope.maxlength + " characters.",
                    hasError: false
                };
            }

            if (angular.isDefined(scope.minlength)) {
                scope.error_tracker.minlength = {
                    msg: "Please enter at least " + scope.minlength + " characters.",
                    hasError: false
                };
            }

            if (angular.isDefined(attrs.required)) {
                scope.error_tracker.required = {
                    msg: "Please enter a value.",
                    hasError: false
                };
            }

            if (angular.isDefined(attrs.urlValidate)) {
                scope.error_tracker.url = {
                    msg: "Please enter a valid URL.",
                    hasError: false
                };

                var URL_REGEX = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
                ctrl.$parsers.unshift(function (value) {
                    if (ctrl.$isEmpty(value) || URL_REGEX.test(value)) {
                        ctrl.$setValidity('url', true);
                        return value;
                    } else {
                        ctrl.$setValidity('url', false);
                        return undefined;
                    }
                });
            }

            if(angular.isDefined(attrs.usernameValidate)){
                scope.error_tracker.username = {
                    msg: "Your username can only contain letters (a-z), numbers (0-9) and periods (.)",
                    hasError: false
                };

                var USERNAME_REGEXP = /^[a-z\d.]*$/i;
                ctrl.$parsers.unshift(function (value) {
                    if (ctrl.$isEmpty(value) || USERNAME_REGEXP.test(value)) {
                        ctrl.$setValidity('username', true);
                        return value;
                    } else {
                        ctrl.$setValidity('username', false);
                        return undefined;
                    }
                });
            }

            if (scope.type === "email" || angular.isDefined(attrs.rvEmail)) {
                scope.error_tracker.email = {
                    msg: "Please enter a valid email address.",
                    hasError: false
                };

                //adds custom email validator for ie8n9 because they don't support type="email"
                if ($rootScope.ie8n9) {
                    var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
                    ctrl.$parsers.unshift(function (value) {
                        if (ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value)) {
                            ctrl.$setValidity('email', true);
                            return value;
                        } else {
                            ctrl.$setValidity('email', false);
                            return undefined;
                        }
                    });
                }
            }

            scope.messages = [];
            var form_group = element.closest('.form-group');
            scope.updateOuterClass = function () {
                if (scope.messages.length === 0) {
                    form_group.removeClass('has-error');
                } else {
                    form_group.addClass('has-error');
                }
            };

            scope.updateErrorTracker = function () {
                scope.messages = [];
                angular.forEach(scope.error_tracker, function (v, k) {
                    scope.error_tracker[k].hasError = ctrl.$error[k];
                    if (v.hasError) {
                        this.push(v.msg);
                    }
                }, scope.messages);
                scope.updateOuterClass();
            };

            //handles when to show characters left
            if (scope.charLeft === 'true') {
                scope.showingCharLeft = true;
            } else if (scope.charLeft === 'onFocus') {
                scope.showingCharLeft = false;
                element.on('focus', function () {
                    scope.$apply(function () {
                        scope.showingCharLeft = true;
                    });
                });
                element.on('blur', function () {
                    scope.$apply(function () {
                        scope.showingCharLeft = false;
                    });
                });
            } else {
                scope.showingCharLeft = false;
            }

            var help_block = $compile('<div class="help-block pull-left" ng-show="messages.length !== 0">' +
                '<ul class="list-unstyled"><li ng-repeat="message in messages">{{message}}</li></ul></div>' +
                '<div class="pull-right rv-help-block" ng-class="{\'text-danger\': ngModel.length >= maxlength}" ng-if="!!maxlength" ng-show="showingCharLeft">' +
                '{{maxlength - ngModel.length}}</div>')(scope.$new());


            //handles where to append help_block
            if (!!scope.target) {
                var elem_target = element.siblings(scope.target);
                if (elem_target.length === 0) {
                    elem_target = element.closest(scope.target);
                }
                if (elem_target.length !== 0) {
                    elem_target.eq(0).after(help_block);
                } else {
                    $log.error("Could not find " + scope.target);
                    element.after(help_block);
                }
            } else {
                element.after(help_block);
            }

            //one time attachment of scope.updateErrorTracker() & compileMessages() on blur if field is dirty.
            var off = scope.$watch(function (scope) {
                return ctrl.$dirty;
            }, function (newVal) {
                if (newVal === true) {
                    element.one('blur', function () {
                        scope.$apply(function () {
                            scope.updateErrorTracker();
                        });

                        scope.$watch(function () {
                            return ctrl.$viewValue;
                        }, function (newVal) {
                            scope.updateErrorTracker();
                        });
                    });

                    off();
                }
            });

            //compiles error messages when user attempts to submit invalid form
            scope.$on('invalid-submit', function () {
                scope.updateErrorTracker();
            });

            if (angular.isDefined(scope.submitCallback)) {
                scope.$watch('submitCallback', function (newVal) {
                    if (!!newVal) {
                        scope.messages.push(newVal);
                        scope.updateOuterClass();
                        scope.submitCallback = "";
                    }
                });
            }
        }
    };
});
