app.controller('indexController', function ($scope, Project) {
    $scope.last_id = undefined;
    $scope.projects = [];
    $scope.limit = 2;

    $scope.query = function () {
        var q =
            Project.find()
                .limit($scope.limit)
                .sort("-_id")
                .populate('owner');
        if ($scope.last_id) {
            q.compare('_id < ' + $scope.last_id);
        }

        q.exec().then(function(data){
            $scope.projects = $scope.projects.concat(data);
        });
    };
    $scope.query();
    $scope.loadMore = function(){
        $scope.last_id = $scope.projects[$scope.projects.length-1].getId();
        $scope.query()
    }
});