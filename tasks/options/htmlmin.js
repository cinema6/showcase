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
    tmp: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: ['**/*.html'],
                dest: '.tmp/<%= settings.distDir %>'
            },
            {
                expand: true,
                cwd: 'src',
                src: ['**/*.html'],
                dest: '.tmp/src'
            }
        ]
    }
};
