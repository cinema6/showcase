'use strict';

var grunt = require('grunt');
var concat = Array.prototype.concat;

module.exports = function(config) {
    var only = grunt.option('only') || '**';
    var specs = grunt.file.match(
        { matchBase: true },
        only,
        concat.apply([], [
            'test/spec/**/*.ut.js'
        ].map(function(glob) {
            return grunt.file.expand(glob);
        }))
    );

    config.set({
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'test/main.js', watched: false }
        ].concat(specs.map(function(path) {
            return { pattern: path, watched: false };
        })),

        exclude: [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress' ],

        browserify: {
            debug: true,
            configure: function(bundle) {
                var _filterTransform = bundle._filterTransform;

                bundle.once('prebundle', function() {
                    bundle.transform('babelify')
                        .plugin('proxyquire-universal');

                    // Monkey-patch browserify so that the babelify transform is not added twice.
                    bundle._filterTransform = function(tr) {
                        var existing;

                        if (!_filterTransform.call(this, tr)) { return false; }

                        if (tr instanceof Array) {
                            tr = tr[0];
                        }

                        existing = bundle._transforms.map(function(item) {
                            return item.transform;
                        });

                        try {
                            return existing.indexOf(require.resolve(tr)) < 0;
                        } catch (e) {
                            return true;
                        }
                    };

                    bundle.external('react/addons');
                    bundle.external('react/lib/ReactContext');
                    bundle.external('react/lib/ExecutionEnvironment');
                });
            }
        }
    });
};
