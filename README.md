# River of Ebooks
https://github.com/EbookFoundation/river-of-ebooks

## About
The River of Ebooks serves as an easy-to-use ebook aggregator. Publishers can send metadata from new and updated ebooks through the River where it will be available for any downstream consumers to read, allowing for a more widely available ebook collection. This way, ebooks can be made available on all end user sites, instead of only the site they were published with.

-----

### Version info
This app was originally generated on Tue Oct 16 2018 01:21:31 GMT+0000 (UTC) using Sails v1.0.2.
<!-- Internally, Sails used [`sails-generate@1.15.28`](https://github.com/balderdashy/sails-generate/tree/v1.15.28/lib/core-generators/new). -->

### Setup
a [Sails v1](https://sailsjs.com) application
[![Build Status](https://travis-ci.org/miacona96/RoE-pipe.svg?branch=master)](https://travis-ci.org/miacona96/RoE-pipe)

#### Standalone

1. Standard npm install
```
git clone https://github.com/EbookFoundation/river-of-ebooks
cd river-of-ebooks
npm i
```

2. Create config files
```
touch config/local.js
```

3. Add database info to knexfile and pm2 ecosystem
```js
/* -- knexfile.js -- */
module.exports = {
  client: 'pg',
  connection: 'postgresql://user:password@example.com:5432/databasename'
}

/* -- ecosystem.config.js -- */

// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
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
      SAILS_DATASTORE_URL: 'postgresql://user:password@example.com:5432/databasename'
    }
  }]
}
```

4. Add secrets to config/local.js
```
/* -- config/local.js -- */
module.exports = {
  passport: {
    google: {
      options: {
        clientID: 'GOOGLE_CLIENT_ID',
        clientSecret: 'GOOGLE_CLIENT_SECRET'
      }
    },
    github: {
      options: {
        clientID: 'GITHUB_CLIENT_ID',
        clientSecret: 'GITHUB_CLIENT_SECRET'
      }
    }
  }
}
```

5. Run database migrations
```
npm run db:migrate
```

6. Start server
```
npm start
```


#### Elastic Beanstalk

1. Clone repo
```
git clone https://github.com/EbookFoundation/RoE-pipe
cd RoE-pipe
```

2. Deploy to environment
```
eb deploy environment_name
```

3. Configure environment variables on elastic beanstalk
```
PASSPORT_GOOGLE_ID
PASSPORT_GOOGLE_SECRET
PASSPORT_GITHUB_ID
PASSPORT_GITHUB_SECRET
DATABASE_CONNECTION
```

4. Run database migrations
```
npm run db:migrate
```

5. Start server
```
npm start
```
