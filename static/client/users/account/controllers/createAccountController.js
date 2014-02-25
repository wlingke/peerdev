app.controller('createAccountController', function ($scope, $http, StatusService, $window, User, UniversalAlertService, RVValidate) {
    $scope.newUser = User.init();
    $scope.create_status = StatusService.createSaveStatus();

    $scope.createUser = function () {
        RVValidate.validate($scope, 'create_account', {
            status: 'create_status',
            valid: function () {
                $scope.newUser.save()
                    .then(function () {
                        $window.location.pathname = '/profile';
                    }, function (err) {
                        $scope.create_status.reset();
                        if (err.pd1000 || err.pd1100) {
                            $scope.usernameError = err.pd1000;
                            $scope.emailError = err.pd1100;
                        } else {
                            UniversalAlertService.createTryAgainErrorAlert();
                        }
                    });
            }
        });
    }
});