app.factory('BaseModel', function (ModelRelations, $q, $http, $log) {

    function BaseModel(json) {
        this.data = {};
        this.relations = {};
        this.url = BaseModel.url;
        this.setData(json);
    }

    BaseModel.url = '/api';

    BaseModel.prototype.setData = function (json) {
        json = json || {
            relations: {},
            data: {},
        };
        this.data = json.data;
        this.id = json._id;

        for (var k in json.relations) {
            if (json.relations.hasOwnProperty(k)) {
                this.setRelation(k, json.relations[k]);
            }
        }

    };

    BaseModel.prototype.setRelation = function (relation_name, relation_data) {
        var Model;
        this.relations[relation_name] = [];
        var relations = this.relations[relation_name];

        if (angular.isArray(relation_data)) {

            if (!relation_data[0].hasOwnProperty('data')) {
                return $log.error('Relation missing data field');
            }
            Model = ModelRelations.getModel(relation_data[0].data.model_type);

            if (angular.isDefined(Model)) {
                angular.forEach(relation_data, function (value, key) {
                    relations.push(new Model(value));
                })
            } else {
                angular.forEach(relation_data, function (value, key) {
                    relations.push(value);
                })
            }

        } else {
            if (!relation_data.hasOwnProperty('data')) {
                return $log.error('Relation missing data field');
            }
            Model = ModelRelations.getModel(relation_data.data.model_type);

            if (angular.isDefined(Model)) {
                relations.push(new Model(relation_data));
            } else {
                relations.push(relation_data);
            }


        }
    };

    BaseModel.prototype.getId = function () {
        return this.id;
    };
    BaseModel.prototype.getType = function () {
        return this.data.type;
    };
    BaseModel.prototype.get = function (attr_name) {
        return angular.isDefined(this.data[attr_name]) ? this.data[attr_name] : "";
    };
    BaseModel.prototype.getRelation = function (relation_name) {
        return this.relations[relation_name] || [];
    };
    BaseModel.prototype.getFirstRelation = function (relation_name) {
        return this.getRelation(relation_name)[0];
    };
    BaseModel.prototype.getUrl = function () {
        return this.url;
    };
    BaseModel.prototype.save = function (data) {
        if (angular.isDefined(this.getId())) {
            return this.update(data);
        } else {
            return this.construct();
        }
    };
    BaseModel.prototype.update = function (data) {
        data = data || this.data;
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: this.getUrl() + "/" + this.getId(),
            data: data
        })
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (err) {
                $log.error(err)
                deferred.reject(err)
            });

        return deferred.promise

    };
    BaseModel.prototype.construct = function () {
        var self = this;
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: this.getUrl(),
            data: self.data
        })
            .success(function (data) {
                self.id = data.id;
                deferred.resolve(data);
            })
            .error(function (err) {
                $log.error(err);
                deferred.reject(err)
            });
        return deferred.promise
    };

    BaseModel.prototype.getFirstRelationId = function (relation_name) {
        var relation = this.getFirstRelation(relation_name)
        if (relation) {
            return relation.getId();
        } else {
            return null;
        }
    };

    BaseModel.inherit = function (subType) {
        var prototype = Object.create(BaseModel.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };

    return {
        getModel: function () {
            return BaseModel;
        },
        inherit: BaseModel.inherit
    }
});