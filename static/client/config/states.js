app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/static/client/general/partials/index.html'
        })
        .state('create_account', {
            url: '/create-account',
            templateUrl: '/static/client/users/account/partials/create-account.html',
            controller: 'createAccountController'
        })

        .state('profile', {
            url: '/profile',
            templateUrl: '/static/client/users/account/partials/edit-profile.html',
            controller: 'editProfileController',
            resolve: {
                routeCheck: ["RouteCheck", function (RouteCheck) {
                    return RouteCheck.loggedIn();
                }]
            }
        })
        .state('new_project', {
            url: '/create-project',
            templateUrl: '/static/client/projects/partials/create-project.html',
            controller: 'createProjectController',
            resolve: {
                routeCheck: ["RouteCheck", function (RouteCheck) {
                    return RouteCheck.loggedIn();
                }]
            }
        })
        .state('edit_project', {
            url: '/edit-project/:id',
            controller: 'editProjectController',
            templateUrl: '/static/client/projects/partials/edit-project.html',
            resolve: {
                project: ["$http", "$stateParams", "$q", "$rootScope", "Project", function($http, $stateParams, $q, $rootScope, Project){
                    var deferred = $q.defer();

                    $http.get('/api/projects/' + $stateParams.id)
                        .success(function(data){
                            var project = Project.init(data);
                            if($rootScope.current_user && project.getOwnerId() === $rootScope.current_user.getId()){
                                deferred.resolve(project);
                            }else {
                                deferred.reject({type: 'redirect', state: 'route_error.default'});
                            }
                        })
                        .error(function(){
                            deferred.reject({type: 'redirect', state: 'route_error.default'});
                        });

                    return deferred.promise;
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