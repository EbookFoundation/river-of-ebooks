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
        if (!user) throw new Error('an account with that email was not found')

        const passport = await Passport.findOne({
          protocol: 'local',
          user: user.id
        })
        if (passport) {
          const res = await Passport.validatePassword(password, passport)
          if (!res) throw new Error('incorrect password')
          return next(null, user, passport)
        }
      } catch (e) {
        return next(e, false)
      }
    }
  }
}

const EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

function validateEmail (email) {
  return EMAIL_REGEX.test(email)
}

function generateToken () {
  return base64URL(crypto.randomBytes(48))
}
