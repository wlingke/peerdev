app.controller('createProjectController', function ($scope, StatusService, GeneralCategories, Project, RVValidate, UniversalAlertService, $state, $rootScope) {
    $scope.project = Project.init();
    $scope.data = {
        hide_add_info: true
    };

    $scope.save_status = StatusService.createSaveStatus();
    $scope.states = GeneralCategories.states;

    $scope.save = function () {
        RVValidate.validate($scope, 'create_project', {
            status: 'save_status',
            valid: function () {
                $scope.project.save(undefined, true)
                    .then(function () {
                        $scope.save_status.reset();
                        UniversalAlertService.createTransientSuccessAlert("Project saved successfully!");
                        $state.go('index');
                    }, function () {
                        $scope.save_status.reset();
                        UniversalAlertService.createTryAgainErrorAlert();
                    })
            }
        })
    }
});