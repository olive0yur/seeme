module.exports = {
    apps: [{
        name: 'see-me',
        script: 'pnpm',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: 'production',
            PORT: 8080
        }
    }]
};