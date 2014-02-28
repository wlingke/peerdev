app.controller('createProjectController', function($scope, StatusService, GeneralCategories){
    $scope.project = {data:{}};
    $scope.hide_add_info = true;
    $scope.save_status = StatusService.createSaveStatus();
    $scope.states = GeneralCategories.states;
});