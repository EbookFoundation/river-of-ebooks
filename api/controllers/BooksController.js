'use strict'
/**
 * BooksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const HttpError = require('../errors/HttpError')

module.exports = {
  publish: async function (req, res) {
    try {
      const body = req.body
      const host = req.hostname
      let result

      if (!host) throw new HttpError(400, 'Missing hostname')
      if (!body) throw new HttpError(400, 'Missing body')
      if (!body.title || !body.author || !body.version || !req.file('opds')) throw new Error('Body is not formatted correctly')
      const data = {
        source: host,
        title: body.title,
        author: body.author,
        version: body.version
      }
      if (body.isbn) data.isbn = body.isbn
      const bookExists = await Book.findOne(data)

      if (bookExists) {
        throw new HttpError(400, 'Version already exists')
      } else {
        result = await Book.create(data).fetch()
      }

      req.file('opds').upload(sails.config.skipperConfig, async function (err, uploaded) {
        if (err) {
          await Book.destroy({ id: result.id })
          throw new HttpError(500, err.message)
        }
        await Book.update({ id: result.id }, { storage: uploaded[0].fd })
        sendUpdatesAsync(result.id)
        return res.json({
          ...result
        })
      })
    } catch (e) {
      if (e instanceof HttpError) return e.send(res)
      return res.status(400).json({
        error: e.message
      })
    }
  },

  list: async function (req, res) {
    try {
      const body = req.allParams()
      if (!body) throw new HttpError(400, 'Missing parameters')
      const numPerPage = 50
      const page = body.page || 1

      const books = await Book.find(body).sort('createdAt DESC').skip(page * numPerPage - numPerPage).limit(numPerPage)
      if (!books.length) throw new HttpError(404, 'No books matching those parameters were found.')

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
  const book = await Book.find({ id })
  const targets = await TargetUrl.find()
  for (const i in targets) {
    sails.log('sending ' + book.id + ' info to ' + targets[i].url)
  }
}
