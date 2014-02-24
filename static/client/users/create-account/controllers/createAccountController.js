app.controller('createAccountController', function ($scope, $http, StatusService, $window, User, UniversalAlertService) {
    $scope.newUser = {};
    $scope.create_status = StatusService.createSaveStatus();

    $scope.createUser = function () {
        if (false && $scope.create_user.$invalid) {
            $scope.$broadcast('invalid-submit');
            $scope.create_status.reset();
        } else {
            $scope.create_status.showWorking();

            User.createUser($scope.newUser)
                .then(function () {
                    $window.location.pathname = '/account';
                }, function (err) {
                    console.log(err);
                    $scope.create_status.reset();
                    UniversalAlertService.createTryAgainErrorAlert();
                });

        }
    }
});