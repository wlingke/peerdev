'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose');

/**
 * Sets nod environment if not already set
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(process.env.NODE_ENV)


var app = express();
var db = mongoose.connect('mongodb://localhost/test');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('peerdev022114'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


/**
 * Models
 */
require('./app/models/user');

/**
 * Passport
 */
require('./app/config/passport')(passport);


/**
 * Routing
 */

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(app.router);
require('./app/api/users')(app, passport);

app.get('/static/*', function (req, res, next) {
    res.writeHead(404);
    res.end();
});

app.get('/*', function(req,res,next){
    res.render('index');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
