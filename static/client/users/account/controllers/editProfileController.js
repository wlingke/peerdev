app.controller('editProfileController', function($scope, $rootScope, GeneralCategories, StatusService, RVValidate, $timeout){
    $scope.profile = angular.copy($rootScope.current_user);
    $scope.states = GeneralCategories.states;
    $scope.save_status = StatusService.createSaveStatus();

    $scope.save = function(){
        RVValidate.validate($scope, 'edit_profile', {
            status: 'save_status',
            valid: function(){
                $timeout($scope.save_status.reset, 1000)
            }
        })
    }
});