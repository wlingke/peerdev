'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash');


module.exports.create = function (req, res, next) {
    var newProject = {
        data: {},
        relations: {}
    };
    _.assign(newProject.data, req.body);
    newProject.relations.owner = req.session.profile._id;

    var project = new Project(newProject);
    project.save(function (err) {
        if (err) {
            res.send(400, err);
            return;
        }
        res.send(201);
    })
};

