app.factory('APIQuery', function ($http, $q, $log) {

    /**
     *
     * APIQuery is the front end query method for retrieving information from the backend API. To use,
     * construct an APIQuery object then chain methods as needed
     * var query = new APIQuery(Model, '/api/users', 'find');
     * query.conditions({name: 'Bob'}).sort('id').exec().then(callbacks);
     *
     * Callback will be called data which can be:
     * array of models if type is find or distinct
     * single model if type is findOne or findById
     * number if type is count
     *
     * APIQuery supports basic mongooseJS operations:
     * Conditions (which are passed into the type)
     * Select
     * Compare (for lt, lte, gt, gte operations)
     * Limit
     * Populate
     *
     * All mongodb paths should be specified with respect to 'data' or 'relations'. So to set filter condition for
     * data.name = 'Bob" use {name: 'Bob'}
     *
     *
     * Internal info:
     *
     * this._compare: array of comparison strings
     * this._populate: array of string of the form 'path/select'
     *
     * @param Model - constructor function that will be fed the data when retrieved
     * @param url - get URL
     * @param query_type - accepts 'find', 'findOne', 'findById', 'count'
     * @constructor
     */

    function APIQuery(Model, url, query_type) {

        switch (query_type) {
            case 'find':
                break;
            case 'findOne':
                break;
            case 'findById':
                break;
            case 'count':
                break;
            default:
                $log.error("query_type must be one of 'find', 'findOne', 'findById', 'count'");
                return;
        }

        if (angular.isUndefined(Model) || angular.isUndefined(url)) {
            $log.error('Must specify Model & url')
            return;
        }

        this.Model = Model;
        this.url = url;
        this.params = {
            type: query_type
        };
    }

    /**
     * Accepts conditions for the query types. This can only be used once per APIQuery.
     * @param conditions
     *      find: Object
     *      findOne: Object
     *      findById: string of the ID
     *      count: Object
     */
    APIQuery.prototype.conditions = function (conditions) {
        if (this.params.type === 'findById' && !!angular.isString(conditions)) {
            $log.error('findById only takes a string conditions argument')
            return this;
        }
        this.params.conditions = conditions;
        return this;
    };


    /**
     * Accepts string version of what mongoose accepts:
     * http://mongoosejs.com/docs/api.html#query_Query-select
     *
     * @param select (string)
     * @returns {APIQuery}
     */
    APIQuery.prototype.select = function (select) {
        if (angular.isString(select)) {
            this.params.select = select;
        }
        return this;
    };

    /**
     * Applies a numerical comparison filter
     * @param comparisons accepts string or array of strings in the form of: 'path>value' with the path name on the left and value on the right
     * separated by an operator: >, <, >=, <=
     *
     * Note, you can only use up to 10 of these.
     */
    APIQuery.prototype.compare = function (comparisons) {
        this._compare = this._compare || [];
        if (angular.isArray(comparisons)) {
            this._compare = this._compare.concat(comparisons);
        } else if (angular.isString(comparisons)) {
            this._compare.push(comparisons)
        } else {
            $log.error('Comparison must be a string or array')
        }
        return this;
    };

    /**
     * Limits results
     * @param value (Number)
     * @returns {APIQuery}
     */
    APIQuery.prototype.limit = function (value) {
        if (!angular.isNumber(value)) {
            $log.error('value must be a number');
            return this;
        }
        this.params.limit = value;
        return this;
    };

    /**
     * Skips results in the table
     *
     * WARNING: Do not skip too many rows (~200) or suffer performance issues.
     * For better perf, find first item, then skip use skip rather than skipping a bunch.
     * APIQuery does not allow more than 200 skips
     *
     * @param value (Number)
     * @returns {APIQuery}
     */
    APIQuery.prototype.skip = function (value) {
        if (!angular.isNumber(value)) {
            $log.error('Value must be a number');
            return this;
        }
        if(value > 200){
            $log.error('Cannot skip more than 200 rows');
            return this;
        }
        this.params.skip = value;
        return this;
    };

    /**
     * Accepts string version of mongoose parameters only
     * @param sort
     */
    APIQuery.prototype.sort = function(sort){
        if (angular.isString(sort)) {
            this.params.sort = sort;
        }
        return this;
    };

    /**
     * Populates a relation. Specify this multiple times to add multiple relations.
     * query.populate('user').populate('article', 'author').exec();
     *
     * NOTE: only allows max of 5 populates
     *
     * @param path (string) - required
     * @param select (string) - optional
     */
    APIQuery.prototype.populate = function (path, select) {
        this._populate = this._populate || [];
        if (angular.isString(path)) {
            var str = path;
            if (angular.isString(select)) {
                str += "/" + select;
            }
            this._populate.push(str);
        }
        return this;
    };

    APIQuery.prototype.exec = function () {
        //build compare & populate strings
        if(angular.isArray(this._compare)){
            this.params.compare = this._compare.slice(0,10).join('+');
            this.params.compare.replace('\\s+', '');
        }
        if(angular.isArray(this._populate)){
            this.params.populate = this._populate.slice(0,5).join('+');
        }
        this.params.cb = new Date().getTime();

        var self = this;
        var deferred = $q.defer();

        $http.get(this.url, {params: self.params})
            .success(function (data) {

                if (angular.isUndefined(data) || data === null) {
                    return deferred.reject('No Results')
                }

                if (angular.isArray(data)) {
                    if (data.length === 0) {
                        return deferred.reject('No Results')
                    }

                    var model_list = [];
                    angular.forEach(data, function (value) {
                        model_list.push(new self.Model(value))
                    });

                    return deferred.resolve(model_list);
                }

                return deferred.resolve(new self.Model(data))
            })
            .error(function(err){
                $log.error(err);
                return deferred.reject(err);
            });

        return deferred.promise;
    };


    return {
        init: function(Model, url, query_type){
            return new APIQuery(Model, url, query_type);
        }
    }

});