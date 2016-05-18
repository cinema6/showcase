'use strict';

var grunt = require('grunt');

var verbosityOpt = grunt.option('verbosity');
var verbosity = (verbosityOpt === undefined) ? Infinity : verbosityOpt;

module.exports = {
    options: {
        hostname: '0.0.0.0'
    },
    docs: {
        options: {
            port: 8000,
            base: 'docs',
            livereload: true
        }
    },
    server: {
        proxies: [
            {
                context: '/api',
                port: 443,
                https: true,
                host: 'platform-staging.reelcontent.com',
                protocol: 'https:',
                headers: {
                    origin : 'https://platform-staging.reelcontent.com',
                    host: 'platform-staging.reelcontent.com',
                    'accept-encoding': ''
                }
            }
        ],
        options: {
            port: '<%= settings.port %>',
            base: 'server/.build',
            livereload: true,
            middleware: function(connect, options, middleware) {
                return [
                    require('http-mock')({
                        '/api/auth': 'server/api/auth/main.js',
                        '/api/account': 'server/api/account/main.js',
                        '/api/payments': 'server/api/payment/main.js',
                        '/api/search': 'server/api/search/main.js',
                        '/api/collateral': 'server/api/collateral/main.js',
                        '/api/campaigns': 'server/api/campaign/main.js',
                        '/api/analytics': 'server/api/analytics/main.js',

                        '@verbosity': verbosity,
                        '@delay': [500, 1000]
                    }),
                    require('grunt-connect-proxy/lib/utils').proxyRequest
                ].concat(middleware);
            }
        }
    }
};
