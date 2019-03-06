/**
 * BooksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const HttpError = require('../errors/HttpError')
const { asyncRead, hmacSign } = require('../util')
const request = require('request')
const uriRegex = /^(.+:\/\/)?(.+\.)*(.+\.).{1,}(:\d+)?(.+)?/i

module.exports = {
  publish: async function (req, res) {
    try {
      const body = req.body
      const host = req.hostname
      let result

      if (!host) throw new HttpError(400, 'Missing hostname')
      if (!body) throw new HttpError(400, 'Missing body')

      const bookExists = await Book.findOne(body)

      if (bookExists) {
        throw new HttpError(400, 'Version already exists')
      } else {
        const { title, isbn, author, publisher } = body
        // require at least 2 fields to be filled out
        if ([title, isbn, author, publisher].reduce((a, x) => a + (x ? 1 : 0), 0) >= 2) {
          result = await Book.create(body).fetch()
        } else {
          throw new HttpError(400, 'Please fill out at least 2 fields (title, author, publisher, isbn)')
        }
      }

      if (req.file('opds')) {
        req.file('opds').upload(sails.config.skipperConfig, async function (err, uploaded) {
          if (err) {
            await Book.destroy({ id: result.id })
            throw new HttpError(500, err.message)
          }
          const fd = (uploaded[0] || {}).fd
          await Book.update({ id: result.id }, { storage: fd })
          sendUpdatesAsync(result.id)
          return res.json({
            ...result
          })
        })
      } else {
        throw new HttpError(400, 'Missing OPDS file upload')
      }
    } catch (e) {
      if (e instanceof HttpError) return e.send(res)
      return res.status(500).json({
        error: e.message
      })
    }
  }
}

async function sendUpdatesAsync (id) {
  const book = await Book.findOne({ id })
  const targets = await TargetUrl.find()
  if (!book) return
  for (const i in targets) {
    try {
      const item = targets[i]
      const user = await User.findOne({ id: item.user })
      const { author: fAuthor, publisher: fPublisher, title: fTitle, isbn: fIsbn, url } = item
      const { author: bAuthor, publisher: bPublisher, title: bTitle, isbn: bIsbn } = book
      sails.log('sending ' + book.id + ' info to ' + url)

      if (uriRegex.test(url)) {
        if (fAuthor && !((bAuthor || '').includes(fAuthor))) continue
        if (fPublisher && !((bPublisher || '').includes(fPublisher))) continue
        if (fTitle && !((bTitle || '').includes(fTitle))) continue
        if (fIsbn && !((bIsbn || '').includes(fIsbn))) continue

        let content
        const skipperConfig = sails.config.skipperConfig
        const adapterConfig = { ...skipperConfig, adapter: undefined }
        const skipperAdapter = skipperConfig.adapter(adapterConfig)
        const opdsHelper = await sails.helpers.opds()
        try {
          if (!book.storage.length) throw new Error('missing book opds file')
          content = await asyncRead(skipperAdapter, opdsHelper, book.storage)
        } catch (e) {
          content = await opdsHelper.book2opds(book)
        }
        const timestamp = Date.now()
        request.post({
          url: url,
          headers: {
            'User-Agent': 'RoE-aggregator',
            'X-RoE-Signature': hmacSign(user.signing_secret, timestamp, content),
            'X-RoE-Request-Timestamp': timestamp
          },
          body: content,
          json: true
        }, function (err, httpResp, body) {
          if (err) {
            sails.log(`error: failed to send book ${id} to ${url}`)
          }
        })
      }
    } catch (e) {
      sails.log(`error: ${e.message}\n${e.stack}`)
    }
  }
}
