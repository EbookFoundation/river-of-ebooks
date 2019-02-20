/**
 * BooksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const HttpError = require('../errors/HttpError')
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
  },

  list: async function (req, res) {
    try {
      const body = req.allParams()
      let page = 1
      const perPage = 200
      if (body.page) {
        page = Math.abs(+body.page) || 1
        delete body.page
      }
      const books = await Book.find(body || {}).skip((page * perPage) - perPage).limit(perPage)

      if (!books.length) {
        throw new HttpError(404, 'No books matching those parameters were found.')
      }
      return res.json(books)
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
    const item = targets[i]
    const { author: fAuthor, publisher: fPublisher, title: fTitle, isbn: fIsbn, url } = item
    const { author: bAuthor, publisher: bPublisher, title: bTitle, isbn: bIsbn } = book
    sails.log('sending ' + book.id + ' info to ' + url)

    if (uriRegex.test(url)) {
      if (fAuthor && !((bAuthor || '').includes(fAuthor))) continue
      if (fPublisher && !((bPublisher || '').includes(fPublisher))) continue
      if (fTitle && !((bTitle || '').includes(fTitle))) continue
      if (fIsbn && !((bIsbn || '').includes(fIsbn))) continue
      request.post({
        url: url,
        headers: { 'User-Agent': 'RoE-aggregator' },
        form: book
      }, function (err, httpResp, body) {
        if (err) {
          sails.log(`error: failed to send book ${id} to ${url}`)
        }
      })
    }
  }
}
