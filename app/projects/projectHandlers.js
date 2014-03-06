'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash');


module.exports.create = function (req, res, next) {
    var newProject = {};
    _.assign(newProject, req.body);
    newProject.owner = req.session.profile._id;

    var project = new Project(newProject);
    project.save(function (err) {
        if (err) {
            res.send(400, err);
            return;
        }
        res.send(201);
    })
};

module.exports.getProjectById = function (req, res, next) {
    var callback = function (err, project) {
        if (err) {
            res.send(404, err);
            return;
        }

        req.project = project;
        next();
    };

    Project.findById(req.params.id)
        .populate('owner', '-providers')
        .exec(callback)
};

module.exports.isProjectOwner = function (req, res, next) {
    if (req.project.matchesOwnerId(req.session.profile._id)) {
        next();
    } else {
        res.send(401, "Unauthorized access")
    }

};

module.exports.save = function (req, res, next) {
    _.assign(req.project, req.body);
    req.project.save(function (err) {
        if (err) {
            res.send(400, err)
        }

        res.send(200, req.project);
    })
};

module.exports.del = function (req, res, next) {
    req.project.remove(function (err) {
        if (err) {
            res.send(400, err)
        }
        res.send(204);
    })
};

module.exports.send = function (req, res, next) {
    if (req.project) {
        res.send(200, req.project);
    } else {
        res.send(404);
    }
};