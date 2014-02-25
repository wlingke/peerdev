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

    User.findOne(search, 'data', function (err, profile) {
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
        data: {
            name: cookie.name
        }
    };
    _.assign(newUser.data, req.body);

    if (typeof newUser.data.username === 'string') {
        newUser.data.userId = newUser.data.username.replace('.', '');
    }

    var user = new User(newUser);
    user.save(function (err) {
        if (err) {
            return res.send(400, errorParser.parse(['pd1000', 'pd1001', 'pd1100', 'pd1101'], err));
        }

        req.session.profile = {
            data: user.data,
            _id: user._id
        };
        res.send(201);
    })
};

module.exports.save = function (req, res, next) {
    User.findById(req.params.id, 'data', function (err, model) {
        if (err) {
            return res.send(400, err);
        }
        _.assign(model.data, req.body);
        if(typeof model.data.username === 'string'){
            model.data.userId = model.data.username.replace('.', '');
        }

        model.save(function(err){
            if(err){
                return res.send(400, errorParser.parse(['pd1000', 'pd1001', 'pd1100', 'pd1101'], err));
            }

            req.session.profile = model;
            res.send(200, model);
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
}