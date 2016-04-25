module.exports = {
    compile: {
        name: '<%= package.name %>',
        description: '<%= package.description %>',
        version: '<%= package.version %>',
        options: {
            linkNatives: true,

            paths: [
                'src/',
                'lib/'
            ],
            outdir: 'docs/'
        }
    }
};
