'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

module.exports.create = function (req, res, next) {
    var cookie = req.signedCookies.auth;
    var newUser = {
        providers: {
            facebook_id: cookie.facebook_id
        },
        data: {
            name: cookie.display_name
        }

    };
    _.assign(newUser.data, req.body);
    newUser.userId = newUser.data.username.replace('.', '');

    var user = new User(newUser);
    user.save(function (err) {
        if (err) {
            res.send(500, err)
        } else {
            res.send(201);
        }
    })
};

module.exports.facebook_auth = function (passport) {
    return function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {

            User.findOne({'providers.facebook_id': user.id}, 'userId data', function (err, profile) {
                if (err) {
                    next(err)
                }

                if (profile) {
                    req.session.profile = profile;
                    res.redirect('/');
                } else {
                    res.cookie('auth',
                        {
                            facebook_id: user.id,
                            name: user.displayName
                        },
                        {
                            signed: true
                        }
                    );
                    res.redirect('/create-account')
                }
            });

        })(req, res, next)
    };
};

module.exports.currentUser = function (req, res, next) {
    if (req.session.profile) {
        res.send(200, req.session.profile)
    } else {
        res.send(204, null);
    }
};

module.exports.logout = function(req,res,next){
    req.session.profile = null;
    res.send(204);
}