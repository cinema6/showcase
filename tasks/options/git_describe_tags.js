'use strict';

var grunt = require('grunt');

module.exports = {
    options: {
        config: function(version) {
            grunt.config.set('_version', version);
        }
    }
};
