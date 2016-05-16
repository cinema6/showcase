module.exports = {
    options: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
    },
    build: {
        files: [
            {
                expand: true,
                cwd: 'static',
                src: ['**/*.html'],
                dest: '.tmp/uncompressed/static'
            },
            {
                src: '.tmp/static/index.html',
                dest: '.tmp/uncompressed/static/index.html'
            }
        ]
    }
};
