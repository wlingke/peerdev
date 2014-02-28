/**
 * Required:
 * @param rvLinkSwitch (*) - if function, it is executed. Do not use 'fnc()', use 'fnc'. If other function,
 * it will toggle between truthiness and falsiness.
 *
 * Optional:
 * @param switchText (String) - Text to switch to on click
 */

app.directive('rvLinkSwitch', function () {

    return {
        scope: {
            rvLinkSwitch: "=", //value to flip or function to execute
            switchText: "@"
        },
        link: function (scope, element, attrs) {
            scope.defaultValue = true; //controls text switch
            scope.text = [element.text(), scope.switchText];

            scope.toggle = function () {
                if (angular.isFunction(scope.rvLinkSwitch)) {
                    scope.rvLinkSwitch();
                }
                else {
                    scope.rvLinkSwitch = !scope.rvLinkSwitch;
                }
                scope.defaultValue = !scope.defaultValue;

                var text = scope.defaultValue ? scope.text[0] : scope.text[1];
                element.text(text);
            };

            element.on('click', function (e) {
                e.preventDefault();
                scope.$apply(function () {
                    scope.toggle();
                });
            });
        }
    };
});