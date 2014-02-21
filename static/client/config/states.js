app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            template: '<a href="/api/facebook">facebook</a>'
        })
        .state('create_user', {
            url: '/create-user',
            templateUrl: '/static/client/users/partials/create-user.html',
            controller: 'createUserController'
        })


    $urlRouterProvider.otherwise("/index")

});