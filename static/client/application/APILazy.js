app.factory('APILazy', function (StatusService) {

    /**
     * Lazy loads queries. Simple to use with infinite scroll. Loads result in decending order of creation date
     * (or _id) - may extend this in the future as need.
     *
     * Usage:
     * Bind an instance of APILazy to the scope.
     *
     * Property exports:
     * lazy.data = array of data;
     * lazy.stopLoading = boolean indicating if it is either currently querying or there are no more results
     * lazy.status = status object indicating if it is currently loading
     *
     * Public methods:
     * removeData = splices out a item from the data
     * query = runs query method. Automatically handles optimizing query using last_id and limit. Avoids using
     * skips which are database intensive operations.
     *
     * @param query_obj - APIQuery object
     * @param initial_id (optional) - id specifying the most recent _id to start with
     * @param s_call - Callback to be executed on each successful query
     * @param e_call - Callback to be executed on each error query (including results with no data)
     * @constructor
     */

    function APILazy(query_obj, initial_id, s_call, e_call) {
        this.query_obj = query_obj
            .sort("-_id");

        this.last_id = initial_id;
        this.success_callback = angular.isFunction(s_call) ? s_call : angular.noop;
        this.error_callback = angular.isFunction(e_call) ? e_call : angular.noop;
        this.status = StatusService.create();
        this.stopLoading = false;
        this.data = [];
    }

    APILazy.prototype.query = function(){
        this.status.showWorking();
        this.stopLoading = true;
        var self = this;
        var query_obj = angular.copy(this.query_obj);

        if(this.last_id){
            query_obj.compare('_id < ' + this.last_id);
        }

        return query_obj.exec()
            .then(function(data){
                self.status.reset();
                self.stopLoading = false;
                self.data = self.data.concat(data);
                self.last_id = self.data[self.data.length - 1].getId();
                self.success_callback();
            }, function(err){
                self.status.reset();
                self.error_callback();
            })
    };

    APILazy.prototype.removeData = function($index){
        this.data.splice($index,1);
    };

    return {
        create: function (query_obj, initial_id, s_call, e_call) {
            return new APILazy(query_obj, initial_id, s_call, e_call)
        }
    }

});