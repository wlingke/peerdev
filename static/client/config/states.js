app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            template: 'This is the index'
        })
        .state('other', {
            url: '/other',
            template: 'this is a page with route {{ route }}',
            controller: function($location, $scope){
                $scope.route = $location.path();
            }
        });

    $urlRouterProvider.otherwise("/other")

});