app.controller('myProjectsController', function($scope, Project, $rootScope, ConfirmModals){
    $scope.projects = [];
    Project.find()
        .conditions({owner: $rootScope.current_user.getId()})
        .select('title meta.created_at')
        .sort('_id')
        .exec()
        .then(function(projects){
            $scope.projects = $scope.projects.concat(projects);
        });

    $scope.deleteProject = function(model, $index){
        var instance = ConfirmModals.removeProject(model);
        instance.result.then(function(){
            $scope.projects.splice($index, 1);
        })

    }
});