module.exports = {
    options: {
        mode: 'gzip',
        level: 9
    },

    build: {
        files: [
            {
                src: '.tmp/uncompressed/<%= settings.distDir %>/index.js',
                dest: '<%= settings.distDir %>/<%= _version %>/index.js'
            },
            {
                expand: true,
                cwd: '.tmp/uncompressed/static',
                src: '*.html',
                dest: '<%= settings.distDir %>'
            },
            {
                expand: true,
                cwd: '.tmp/uncompressed/static',
                src: '**/*.html',
                dest: '<%= settings.distDir %>/<%= _version %>'
            },
            {
                expand: true,
                cwd: 'static',
                src: '**/*.css',
                dest: '<%= settings.distDir %>/<%= _version %>'
            }
        ]
    }
};
