'use strict';

var port = require('./all.js').port;

module.exports = {
  facebook: {
      clientID: '726829610675361',
      clientSecret: '1a03196ee1b7355ef5f391f294a33ebf',
      callbackURL: 'http://localhost:' + port + "/api/facebook/callback"
  }
};