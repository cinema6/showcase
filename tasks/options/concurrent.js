module.exports = {
    server: {
        options: {
            logConcurrentOutput: true
        },
        tasks: ['watch:server', 'compass:watch']
    }
};
