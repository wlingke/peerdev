app.factory('Project', function (BaseModel, GoogleMaps, $q, Utilities, APIQuery, GeneralCategories) {
    function Project(json) {
        BaseModel.getModel().call(this, json, ['owner'])
        this.url = Project.url;
        if (moment().from(this.getMeta('created_at'), 'days')[0] >= 15) {
            this.data.active = false;
        } else {
            this.data.active = true;
        } 
    }

    BaseModel.inherit(Project);

    Project.url = '/api/projects';
    Project.query = function(type){
        return APIQuery.init(Project, Project.url, type)
    };
    /**
     *
     * @param coord with properties latitude and longitude
     */
    Project.prototype.setLocation = function (coord) {
        if (angular.isDefined(coord.latitude) && angular.isDefined(coord.longitude)) {
            this.data.loc = [coord.longitude, coord.latitude];
        } else {
            throw 'Coord must have a longitude and latitude';
        }
    };

    Project.prototype.hasCityState = function () {
        return this.data.city && this.data.state;
    };

    Project.prototype.getCityState = function(fullState){
        var city = this.get('city') || '';
        var stateAbbr = this.get('state') || '';
        var state = fullState ? GeneralCategories.getFullState(stateAbbr, true) : stateAbbr;

        if (!city || !state) {
            return city + state;
        } else {
            return city + ", " + state;
        }
    }

    Project.prototype.getOwner = function(){
        return this.getFirstRelation('owner');
    };

    Project.prototype.getOwnerId = function(){
        return this.getFirstRelationId('owner');
    };

    Project.prototype.save = function (data, setLocation) {
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
            return Project;
        },
        init: function (json) {
            return new Project(json);
        },
        query: function(type){
            return Project.query(type)
        },

        //convenience methods
        find: function(){
            return Project.query('find')
        },
        findOne: function(){
            return Project.query('findOne')
        },
        findById: function(){
            return Project.query('findById')
        },
        count: function(){
            return Project.query('count')
        }
    }
});