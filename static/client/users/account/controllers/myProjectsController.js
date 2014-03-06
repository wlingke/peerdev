app.controller('myProjectsController', function($scope, Project, $rootScope){
    $scope.projects = [];
    Project.find()
        .conditions({owner: $rootScope.current_user.getId()})
        .exec()
        .then(function(projects){
            $scope.projects = $scope.projects.concat(projects);
        })
});