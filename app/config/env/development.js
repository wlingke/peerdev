'use strict';

var port = require('./all').port;

module.exports = {
    db: 'mongodb://localhost/peerdev',
    facebook: {
        clientID: '726829610675361',
        clientSecret: '1a03196ee1b7355ef5f391f294a33ebf',
        callbackURL: 'http://localhost:' + port + "/api/facebook/callback"
    }
};