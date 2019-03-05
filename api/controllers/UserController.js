/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
const { generateToken } = require('../util')
const HttpError = require('../errors/HttpError')

module.exports = {
  /**
   * @override
   */
  create: async function (req, res, next) {
    const passportHelper = await sails.helpers.passport()
    passportHelper.protocols.local.register(req.body, function (err, user) {
      if (err) {
        return res.status(500).json({
          error: err.toString()
        })
      }
      res.json(user)
    })
  },

  edit: async function (req, res, next) {
    const passportHelper = await sails.helpers.passport()
    passportHelper.protocols.local.update(req.body, function (err, user) {
      if (err) {
        return res.status(500).json({
          error: err.toString()
        })
      }
      res.json(user)
    })
  },

  me: function (req, res) {
    res.json(req.user)
  },

  regenerateSigningSecret: async function (req, res) {
    try {
      const user = await User.update({ id: req.user.id }, { signing_secret: generateToken({ bytes: 24 }) }).fetch()
      return res.json(user)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  }
}
