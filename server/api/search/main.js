module.exports = function(http) {
    'use strict';

    var apps = require('./apps.json');
    var assign = require('lodash/assign');
    var createUuid = require('rc-uuid').createUuid;

    function randomMember(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    http.whenGET('/api/search/apps', function(request) {
        var limit = parseInt(request.query.limit) || 50;

        this.respond(200, Array.apply([], new Array(limit)).map(function() {
            var app = randomMember(apps);

            return assign({}, app, {
                uri: app.uri + '&rnd=' + createUuid()
            });
        }));
    });
};
