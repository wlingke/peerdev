app.factory('BaseModel', function (ModelRelations, $q, $http, $log) {

    /**
     *
     * @param json
     * @param relation_names Array of strings describing relations a model may have.
     * @constructor
     */
    function BaseModel(json, relation_names) {
        this.data = {};
        this.relations = {};
        this.url = BaseModel.url;
        this.setData(json, relation_names);
    }

    BaseModel.url = '/api';

    BaseModel.prototype.setData = function (json, relation_names) {
        json = json || {};
        var self = this;

        if (angular.isArray(relation_names)) {
            angular.forEach(relation_names, function (v) {
                if (json.hasOwnProperty(v)) {
                    self.setRelation(v, json[v]);
                    delete json[v];
                }
            })
        }

        this.data = json;

    };

    BaseModel.prototype.setRelation = function (relation_name, relation_data) {
        var Model;
        this.relations[relation_name] = [];
        var relations = this.relations[relation_name];

        if (angular.isArray(relation_data)) {

            Model = ModelRelations.getModel(relation_data[0].model_type);
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
            Model = ModelRelations.getModel(relation_data.model_type);

            if (angular.isDefined(Model)) {
                relations.push(new Model(relation_data));
            } else {
                relations.push(relation_data);
            }
        }
    };

    BaseModel.prototype.getId = function () {
        return this.data._id;
    };
    BaseModel.prototype.getType = function () {
        return this.data.model_type;
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