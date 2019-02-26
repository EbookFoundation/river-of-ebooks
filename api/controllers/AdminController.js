const HttpError = require('../errors/HttpError')

module.exports = {
  show: async function (req, res) {
    res.view('pages/admin', {
      email: req.user.email
    })
  },
  listUsers: async function (req, res) {
    try {
      const users = await User.find({})
      return res.json(users)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  listPublishers: async function (req, res) {
    try {
      const publishers = await PublishKey.find({
        select: ['id', 'user', 'appid', 'url', 'name', 'whitelisted', 'verified', 'verification_key', 'created_at', 'updated_at']
      }).populate('user')
      return res.json(publishers)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  editUser: async function (req, res) {
    try {
      const id = req.param('id')
      const patchData = req.param('patch')
      const updated = await User.updateOne({ id }).set({
        ...patchData
      })
      for (const key in updated) {
        if (patchData[key] === undefined && key !== 'id') delete updated[key]
      }
      return res.json(updated)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  editPublisher: async function (req, res) {
    try {
      const id = req.param('id')
      const patchData = req.param('patch')
      const updated = await PublishKey.updateOne({ id }).set({
        ...patchData
      })
      for (const key in updated) {
        if (patchData[key] === undefined && key !== 'id') delete updated[key]
      }
      return res.json(updated)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  deleteUser: async function (req, res) {
    try {
      const id = req.param('id')
      await User.destroyOne({ id })
      return res.status(204).send()
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  deletePublisher: async function (req, res) {
    try {
      const id = req.param('id')
      await PublishKey.destroyOne({ id })
      return res.status(204).send()
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  }
}
