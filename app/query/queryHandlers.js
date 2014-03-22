'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


module.exports.init = function (model_type) {

    return function (req, res, next) {
        req.pd = {};
        req.pd.params = req.query || {};
        req.pd.model = mongoose.model(capitalize(model_type));
        next();
    }
};

module.exports.buildConditions = function (req, res, next) {
    var params = req.pd.params;

    if (_.isUndefined(req.pd)) {
        return next(new Error('Must initialize query'));
    }

    function tryJSONParse(str) {
        try {
            return JSON.parse(str)
        } catch (e) {

            //Returns string only in the type is findOne
            return params.type === 'findOne' ? str : {};
        }
    }

    // Sets the conditions for the query (usually filters)
    req.pd.conditions = tryJSONParse(params.conditions);
    next()
};



module.exports.buildQuery = function (req, res, next) {
    var params = req.pd.params,
        model = req.pd.model,
        conditions = req.pd.conditions || {},
        query;

    if (_.isUndefined(req.pd)) {
        return next(new Error('Must initialize query'));
    }

    // Checks that the type is one of the correct types.
    function checkType(type) {
        return type === 'find' || type === 'findById' || type === 'findOne' || type === 'count';
    }

    if (!checkType(params.type)) {
        return next(new Error('Query type:' + params.type + 'is invalid'))
    }

    query = model[params.type](conditions);

    if (!model) {
        return next(new Error('No model is available'))
    }

    // Sets select
    if (params.select) {
        query.select(params.select);
    }

    //Limit queries to specified or 100 results and limits max queries to 1000.
    var limit = parseInt(params.limit, 10);
    if (!_.isNaN(limit) && limit <= 1000) {
        query.limit(limit);
    } else {
        query.limit(100);
    }


    // Limit skip to 200

    var skip = parseInt(params.skip, 10);
    if (!_.isNaN(skip) && skip <= 200) {
        query.skip(skip);
    }

    // Allows for 5 populations of one level. If need deeper population, should write custom query handler.

    if (params.populate) {
        //Allows a maximum of 5 populates and only one level deep
        var populate = params.populate.split('+').slice(0, 5);
        populate.forEach(function (value, index, self) {
            var arr = value.split('/');
            query.populate(arr[0], arr[1]);
        })
    }

    // Handles basic inequality comparisons.
    if (params.compare) {
        var operators = [
            {
                op: '<=',
                fn: 'lte'
            },
            {
                op: '>=',
                fn: 'gte'
            },
            {
                op: '<',
                fn: 'lt'
            },
            {
                op: ">",
                fn: 'gt'
            }
        ];
        var compare = params.compare.split('+').slice(0, 10);
        compare.forEach(function (value, index, self) {
            for (var i = 0, ii = operators.length; i < ii; i++) {
                var arr = value.split(operators[i].op);
                if (arr.length === 2) {
                    query[operators[i].fn](arr[0], arr[1]);
                    break;
                }
            }
        })
    }

    // Allows for sorting
    if (params.sort) {
        query.sort(params.sort);
    }

    req.pd.query = query;
    next();
};


module.exports.exec = function (req, res, next) {
    if (_.isUndefined(req.pd)) {
        return next(new Error('Must initialize query'));
    }

    if (!req.pd.query) {
        return next(new Error('No query is available in req.pd.query'))
    }

    req.pd.query.exec(function (err, data) {

        if (err) {
            return res.send(404, err);
        }
        req.pd.data = data;
        next();
    });

};

module.exports.send = function (req, res, next) {
    if (!req.pd || !req.pd.data) {
        return next(new Error('Cannot find req.pd.data'))
    }
    res.send(200, req.pd.data);
};