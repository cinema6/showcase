module.exports = {
    presets: ['es2015-loose', 'react'],
    sourceMaps: true,
    plugins: [
        ['transform-runtime', {
            polyfill: false,
            regenerator: false
        }]
    ]
};
