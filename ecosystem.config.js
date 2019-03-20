module.exports = {
  apps: [{
    name: 'roe-base',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      SAILS_DATASTORE_URL: process.env.DATABASE_CONNECTION
    }
  }]
}
