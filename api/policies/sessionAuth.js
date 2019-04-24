/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */
module.exports = function (req, res, next) {
  if (process.env.NODE_ENV === 'development') return next()
  if (req.session.authenticated) return next()
  // res.status(403).json({ error: 'You are not permitted to perform this action.' })
  res.redirect('/login')
}
