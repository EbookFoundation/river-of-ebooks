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

      return res.json({
        ...result
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message
      })
    }
  }
}
