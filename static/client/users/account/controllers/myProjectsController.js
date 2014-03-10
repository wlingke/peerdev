app.controller('myProjectsController', function ($scope, Project, $rootScope, ConfirmModals, APILazy) {
    var q =
        Project.find()
            .conditions({owner: $rootScope.current_user.getId()})
            .select('title meta.created_at')
            .limit(10)

    $scope.lazy = APILazy.create(q);
    $scope.deleteProject = function (model, $index) {
        var instance = ConfirmModals.removeProject(model);
        instance.result.then(function () {
            $scope.lazy.removeData($index);
        });
    };
});