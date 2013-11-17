/*
 */

'use strict';

var hljs = require('highlight.js');

module.exports = function(grunt) {

    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        CONFIG: {
            src: 'src',
            dist: 'dist'
        },

        PACKAGE: require('./package.json'),
        DEVELOPMENT: process.env.NODE_ENV &&
            process.env.NODE_ENV.toLowerCase().indexOf('dev') !== -1 ? true : false,

        watch: {
            javascripts: {
                files: [ 'Gruntfile.js', '<%= CONFIG.src %>/assets/js/**/*.js' ],
                tasks: ['jshint', 'uglify']
            },
            stylesheets: {
                files: ['<%= CONFIG.src %>/assets/stylesheets/**/*.{css,less}']
                tasks: ['less']
            }
            build: {
                files: [
                    '<%= CONFIG.src %>/{data,templates}/{,*/}*.{md,hbs,yml,json}',
                    '<%= CONFIG.src %>/assets/{stylesheets,javascripts}/*.{css,js}'],
                tasks: ['build']
            },
            livereload: {
                tasks: ['build'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= CONFIG.dist %>/{,*/}*.html',
                    '<%= CONFIG.dist %>/assets/**/*.css',
                    '<%= CONFIG.dist %>/assets/**/*.js',
                    '<%= CONFIG.dist %>/assets/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= CONFIG.dist %>'
                    ]
                }
            }
        },

        assemble: {
            options: {
                DEVELOPMENT: '<%= DEVELOPMENT %>',
                PACKAGE: '<%= PACKAGE %>',
                data: '<%= CONFIG.src %>/data/*.{json,yml}',
                assets: '<%= CONFIG.dist %>/assets',
                layoutdir: '<%= CONFIG.src %>/templates/layouts',
                layout: 'default.hbs',
                partials: '<%= CONFIG.src %>/templates/partials/*.hbs',
                helpers: ['<%= CONFIG.src %>/helpers/*.js'],
                flatten: true,
                sanitize: false,
                marked: {
                    breaks: true,
                    gfm: true,
                    langPrefix: 'lang-',
                    pedantic: false,
                    sanitize: false,
                    silent: false,
                    smartLists: true,
                    smartypants: true,
                    tables: true,
                    highlight: function (code, lang) {
                        return hljs.highlightAuto(code).value;
                    }
                },
                prettify: {
                    indent: 2,
                    condense: true,
                    padcomments: true
                },
            },

            blog: {
                files: {
                    '<%= CONFIG.dist %>/': ['<%= CONFIG.src %>/templates{/posts,}/*.hbs']
                }
            }
        },

        shell: {
            hackers: {
                command: 'hacker-deps . --verbose | head -n30 >> <%= CONFIG.dist %>/assets/hackers.txt'
            }
        },

        jshint: {
            options: {
            },
            grunt: {
                options: {
                    node: true
                },
                src: ['Gruntfile.js', 'tasks/**/*.js']
            },
            js: {
                options: {
                    browser: true
                },
                src: ['<%= CONFIG.src %>/assets/js/**/.js']
            }
        },

        less: {
            options: {
            },
            development: {
                options: {
                    paths: "<%= CONFIG.src %>/assets/stylesheets",
                    dumpLineNumbers: 'all',
                    compress: true,
                },
                files: {
                    "<%= CONFIG.dist %>/assets/css/style.css": "<%= CONFIG.src %>/assets/stylesheets/style.less"
                }

            },
            production: {
                options: {
                    paths: "<%= CONFIG.src %>/assets/stylesheets",
                    dumpLineNumbers: 'all',
                    compress: true,
                    cleancss: true
                },
                files: {
                    "<%= CONFIG.dist %>/assets/css/style.css": "<%= CONFIG.src %>/assets/stylesheets/style.less"
                }
            },
        },

        uglify: {
            options: {},
            development: {
                options: {
                }
            },
            production: {
                options: {
                }
            },
            files: {
                "<%= CONFIG.dist %>/assets/js/site.js": "<%= CONFIG.src/assets/js/*.js"
            }
        },

        // Before generating any new files,
        // remove any previously-created files.
        clean: ['<%= CONFIG.dist %>']

    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadTasks('./tasks');

    grunt.registerTask('server', [
        'build',
        'connect:livereload',
        'watch:build:livereload'
    ]);

    grunt.registerTask('build', function(){
        var tasks = [];
        if (grunt.config('DEVELOPMENT') === true) {
            tasks = [
                'clean',
                'jshint',
                'less:development',
                'uglify:development',
                'assemble'
            ];
        } else {
            tasks = [
                'clean',
                'jshint',
                'less:production',
                'uglify:production',
                'shell:hackers',
                'assemble'
            ];
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('default', [
        'build'
    ]);

};
