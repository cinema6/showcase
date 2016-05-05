'use strict';

/* eslint-env node  */

module.exports = function(grunt) {
    grunt.registerTask('prepare_ruby_env', 'Try to setup ruby dependencies', function() {
        var done = this.async();

        function installBundler() {
            grunt.util.spawn({ cmd: 'bundler', args: ['--version'] }, function(error) {
                if (!error) {
                    grunt.log.writeln('Bundler is already installed.');
                    return done();
                }

                grunt.log.writeln('Installing the bundler!');
                grunt.util.spawn({ cmd: 'gem', args: ['install', 'bundler'] }, function(error) {
                    if (error) {
                        grunt.log.errorlns('Failed to install the bundler:');
                        return grunt.fail.fatal(error);
                    }

                    grunt.log.oklns('Installed the bundler!');
                    return done();
                }).stdout.pipe(process.stdout);
            });
        }

        grunt.util.spawn({ cmd: 'ruby', args: ['--version'] }, function(error, output) {
            if (error) {
                grunt.log.errorlns('Failed to validate ruby version. Is it installed?');
                grunt.fail.fatal(error);
            } else {
                if (!/2\.\d+\.\d+/.test(output.toString())) {
                    return grunt.fail.fatal('Ruby >= 2 is required!');
                }
            }

            return installBundler();
        });
    });
};
