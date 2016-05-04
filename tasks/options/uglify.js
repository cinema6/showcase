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
    }
};
