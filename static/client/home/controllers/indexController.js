app.controller('indexController', function ($scope, Project, APILazy) {
    var q =
        Project.find()
            .limit(10)
            .populate('owner')

    $scope.lazy = APILazy.create(q);
});