'use strict';

module.exports = {
    options: {
        environment: 'development',
        bundleExec: true
    },

    build: {
        options: {
            environment: 'production'
        }
    },

    server: {
        options: {}
    },
    watch: {
        options: {
            watch: true
        }
    }
};
