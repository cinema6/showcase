module.exports = {
    build: ['<%= settings.distDir %>', '.tmp', '.sass-cache', 'static/scss'],
    server: ['server/.build'],
    test: ['.tmp']
};
