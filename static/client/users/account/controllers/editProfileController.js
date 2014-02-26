app.controller('editProfileController', function ($scope, $rootScope, GeneralCategories, StatusService, RVValidate, UniversalAlertService, Initialize, $q, GoogleMaps) {
    $scope.profile = angular.copy($rootScope.current_user);
    $scope.states = GeneralCategories.states;
    $scope.save_status = StatusService.createSaveStatus();

    $scope.save = function () {
        var saveProfile = function (setLocation) {
            RVValidate.validate($scope, 'edit_profile', {
                status: 'save_status',
                valid: function () {
                    $scope.profile.save(undefined, setLocation)
                        .then(function () {
                            return Initialize.getCurrentUser();
                        }, function (err) {
                            $scope.save_status.reset();
                            if (err.pd1000 || err.pd1100) {
                                $scope.usernameError = err.pd1000;
                                $scope.emailError = err.pd1100;
                            } else {
                                UniversalAlertService.createTryAgainErrorAlert();
                            }
                            return $q.reject()
                        })
                        .then(function () {
                            $scope.save_status.reset();
                            UniversalAlertService.createTransientSuccessAlert("Profile saved successfully!");
                            $scope.profile = angular.copy($rootScope.current_user);
                        });
                }
            })
        };

        var hasChanged = function (dataName) {
            return $scope.profile.data[dataName] !== $rootScope.current_user.data[dataName];
        };

        saveProfile(hasChanged('city') && hasChanged('state'));
    }
});

app.controller('editProfileTagsController', function($scope){
    $scope.maxTags = 10;
    $scope.newTag = '';
    $scope.addTag = function(){
        if(!!$scope.newTag){
            var newTag = $scope.newTag.toLowerCase().replace(/[^a-z0-9- ]/gi, '');


        }

    }

})