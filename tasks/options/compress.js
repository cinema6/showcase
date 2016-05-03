module.exports = {
    options: {
        mode: 'gzip',
        level: 9
    },

    build: {
        files: [
            {
                src: '.tmp/uncompressed/<%= settings.distDir %>/index.js',
                dest: '<%= settings.distDir %>/index.js'
            }
        ]
    }
};
