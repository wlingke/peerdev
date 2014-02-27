RVStatus.directive('rvStatus', function () {
    return {
        templateUrl: function (tElem, tAttrs) {
            if (tAttrs.srcType === 'error') {
                return '/static/library/RVStatus/partials/error-only-template.html';
            }

            return tAttrs.src ? tAttrs.src : '/static/library/RVStatus/partials/status-template.html';
        },
        replace: true,
        scope: {
            rvStatus: "="
        },
        link: function (scope, elem, attrs) {

        }
    };
});

/**
 * Transcludes element while also publishing a standard 'loadStatus' property onto the transcluded scope which is
 * bound to the original statusObj. Normally scope properties cannot be passed into transcluded scope, but passing it
 * in this case makes it easier to transclude general templates because you can show/hide stuff by binding to
 * 'loadStatus' instead of a custom status object.
 *
 * Usage:
 * <div rv-load-status="statusObj">
 *     <div>Show always</div>
 *     <div ng-show='loadStatus.hasSuccess'>Show on success</div>
 *     <div ng-show='loadStatus.hasError'>Show on error</div>
 *     <div ng-show='loadStatus.isWorking'>Show while loading stuff</div>
 * </div>
 *
 * Add attributes 'custom-error' false and 'custom-working' to show default error and working messages.
 *
 *
 * Note: transcluded directives will lose two-way binding with any scope.property that is a literal. To fix, bind to an model: like scope.data.property.
 */
RVStatus.directive('rvLoadStatus', function () {
    var defaultError = '<div ng-if="loadStatus.hasError"><h2 class="text-center text-danger">{{ loadStatus.msg }}</h2></div>';
    var defaultWorking = '<div ng-if="loadStatus.isWorking"><h1 class="text-center text-info"><i class="fa fa-spinner fa-spin ie8n9-hide fa-fw"></i> {{ loadStatus.msg }}</h1></div>';

    return {
        template: '<div></div>', //MUST specify this. Otherwise elements created in compile phase can't access the scope for some reason.
        transclude: true,
        scope: {
            loadStatus: "=rvLoadStatus"
        },
        compile: function (tElem, tAttrs) {
            var errorElem, workingElem;

            if (typeof tAttrs.customError === 'undefined') {
                errorElem = angular.element(defaultError);
                tElem.append(errorElem);
            }
            if (typeof tAttrs.customWorking === 'undefined') {
                workingElem = angular.element(defaultWorking);
                tElem.append(workingElem);
            }

            return function (scope, elem, attrs, ctrl, $transclude) {
                $transclude(undefined, function (clone, tScope) {
                    //makes loadStatus available to transcluded scope
                    tScope.loadStatus = scope.loadStatus;

                    //manually adds the transcluded clone into the proper location.
                    elem.append(clone);
                });
            };
        }
    };
});

/**
 * Convenience child directive to rvLoadStatus
 * Show/hides various content based on loadStatus
 *
 * Usage:
 * <div rv-load-status="statusObj">
 *     <div rv-load-status-on="success">
 *         Success Content here
 *     </div>
 * </div>
 *
 * Other optional values for rv-load-status-on are 'error' and 'working'
 * */
RVStatus.directive('rvLoadStatusOn', function () {

    //Remember that loadStatus is published onto this scope from rvLoadStatus
    return {
        template: function (tElement, tAttrs) {
            switch (tAttrs.rvLoadStatusOn) {
                case 'success':
                    return '<div ng-show="loadStatus.hasSuccess"><div ng-transclude></div></div>';
                case 'error':
                    return '<div ng-show="loadStatus.hasError"><div ng-transclude></div></div>';
                case 'working':
                    return '<div ng-show="loadStatus.isWorking"><div ng-transclude></div></div>';
                default:
                    return '<div ng-transclude></div>';
            }
        },
        transclude: true,
        link: function (scope, elem, attrs, ctrl) {
        }
    };
});


/**
 * Converts a button to automtically disable button and show working status message based on an rvStatus object.
 *
 * Required Input:
 * @param rvStatusBtn - rvStatus Object (it's technically optional but if you don't specify this, nothing will happen)
 *
 * Optional Input:
 * @param btnTextBind - expression when evaluated returns the default button text. Allows for binding of the text. Otherwise the actual expression {{ bind }} gets put into text.
 * NOTE: This only allows you to input an expression to evaluate into text. This does NOT provide reliable 2-way binding of button text because button will not know when the
 * input variable changes (ie no watch expression on this variable is generated).
 *
 * @param rvDisabled - use this instead of ngDisabled. Same usage pattern.
 *
 * Usage
 * ------------
 * HTML:
 * <button type='button' class='btn btn-default' rv-status-btn='saveStatus' ng-click="save()">Save Changes</button>
 *
 * Controller:
 * $scope.saveStatus = StatusService.createSaveStatus();
 * $scope.save = function(){
 *  $scope.saveStatus.showWorking();
 *  save().then(function(){
 *      $scope.saveStatus.reset();
 *  })
 * }
 *
 */
RVStatus.directive('rvStatusBtn', function (StatusService) {
    return {
        link: function (scope, elem, attr) {
            var defaultText = elem.text();

            var statusWorking = attr.rvStatusBtn + '.isWorking';
            var watchExp = !!attr.rvDisabled ? statusWorking + " || " + attr.rvDisabled : statusWorking;

            var btnHtml = '<i class="fa fa-spinner fa-spin ie8n9-hide fa-fw"></i> ';

            scope.$watch(watchExp, function (value) {
                attr.$set('disabled', value);
            });

            scope.$watch(statusWorking, function (value) {
                if (value)
                    elem.html(btnHtml + scope.$eval(attr.rvStatusBtn)['msg']);
                else {
                    elem.html(scope.$eval(attr.btnTextBind) || defaultText);
                }
            });

        }
    };
});