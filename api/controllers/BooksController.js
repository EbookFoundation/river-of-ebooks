/**
 * BooksController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  publish: async function (req, res) {
    try {
      const body = req.body
      const host = req.hostname
      let result

      if (!host) throw new Error('Missing hostname')
      if (!body) throw new Error('Missing body')

      const bookExists = await Book.findOne(body)

      if (bookExists) {
        throw new Error('Version already exists')
      } else {
        result = await Book.create(body)
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
      return res.status(400).json({
        error: e.message
      })
    }
  },

  list: async function (req, res) {
    try {
      const body = req.allParams()
      if (!body) throw new Error('Missing parameters')

      const books = await Book.find(body)

      if (!books.length) {
        return res.status(404).json({
          error: 'No books matching those parameters were found.'
        })
      }
      return res.json(books)
    } catch (e) {
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
