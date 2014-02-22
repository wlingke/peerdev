app.factory('Initialize', function($rootScope, $http, $q){

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
                    $rootScope.current_user = user;
                    $rootScope.isLogged = true;
                }else {
                    $rootScope.current_user = null;
                    $rootScope.isLogged = false;
                }
                deferred.resolve();
            })

        return deferred.promise;
    };

    return {
        getCurrentUser: getCurrentUser
    }

});