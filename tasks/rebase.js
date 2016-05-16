'use strict';

var cheerio = require('cheerio');

module.exports = function(grunt) {
    grunt.registerMultiTask('rebase', 'Adds/modifies a page\'s <base> tag', function() {
        var options = this.options();

        this.files.forEach(function(file) {
            var html = file.src.reduce(function(contents, src) {
                return contents + grunt.file.read(src);
            }, '');
            var $ = cheerio.load(html);
            var $base = $('head > base');

            if ($base.length > 0) {
                $base.attr('href', options.base);
            } else {
                $('head').prepend('<base href="' + options.base + '" />');
            }

            grunt.file.write(file.dest, $.html());
            grunt.log.oklns('Wrote to ' + file.dest);
        });
    });
};
