'use strict';

var buildExternalHelpers = require('babel-core').buildExternalHelpers;

module.exports = function(grunt) {
    grunt.registerMultiTask('babelhelpers', 'Build external babel helpers', function() {
        var options = this.options({
            dest: './external-helpers.js'
        });

        grunt.file.write(options.dest, buildExternalHelpers());
        grunt.log.ok('Wrote Babel helpers to ' + options.dest + '!');
    });
};
