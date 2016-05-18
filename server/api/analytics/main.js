module.exports = function(http) {
    'use strict';

    var grunt = require('grunt'),
        path = require('path'),
        Q = require('q'),
        db = require('../utils/db'),
        idFromPath = db.idFromPath;

    function objectPath(type, id) {
        return path.resolve(__dirname, './' + type + '/' + id + '.json');
    }


    http.whenGET('/api/analytics/campaigns/showcase/apps/**', function(request) {
        var id = db.idFromPath(request.pathname),
            filePath = objectPath('campaigns', id),
            analytics = grunt.file.exists(filePath) ? grunt.file.readJSON(filePath) : null;

        if (analytics) {
            this.respond(200, analytics);
        } else {
            this.respond(404, 'NOT FOUND');
        }
    });

};
