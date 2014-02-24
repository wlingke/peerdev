'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    config = require('./app/config/config'),
    Mongostore = require('connect-mongo')(express)

var app = express();
var db = mongoose.connect(config.db);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookieSecret));
app.use(express.session({
    secret: config.cookieSecret,
    store: new Mongostore({
        mongoose_connection: db.connections[0]
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
})


/**
 * Models
 */
require('./app/models/user');

/**
 * Passport
 */
require('./app/config/passport')(passport);


/**
 * Static Files, API, and Routing
 */
app.use('/static', express.static('static'));
app.use(app.router);
require('./app/users/usersAPI')(app, passport);
require('./app/general/routes')(app);

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
