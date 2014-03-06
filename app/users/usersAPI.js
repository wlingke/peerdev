'use strict';

var userHandlers = require('./userHandlers');

module.exports = function (app, passport) {

    app.post('/api/users', userHandlers.notLoggedIn, userHandlers.create);
    app.post('/api/users/:id', userHandlers.restrictToSelf, userHandlers.save, userHandlers.currentUser);

    app.get('/api/current_user', userHandlers.currentUser);
    app.post('/api/logout', userHandlers.loggedIn, userHandlers.logout);

    app.get('/api/facebook', passport.authenticate('facebook'));
    app.get('/api/facebook/callback', userHandlers.facebook_auth(passport));
};