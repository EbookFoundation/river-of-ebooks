// api/helpers/passport.js
const url = require('url')

module.exports = {
  friendlyName: 'Load PassportHelper',
  description: 'Load a PassportHelper instance',
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: 'Passport helper',
      outputDescription: 'A PassportHelper instance'
    }
  },
  fn: async function (inputs, exits) {
    return exits.success(new PassportHelper())
  }
}

function PassportHelper () {
  const passport = require('passport')
  this.loadStrategies = function () {
    const strategies = sails.config.passport
    const protocols = sails.config.protocols

    for (const key in strategies) {
      let options = {passReqToCallback: true}
      let Strategy = strategies[key].strategy
      if (key === 'local') {
        _.extend(options, {
          usernameField: 'identifier'
        })
        passport.use(new Strategy(options, protocols.local.login))
      } else {
        const protocol = strategies[key].protocol
        const callbackURL = strategies[key].callback
        let baseURL = ''
        if (sails.config.appUrl && sails.config.appUrl !== null) {
          baseURL = sails.config.appUrl
        } else {
          sails.log.warn('Please add \'appUrl\' to configuration')
          baseURL = sails.getBaseurl()
        }

        switch (protocol) {
          case 'oauth2':
            options.callbackURL = url.resolve(baseURL, callbackURL)
            break
          // other protocols (openid, etc can go here)
        }

        _.extend(options, strategies[key].options)

        passport.use(new Strategy(options, protocols[protocol].login))
      }
    }
  }
  this.getPassport = function () {
    return passport
  }
}
