const HttpError = require('../errors/HttpError')

module.exports = {
  create: async function (req, res) {
    try {
      const name = req.param('name')
      if (!name.length) throw new Error('Name cannot be blank')

      const created = await PublishKey.create({
        user: req.user.id,
        name
      }).fetch()
      return res.json(created)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  list: async function (req, res) {
    try {
      const keys = await PublishKey.find({ user: req.user.id })
      return res.json(keys)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  refresh: async function (req, res) {
    try {
      const id = req.param('id')
      const key = await PublishKey.update({ id, user: req.user.id }, {}).fetch()
      return res.json(key)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  delete: async function (req, res) {
    try {
      const id = req.param('id')
      await PublishKey.destroyOne({ id })
      return res.status(204).send()
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  }
}
