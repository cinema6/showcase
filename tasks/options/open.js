module.exports = {
    server: {
        url: 'http://localhost:<%= settings.port %>/',
        app: '<%= personal.browser %>'
    },
    docs: {
        url: 'http://localhost:8000/',
        app: '<%= personal.browser %>'
    }
};
