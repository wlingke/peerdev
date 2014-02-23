app.factory('ModelRelations', function(){

    var relations = {};

    return {
        registerModel: function(model_string, Model) {
            relations[model_string] = Model;
        },

        registerModels: function(model_obj) {
            relations = angular.extend(relations, model_obj);
        },

        getModel: function(model_string) {
            return relations[model_string];
        }
    }

});