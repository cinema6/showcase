module.exports = {
    options: {
        key:    '<%= settings.aws.accessKeyId %>',
        secret: '<%= settings.aws.secretAccessKey %>',
        access: 'public-read'
    },
    staging: {
        options: {
            bucket: '<%= settings.s3.staging.bucket %>'
        },
        upload: [
            {
                src: [
                    '<%= settings.distDir %>/**',
                    '!<%= settings.distDir %>/**/*.css',
                    '!<%= settings.distDir %>/**/*.js',
                    '!<%= settings.distDir %>/*.*'
                ],
                dest: '<%= settings.s3.staging.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=31556926'
                }
            },
            {
                src: [
                    '<%= settings.distDir %>/**/*.css',
                    '<%= settings.distDir %>/**/*.js'
                ],
                dest: '<%= settings.s3.staging.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=31556926',
                    ContentEncoding: 'gzip'
                }
            },
            {
                src: '<%= settings.distDir %>/*.html',
                dest: '<%= settings.s3.staging.app %><%= _version %>/',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=15',
                    ContentEncoding: 'gzip'
                }
            },
            {
                src: '<%= settings.distDir %>/*.html',
                dest: '<%= settings.s3.staging.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=15',
                    ContentEncoding: 'gzip'
                }
            }
        ]
    },
    production: {
        options: {
            bucket: '<%= settings.s3.production.bucket %>'
        },
        upload: [
            {
                src: [
                    '<%= settings.distDir %>/**',
                    '!<%= settings.distDir %>/**/*.css',
                    '!<%= settings.distDir %>/**/*.js',
                    '!<%= settings.distDir %>/*.*'
                ],
                dest: '<%= settings.s3.production.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=31556926'
                }
            },
            {
                src: [
                    '<%= settings.distDir %>/**/*.css',
                    '<%= settings.distDir %>/**/*.js'
                ],
                dest: '<%= settings.s3.production.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=31556926',
                    ContentEncoding: 'gzip'
                }
            },
            {
                src: '<%= settings.distDir %>/*.html',
                dest: '<%= settings.s3.production.app %><%= _version %>/',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=15',
                    ContentEncoding: 'gzip'
                }
            },
            {
                src: '<%= settings.distDir %>/*.html',
                dest: '<%= settings.s3.production.app %>',
                rel : '<%= settings.distDir %>/',
                options: {
                    CacheControl: 'max-age=60',
                    ContentEncoding: 'gzip'
                }
            }
        ]
    }
};
