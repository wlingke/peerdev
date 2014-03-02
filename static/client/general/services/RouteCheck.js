app.factory('RouteCheck', function ($rootScope, Initialize, $q, $log) {

    /**
     *
     * @param runFnc - must be one of the predefined run functions below
     * @param data - object
     * @returns {IPromise<T>}
     */
    var routeChecker = function (runFnc, data) {
        var deferred = $q.defer();
        var run = function () {
            if (typeof runFnc === 'function') {
                runFnc(deferred, data);
            }
        };

        if ($rootScope.isLogged) {
            run();

        } else {
            Initialize.getCurrentUser().then(function () {
                run();
            }, function (reason) {
                $log.error(reason);
                deferred.reject(reason);
            });
        }

        return deferred.promise;
    };

    //route checkers, used in routeChecker
    var loggedIn = function (deferred) {
        if ($rootScope.isLogged) {
            deferred.resolve();
        } else {
            deferred.reject({type: 'redirect', state: 'route_error.users_only'});
        }
    };

    return {
        loggedIn: function () {
            return routeChecker(loggedIn);
        }
    }

});