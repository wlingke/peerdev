var projectHandlers = require('./projectHandlers');
var userHandlers = require('app/users/userHandlers');

'use strict';

module.exports = function (app) {

    app.post('/api/projects', userHandlers.loggedIn, projectHandlers.create);
    app.get('/api/projects/:id');

    app.post('/api/projects/:id');
    app.del('/api/projects/:id');

};