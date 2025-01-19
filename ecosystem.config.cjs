module.exports = {
  apps: [{
    name: 'telegram-bot',
    script: 'src/index.js',
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
