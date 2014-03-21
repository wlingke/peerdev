app.controller('editProjectController', function($scope, project, StatusService, GeneralCategories, RVValidate, UniversalAlertService, $state){
    $scope.project = project;
    $scope.hide_add_info_switch = true;
    $scope.hide_add_info = false;
    $scope.save_status = StatusService.createSaveStatus();
    $scope.states = GeneralCategories.states;

    $scope.save = function () {
        RVValidate.validate($scope, 'edit_project', {
            status: 'save_status',
            valid: function () {
                $scope.project.save(undefined, true)
                    .then(function () {
                        $scope.save_status.reset();
                        $state.go('my_projects');
                        UniversalAlertService.createTransientSuccessAlert("Project saved successfully!", true);
                    }, function () {
                        $scope.save_status.reset();
                        UniversalAlertService.createTryAgainErrorAlert();
                    })
            }
        })
    }

});