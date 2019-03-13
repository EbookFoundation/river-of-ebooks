const showdown = require('showdown')
const fs = require('fs')
const path = require('path')

showdown.setFlavor('github')
const converter = new showdown.Converter()

module.exports = {
  friendlyName: 'Load DocsHelper',
  description: 'Load a DocsHelper instance',
  inputs: {},
  exits: {
    success: {
      outputFriendlyName: 'Docs helper',
      outputDescription: 'A DocsHelper instance'
    }
  },
  fn: async function (inputs, exits) {
    return exits.success(new DocsHelper())
  }
}

class DocsHelper {
  read (file, relPath = '../../docs') {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, relPath, `${file}.md`), { encoding: 'utf8' }, (err, data) => {
        if (err) reject(err)
        resolve(converter.makeHtml(data))
      })
    })
  }
  convert (md) {
    return converter.makeHtml(md)
  }
}
