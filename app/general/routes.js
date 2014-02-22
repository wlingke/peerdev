'use strict';

var generalHandlers = require("./generalHandlers");

module.exports = function(app){
    app.get('/static/*', generalHandlers.notFound);

    app.get('/*', generalHandlers.index);
};


