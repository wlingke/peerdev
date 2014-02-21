app.controller('createUserController', function($scope, $http){

    $scope.newUser = {};

    $scope.createUser = function(){
        $http({
            url: '/api/users',
            method: 'POST',
            data: $scope.newUser
        }).success(function(data){
            console.log(data);
        }).error(function(err){
            console.log(err);
        })
    }
})