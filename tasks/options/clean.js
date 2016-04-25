module.exports = {
    build: ['<%= settings.distDir %>', '.tmp'],
    server: ['server/.build'],
    test: ['.tmp']
};
