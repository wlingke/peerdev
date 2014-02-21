'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    rootPath: rootPath,
    port: process.env.PORT || 3000
};