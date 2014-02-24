app.factory('BaseModel', function (ModelRelations) {

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
            id: -1
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
        if (!angular.isArray(relation_data)) {
            throw 'Relation data must be an array'
        }
        if (!relation_data[0].hasOwnProperty(data)) {
            throw 'Relation missing data field'
        }

        Model = ModelRelations.getModel(relation_data[0].data.type);
        if(angular.isDefined(Model)){
            this.relations[relation_name].push(new Model(relation_data));
        }else {
            this.relations[relation_name].push(relation_data);
        }
    };

    BaseModel.prototype.getId = function(){
        return this.id;
    };
    BaseModel.prototype.getType = function(){
        return this.data.type;
    };
    BaseModel.prototype.get = function (attr_name) {
        return angular.isDefined(this.data[attr_name]) ? this.data[attr_name] : "";
    };
    BaseModel.prototype.getRelation = function(relation_name){
        return this.relations[relation_name] || [];
    };
    BaseModel.prototype.getOneRelation = function(relation_name){
        return this.getRelation(relation_name)[0];
    };
    BaseModel.prototype.getUrl = function(){
        return this.url;
    };
    BaseModel.prototype.save = function(data){
        if (angular.isDefined(this.getId())) {
            return this.update(data);
        } else {
            return this.construct();
        }
    };
    BaseModel.prototype.update = function(data){

    };
    BaseModel.prototype.construct = function(){

    };

    BaseModel.inherit = function(subType){
        var prototype = Object.create(BaseModel.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };

    return {
        getModel: function(){
            return BaseModel;
        },
        inherit: BaseModel.inherit
    }
});