module.exports = function(grunt) {
    'use strict';

    var path = require('path');
    var osType = require('os').type();
    var _ = require('lodash');

    if (osType === 'Darwin'){
        try {
            require('posix').setrlimit('nofile', { soft : 1048 });
        } catch(error) {
        }
    }

    var settings = {
        distDir: 'build',
        port: 9000,
        awsJSON: '.aws.json',
        s3: {
            staging: {
                bucket: 'com.cinema6.staging.showcase.apps',
                app: ''
            },
            production: {
                bucket: 'com.cinema6.showcase.apps',
                app: ''
            }
        }
    };
    var personal = _.extend({
        browser: null
    }, grunt.file.exists('personal.json') ? grunt.file.readJSON('personal.json') : {});

    function loadGlobalConfig(relPath) {
        var configPath = path.join(process.env.HOME, relPath),
            configExists = grunt.file.exists(configPath);

        return configExists ? grunt.file.readJSON(configPath) : {};
    }

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            settings: _.extend(settings, {
                aws: loadGlobalConfig(settings.awsJSON)
            }),
            personal: personal
        }
    });

    grunt.loadTasks('tasks');

    /*********************************************************************************************
     *
     * SERVER TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('server', 'start a development server', [
        'clean:build',
        'clean:server',
        'compass:server',
        'copy:server',
        'browserify:server',
        'configureProxies:server',
        'connect:server',
        'open:server',
        'concurrent:server'
    ]);

    grunt.registerTask('server:docs', 'start a YUIDoc server', [
        'yuidoc:compile',
        'connect:docs',
        'open:docs',
        'watch:docs'
    ]);

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test:unit', 'run unit tests', [
        'clean:test',
        'eslint',
        'karma:unit'
    ]);

    grunt.registerTask('tdd', 'run unit tests whenever files change', [
        'clean:test',
        'karma:tdd'
    ]);

    /*********************************************************************************************
     *
     * BUILD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('build', 'build app into distDir', [
        'clean:build',
        'git_describe_tags',
        'rebase:build',
        'compass:build',
        'htmlmin:build',
        'copy:build',
        'browserify:build',
        'uglify:build',
        'compress:build'
    ]);

    grunt.registerTask('build:docs', 'build YUIDocs', [
        'yuidoc:compile'
    ]);

    /*********************************************************************************************
     *
     * UPLOAD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('publish', 'build and upload the application to s3', function(target) {
        grunt.task.run('build');
        grunt.task.run('s3:' + target);
    });
};
