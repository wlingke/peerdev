app.controller('myProjectsController', function ($scope, Project, $rootScope, ConfirmModals, StatusService) {
    $scope.last_id = undefined;
    $scope.projects = [];
    $scope.limit = 10;
    $scope.loadStatus = StatusService.create();
    $scope.stopLoading = false;

    $scope.query = function () {
        console.log('test')
        $scope.loadStatus.showWorking();
        $scope.stopLoading = true;
        var q =
            Project.find()
                .conditions({owner: $rootScope.current_user.getId()})
                .select('title meta.created_at')
                .limit($scope.limit)
                .sort("-_id")
        if ($scope.last_id) {
            q.compare('_id < ' + $scope.last_id);
        }

        q.exec().then(function (data) {
            $scope.loadStatus.reset();
            $scope.stopLoading = false;
            $scope.projects = $scope.projects.concat(data);
            $scope.last_id = $scope.projects[$scope.projects.length - 1].getId();
        }, function(err){
            $scope.loadStatus.reset();
            $scope.stopLoading = true;
        });
    };

    $scope.deleteProject = function (model, $index) {
        var instance = ConfirmModals.removeProject(model);
        instance.result.then(function () {
            $scope.projects.splice($index, 1);
        });
    };
});