// Passport protocol configurations
const crypto = require('crypto')
const base64URL = require('base64url')

module.exports.protocols = {
  local: {
    /**
     * Validate a login request
     *
     * Looks up a user using the supplied identifier (email or username) and then
     * attempts to find a local Passport associated with the user. If a Passport is
     * found, its password is checked against the password supplied in the form.
     *
     * @param {Object}   req
     * @param {string}   identifier
     * @param {string}   password
     * @param {Function} next
     */
    login: async function (req, identifier, password, next) {
      if (!validateEmail(identifier)) {
        return next(new Error('invalid email address'), false)
      }
      try {
        const user = await User.findOne({
          email: identifier
        })
        if (!user) { throw new Error('an account with that email was not found') }

        const passport = await Passport.findOne({
          protocol: 'local',
          user: user.id
        })
        if (passport) {
          const res = await Passport.validatePassword(password, passport)
          if (!res) { throw new Error('incorrect password') }
          return next(null, user)
        } else {
          throw new Error('that account does not have password login enabled')
        }
      } catch (e) {
        return next(e, false)
      }
    },
    register: async function (user, next) {
      try {
        const token = generateToken()
        const password = user.password
        if (!password.length) { throw new Error('password cannot be blank') }
        delete user.password

        const newUser = await User.create(user).fetch()
        try {
          await Passport.create({
            protocol: 'local',
            password,
            user: newUser.id,
            accesstoken: token
          })
          return next(null, token)
        } catch (e) {
          await User.destroy(newUser.id)
          throw e
        }
      } catch (e) {
        return next(e)
      }
    },
    update: async function (user, next) {
      throw new Error('not implemented')
    },
    connect: async function (req, res, next) {
      try {
        const user = req.user
        const password = req.param('password')

        const pass = await Passport.findOne({
          protocol: 'local',
          user: user.id
        })
        if (!pass) {
          await Passport.create({
            protocol: 'local',
            password,
            user: user.id
          })
        } else {
          return next(null, user)
        }
      } catch (e) {
        return next(e)
      }
    }
  }
}

const EMAIL_REGEX = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

function validateEmail (email) {
  return EMAIL_REGEX.test(email)
}

function generateToken () {
  return base64URL(crypto.randomBytes(48))
}
