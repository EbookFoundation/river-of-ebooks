# roe-base

a [Sails v1](https://sailsjs.com) application


### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Tue Oct 16 2018 01:21:31 GMT+0000 (UTC) using Sails v1.0.2.

<!-- Internally, Sails used [`sails-generate@1.15.28`](https://github.com/balderdashy/sails-generate/tree/v1.15.28/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

[![Build Status](https://travis-ci.org/miacona96/RoE-pipe.svg?branch=master)](https://travis-ci.org/miacona96/RoE-pipe)


### Setup

#### Standalone

1. Standard npm install
```
git clone https://github.com/EbookFoundation/RoE-pipe
cd RoE-pipe
npm i
```

2. Create config files
```
touch knexfile.js ecosystem.config.js config/local.js
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
  skipperConfig: {
    adapter: require('skipper-s3'),
    key: 'S3_API_KEY',
    secret: 'S3_API_SECRET',
    bucket: 'S3_BUCKET'
  },
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

