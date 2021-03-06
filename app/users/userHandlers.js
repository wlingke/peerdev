'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    errorParser = require('app/general/errorParser');


var userAuth = function (req, res, next, user, authType) {
    var prop;
    if (authType === 'facebook') {
        prop = 'facebook_id'
    } else {
        next('Incorrect authType')
    }

    var search = {};
    search['providers.' + prop] = user.id;

    User.findOne(search, '-providers', function (err, profile) {
        if (profile) {
            req.session.profile = profile;
            res.redirect('/');
        } else {
            var cookie = {};
            cookie[prop] = user.id;
            cookie.name = user.displayName;

            res.cookie('auth', cookie, {signed: true});
            res.redirect('/create-account')
        }
    });
};

module.exports.create = function (req, res, next) {
    var cookie = req.signedCookies.auth;
    var newUser = {
        providers: {
            facebook_id: cookie.facebook_id
        },
        name: cookie.name
    };
    _.assign(newUser, req.body);

    newUser.userId = newUser.username;

    var user = new User(newUser);
    user.save(function (err) {
        if (err) {
            return errorParser.handle(req, res, next, ['pd1000', 'pd1100'], err);
        }

        req.session.profile = user;
        res.send(201);
    })
};

module.exports.save = function (req, res, next) {
    User.findById(req.params.id, function (err, model) {
        if (err) {
            return res.send(400, err);
        }
        _.assign(model, req.body);
        model.userId = model.username;

        model.save(function (err) {
            if (err) {
                return errorParser.handle(req, res, next, ['pd1000', 'pd1100'], err);
            }

            req.session.profile = model;
            next();
        })

    })
};

module.exports.facebook_auth = function (passport) {
    return function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            userAuth(req, res, next, user, 'facebook')
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

module.exports.logout = function (req, res, next) {
    req.session.destroy();
    res.send(204);
};

module.exports.loggedIn = function (req, res, next) {
    if (!req.session || !req.session.profile) {
        res.send(401, "Must be logged in")
    } else {
        next();
    }
};

module.exports.notLoggedIn = function (req, res, next) {
    if (req.session && req.session.profile) {
        res.send(401, "Must not be logged in")
    } else {
        next();
    }
};

module.exports.restrictToSelf = function (req, res, next) {
    if (!req.session || !req.session.profile || (req.params.id !== req.session.profile._id)) {
        res.send(401, "Unauthorized");
    } else {
        next();
    }
};