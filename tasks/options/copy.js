module.exports = {
    server: {
        files: [
            {
                expand: true,
                cwd: 'static',
                src: [
                    '**'
                ],
                dest: 'server/.build/'
            }
        ]
    },
    build: {
        files: [
            {
                expand: true,
                cwd: 'static',
                src: [
                    '**',
                    '!*.html',
                    '!*.css'
                ],
                dest: '<%= settings.distDir %>/<%= _version %>'
            }
        ]
    }
};
