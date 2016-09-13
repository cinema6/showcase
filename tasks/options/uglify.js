module.exports = {
    options: {
        report: 'gzip'
    },

    build: {
        files: [
            {
                src: '.tmp/<%= settings.distDir %>/index.js',
                dest: '.tmp/uncompressed/<%= settings.distDir %>/index.js'
            }
        ]
    },

    server: {
        files: [
            {
                src: 'server/.build/index.js',
                dest: 'server/.build/index.min.js'
            }
        ]
    }
};
