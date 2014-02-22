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
        name: cookie.display_name
    };
    _.assign(newUser, req.body);

    var user = new User(newUser);
    console.log(user);

    user.save(function (err) {
        if (err) {
            res.send(400, err)
        } else {
            res.send(200, user)
        }
    })
};