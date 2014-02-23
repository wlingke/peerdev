app.factory('Initialize', function($rootScope, $http, $q, ModelRelations, User){

    /**
     * Fetches the current user.
     * Sets $rootScope.isLogged, $rootScope.current_user
     *
     * @returns {IPromise<T>} - returns a resolved promise
     */
    var getCurrentUser = function () {
        var deferred = $q.defer();
        //noinspection JSValidateTypes
        $http({method: "GET", url: "/api/current_user", params: { 'foobar': new Date().getTime() }})
            .success(function (user) {
                if(user){
                    $rootScope.current_user = User.init(user);
                    $rootScope.isLogged = true;
                }else {
                    $rootScope.current_user = null;
                    $rootScope.isLogged = false;
                }
                deferred.resolve();
            });

        return deferred.promise;
    };

    var models = function(){
        ModelRelations.registerModels({
            user: User.getModel()
        })
    };

    return {
        getCurrentUser: getCurrentUser,
        models: models
    }

});