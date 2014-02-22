app.controller('appController', function($scope, GeneralModals){
    $scope.loginModal = function(){
        GeneralModals.loginModal();
    };
});