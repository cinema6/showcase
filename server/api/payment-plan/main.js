module.exports = function(http) {
    'use strict';

    var path = require('path'),
        grunt = require('grunt'),
        Q = require('q');

    var fn = require('../utils/fn'),
        db = require('../utils/db'),
        pluckExcept = fn.pluckExcept,
        idFromPath = db.idFromPath,
        extend = fn.extend,
        genId = require('../../../tasks/resources/helpers').genId;

    function objectPath(type, id) {
        return path.resolve(__dirname, './' + type + '/' + id + '.json');
    }

    http.whenGET('/api/payment-plans/**', function(request) {
        var id = idFromPath(request.pathname),
            filePath = objectPath('payment-plans', id);

        try {
            this.respond(200, Q.when(extend(grunt.file.readJSON(filePath), { id: id })).delay(1000));
        } catch(e) {
            this.respond(404, 'Not Found');
        }
    });

    http.whenGET('/api/payment-plans', function(request) {
        var allPromotions = grunt.file.expand(path.resolve(__dirname, './payment-plans/*.json'))
                .map(function(path) {
                    var id = path.match(/[^\/]+(?=\.json)/)[0];

                    return extend(grunt.file.readJSON(path), { id: id });
                })
                .filter(function(paymentPlan) {
                    var ids = request.query.ids,
                        idArray = (ids || '').split(','),
                        id = paymentPlan.id;

                    return !ids || idArray.indexOf(id) > -1;
                });

        try {
            this.respond(200, Q.when(allPromotions).delay(1500));
        } catch(e) {
            this.respond(404, 'Not Found');
        }
    });

    http.whenPUT('/api/payment-plans/**', function(request) {
        var id = idFromPath(request.pathname),
            filePath = objectPath('payment-plans', id),
            current = grunt.file.readJSON(filePath),
            updated = extend(current, request.body, {
                lastUpdated: (new Date()).toISOString()
            });

        grunt.file.write(filePath, JSON.stringify(updated, null, '    '));

        this.respond(200, Q.when(extend(updated, {id: id})).delay(1500));
    });

    http.whenPOST('/api/payment-plans', function(request) {
        var id = genId('pp'),
            currentTime = (new Date()).toISOString(),
            paymentPlan = extend(request.body, {
                created: currentTime,
                lastUpdated: currentTime,
                status: 'active'
            });

        grunt.file.write(objectPath('payment-plans', id), JSON.stringify(paymentPlan, null, '    '));

        this.respond(201, Q.when(extend(paymentPlan, { id: id })).delay(1500));
    });

    http.whenDELETE('/api/payment-plans/**', function(request) {
        grunt.file.delete(objectPath('payment-plans', idFromPath(request.pathname)));

        this.respond(204, Q.when('').delay(1000));
    });
};
