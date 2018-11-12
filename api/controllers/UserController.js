/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * @override
   */
  create: async function (req, res, next) {
    const passportHelper = await sails.helpers.passport()
    passportHelper.protocols.local.register(req.body, (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err.toString() })
      }
      res.json(user)
    })
  },

  update: async function (req, res, next) {
    const passportHelper = await sails.helpers.passport()
    passportHelper.protocols.local.update(req.body, (err, user) => {
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
  }
}
