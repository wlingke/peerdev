app.controller('createAccountController', function ($scope, $http, StatusService, $window, User, UniversalAlertService, RVValidate) {
    $scope.newUser = {};
    $scope.create_status = StatusService.createSaveStatus();

    $scope.createUser = function () {
        RVValidate.validate($scope, 'create_account', {
            status: 'create_status',
            valid: function () {
                User.createUser($scope.newUser)
                    .then(function () {
                        $window.location.pathname = '/account';
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