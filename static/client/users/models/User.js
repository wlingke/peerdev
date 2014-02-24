app.factory('User', function (BaseModel, $http, $q) {
    function User(json) {
        BaseModel.getModel().call(this, json)
        this.url = User.url;
    }

    BaseModel.inherit(User);

    User.url = '/api/users';

    User.createUser = function (data) {
        var deferred = $q.defer();
        $http(
            {
                url: User.url,
                method: 'POST',
                data: data
            }
        )
            .success(function (data) {
                deferred.resolve(data)
            }).error(function (err) {
                deferred.reject(err)
            });
        return deferred.promise;
    };


    return {
        getModel: function () {
            return User;
        },
        init: function (json) {
            return new User(json);
        },
        createUser: User.createUser
    }
});