app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/static/client/general/partials/index.html'
        })
        .state('create_account', {
            url: '/create-account',
            templateUrl: '/static/client/users/partials/create-account.html',
            controller: 'createAccountController'
        })

        .state('account',{
            url: '/account',
            template: 'this is logged in area',
            resolve:{
                routeCheck: ["RouteCheck", function (RouteCheck) {
                    return RouteCheck.loggedIn();
                }]
            }
        })


        //route errors
        .state('route_error', {
            url: "/oops",
            templateUrl: "/static/client/route-errors/partials/route-error.html",
            abstract: true
        })
        .state('route_error.default', {
            url: "",
            templateUrl: '/static/client/route-errors/partials/not-found.html'
        })
        .state('route_error.users_only', {
            url: "/users-only",
            templateUrl: '/static/client/route-errors/partials/users-only.html'
        })


    $urlRouterProvider.otherwise("/oops")

});