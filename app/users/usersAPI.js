'use strict';

var userHandlers = require('./userHandlers'),
    model = require('mongoose').model('User')

module.exports = function (app, passport) {

    app.post('/api/users', userHandlers.create)
    app.get('/api/current_user', userHandlers.currentUser);
    app.post('/api/logout', userHandlers.logout);
    app.get('/api/facebook', passport.authenticate('facebook'));
    app.get('/api/facebook/callback', userHandlers.facebook_auth(passport));
};