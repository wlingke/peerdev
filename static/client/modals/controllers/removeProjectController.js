app.controller('removeProjectController', function ($scope, StatusService, $modalInstance, UniversalAlertService) {
    $scope.confirm_status = StatusService.create('Removing...');
    $scope.actionBtnText = 'Delete';
    $scope.actionBtnClass = 'btn-danger';

    if (typeof $scope.message === 'undefined') {
        $scope.message = "Are you sure you want to delete this project? This action cannot be reversed.";
    }

    $scope.action = function () {
        $scope.confirm_status.showWorking();
        $scope.project.destroy()
            .then(function () {
                $modalInstance.close();
            }, function () {
                UniversalAlertService.createTryAgainErrorAlert();
                $modalInstance.dismiss('error');
            });
    }
})