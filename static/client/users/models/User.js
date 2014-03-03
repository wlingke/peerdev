app.factory('User', function (BaseModel, GoogleMaps, $q, Utilities, APIQuery) {
    function User(json) {
        BaseModel.getModel().call(this, json)
        this.url = User.url;
    }

    BaseModel.inherit(User);

    User.url = '/api/users';

    User.query = function(type){
        return APIQuery.init(User, User.url, type)
    }

    /**
     *
     * @param coord with properties latitude and longitude
     */
    User.prototype.setLocation = function (coord) {
        if (angular.isDefined(coord.latitude) && angular.isDefined(coord.longitude)) {
            this.data.loc = [coord.longitude, coord.latitude];
        } else {
            throw 'Coord must have a longitude and latitude';
        }
    };

    User.prototype.hasCityState = function () {
        return this.data.city && this.data.state;
    };

    User.prototype.save = function (data, setLocation) {
        var self = this;

        // Ensures URLs have a protocol
        this.data.website = Utilities.ensureUrlProtocol(this.data.website);

        // Handles geocoding location
        if (!this.hasCityState()) {
            this.data.loc = [];
        }

        var promise = $q.when((function () {
            if (self.hasCityState() && setLocation) {
                return GoogleMaps.geocode({address: self.get('city') + ', ' + self.get('state') })
                    .then(function (coord) {
                        self.setLocation(coord);
                    })
            }
            return null;
        })());

        return promise.then(function () {
            return BaseModel.getModel().prototype.save.call(self, data);
        })
    };


    return {
        getModel: function () {
            return User;
        },
        init: function (json) {
            return new User(json);
        },
        query: function(type){
            return User.query(type)
        },

        //convenience methods
        find: function(){
            return User.query('find')
        },
        findOne: function(){
            return User.query('findOne')
        },
        findById: function(){
            return User.query('findById')
        }
    }
});