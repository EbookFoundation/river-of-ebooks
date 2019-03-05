const HttpError = require('../errors/HttpError')
const { asyncRead } = require('../util')

module.exports = {
  navigation: async function (req, res) {
    return res.json({
      'metadata': {
        'title': 'RoE navigation'
      },
      'links': [
        {
          'rel': 'self',
          'href': '/api/catalog',
          'type': 'application/opds+json'
        }
      ],
      'navigation': [
        {
          'href': 'new',
          'title': 'New Publications',
          'type': 'application/opds+json',
          'rel': 'current'
        },
        {
          'href': 'all',
          'title': 'All Publications',
          'type': 'application/opds+json',
          'rel': 'current'
        },
        { 'rel': 'search', 'href': '/api/catalog/search{?title,author,isbn}', 'type': 'application/opds+json', 'templated': true }
      ]
    })
  },
  listNew: async function (req, res) {
    return res.status(400).json({ error: 'not implemented' })
  },
  listAll: async function (req, res) {
    try {
      const body = req.allParams()
      let page = 1
      const perPage = 200
      if (body.page) {
        page = Math.abs(+body.page) || 1
        delete body.page
      }
      let books = await Book.find(body || {}).skip((page * perPage) - perPage).limit(perPage)

      if (!books.length) {
        throw new HttpError(404, 'No books matching those parameters were found.')
      }

      const skipperConfig = sails.config.skipperConfig
      const adapterConfig = { ...skipperConfig, adapter: undefined }
      const skipperAdapter = skipperConfig.adapter(adapterConfig)
      const opdsHelper = await sails.helpers.opds()

      books = await Promise.all(books.map(book => {
        try {
          if (!book.storage.length) throw new Error('missing book opds file')
          return asyncRead(skipperAdapter, opdsHelper, book.storage)
        } catch (e) {
          return opdsHelper.book2opds(book)
        }
      }))

      return res.json({
        metadata: {
          title: 'RoE all publications',
          itemsPerPage: perPage,
          currentPage: page
        },
        links: [
          { rel: 'self', href: `new?page=${page}`, type: 'application/opds+json' },
          { rel: 'prev', href: `new?page=${page > 1 ? page - 1 : page}`, type: 'application/opds+json' },
          { rel: 'next', href: `new?page=${page + 1}`, type: 'application/opds+json' },
          { 'rel': 'search', 'href': 'all{?title,author,version,isbn}', 'type': 'application/opds+json', 'templated': true }
        ],
        publications: books
      })
    } catch (e) {
      if (e instanceof HttpError) return e.send(res)
      return res.status(500).json({
        error: e.message
      })
    }
  }
}
