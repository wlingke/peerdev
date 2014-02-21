'use strict';

var _ = require('lodash');

module.exports = _.assign(
    require('./env/all.js'),
    require('./env/' + process.env.NODE_ENV + '.js') || {}
)