'use strict';

var userHandler = require('./userHandlers'),
    model = require('mongoose').model('User')

module.exports = function (app, passport) {

    app.post('/api/users', userHandler.create)
    app.get('/api/users', function (req, res, next) {
        model.find({}, function (err, users) {
            if (err) {
                console.log(err)
                next();
            }
            res.send(users);
        })
    });

    app.get('/api/facebook', passport.authenticate('facebook'));
    app.get('/api/facebook/callback', function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {

            // if user doesn't exist, set data as a cookie
            res.cookie('auth',
                {
                    facebook_id: user.id,
                    display_name: user.displayName
                },
                {
                    signed: true
                }
            );
            res.redirect('/create-account')
        })(req, res, next)
    });
};