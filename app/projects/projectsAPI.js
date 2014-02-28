var projectHandlers = require('./projectHandlers');

'use strict';

module.exports = function (app) {

    app.post('/api/projects', function(req,res,next){res.send('hello world')});
    app.get('/api/projects/:id');

};