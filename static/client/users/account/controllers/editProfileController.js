app.controller('editProfileController', function ($scope, $rootScope, GeneralCategories, StatusService, RVValidate, UniversalAlertService, Initialize) {
    $scope.profile = angular.copy($rootScope.current_user);
    $scope.states = GeneralCategories.states;
    $scope.save_status = StatusService.createSaveStatus();

    $scope.save = function () {
        RVValidate.validate($scope, 'edit_profile', {
            status: 'save_status',
            valid: function () {
                $scope.profile.save()
                    .then(function (profile) {
                        return Initialize.getCurrentUser();
                    }, function (err) {
                        $scope.save_status.reset();
                        if (err.pd1000 || err.pd1100) {
                            $scope.usernameError = err.pd1000;
                            $scope.emailError = err.pd1100;
                        } else {
                            UniversalAlertService.createTryAgainErrorAlert();
                        }
                    })
                    .then(function () {
                        $scope.save_status.reset();
                        UniversalAlertService.createTransientSuccessAlert("Profile saved successfully!");
                        $scope.profile = angular.copy($rootScope.current_user);
                    });
            }
        })
    }
})
;