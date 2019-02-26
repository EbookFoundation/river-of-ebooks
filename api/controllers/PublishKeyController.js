const HttpError = require('../errors/HttpError')
const request = require('request')
const url = require('url')
const uriRegex = /(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?/i

module.exports = {
  create: async function (req, res) {
    try {
      const name = req.param('name')
      const url = req.param('url')
      if (!name.length) throw new Error('Name cannot be blank')
      if (!url.length) throw new Error('URL cannot be blank')
      if (!uriRegex.test(url)) throw new Error('Invalid URL')
      const created = await PublishKey.create({
        user: req.user.id,
        name,
        url
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
  },
  verify: async function (req, res) {
    try {
      const id = req.param('id')
      const key = await PublishKey.findOne({ id })
      if (!key) throw new HttpError(404, 'Cannot find that key')
      if (key.verified) throw new HttpError(400, 'That key\'s domain has already been verified')

      const verification = key.verification_key
      const _url = url.resolve(key.url, `${verification}.html`)

      const { httpResp, body } = await requestAsync({
        url: _url,
        headers: { 'User-Agent': 'RoE-aggregator' }
      })

      if (httpResp.statusCode !== 200 || body !== `${verification}.html`) throw new HttpError(404, `Could not find ${_url}`)

      const updated = await PublishKey.updateOne({ id }).set({
        verified: true,
        verification_key: ''
      })
      return res.json(updated)
    } catch (e) {
      if (e instanceof HttpError) return e.send(res)
      else return (new HttpError(500, e.message)).send(res)
    }
  }
}

function requestAsync (opts) {
  return new Promise((resolve, reject) => {
    request.get(opts, function (err, httpResp, body) {
      if (err) {
        reject(err)
      } else {
        resolve({ httpResp, body })
      }
    })
  })
}
