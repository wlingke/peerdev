#!/usr/bin/env node

'use strict';

var spawn = require('child_process').spawn;

var args = [
    '--harmony',
    'app/app.js'
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