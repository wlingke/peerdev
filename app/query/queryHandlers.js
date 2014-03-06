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

/**
 * Must be run after initialization
 */
module.exports.buildQuery = function (req, res, next) {
    var model = req.pd.model,
        params = req.pd.params,
        query;

    if (_.isUndefined(req.pd)) {
        return next(new Error('Must initialize query'))
    }

    function checkType(type) {
        return type === 'find' || type === 'findById' || type === 'findOne' || type === 'count';
    }

    if (!checkType(params.type)) {
        return next(new Error('Query type:' + params.type + 'is invalid'))
    }

    function tryJSONParse(str) {
        try {
            return JSON.parse(str)
        } catch (e) {
            return str
        }
    }


    var conditions = tryJSONParse(params.conditions);
    query = model[params.type](conditions);


    if (params.select) {
        query.select(params.select);
    }


    if (params.limit) {
        var limit = parseInt(params.limit, 10);
        if (!_.isNaN(limit)) {
            query.limit(limit);
        }
    }

    /**
     * Doesn't allow more than 200 skips
     */
    if (params.skip) {
        var skip = parseInt(params.skip, 10);
        if (!_.isNaN(skip) && skip <= 200) {
            query.skip(skip);
        }
    }

    if (params.populate) {
        //Allows a maximum of 5 populates and only one level deep
        var populate = params.populate.split('+').slice(0, 5);
        populate.forEach(function (value, index, self) {
            var arr = value.split('/');
            query.populate(arr[0], arr[1]);
        })
    }

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

    if (params.sort) {
        query.sort(params.sort);
    }

    query.exec(function (err, data) {
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