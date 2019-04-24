module.exports = {
  apps: [{
    name: 'roe-base',
    script: 'app.js',
    instances: 2,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      SAILS_DATASTORE_URL: process.env.DATABASE_CONNECTION,
      DATABASE_CONNECTION: process.env.DATABASE_CONNECTION,
      PASSPORT_GITHUB_ID: process.env.PASSPORT_GITHUB_ID,
      PASSPORT_GITHUB_SECRET: process.env.PASSPORT_GITHUB_SECRET,
      PASSPORT_GOOGLE_ID: process.env.PASSPORT_GOOGLE_ID,
      PASSPORT_GOOGLE_SECRET: process.env.PASSPORT_GOOGLE_SECRET
    }
  }]
}
