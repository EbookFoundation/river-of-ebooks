module.exports = {
  friendlyName: 'Load OpdsHelper',
  description: 'Load a OpdsHelper instance',
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: 'Opds helper',
      outputDescription: 'A OpdsHelper instance'
    }
  },
  fn: async function (inputs, exits) {
    return exits.success(new OpdsHelper())
  }
}

function OpdsHelper () {
  this.book2opds = async function (book) {
    return new Promise((resolve, reject) => {
      const metadata = {
        '@type': 'http://schema.org/Book',
        modified: new Date(book.updated_at).toISOString()
      }
      if (book.title) metadata.title = book.title
      if (book.author) metadata.author = book.author
      if (book.isbn) metadata.identifier = `urn:isbn:${book.isbn}`
      resolve({
        metadata,
        'links': [
          {
            'rel': 'self',
            'href': 'single/' + book.id,
            'type': 'application/opds+json'
          }
        ],
        'images': []
      })
    })
  }
}
