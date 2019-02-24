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
        select: ['id', 'user', 'appid', 'url', 'created_at', 'updated_at']
      }).populate('user')
      return res.json(publishers)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  }
}
