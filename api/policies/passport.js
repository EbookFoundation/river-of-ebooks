/**
 * Passport Middleware
 *
 * Policy for Sails that initializes Passport.js and as well as its built-in
 * session support.
 *
 * For more information on the Passport.js middleware, check out:
 * http://passportjs.org/guide/configure/
 */

const http = require('http')

const methods = ['login', 'logout', 'isAuthenticated', 'isUnauthenticated']

module.exports = async function (req, res, next) {
  const passport = (await sails.helpers.passport()).getPassport()
  passport.initialize()(req, res, function () {
    passport.session()(req, res, function () {
      if (req.isSocket) {
        _.each(methods, function (method) {
          req[method] = http.IncomingMessage.prototype[method].bind(req)
        })
      }

      if (!req.locals) req.locals = {}
      req.locals.user = req.user
      next()
    })
  })
}
