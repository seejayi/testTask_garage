/**
 * Grunt configuration
 */
module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    /*******************************************************************************************************************
     * ANALIZE GRUNT OPTIONS
     ******************************************************************************************************************/
    var _APP_NAME_, _APP_HOST_, _APP_PORT_;

    _APP_NAME_ = _findOutApplication(grunt.option('app'));
    _APP_HOST_ = grunt.option('host') ? grunt.option('host') : '*';
    _APP_PORT_ = grunt.option('port') ? grunt.option('port') : '*';


    /*******************************************************************************************************************
     * Define core grunt config parameters
     ******************************************************************************************************************/
    var ENVIROMENTS = {
        'main': {
            // Common directories
            tmp: '.tmp',
            corePath: require('./bower.json').appPath || 'app',
            // Main Application (Web Shop Application) configuration
            applicationPath: require('./bower.json').appPath || 'app',
            moduleName: require('./bower.json').name || 'app',
            vendorsPath: 'vendors'
        }
    },
    _config = {
        application: ENVIROMENTS[_APP_NAME_]
    };
    _config.application.applicationUiPath = _config.application.applicationPath + '/ui';
    _config.application.applicationViewsPath = _config.application.applicationPath + '/ui/views';
    _config.application.applicationScriptsPath = _config.application.applicationPath + '/ui/scripts';
    _config.application.applicationUploadsPath = _config.application.applicationPath + '/ui/uploads';
    _config.application.applicationStylesPath = _config.application.applicationPath + '/ui/styles';


    /*******************************************************************************************************************
     * Files convertion: merging, minification, uglification, etc.
     ******************************************************************************************************************/

    /**
     * Parse CSS and add vendor prefixes to CSS rules using values from Can I Use.
     * Write your CSS rules without vendor prefixes (in fact, forget about them entirely):
     *
     * :fullscreen a {transition: transform 1s}
     *
     * Process your CSS by Autoprefixer:
     *    var prefixed = autoprefixer.process(css).css;
     * It will use the data on current browser popularity and properties support to apply prefixes for you:
     *    :-webkit-full-screen a {-webkit-transition: -webkit-transform 1s; transition: transform 1s }
     *    :-moz-full-screen a {transition: transform 1s}
     *    :-ms-fullscreen a {transition: transform 1s}
     *    :fullscreen a {-webkit-transition: -webkit-transform 1s; transition: transform 1s}
     */
    _config.autoprefixer = {
        options: ['last 1 version'],
        dist: {
            files: [
                {
                    expand: true,
                    cwd: '<%= application.tmp %>/ui/styles/css/',
                    src: '{,*/}*.css',
                    dest: '<%= application.tmp %>/ui/styles/'
                }
            ]
        }
    };
//
    /*******************************************************************************************************************
     * Work with server, tasks and watchers
     ******************************************************************************************************************/
    _config.watch = {
        'compass': {
            files: [
                '<%= application.applicationStylesPath %>/scss/{,*/}*.{scss,sass}',
                '<%= application.applicationStylesPath %>/scss/**/{,**/}*.{scss,sass}'
            ],
            tasks: ['compass', 'autoprefixer']
        },
        'styles': {
            files: [
                '<%= application.applicationStylesPath %>/css/{,*/}*.css'
            ],
            tasks: ['autoprefixer']
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
    _config.compass = {
        options: {
            // cssDir: '.tmp/styles',
            relativeAssets: false,
            debugInfo: false
        },
        'css': {
            options: {
                sassDir: '<%= application.applicationStylesPath %>/scss',
                cssDir: [
                    '<%= application.tmp %>/ui/styles',
                    '<%= application.applicationStylesPath %>/css'
                ]
            }
        },
        'fonts': {
            options: {
                httpFontsPath: 'ui/styles/fonts',
                fontsDir: '<%= application.applicationStylesPath %>/fonts'
            }
        }
    };

    var modRewrite, mountFolder;
    modRewrite = require('connect-modrewrite');
    mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };
    _config.connect = {
        options: {
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: ('*' === _APP_HOST_) ? '127.0.0.1' : _APP_HOST_,
            port: ('*' === _APP_PORT_) ? '9001' : _APP_PORT_,
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
                middleware: function(connect, options) {
                    var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
                    return [modRewrite(['!(\\..+)$ / [L]'])].concat(
                        optBase.map(function(path) {
                            return connect.static(path);
                        }));
                }
            }
        }
    };

    /*******************************************************************************************************************
     * INIT CONFIG
     ******************************************************************************************************************/
    grunt.initConfig(_config);

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
    grunt.registerTask('default', function() {
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
    grunt.registerTask('run', 'Run server from core folders (developer mode)', function() {
        // Task started
        grunt.log.writeln('Task started : Run server from core folders (developer mode)');

        // Run the task
        grunt.task.run([
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
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
            + '\n----------\n'
            + '* RUN APPLICATION IN DEVELOPMENT MODE (with watchers for styles, js, html files):\n'
            + '  Format:\n'
            +
            '    grunt run [-app=APPLICATION_TO_RUN_NAME] [-host=APPLICATION_RUN_HOST] [-port=APPLICATION_RUN_PORT]\n'
            + '  Parameters:\n'
            + '  - APPLICATION_TO_RUN_NAME = {"main"}, if not set, "main" will be used\n'
            + '  - APPLICATION_RUN_HOST = host to run, "127.0.0.1" on default\n'
            + '  - APPLICATION_RUN_PORT = port to run, "9001" on default\n'
            + '  Usage:\n'
            + '    grunt run\n'
            + '    grunt run -host=192.168.100.199 -port=9000\n'
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
        app = _findKeysConfig(args, ['main'], 'main');
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
        if (('string' === (typeof args)) || ('number' === (typeof args))) {
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