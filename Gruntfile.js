module.exports = function(grunt){

    grunt.initConfig({

        SASS_DIR: "sass",

        //Glob CONSTANTS
        ALL_FILES: "**/*",
        ALL_JS: "**/*.js",
        MIN_CSS: "**/*.min.css",
        ALL_SCSS: "**/*.scss",
        ALL_HTML: "**/*.html",

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/*\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n <%= pkg.author %>' +
                ' \n*/\n'
        },

        compass: {
            compile: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        watch: {
            css: {
                files: ["<%= SASS_DIR %>/<%= ALL_SCSS %>"],
                tasks: ["compass"]
            }
        },

        bgShell: {
            _defaults: {
                stdout: true,
                stderr: true
            },
            run_watch_css: {
                cmd: 'grunt watch:css',
                bg: true
            },
            run_dev: {
                cmd: 'node start.js'
            }
        }


    });

    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['compass', 'bgShell:run_watch_css', 'bgShell:run_dev']);

}