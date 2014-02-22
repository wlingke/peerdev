app.controller('appController', function ($scope, GeneralModals, $http, $window) {
    $scope.loginModal = function () {
        GeneralModals.loginModal();
    };

    $scope.logout = function () {
        $http.post('/api/logout').success(function () {
            $window.location.pathname = '/';
        })
    }
});