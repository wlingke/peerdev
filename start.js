#!/usr/bin/env node

'use strict';

//TODO: Switch to forever when issue #34 is solved

//var forever = require('forever-monitor');
//
//var child = new (forever.Monitor)('app.js',{
//    max: 3,
//    cwd: __dirname,
//    env: (function() {
//        process.env.NODE_PATH = '.'; // Enables require() calls relative to the cwd :)
//        process.env.NODE_ENV = 'development';
//        return process.env;
//    })(),
//    options: ['--harmony']
//});
//
//child.on('exit', function () {
//    console.log('your-filename.js has exited after 3 restarts');
//});
//
//child.start();

var spawn = require('child_process').spawn;

var args = [
    '--harmony',
    'app.js'
];

var opt = {
    cwd: __dirname,
    env: (function() {
        process.env.NODE_PATH = '.'; // Enables require() calls relative to the cwd :)
        process.env.NODE_ENV = 'development';
        return process.env;
    }()),
    stdio: [process.stdin, process.stdout, process.stderr]
};

var app = spawn(process.execPath, args, opt);