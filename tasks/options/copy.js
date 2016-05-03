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
                    '**'
                ],
                dest: '<%= settings.distDir %>'
            }
        ]
    }
};
