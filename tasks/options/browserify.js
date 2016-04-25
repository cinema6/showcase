'use strict';

var babelConfig = require('../resources/babel.config.js');

module.exports = {
    options: {
        browserifyOptions: {
            debug: true
        },
        transform: [
            ['babelify', babelConfig]
        ]
    },
    server: {
        options: {
            watch: true,
            keepAlive: false
        },
        files: [
            {
                src: 'src/index.js',
                dest: 'server/.build/index.js'
            }
        ]
    }
};
