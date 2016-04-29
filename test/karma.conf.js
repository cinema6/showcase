'use strict';

var babelConfig = require('../tasks/resources/babel.config');

module.exports = function(config) {
    config.set({
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'test/main.js', watched: false },
            { pattern: 'test/spec/**/*.ut.js', watched: false }
        ],

        exclude: [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress'],

        browserify: {
            debug: true,
            configure: function(bundle) {
                bundle.once('prebundle', function() {
                    bundle.transform('babelify', babelConfig)
                        .plugin('proxyquire-universal');
                });
            }
        }
    });
};
