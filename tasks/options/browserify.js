'use strict';

module.exports = {
    server: {
        options: {
            watch: true,
            keepAlive: false,
            browserifyOptions: {
                debug: true
            },
            transform: [
                ['babelify']
            ]
        },
        files: [
            {
                src: 'src/index.js',
                dest: 'server/.build/index.js'
            }
        ]
    },
    build: {
        options: {
            browserifyOptions: {
                debug: false
            },
            transform: [
                ['babelify'],
                ['envify', {
                    global: true,
                    NODE_ENV: 'production'
                }],
                ['uglifyify', { global: true }]
            ]
        },
        files: [
            {
                src: 'src/index.js',
                dest: '.tmp/<%= settings.distDir %>/index.js'
            }
        ]
    }
};
