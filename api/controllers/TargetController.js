'use strict'
const HttpError = require('../errors/HttpError')

module.exports = {
  show: function (req, res) {
    res.view('pages/targets', {
      email: req.user.email

    })
  },
  create: async function (req, res) {
    try {
      const url = await TargetUrl.create({
        user: req.user
      }).fetch()
      return res.json(url)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  edit: async function (req, res) {
    try {
      const id = req.param('id')
      const value = req.param('url')
      const url = await TargetUrl.update({ id, user: req.user }, { url: value }).fetch()
      return res.json(url)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  delete: async function (req, res) {
    try {
      await TargetUrl.destroy({ id: req.param('id') })
      return res.status(204)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  },
  list: async function (req, res) {
    try {
      const urls = await TargetUrl.where({
        user: req.user
      })
      return res.json(urls)
    } catch (e) {
      return (new HttpError(500, e.message)).send(res)
    }
  }
}
