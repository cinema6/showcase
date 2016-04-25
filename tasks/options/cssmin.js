'use strict';

module.exports = {
    build: {
        files: [
            {
                expand: true,
                cwd: 'public',
                src: '',
                dest: '<%= settings.distDir %>'
            }
        ]
    }
};
