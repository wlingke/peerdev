app.controller('editAccountController', function($scope, $rootScope){
    $scope.profile = angular.copy($rootScope.current_user);


});