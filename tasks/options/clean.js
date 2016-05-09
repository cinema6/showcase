module.exports = {
    build: ['<%= settings.distDir %>', '.tmp', 'static/scss'],
    server: ['server/.build', 'static/scss'],
    test: ['.tmp']
};
