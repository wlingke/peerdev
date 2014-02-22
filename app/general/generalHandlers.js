'use strict';

module.exports.index = function(req,res,next){
    res.render('index');
};

module.exports.notFound = function (req, res, next) {
    res.writeHead(404);
    res.end();
};