module.exports = {
    server: {
        options: {
            livereload: true
        },
        files: [
            'static/**',
            'server/.build/index.js'
        ],
        tasks: ['copy:server']
    }
};
