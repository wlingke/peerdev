'use strict';

var userHandlers = require('./userHandlers');
var queryHandlers = require('app/query/queryHandlers');

module.exports = function (app, passport) {

    app.post('/api/users', userHandlers.notLoggedIn, userHandlers.create);
    app.post('/api/users/:id', userHandlers.restrictToSelf, userHandlers.save);

    app.get('/api/current_user', userHandlers.currentUser);
    app.post('/api/logout', userHandlers.loggedIn, userHandlers.logout);

    app.get('/api/facebook', passport.authenticate('facebook'));
    app.get('/api/facebook/callback', userHandlers.facebook_auth(passport));
};