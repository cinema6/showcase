module.exports = {
    build: {
        options: {
            base: '/<%= _version %>/'
        },
        files: [
            {
                src: 'static/index.html',
                dest: '.tmp/static/index.html'
            }
        ]
    }
};
