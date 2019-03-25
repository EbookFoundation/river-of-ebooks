// api/helpers/passport.js
// from https://github.com/trailsjs/sails-auth/blob/master/api/services/passport.js
const url = require('url')
const { generateToken } = require('../util')

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

const passport = require('passport')
passport.serializeUser(function (user, next) {
  next(null, user.id)
})
passport.deserializeUser(function (id, next) {
  return User.findOne({ id: id })
    .then(function (user) {
      next(null, user)
      return user
    }).catch(next)
})

function PassportHelper () {
  this.protocols = sails.config.protocols

  this.loadStrategies = function () {
    const strategies = sails.config.passport

    for (const key in strategies) {
      let options = { passReqToCallback: true }
      let Strategy = strategies[key].strategy
      if (key === 'local') {
        _.extend(options, {
          usernameField: 'identifier'
        })
        passport.use(new Strategy(options, this.protocols.local.login))
      } else {
        const protocol = strategies[key].protocol
        const callbackURL = strategies[key].callback
        let baseURL = ''
        if (sails.config.custom.baseURL && sails.config.custom.baseURL !== null) {
          baseURL = sails.config.custom.baseURL
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

        passport.use(new Strategy(options, this.protocols[protocol].login))
      }
    }
  }
  this.endpoint = function (req, res) {
    const strategies = sails.config.passport
    const provider = req.param('provider')

    if (!_.has(strategies, provider)) return res.redirect('/login')

    const scopes = {
      google: ['email'],
      github: ['user:email']
    }

    passport.authenticate(provider, { scope: scopes[provider] })(req, res, req.next)
  }
  // a callback helper to split by req
  this.callback = function (req, res, next) {
    var provider = req.param('provider', 'local')
    var action = req.param('action')

    if (provider === 'local' && action !== undefined) {
      if (action === 'register' && !req.user) {
        this.protocols.local.register(req, res, next)
      } else if (action === 'connect' && req.user) {
        this.protocols.local.connect(req, res, next)
      } else if (action === 'disconnect' && req.user) {
        this.protocols.local.disconnect(req, res, next)
      } else {
        next(new Error('Invalid action'))
      }
    } else {
      if (action === 'disconnect' && req.user) {
        this.disconnect(req, res, next)
      } else {
        passport.authenticate(provider, next)(req, res, req.next)
      }
    }
  }
  this.connect = async function (req, q, profile, next) {
    let userAttrs = {}
    let provider = profile.provider || req.param('provider')

    req.session.tokens = q.tokens
    q.provider = provider

    if (!provider) {
      return next(new Error('No provider identified'))
    }

    // if the profile object from passport has an email, use it
    if (profile.emails && profile.emails[0]) userAttrs.email = profile.emails[0].value
    // if (!userAttrs.email) return next(new Error('No email available'))

    const pass = await Passport.findOne({
      provider,
      identifier: q.identifier
    })

    let user

    if (!req.user) {
      if (!pass) { // new user signing up, create a new user and/or passport
        if (userAttrs.email) {
          user = await User.findOne({ email: userAttrs.email })
        }
        if (!user) {
          user = await User.create({ userAttrs, signing_secret: await generateToken({ bytes: 24 }) }).fetch()
        }
        await Passport.create({
          ...q,
          user: user.id
        })
        next(null, user)
      } else { // existing user logging in
        if (_.has(q, 'tokens') && q.tokens !== pass.tokens) {
          pass.tokens = q.tokens
        }
        delete pass.id
        await Passport.update({ id: pass.id }, { tokens: pass.tokens })
        user = await User.find({ id: pass.user }).limit(1)
        next(null, user[0])
      }
    } else { // user logged in and trying to add new Passport
      if (!pass) {
        await Passport.create({
          ...q,
          user: req.user.id
        })
        next(null, req.user)
      } else { // no action, user already logged in and passport exists
        next(null, user)
      }
    }
  }
  this.disconnect = async function (req, res, next) {
    try {
      const user = req.user
      const provider = req.param('provider')

      const pass = Passport.findOne({
        provider,
        user: user.id
      })
      await Passport.destroy(pass.id)
      next(null, user)
      return user
    } catch (e) {
      next(e)
    }
  }
  this.getPassport = function () {
    return passport
  }
}
