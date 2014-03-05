'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeDataAttr(str){
    return str === "_id" ? str : 'data.' + str;
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
    var modified_conditions = {};
    if (_.isObject(conditions)) {
        var keys = Object.keys(conditions);
        keys.forEach(function (value) {
            var prop = normalizeDataAttr(value)
            modified_conditions[prop] = conditions[value];
        });
        query = model[params.type](modified_conditions);
    } else {
        query = model[params.type](conditions);
    }


    if (params.select) {
        var select = params.select.split(' ').slice(0, 25);
        var modified_select = [];
        select.forEach(function (value, index, self) {
            if (value.charAt(0) === "+" || value.charAt(0) === "-") {
                modified_select.push(value.charAt(0) + normalizeDataAttr(value.slice(1)));
            } else {
                modified_select.push(normalizeDataAttr(value));
            }
        });
        modified_select.push('relations');
        query.select(modified_select.join(' '));
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
            var final_pop_select;

            // handles select part of populate
            if (!_.isUndefined(arr[1])) {
                var pop_select = arr[1].split(' ').slice(0, 25);
                var pop_modified_select = [];
                pop_select.forEach(function (value, index, self) {
                    if (value.charAt(0) === "+" || value.charAt(0) === "-") {
                        pop_modified_select.push(value.charAt(0) + normalizeDataAttr(value.slice(1)));
                    } else {
                        pop_modified_select.push(normalizeDataAttr(value));
                    }
                });
                pop_modified_select.push('relations');
                final_pop_select = pop_modified_select.join(' ');
            }

            query.populate("relations." + arr[0], final_pop_select);
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
                var arr = value.split(operators[i].op)
                if (arr.length === 2) {
                    var prop = normalizeDataAttr(arr[0]);
                    query[operators[i].fn](prop, arr[1]);
                    break;
                }
            }
        })
    }

    if(params.sort) {
        var sort = params.sort.split(' ').slice(0, 25);
        var modified_sort = [];
        sort.forEach(function (value, index, self) {
            if (value.charAt(0) === "+" || value.charAt(0) === "-") {
                modified_sort.push(value.charAt(0) + normalizeDataAttr(value.slice(1)));
            } else {
                modified_sort.push(normalizeDataAttr(value));
            }
        });
        query.sort(modified_sort.join(' '));
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
    res.send(200, req.pd.data)
}