'use strict';

var FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    User = require('../controllers/users').model

module.exports = function (passport) {
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));
};