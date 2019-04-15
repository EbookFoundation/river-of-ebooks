module.exports = {
  show: async function (req, res) {
    const docsHelper = await sails.helpers.docs()
    const content = await docsHelper.read('README', '../../')
    const feedItems = await Book.find({}).sort('created_at DESC').limit(20)
    res.view('pages/index', {
      content,
      feedItems
    })
  },
  docs: async function (req, res) {
    const docsHelper = await sails.helpers.docs()
    const page = req.param('page')
    if (!page || !(['api', 'integrations', 'webhooks'].includes(page))) {
      return res.notFound()
    }
    const content = await docsHelper.read(page)
    res.view('pages/index', {
      active: page,
      content
    })
  }
}
