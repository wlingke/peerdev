app.factory('User', function(BaseModel){
    function User (json){
        BaseModel.getModel().call(this, json)
    }
    BaseModel.inherit(User);


    return {
        getModel: function(){
            return User;
        },
        init: function(json){
            return new User(json);
        }
    }
});