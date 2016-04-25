'use strict';

var uuid = require('rc-uuid');
var q = require('q');

module.exports = {
    mountFolder: function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    },

    genId: function(prefix) {
        return prefix + '-' + uuid.createUuid();
    },

    QS3: function(s3) {
        for (var prop in s3) {
            if (typeof s3[prop] === 'function') {
                this[prop] = q.nbind(s3[prop], s3);
            }
        }
    }
};
