module.exports = function(http) {
    'use strict';

    var apps = require('./app.products.json');

    function randomMember(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    http.whenGET('/api/collateral/product-data', function(request) {
        var uri = request.query.uri;

        if (!uri) {
            this.respond(400, 'Must specify a URI.');
        }

        this.respond(200, randomMember(apps));
    });
};
