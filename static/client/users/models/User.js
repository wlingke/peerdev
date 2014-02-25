app.factory('User', function (BaseModel, $http, $q, $log) {
    function User(json) {
        BaseModel.getModel().call(this, json)
        this.url = User.url;
    }

    BaseModel.inherit(User);

    User.url = '/api/users';

    return {
        getModel: function () {
            return User;
        },
        init: function (json) {
            return new User(json);
        }
    }
});