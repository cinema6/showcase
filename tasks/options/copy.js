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
    }
};
