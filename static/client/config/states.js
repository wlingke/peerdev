app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            template: '<a href="/api/facebook">facebook</a>'
        })
        .state('create_account', {
            url: '/create-account',
            templateUrl: '/static/client/users/partials/create-account.html',
            controller: 'createAccountController'
        })


    $urlRouterProvider.otherwise("/index")

});