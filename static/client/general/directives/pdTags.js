app.directive('pdTags', function () {
    return {
        scope: {
            tags: '=pdTags'
        },
        templateUrl: function (tElem, tAttrs) {
            return tAttrs.src || '/static/client/general/partials/pd-tags.html';
        },
        link: function (scope, elem, attrs) {
            scope.label = attrs.label || "Tags";
            scope.tags = scope.tags || [];
            scope.maxTags = !!parseInt(attrs.maxTags) ? parseInt(attrs.maxTags) : 10;

            scope.addTag = function () {
                if (!!scope.newTag) {
                    var newTag = scope.newTag.toLowerCase().replace(/[^a-z0-9- ]/gi, '').slice(0, 20);
                    if (scope.tags.length < scope.maxTags && scope.tags.indexOf(newTag) === -1) {
                        scope.tags.push(newTag);
                    }
                    scope.newTag = '';
                }
            };

            scope.removeTag = function (index) {
                scope.tags.splice(index, 1);
            };

            scope.tagEnter = function (e) {
                if (e.which !== 13) {
                    return true;
                }
                else {
                    e.preventDefault();
                    scope.addTag();
                    return false;
                }
            }
        }
    }
});