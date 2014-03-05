app.controller('indexController', function ($scope, Project) {
    $scope.last_id = undefined;

    $scope.query = function () {
        var q =
            Project.find()
                .limit(10)
                .sort("+_id")
                .populate('owner')
        if ($scope.last_id) {
            q.compare('_id > ' + $scope.last_id);
        }

        q.exec().then(function(data){
            $scope.projects = data;
        })
    }

    $scope.query();
});