app.controller('appController', function ($scope, GeneralModals, $http, $window, APIQuery, User) {
    $scope.loginModal = function () {
        GeneralModals.loginModal();
    };

    $scope.logout = function () {
        $http.post('/api/logout').success(function () {
            $window.location.pathname = '/';
        })
    };

    $window.test = function(type){
        return APIQuery.init(User.getModel(), '/api/user/test', type);
    }
});