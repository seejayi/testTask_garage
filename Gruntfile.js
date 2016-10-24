/**
 * Grunt configuration
 */
module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    /*******************************************************************************************************************
     * ANALIZE GRUNT OPTIONS
     ******************************************************************************************************************/
    var optionApplicationToRunName = _findOutApplication(grunt.option('app'));

    /*******************************************************************************************************************
     * Define core grunt config parameters
     ******************************************************************************************************************/
    var ENVIROMENTS = {
        'main': {
            // Common directories
            dist: 'build',
            tmp: '.tmp',
            corePath: require('./bower.json').appPath || 'app',
            // Main Application (Web Shop Application) configuration
            applicationPath: require('./bower.json').appPath || 'app',
            moduleName: require('./bower.json').name || 'app',
            vendorPath: 'vendor'
        }
    },
    _config = {
        application: ENVIROMENTS[optionApplicationToRunName]
    };

    /*******************************************************************************************************************
     * Files / Folders Management
     ******************************************************************************************************************/
    /**
     * Used to clean temporary and distinct folders
     *
     * @example <caption>clean distinct folder</caption>
     * grunt clean:dist
     * @example <caption>remove temporary folder</caption>
     * grunt clean:tmp
     * @example <caption>Clear all (if called without parameters all commands will be called)</caption>
     * grunt clean // will call [grunt clean:dist] & [grunt clean:tmp]
     *
     * @syntax grunt clean[:dist|tmp]
     *
     * @requires grunt-contrib-clean
     * @uses grunt-contrib-clean:clean
     */
    _config.clean = {
        // Clear distinct folder
        dist: {
            dot: true,
            src: [
                '<%= application.dist %>/*',
                '!<%= application.dist %>/.git*'
            ]
        },
        // Remove temporary folder
        tmp: '<%= application.tmp %>'
    };

    /**
     * Copy single file and/or files to temporary OR distinct folder
     *
     * @example <caption>Copy to temporary folder</caption>
     * grunt copy:dist
     * @example <caption>Copy to distinct folder</caption>
     * grunt copy:tmp
     *
     * @syntax grunt copy[:dist|tmp]
     * @requires grunt-contrib-copy
     * @uses grunt-contrib-copy:copy
     */
    _config.copy = {
        // Copy all required Product Builder Application files to distinct folder
        'dist': {
            files: [
                // Copy fonts and images
                {
                    expand: true,
                    cwd: '<%= application.applicationPath %>/ui',
                    dest: '<%= application.dist %>/ui/',
                    src: ['fonts/{,*/}*.*', 'images/{,*/}*.*']
                },
                // Copy .htaccess and fixtures images
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= application.applicationPath %>',
                    dest: '<%= application.dist %>',
                    src: [
                        '.htaccess',
                        'fixtures/img/{,*/}*.*'
                    ]
                },
                // Copy index file
                {
                    src: '<%= application.applicationPath %>/index.html',
                    dest: '<%= application.dist %>/index.html'
                }
            ],
            options: {
//                    process: function(context, srcpath) {
                processContent: function (context, srcpath) {
                    // If the file is not an html file
                    if (srcpath.indexOf('.html') === -1
                        || srcpath.indexOf('.html') !== (srcpath.length - ('.html').length)) {
                        return context;
                    }

                    var regExpression, replacement;
                    // Replace script
                    regExpression = /<script([^>]*)src=([^>]*)\sdata-main([^>]*)>/g;
                    replacement = '<script src="main.js">';
                    context = context.replace(regExpression, replacement);

                    // Replace css
                    regExpression = /<link([^>]*)href=(['"])([^>'"]*)([^>]*)>/g;
                    replacement = '<link$1href=$2ui/styles/css/main.css$4>';
                    context = context.replace(regExpression, replacement);
                    return context;
                }
            }
        },
        // Copy all required Product Builder Application files to temporary folder
        'tmp': {
            files: [
                // Copy css styles and fonts to styles folder
                {
                    expand: true,
                    cwd: '<%= application.applicationPath %>/ui',
                    dest: '<%= application.tmp %>/ui/',
                    src: ['styles/css/{,*/}*.css']
                }
            ]
        }
    };

    /*******************************************************************************************************************
     * Gettext functionality
     ******************************************************************************************************************/
    /**
     * Gettext module works with angular views:
     * - creates pot template for po-files (translation);
     * - converrts all po-files to js file
     *
     * To work properly frontend (frontend application itself) requires angular-translate module to be installed
     *
     * @requires grunt-angular-gettext
     * @requires vendor/angular-translate
     */
    grunt.loadNpmTasks('grunt-angular-gettext');

    /**
     * Gettext tasks pot creation : checks all angular views and creates pot template for translation.
     *
     * @example <caption>Create pot template</caption>
     * grunt nggettext_extract
     *
     * @requires grunt-angular-gettext
     * @uses grunt-angular-gettext:nggettext_extract
     */
    _config.nggettext_extract = {
        all: {
            files: {
                '<%= application.applicationPath %>/ui/po/template.pot': [
                    '<%= application.applicationPath %>/ui/views/gettext.html',
                    '<%= application.applicationPath %>/ui/views/**.html',
                    '<%= application.applicationPath %>/ui/views/**/**.html',
                    '<%= application.applicationPath %>/ui/scripts/**/**/**.js',
                    '<%= application.applicationPath %>/ui/scripts/**/**/**/**.js',
                ]
            }
        }
    };

    /**
     * Gettext tasks convertion of po-files to a single js file : Creates js file for angular from po-files
     *
     * @example <caption>Create js single template from po files</caption>
     * grunt nggettext_compile
     *
     * @requires grunt-angular-gettext
     * @uses grunt-angular-gettext:nggettext_compile
     */
    _config.nggettext_compile = {
        all: {
            files: {
                '<%= application.applicationPath %>/ui/scripts/common/modules/extra/translations.js': [
                    '<%= application.applicationPath %>/ui/po/*.po']
            }
        }
    };

    /*******************************************************************************************************************
     * Work with templates
     ******************************************************************************************************************/
    /**
     * Creates js file with cached templates
     *
     * @syntax grunt ngtemplates
     * @requires grunt-angular-template
     * @uses grunt-angular-template:ngtemplates
     */
    _config.ngtemplates = {
        // Common options
        options: {
            htmlmin: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true, // Only if you don't use comment directives!
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
//                prefix: '/app/ui'
        },
        // Run Application
        'main': {
            options: {module: '<%= application.moduleName %>.templates'},
            cwd: '<%= application.applicationPath %>',
            src: ['*.html'],
            dest: '<%= application.applicationPath %>/ui/scripts/common/modules/extra/templates.js'
        }
    };

    /*******************************************************************************************************************
     * Files convertion: merging, minification, uglification, etc.
     ******************************************************************************************************************/

    /**
     * Convert all application to single file with requirejs
     *
     * Work both with Main Application and Product Builder Application
     *
     * @example <caption>Main Application convertion</caption>
     * grunt requirejs --app=main
     * @example <caption>Product Builder Application convertion</caption>
     * grunt requirejs --app=prodbuilder
     *
     * @requires grunt-contrib-requirejs
     * @uses grunt-contrib-requirejs:requirejs
     */
    _config.requirejs = {
        // Common options
        options: {
            optimize: 'uglify2', //none',
            //If using UglifyJS for script optimization, these config options can be
            //used to pass configuration values to UglifyJS.
            //See https://github.com/mishoo/UglifyJS for the possible values.
            uglify2: {
                output: {beautify: false},
                compress: {
                    sequences: true,
                    global_defs: {
                        DEBUG: false
                    }
                },
                warnings: true,
                mangle: false
            },
            waitSeconds: 0,
            skipDirOptimize: false,
//                findNestedDependencies: false,
            exclude: [],
            inlineText: true,
            //Creates map for used files
            generateSourceMaps: false,
            // License comments
            // - If true, license comments from compiiled files will be set to file,
            // - if false, license comments will not be placed to result file
            preserveLicenseComments: false,
            // Additional required files list
            // All dependencies in a new file will be loaded with require js
            // But if file is used in the productBuilderApp, but it is not used in require js calls,
            // files can be included via includes section
            include: [
                'requirejsRequire'
            ],
            // Changeble options
            baseUrl: "<%= application.applicationPath %>",
            paths: {
                requirejsRequire: '<%= application.vendorPath %>/requirejs/require'
            },
            mainConfigFile: "<%= application.applicationPath %>/config/main.js",
            name: 'ui/main',
            out: "<%= application.dist %>/main.js"
        },
        rjsBuildAnalysisDone: {
            done: function (done, output) {
                var duplicates = rjsBuildAnalysis.duplicates(output);

                if (duplicates.length > 0) {
                    grunt.log.subhead('Duplicates found in requirejs build:');
                    grunt.log.warn(duplicates);
                    done(new Error('r.js built duplicate modules, please check the excludes option.'));
                }

                done();
            }
        },
        // Application convertion
        'analysys': {
            options: "<%= requirejs.options %>",
            done: "<%= requirejs.rjsBuildAnalysisDone.done %>"
        }
    };

    _config.cssmin = {
        'dist': {
            files: {
                '<%= application.dist %>/ui/styles/css/main.css': [
                    '<%= application.applicationPath %>/ui/styles/{,*/}*.css'
                ]
            }
        },
        'tmp': {
            files: {
                '<%= application.tmp %>/ui/styles/css/main.css': [
                    '<%= application.applicationPath %>/ui/styles/{,*/}*.css'
                ]
            }
        }
    };

    _config.useminPrepare = {
        html: '<%= application.applicationPath %>/index.html',
        options: {
            dest: '<%= application.dist %>'
        }
    };
    _config.usemin = {
        html: ['<%= application.dist %>/{,*/}*.html'],
        css: ['<%= application.dist %>/ui/styles/css/{,*/}*.css'],
        options: {
            dirs: ['<%= application.dist %>']
        }
    };
    _config.rev = {
        dist: {
            files: {
                src: [
                    '<%= application.dist %>/ui/*/controllers/**/**.{js}',
                    '<%= application.dist %>/ui/styles/{,*/}*.',
                    '<%= application.dist %>/ui/uploads/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= application.dist %>/ui/styles/fonts/*'
                ]
            }
        }
    };
//
    /*******************************************************************************************************************
     * Work with server, tasks and watchers
     ******************************************************************************************************************/
//    /**
//     * @requires grunt-concurrent
//     */
//    _config.concurrent = {
//        'dist': [
//            'copy:dist',
//            'cssmin:dist'
//        ],
//        'tmp': [
//            'copy:tmp',
//            'cssmin:tmp'
//        ]
//    };
    _config.watch = {
        'compass': {
            files: [
                '<%= application.applicationPath %>/ui/styles/scss/{,*/}*.{scss,sass}',
                '<%= application.applicationPath %>/ui/styles/scss/**/{,**/}*.{scss,sass}'
            ],
            tasks: ['compass']
        },
        'styles': {
            files: [
                '<%= application.applicationPath %>/ui/styles/css/{,*/}*.css'
            ],
            tasks: ['copy:tmp']
        },
        'livereload': {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                '<%= application.applicationPath %>/{,*/}*.html',
                '<%= application.applicationPath %>/ui/views/{,**/}**.html',
                '{.tmp,<%= application.applicationPath %>}/ui/styles/css/{,*/}*.css',
                '<%= application.applicationPath %>/config/{,**/}**.js',
                // '<%= application.applicationPath %>/core/services/{,**/}**.js',
                // '<%= application.applicationPath %>/core/infrastructure/{,**/}**.js',
                // '<%= application.applicationPath %>/core/lib/{,**/}**.js',
                // '{.tmp,<%= application.applicationPath %>}/ui/scripts/common/{,**/}**.js',
                // '{.tmp,<%= application.applicationPath %>}/ui/scripts/landing/{,**/}**.js',
                // '{.tmp,<%= application.applicationPath %>}/ui/scripts/shipper/{,**/}**.js',
                // '{.tmp,<%= application.applicationPath %>}/ui/scripts/tp/{,**/}**.js',
                '<%= application.applicationPath %>/ui/uploads/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    };
    _config.compass = {
        options: {
            // cssDir: '.tmp/styles',
            relativeAssets: false,
            debugInfo: false,
            importPath: '<%= application.corePath %>/vendor'
        },
        'css': {
            options: {
                sassDir: '<%= application.applicationPath %>/ui/styles/scss',
                cssDir: [
                    '<%= application.tmp %>/ui/styles',
                    '<%= application.applicationPath %>/ui/styles/css'
                ]
            }
        },
        'images': {
            options: {
                httpImagesPath: 'ui/images',
                httpGeneratedImagesPath: 'ui/images/generated',
                generatedImagesDir: '<%= application.tmp %>/images/generated',
                imagesDir: '<%= application.applicationPath %>/ui/images',
            }
        },
        'fonts': {
            options: {
                httpFontsPath: 'ui/styles/fonts',
                fontsDir: '<%= application.applicationPath %>/ui/styles/fonts'
            }
        },
        'javascript': {
            options: {
                javascriptsDir: '<%= application.applicationPath %>/ui/scripts'
            }
        },
        'livereload': {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
               '<%= application.applicationPath %>/{,*/}*.html',
                '<%= application.applicationViewsPath %>/{,**/}**.html',
                '{.tmp,<%= application.applicationStylesPath %>}/css/{,*/}*.css',
                '{.tmp,<%= application.applicationScriptsPath %>}/{,**/}**.js',
                '{.tmp,<%= application.applicationScriptsPath %>}/**/{,**/}**.js',
                '<%= application.applicationUploadsPath %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    };


    var rewriteModule = require('http-rewrite-middleware');
    _config.connect = {
        options: {
            port: 9001,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: '127.0.0.1',
            livereload: 35729
        },
        'livereload': {
            options: {
                open: true,
                base: [
                    '<%= application.applicationPath %>',
                    '<%= application.corePath %>',
                    '<%= application.tmp %>'
                ],
                middleware: function (connect, options, middlewares) {
                    var middlewares = [];
                    // rewrite (make sure it is first)
                    middlewares.unshift(rewriteModule.getMiddleware([
                        {from: '/app/ui/(.*)', to: '/ui/$1'},
                        {from: '/app/config/(.*)', to: '/config/$1'},
                        {from: '/app/vendor/(.*)', to: '/vendor/$1'},
                        // {from: '/app/core/(.*)', to: '/core/$1'},
                        // {from: '/app/fbaotoauth', to: '/fbaotoauth.html'},
                        // {from: '/app/sh(.*)', to: '/shipper.html'},
                        // {from: '/app/tp(.*)', to: '/transporter.html'},
                        {from: '/app(.*)', to: '/index.html'}
                    ]));
                    if (!Array.isArray(options.base)) {
                        options.base = [options.base];
                    }

                    var directory = options.directory || options.base[options.base.length - 1];
                    options.base.forEach(function (base) {
                        // Serve static files.
                        middlewares.push(connect.static(base));
                    });

                    // Make directory browse-able.
                    middlewares.push(connect.directory(directory));
                    console.log(middlewares)
                    return middlewares;
                }
            }
        },
        dist: {
            options: {
                base: '<%= application.dist %>'
            }
        }
    };

    /*******************************************************************************************************************
     * Testing
     ******************************************************************************************************************/
    /**
     *
     * @requires rjs-build-analysis
     */
    // var rjsBuildAnalysis = require('rjs-build-analysis');
    /**
     *
     * @requires grunt-angular-gettext
     */
//    grunt.loadNpmTasks('grunt-contrib-jshint');
//    /**
//     * Check code with jshint
//     *
//     * @example <caption>Check grunt</caption>
//     * grunt jshint:grunt
//     * @example <caption>Check Main Application</caption>
//     * grunt jshint
//     * grunt jshint --app=main
//     * @example <caption>Check Product Builder Application</caption>
//     * grunt jshint --app=prodbuilder
//     * @example <caption>Check all (if called without parameters all commands will be called)</caption>
//     * grunt jshint
//     *
//     * @syntax grunt jshint[:name]
//     *
//     * @requires grunt-contrib-jshint
//     * @uses grunt-contrib-jshint:jshint
//     */
   // _config.jshint = {
   //     // Common options section
   //     options: {
   //         jshintrc: '.jshintrc'
   //     },
   //     // Check grunt
   //     grunt: [
   //         'Gruntfile.js'
   //     ],
   //     // Check Application
   //     main: [
   //         '<%= application.applicationPath %>/ui/scripts/{,*/}*.js',
   //         '<%= application.applicationPath %>/core/{,*/}*.js',
   //         '<%= application.applicationPath %>/config/{,*/}*.js'
   //     ],
   // };

    /*******************************************************************************************************************
     * INIT CONFIG
     ******************************************************************************************************************/
    grunt.initConfig(_config);

    /*******************************************************************************************************************
     * Define subtasks
     ******************************************************************************************************************/
    /**
     * Create empty templates file
     *
     * @example <caption>Clear teplates file for Main Application:</caption>
     * grunt ngtemplates-empty
     * @example <caption>Clear teplates file for Product Builder Application:</caption>
     * grunt ngtemplates-empty --app=prodbuilder
     *
     * @syntax grunt ngtemplates-empty[:APPLICATION_TO_RUN_NAME]
     */
    grunt.registerTask('ngtemplates-empty', 'Creates empty cached templates file', function () {
        // Task started
        grunt.log.writeln('Task started : Creates empty cached templates file');

        // Get variables
        var templatePath;
        templatePath = ENVIROMENTS[optionApplicationToRunName].applicationPath + '/ui/scripts/common/modules/extra/templates.js';

        // Run the task
        grunt.file.write(templatePath, '');
    });

    /*******************************************************************************************************************
     * Define default grunt commands
     ******************************************************************************************************************/
    /**
     * Get grunt commands info
     *
     * @example <caption>Get grunt info:</caption>
     * grunt
     * grunt default
     *
     * @syntax grunt [default]
     */
    grunt.registerTask('default', function () {
        console.info(_infoMessage());
    });

    /**
     * Run server from developer machine. Server will run from core folder (not dist). All watchers will be on
     *
     * Don't build application in a distinct folder
     *
     * @syntax grunt run[:APPLICATION_TO_RUN_NAME]
     *
     * @param {array[string]} arguments
     */
    grunt.registerTask('run', 'Run server from core folders (developer mode)', function () {
        // Task started
        grunt.log.writeln('Task started : Run server from core folders (developer mode)');

        // Run the task
        grunt.task.run([
            'clean',
            'useminPrepare',
            'ngtemplates-empty:' + optionApplicationToRunName,
            'gettext',
            'rev',
            'usemin',
            'connect:livereload',
            'watch'
        ]);
    });

    /**
     * Makes new build in dist folder and run server from the dist folder
     *
     * @syntax grunt server[:APPLICATION_TO_RUN_NAME]
     *
     * @param {array[string]} arguments
     */
    grunt.registerTask('server', 'Run server from dist folder (live mode)', function () {
        // Task started
        grunt.log.writeln('Task started : Run server from dist folder (live mode)');

        // Run the task
        grunt.task.run([
            'build:' + optionApplicationToRunName,
            'connect:dist:keepalive'
           
        ]);
    });

    /**
     * Build minified application in distinct directory. After build application can be run from the dist folder
     *
     * @syntax grunt build[:APPLICATION_TO_RUN_NAME]
     *
     * @param {array[string]} arguments
     */
    grunt.registerTask('build', 'Build minified application in distinct directory', function () {
        // Task started
        grunt.log.writeln('Task started : Build minified application in distinct directory');

        // Run the task
        grunt.task.run([
            'clean',
            'useminPrepare',
            'copy:dist',
            'cssmin:dist',
            'ngtemplates',
            'gettext:' + optionApplicationToRunName,
            'requirejs:analysys',
            'rev',
            'usemin'
        ]);
    });

    /**
     * Run gettext compiler for both Main Application and Product Builder Application
     *
     * @example Run gettext compiler from the comand line:
     * grunt gettext
     * grunt gettext --app=prodbuilder
     *
     * @syntax grunt gettext[:APPLICATION_TO_RUN_NAME]
     */
    grunt.registerTask('gettext', 'Create translation pot template file', function () {
        // Task started
        grunt.log.writeln('Task started : Create translation pot template file');

        // Run the task
        grunt.task.run('nggettext_extract', 'nggettext_compile');
    });

    /*******************************************************************************************************************
     * Helpers
     ******************************************************************************************************************/
    /**
     * Output of the information about current grunt commands

     * @return {string} Formatted information text
     */
    function _infoMessage() {
        return '\n--------------------------------------------------\n'
            + 'Avaliable commands are : \n'
            + '* RUN APPLICATION IN DEVELOPMENT MODE (with watchers for styles, js, html files):\n'
            + '  Format:\n'
            + '    grunt run [-app=APPLICATION_TO_RUN_NAME]\n'
            + '  Parameters:\n'
            + '  - APPLICATION_TO_RUN_NAME = {"main"}, if not set, "main" will be used\n'
            + '  Usage:\n'
            + '    grunt run -app=prodbuilder\n'
            + '    grunt run\n'
            + '\n----------\n'
            + '* RUN SERVER IN PRODUCTION MODE (run the project from the dist folder):\n'
            + '  Format:\n'
            + '    grunt server [-app=APPLICATION_TO_RUN_NAME]\n'
            + '  Parameters:\n'
            + '  - APPLICATION_TO_RUN_NAME = {"main"}, if not set, "main" will be used\n'
            + '  Usage:\n'
            + '    grunt server -app=prodbuilder\n'
            + '    grunt server\n'
            + '\n----------\n'
            + '* BUILD THE PROJECT IN A DISTINCT FOLDER:\n'
            + '  Format:\n'
            + '    grunt build [-app=APPLICATION_TO_RUN_NAME]\n'
            + '  Parameters:\n'
            + '  - APPLICATION_TO_RUN_NAME = {"main"}, if not set, "main" will be used\n'
            + '  Usage:\n'
            + '    grunt build -app=prodbuilder\n'
            + '    grunt build\n'
            + '\n----------\n'
            + 'Parametres can have any order.\n'
            + 'No additional parameters allowed!.\n'
            + '\n--------------------------------------------------\n'
            +
            '\nStrongly not recommended to use other grunt commands, defined as sub-tasks or defined in the Config,\n'
            + '\if you are not sure that you know what to do.\n'
            + '\nEnjoy Grunt tasks with our team :)\n';
    }

    /**
     * Find out a name of the application to run by task arguments
     * Application can be {"main"}, if not set, "main" will be used
     *
     * @syntax _findOutApplication(args)
     * @param {array[string]} args
     * @return {string} Application name
     */
    function _findOutApplication(args) {
        var app;
        app = _findKeysConfig(args, ['main', 'prodbuilder'], 'main');
        grunt.log.writeln('RUN APPLICATION [' + app + ']. Any other applications, if used, will be ignored');
        return app;
    }

    /**
     * Find first occurance of key from keys array in arguments. If any key was found, default value is used
     *
     * @syntax _findKeysConfig(args, keys, defaultValue)
     * @param {array[string]} args Arguments to search in
     * @param {array[string]} keys Keys to find
     * @param {string} defaultValue Default value if keys were not found
     * @return {string} Key
     */
    function _findKeysConfig(args, keys, defaultValue) {
        if (('string' !== (typeof args)) || ('number' !== (typeof args))) {
            args = [args];
        }

        if (('object' !== (typeof args)) || ('object' !== (typeof keys))) {
            return defaultValue;
        }

        var i, iLength, j, jLength;

        iLength = args.length;
        jLength = keys.length;

        if (iLength < 1 || jLength < 1) {
            return defaultValue;
        }

        for (i = 0; i < iLength; i++) {
            for (j = 0; j < jLength; j++) {
                if (keys[j] === args[i]) {
                    return args[i];
                }
            }
        }

        return defaultValue;
    }
};